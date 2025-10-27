import { NextResponse } from "next/server";
import { LiveBlog } from "../../../../../../models/liveBlogModel";
import connectMongoDB from "../../../../../../libs/mongodb";
import {
  encryptCryptoResponse,
  decrypCryptoRequest,
} from "../../../../../../helper/helper";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const { n_page, n_limit, c_search_term } = await request.json();

  try {
    let _search = {};
    let n_limitTerm = n_limit;
    let n_pageTerm = n_page === 1 ? 0 : (n_page - 1) * n_limit;
    let searchTerm = c_search_term ? c_search_term : "";

    if (searchTerm !== "") {
      _search["$and"] = [
        {
          $and: [
            { c_live_blog_title: { $regex: searchTerm, $options: "i" } },
            { n_status: 1 },
            { n_published: 1 },
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

      await LiveBlog.aggregate([
        {
          $match: _search,
        },
        {
          $group: {
            _id: "$_id",
            c_live_blog_title: { $first: "$c_live_blog_title" },
            c_live_blog_english_title: { $first: "$c_live_blog_english_title" },            
            c_live_blog_content: { $first: "$c_live_blog_content" },
            c_live_blog_image_url: { $first: "$c_live_blog_image_url" },
            c_live_blog_short_name: { $first: "$c_live_blog_short_name" },
            c_live_blog_slug_title: { $first: "$c_live_blog_slug_title" },
            c_live_blog_id: { $first: "$c_live_blog_id" },
            c_live_sub_blog: { $first: "$c_live_sub_blog" },

            n_status: { $first: "$n_status" },
            n_published: { $first: "$n_published" },
            createdAt: { $first: "$createdAt" },
            c_createdBy: { $first: "$c_createdBy" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "c_createdBy",
            foreignField: "user_id",
            as: "createdById",
          },
        },
        {
          $unwind: {
            path: "$createdById",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $project: {
            _id: 1,
            c_live_blog_title: 1,
            c_live_blog_english_title: 1,
            c_live_blog_id: 1,
            c_live_blog_content: 1,
            c_live_blog_image_url: 1,
            c_listicles_short_name: 1,
            c_listicles_slug_title: 1,
            c_live_sub_blog: 1,
            n_status: 1,
            n_published: 1,
            createdAt: 1,
            c_createdBy: 1,
            createdName: "$createdById.user_name",
            c_userImg: "$createdById.c_user_img_url",
          },
        },
        {
          $sort: { createdAt: -1 },
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
          const encryptRes = encryptCryptoResponse(data);
          // const decryptRes = decrypCryptoRequest(encryptRes);
          if (data[0].data.length > 0) {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "";
            sendResponse["payloadJson"] = encryptRes;
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
  } catch (error) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = [];
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "Something went wrong!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}

export async function GET(request) {
  const id = request.nextUrl.searchParams.get("id");
  const url = request.nextUrl.searchParams.get("url");
  if (url) {
    const checkURL = await LiveBlog.findOne({ c_live_blog_slug_title: url });
    if (checkURL) {
      let _search = {};
      _search["$and"] = [
        {
          $and: [{ n_status: 1 }, { n_published: 1 }, { c_live_blog_slug_title: url }],
        },
      ];

      try {
        await connectMongoDB();

        await LiveBlog.aggregate([
          { $match: _search },
          {
            $group: {
              _id: "$_id",
              c_live_blog_title: { $first: "$c_live_blog_title" },
              c_live_blog_english_title: { $first: "$c_live_blog_english_title" },              
              c_live_blog_content: { $first: "$c_live_blog_content" },
              c_live_blog_image_url: { $first: "$c_live_blog_image_url" },
              c_live_blog_short_name: { $first: "$c_live_blog_short_name" },
              c_live_blog_slug_title: { $first: "$c_live_blog_slug_title" },
              c_live_blog_id: { $first: "$c_live_blog_id" },
              c_live_sub_blog: { $first: "$c_live_sub_blog" },
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
            $project: {
              _id: 1,
              c_live_blog_title: 1,
              c_live_blog_english_title: 1,
              c_live_blog_content: 1,
              c_live_blog_image_url: 1,
              c_listicles_short_name: 1,
              c_listicles_slug_title: 1,
              c_live_blog_id: 1,
              c_live_sub_blog: 1,
              createdAt: 1,
              c_createdBy: 1,
              c_createdName: "$users.user_name",
              c_userImg: "$users.c_user_img_url",
              n_status: 1,
              n_published: 1,
            },
          },
          {
            $sort: { createdAt: -1 },
          },
        ])
          .then((data) => {
            const encryptRes = encryptCryptoResponse(data);
            // const decryptRes = decrypCryptoRequest(encryptRes);
            if (data.length > 0) {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "";
              sendResponse["payloadJson"] = encryptRes;
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
  }else if (id) {
    const checkId = await LiveBlog.findOne({ c_live_blog_id: id });
    if (checkId) {
      let _search = {};
      _search["$and"] = [
        {
          $and: [{ n_status: 1 }, { n_published: 1 }, { c_live_blog_id: id }],
        },
      ];

      try {
        await connectMongoDB();

        await LiveBlog.aggregate([
          { $match: _search },
          {
            $group: {
              _id: "$_id",
              c_live_blog_title: { $first: "$c_live_blog_title" },
              c_live_blog_english_title: { $first: "$c_live_blog_english_title" },              
              c_live_blog_content: { $first: "$c_live_blog_content" },
              c_live_blog_image_url: { $first: "$c_live_blog_image_url" },
              c_live_blog_short_name: { $first: "$c_live_blog_short_name" },
              c_live_blog_slug_title: { $first: "$c_live_blog_slug_title" },
              c_live_blog_id: { $first: "$c_live_blog_id" },
              c_live_sub_blog: { $first: "$c_live_sub_blog" },
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
            $project: {
              _id: 1,
              c_live_blog_title: 1,
              c_live_blog_english_title: 1,
              c_live_blog_content: 1,
              c_live_blog_image_url: 1,
              c_listicles_short_name: 1,
              c_listicles_slug_title: 1,
              c_live_blog_id: 1,
              c_live_sub_blog: 1,
              createdAt: 1,
              c_createdBy: 1,
              c_createdName: "$users.user_name",
              c_userImg: "$users.c_user_img_url",
              n_status: 1,
              n_published: 1,
            },
          },
          {
            $sort: { createdAt: -1 },
          },
        ])
          .then((data) => {
            const encryptRes = encryptCryptoResponse(data);
            // const decryptRes = decrypCryptoRequest(encryptRes);
            if (data.length > 0) {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "";
              sendResponse["payloadJson"] = encryptRes;
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

      await LiveBlog.aggregate([
        { $match: _search },
        {
          $group: {
            _id: "$_id",
            c_live_blog_title: { $first: "$c_live_blog_title" },
            c_live_blog_english_title: { $first: "$c_live_blog_english_title" },            
            c_live_blog_content: { $first: "$c_live_blog_content" },
            c_live_blog_image_url: { $first: "$c_live_blog_image_url" },
            c_live_blog_short_name: { $first: "$c_live_blog_short_name" },
            c_live_blog_slug_title: { $first: "$c_live_blog_slug_title" },
            c_live_blog_id: { $first: "$c_live_blog_id" },
            c_live_sub_blog: { $first: "$c_live_sub_blog" },
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
          $project: {
            _id: 1,
            c_live_blog_title: 1,
            c_live_blog_english_title: 1,
            c_live_blog_content: 1,
            c_live_blog_image_url: 1,
            c_listicles_short_name: 1,
            c_listicles_slug_title: 1,
            c_live_blog_id: 1,
            c_live_sub_blog: 1,
            createdAt: 1,
            c_createdBy: 1,
            c_createdName: "$users.user_name",
            c_userImg: "$users.c_user_img_url",
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
            const encryptRes = encryptCryptoResponse(data);
            // const decryptRes = decrypCryptoRequest(encryptRes);
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "";
            sendResponse["payloadJson"] = encryptRes;
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
}
