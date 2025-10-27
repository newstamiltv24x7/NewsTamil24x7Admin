import { NextResponse } from "next/server";
import connectMongoDB from "../../../../../../libs/mongodb";
import { verifyAccessToken } from "../../../../../../helper/helper";
import { Listicles } from "../../../../../../models/listiclesModel";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const { n_page, n_limit, c_search_term } = await request.json();

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
            $and: [
               { n_published: 1 },
              { c_listicles_title: { $regex: searchTerm, $options: "i" } },
            ]
            
          },
        ];
      } else {
        _search["$and"] = [
          {
            $and: [ { n_published: 1 }],
          },
        ];
      }

      await connectMongoDB();

      await Listicles.aggregate([
        { $match: _search },
        {
          $set: {
            c_listicles_continue_item: {
              $sortArray: {
                input: "$c_listicles_continue_item",
                sortBy: { c_listicles_continue_create_date: -1 },
              },
            },
          },
        },
        {
          $group: {
            _id: "$_id",
            c_category_id: { $first: "$c_category_id" },
            c_listicles_title: { $first: "$c_listicles_title" },
            c_listicles_slug_title: { $first: "$c_listicles_slug_title" },            
            c_listicles_short_name: { $first: "$c_listicles_short_name" },            
            c_listicles_sub_title: { $first: "$c_listicles_sub_title" },
            c_listicles_img: { $first: "$c_listicles_img" },
            c_listicles_content: { $first: "$c_listicles_content" },
            c_listicles_id: { $first: "$c_listicles_id" },
            c_listicles_continue_item: { $first: "$c_listicles_continue_item" },
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
            from: "categories",
            localField: "c_category_id",
            foreignField: "c_category_id",
            as: "categories",
          },
        },
        {
          $unwind: "$categories",
        },
        {
          $project: {
            _id: 1,
            c_listicles_title: 1,
            c_listicles_slug_title: 1,
            c_listicles_short_name: 1,
            c_category_id: 1,
            c_listicles_sub_title: 1,
            c_listicles_img: 1,
            c_listicles_content: 1,
            c_listicles_id: 1,
            c_listicles_continue_item: 1,
            createdAt: 1,
            c_createdBy: 1,
            c_createdName: "$users.user_name",
            c_category_name: "$categories.c_category_name",
            n_status: 1,
            n_published: 1,
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
  if (verified.success) {
    if (id) {
      let _search = {};

      if (id !== "") {
        _search["$and"] = [
          {
            $and: [ { n_published: 1 },{c_listicles_id: id}]
          },
        ];
      } else {
        _search["$and"] = [
          {
            $and: [ { n_published: 1 }]
          },
        ];
      }


      try {
        await connectMongoDB();

        await Listicles.aggregate([
          { $match: _search },
          {
            $set: {
              c_listicles_continue_item: {
                $sortArray: {
                  input: "$c_listicles_continue_item",
                  sortBy: { c_listicles_continue_create_date: -1 },
                },
              },
            },
          },
          {
            $group: {
              _id: "$_id",
              c_category_id: { $first: "$c_category_id" },
              c_listicles_title: { $first: "$c_listicles_title" },
              c_listicles_slug_title: { $first: "$c_listicles_slug_title" },              
              c_listicles_short_name: { $first: "$c_listicles_short_name" },              
              c_listicles_sub_title: { $first: "$c_listicles_sub_title" },
              c_listicles_img: { $first: "$c_listicles_img" },
              c_listicles_content: { $first: "$c_listicles_content" },
              c_listicles_id: { $first: "$c_listicles_id" },
              c_listicles_continue_item: {
                $first: "$c_listicles_continue_item",
              },
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
              from: "categories",
              localField: "c_category_id",
              foreignField: "c_category_id",
              as: "categories",
            },
          },
          {
            $unwind: "$categories",
          },
          {
            $project: {
              _id: 1,
              c_listicles_title: 1,
              c_listicles_slug_title: 1,
              c_listicles_short_name: 1,
              c_category_id: 1,
              c_listicles_sub_title: 1,
              c_listicles_img: 1,
              c_listicles_content: 1,
              c_listicles_id: 1,
              c_listicles_continue_item: 1,
              createdAt: 1,
              c_createdBy: 1,
              c_createdName: "$users.user_name",
              c_category_name: "$categories.c_category_name",
              n_status: 1,
              n_published: 1,
            },
          },
          {
            $sort: { createdAt: -1 },
          },
        ]).then((data) => {
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
     

      let _search = {};

      _search["$and"] = [
        {
          $and: [ { n_published: 1 }],
        },
      ];

      try {
        await connectMongoDB();
        await Listicles.aggregate([
          { $match: _search },
          {
            $set: {
              c_listicles_continue_item: {
                $sortArray: {
                  input: "$c_listicles_continue_item",
                  sortBy: { c_listicles_continue_create_date: -1 },
                },
              },
            },
          },
          {
            $group: {
              _id: "$_id",
              c_category_id: { $first: "$c_category_id" },
              c_listicles_id: { $first: "$c_listicles_id" },
              c_listicles_title: { $first: "$c_listicles_title" },
              c_listicles_slug_title: { $first: "$c_listicles_slug_title" },              
              c_listicles_short_name: { $first: "$c_listicles_short_name" },              
              c_listicles_sub_title: { $first: "$c_listicles_sub_title" },
              c_listicles_img: { $first: "$c_listicles_img" },
              c_listicles_content: { $first: "$c_listicles_content" },
              c_listicles_continue_item: {
                $first: "$c_listicles_continue_item",
              },
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
              from: "categories",
              localField: "c_category_id",
              foreignField: "c_category_id",
              as: "categories",
            },
          },
          {
            $unwind: "$categories",
          },
          {
            $project: {
              _id: 1,
              c_listicles_title: 1,
              c_listicles_slug_title: 1,
              c_listicles_short_name: 1,
              c_category_id: 1,
              c_listicles_sub_title: 1,
              c_listicles_img: 1,
              c_listicles_content: 1,
              c_listicles_id: 1,
              c_listicles_continue_item: 1,
              createdAt: 1,
              c_createdBy: 1,
              c_createdName: "$users.user_name",
              c_category_name: "$categories.c_category_name",
              n_status: 1,
              n_published: 1,
            },
          },
          {
            $sort: { createdAt: -1 },
          },
        ]).then((data) => {
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
