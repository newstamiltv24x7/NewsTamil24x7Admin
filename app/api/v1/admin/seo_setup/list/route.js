import { NextResponse } from "next/server";
import { SeoContent } from "../../../../../../models/seoContentModel";
import connectMongoDB from "../../../../../../libs/mongodb";
import { verifyAccessToken } from "../../../../../../helper/helper";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const { n_page, n_limit, c_search_term,category_id } = await request.json();

  const verified = verifyAccessToken();

  try {
    await connectMongoDB();

    if (verified.success) {
      let _search = {};
      let n_limitTerm = n_limit;
      let n_pageTerm = n_page === 1 ? 0 : (n_page - 1) * n_limit;
      let searchTerm = c_search_term ? c_search_term : "";

      if (searchTerm !== "") {
        _search["$and"] = [
          {
            $or: [{ c_seo_page_title: { $regex: searchTerm, $options: "i" } }],
          },
          {
            $and: [{ n_status: 1 }, { n_published: 1 }],
          },
        ];
      }else if(category_id !== ""){
        _search["$and"] = [
            {
              $and: [
                { n_status: 1 },
                { n_published: 1 },
                { c_seo_category_id: category_id },
              ],
            },
          ];
      } else {
        _search["$and"] = [
          {
            $and: [{ n_status: 1 }, { n_published: 1 }],
          },
        ];
      }

      if (n_limitTerm !== "" && n_pageTerm !== "") {
        await connectMongoDB();

        await SeoContent.aggregate([
          { $match: _search },
          {
            $group: {
              _id: "$_id",
              c_seo_content_id: { $first: "$c_seo_content_id" },
              c_seo_category_id: { $first: "$c_seo_category_id" },
              c_seo_page_title: { $first: "$c_seo_page_title" },
              c_seo_page_description: { $first: "$c_seo_page_description" },
              c_seo_page_keywords: { $first: "$c_seo_page_keywords" },
              c_seo_social_image_sharing: {
                $first: "$c_seo_social_image_sharing",
              },
              c_seo_scripts: { $first: "$c_seo_scripts" },
              createdAt: { $first: "$createdAt" },
              c_createdBy: { $first: "$c_createdBy" },
              n_status: { $first: "$n_status" },
              n_published: { $first: "$n_published" },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "c_createdBy",
              foreignField: "user_id",
              as: "users",
            },
          },
          {
            $unwind: "$users",
          },
          {
            $lookup: {
              from: "seocategories",
              localField: "c_seo_category_id",
              foreignField: "c_seo_category_id",
              as: "seocategories",
            },
          },
          {
            $unwind: "$seocategories",
          },
          {
            $project: {
              _id: 1,
              c_seo_category_id: 1,
              c_seo_content_id: 1,
              c_seo_page_title: 1,
              c_seo_page_description: 1,
              c_seo_page_keywords: 1,
              c_seo_social_image_sharing: 1,
              c_seo_scripts: 1,
              createdAt: 1,
              c_createdBy: 1,
              c_createdName: "$users.user_name",
              c_seo_category_title: "$seocategories.c_seo_category_title",
              n_status: 1,
              n_published: 1,
            },
          },
          {
            $sort: { createdAt: 1 },
          },
          {
            $facet: {
              data: [{ $skip: n_pageTerm }, { $limit: n_limitTerm }],
              total_count: [
                {
                  $count: "count",
                },
              ],
            },
          },
        ])
          .then((data) => {
            if (data[0].data.length > 0) {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "";
              sendResponse["payloadJson"] = data;
              sendResponse["error"] = [];
            } else {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "Record not found!";
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = [];
            }
          })
          .catch((err) => {
            sendResponse["appStatusCode"] = 4;
            sendResponse["message"] = "";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = err;
          });
        return NextResponse.json(sendResponse, { status: 200 });
      } else {
        sendResponse["appStatusCode"] = 3;
        sendResponse["message"] = "";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Invalid Payload";
        return NextResponse.json(sendResponse, { status: 200 });
      }
    } else {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = [];
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = verified.error;
      return NextResponse.json(sendResponse, { status: 200 });
    }
  } catch (err) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = [];
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "Something went wrong!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}

export async function GET(request) {
  const verified = verifyAccessToken();
  const id = request.nextUrl.searchParams.get("id");
  const catid = request.nextUrl.searchParams.get("category_id");

  if (verified.success) {
    if (id) {
      const checkId = await SeoContent.findOne({ c_seo_content_id: id });
      if (checkId) {
        let _search = {};
        _search["$and"] = [
          {
            $and: [
              { n_status: 1 },
              { n_published: 1 },
              { c_seo_content_id: id },
            ],
          },
        ];

        try {
          await connectMongoDB();

          await SeoContent.aggregate([
            { $match: _search },
            {
              $group: {
                _id: "$_id",
                c_seo_content_id: { $first: "$c_seo_content_id" },
                c_seo_category_id: { $first: "$c_seo_category_id" },
                c_seo_page_title: { $first: "$c_seo_page_title" },
                c_seo_page_description: { $first: "$c_seo_page_description" },
                c_seo_page_keywords: { $first: "$c_seo_page_keywords" },
                c_seo_social_image_sharing: {
                  $first: "$c_seo_social_image_sharing",
                },
                c_seo_scripts: { $first: "$c_seo_scripts" },
                createdAt: { $first: "$createdAt" },
                c_createdBy: { $first: "$c_createdBy" },
                n_status: { $first: "$n_status" },
                n_published: { $first: "$n_published" },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "c_createdBy",
                foreignField: "user_id",
                as: "users",
              },
            },
            {
              $unwind: "$users",
            },
            {
              $lookup: {
                from: "seocategories",
                localField: "c_seo_category_id",
                foreignField: "c_seo_category_id",
                as: "seocategories",
              },
            },
            {
              $unwind: "$seocategories",
            },
            {
              $project: {
                _id: 1,
                c_seo_category_id: 1,
                c_seo_content_id: 1,
                c_seo_page_title: 1,
                c_seo_page_description: 1,
                c_seo_page_keywords: 1,
                c_seo_social_image_sharing: 1,
                c_seo_scripts: 1,
                c_createdBy: 1,
                createdAt: 1,
                c_createdName: "$users.user_name",
                c_seo_category_title: "$seocategories.c_seo_category_title",
                n_status: 1,
                n_published: 1,
              },
            },
            {
              $sort: { createdAt: -1 },
            },
          ])
            .then((data) => {
              if (data.length > 0) {
                sendResponse["appStatusCode"] = 0;
                sendResponse["message"] = "";
                sendResponse["payloadJson"] = data;
                sendResponse["error"] = [];
              } else {
                sendResponse["appStatusCode"] = 0;
                sendResponse["message"] = "Record not found!";
                sendResponse["payloadJson"] = [];
                sendResponse["error"] = [];
              }
            })
            .catch((err) => {
              sendResponse["appStatusCode"] = 4;
              sendResponse["message"] = "";
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = err;
            });

          return NextResponse.json(sendResponse, { status: 200 });
        } catch (err) {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = "";
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Something went wrong!";
          return NextResponse.json(sendResponse, { status: 400 });
        }
      } else {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Invalid Id!";
        return NextResponse.json(sendResponse, { status: 400 });
      }
    } else if (catid) {
      const checkId = await SeoContent.findOne({ c_seo_category_id: catid });
      if (checkId) {
        let _search = {};
        _search["$and"] = [
          {
            $and: [
              { n_status: 1 },
              { n_published: 1 },
              { c_seo_category_id: catid },
            ],
          },
        ];

        try {
          await connectMongoDB();

          await SeoContent.aggregate([
            { $match: _search },
            {
              $group: {
                _id: "$_id",
                c_seo_content_id: { $first: "$c_seo_content_id" },
                c_seo_category_id: { $first: "$c_seo_category_id" },
                c_seo_page_title: { $first: "$c_seo_page_title" },
                c_seo_page_description: { $first: "$c_seo_page_description" },
                c_seo_page_keywords: { $first: "$c_seo_page_keywords" },
                c_seo_social_image_sharing: {
                  $first: "$c_seo_social_image_sharing",
                },
                c_seo_scripts: { $first: "$c_seo_scripts" },
                createdAt: { $first: "$createdAt" },
                c_createdBy: { $first: "$c_createdBy" },
                n_status: { $first: "$n_status" },
                n_published: { $first: "$n_published" },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "c_createdBy",
                foreignField: "user_id",
                as: "users",
              },
            },
            {
              $unwind: "$users",
            },
            {
                $lookup: {
                  from: "seocategories",
                  localField: "c_seo_category_id",
                  foreignField: "c_seo_category_id",
                  as: "seocategories",
                },
              },
              {
                $unwind: "$seocategories",
              },
            {
              $project: {
                _id: 1,
                c_seo_category_id: 1,
                c_seo_content_id: 1,
                c_seo_page_title: 1,
                c_seo_page_description: 1,
                c_seo_page_keywords: 1,
                c_seo_social_image_sharing: 1,
                c_seo_scripts: 1,
                c_createdBy: 1,
                createdAt: 1,
                c_createdName: "$users.user_name",
                c_seo_category_title: "$seocategories.c_seo_category_title",
                n_status: 1,
                n_published: 1,
              },
            },
            {
              $sort: { createdAt: -1 },
            },
          ])
            .then((data) => {
              if (data.length > 0) {
                sendResponse["appStatusCode"] = 0;
                sendResponse["message"] = "";
                sendResponse["payloadJson"] = data;
                sendResponse["error"] = [];
              } else {
                sendResponse["appStatusCode"] = 0;
                sendResponse["message"] = "Record not found!";
                sendResponse["payloadJson"] = [];
                sendResponse["error"] = [];
              }
            })
            .catch((err) => {
              sendResponse["appStatusCode"] = 4;
              sendResponse["message"] = "";
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = err;
            });

          return NextResponse.json(sendResponse, { status: 200 });
        } catch (err) {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = "";
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Something went wrong!";
          return NextResponse.json(sendResponse, { status: 400 });
        }
      } else {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Invalid Id!";
        return NextResponse.json(sendResponse, { status: 400 });
      }
    } else {
      let _search = {};
      _search["$and"] = [
        {
          $and: [{ n_status: 1 }, { n_published: 1 }],
        },
      ];

      try {
        await connectMongoDB();
        await SeoContent.aggregate([
          { $match: _search },
          {
            $group: {
              _id: "$_id",
              c_seo_content_id: { $first: "$c_seo_content_id" },
              c_seo_category_id: { $first: "$c_seo_category_id" },
              c_seo_page_title: { $first: "$c_seo_page_title" },
              c_seo_page_description: { $first: "$c_seo_page_description" },
              c_seo_page_keywords: { $first: "$c_seo_page_keywords" },
              c_seo_social_image_sharing: {
                $first: "$c_seo_social_image_sharing",
              },
              c_seo_scripts: { $first: "$c_seo_scripts" },
              createdAt: { $first: "$createdAt" },
              c_createdBy: { $first: "$c_createdBy" },
              n_status: { $first: "$n_status" },
              n_published: { $first: "$n_published" },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "c_createdBy",
              foreignField: "user_id",
              as: "users",
            },
          },
          {
            $unwind: "$users",
          },
          {
            $lookup: {
              from: "seocategories",
              localField: "c_seo_category_id",
              foreignField: "c_seo_category_id",
              as: "seocategories",
            },
          },
          {
            $unwind: "$seocategories",
          },
          {
            $project: {
              _id: 1,
              c_seo_category_id: 1,
              c_seo_content_id: 1,
              c_seo_page_title: 1,
              c_seo_page_description: 1,
              c_seo_page_keywords: 1,
              c_seo_social_image_sharing: 1,
              c_seo_scripts: 1,
              createdAt: 1,
              c_createdBy: 1,
              c_createdName: "$users.user_name",
              c_seo_category_title: "$seocategories.c_seo_category_title",
              n_status: 1,
              n_published: -1,
            },
          },
          {
            $sort: { createdAt: 1 },
          },
        ])
          .then((data) => {
            if (data.length > 0) {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "";
              sendResponse["payloadJson"] = data;
              sendResponse["error"] = [];
            } else {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "Record not found!";
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = [];
            }
          })
          .catch((err) => {
            sendResponse["appStatusCode"] = 4;
            sendResponse["message"] = "";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = err;
          });

        return NextResponse.json(sendResponse, { status: 200 });
      } catch (err) {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Something went wrong!";
        return NextResponse.json(sendResponse, { status: 400 });
      }
    }
  } else {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = "";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "token expired!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
