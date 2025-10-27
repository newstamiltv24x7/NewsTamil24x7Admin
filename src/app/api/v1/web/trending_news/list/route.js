import { NextResponse } from "next/server";
import { Story } from "../../../../../../models/storyModel";
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
  const { n_page, n_limit, c_search_term, c_from_date, c_to_date } =
    await request.json();

  try {
    await connectMongoDB();
    let fromDate = "";
    let toDate = "";

    if (c_from_date !== "" || c_to_date !== "") {
      // fromDate = new Date(c_from_date).toISOString();
      // toDate = new Date(c_to_date).toISOString();

      fromDate = new Date(c_from_date);
      toDate = new Date(c_to_date);
      // toDate.setDate(toDate.getDate() + 1);
    }

    let _search = {};
    let n_limitTerm = n_limit;
    let n_pageTerm = n_page === 1 ? 0 : (n_page - 1) * n_limit;
    let searchTerm = c_search_term ? c_search_term : "";

    if (fromDate !== "" && toDate !== "") {
      if (searchTerm !== "") {
        _search["$and"] = [
          {
            $and: [{ story_title_name: { $regex: searchTerm, $options: "i" } }],
            $and: [{ n_status: 1 }, { n_published: 1 }],
            $and: [{ c_banner_start_date: { $gte: fromDate, $lte: toDate } }],
          },
        ];
      } else {
        _search["$and"] = [
          {
            $and: [{ n_status: 1 }, { n_published: 1 }],
            $and: [{ c_banner_start_date: { $gte: fromDate, $lte: toDate } }],
          },
        ];
      }
    } else {
      if (searchTerm !== "") {
        _search["$and"] = [
          {
            $or: [{ story_title_name: { $regex: searchTerm, $options: "i" } }],
          },
        ];
      } else {
        _search["$and"] = [
          {
            $and: [{ n_status: 1 }, { n_published: 1 }],
          },
        ];
      }
    }

    if (n_limitTerm !== "" && n_pageTerm !== "") {
      await connectMongoDB();

      await Story.aggregate([
        { $match: _search },
        {
          $group: {
            _id: "$_id",
            story_title_name: { $first: "$story_title_name" },
            c_advt_type: { $first: "$c_advt_type" },
            c_advt_banner_url: { $first: "$c_advt_banner_url" },
            c_advt_banner_redirect_url: {
              $first: "$c_advt_banner_redirect_url",
            },
            c_banner_start_date: { $first: "$c_banner_start_date" },
            c_banner_start_time: { $first: "$c_banner_start_time" },
            c_banner_end_date: { $first: "$c_banner_end_date" },
            c_banner_end_time: { $first: "$c_banner_end_time" },
            c_banner_position: { $first: "$c_banner_position" },
            c_banner_view_pages: { $first: "$c_banner_view_pages" },
            c_banner_target_country_id: {
              $first: "$c_banner_target_country_id",
            },
            c_banner_target_state_id: { $first: "$c_banner_target_state_id" },
            c_banner_target_city_id: { $first: "$c_banner_target_city_id" },

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
            story_title_name: 1,
            c_advt_type: 1,
            c_advt_banner_url: 1,
            c_advt_banner_redirect_url: 1,
            c_banner_start_date: 1,
            c_banner_start_time: 1,
            c_banner_end_date: 1,
            c_banner_end_time: 1,
            c_banner_position: 1,
            c_banner_view_pages: 1,
            c_banner_target_country_id: 1,
            c_banner_target_state_id: 1,
            c_banner_target_city_id: 1,
            createdAt: 1,
            c_createdBy: 1,
            c_createdName: "$users.user_name",
            c_userImg: "$users.c_user_img_url",
            n_status: 1,
            n_published: 1,
          },
        },

        // {
        //   $lookup: {
        //     from: "users",
        //     let: { searchId: { $toObjectId: "$c_createdBy" } },
        //     pipeline: [
        //       { $match: { $expr: [{ _id: "$searchId" }] } },
        //       { $project: { user_name: 1 } },
        //     ],
        //     as: "users",
        //   },
        // },
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
  } catch (err) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = [];
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "Something went wrong!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}

export async function GET(request) {
  const id = request.nextUrl.searchParams.get("id");
  if (id) {
    const checkId = await Story.findOne({ story_id: id });
    if (checkId) {
      let _search = {};
      _search["$and"] = [
        {
          $and: [
            { n_status: 1 },
            { n_published: 1 },
            { story_id: id },
            { trending_news: 1 },
          ],
        },
      ];

      try {
        await connectMongoDB();

        await Story.aggregate([
          { $match: _search },
          {
            $group: {
              _id: "$_id",
              story_title_name: { $first: "$story_title_name" },
              story_id: { $first: "$story_id" },
              story_details: { $first: "$story_details" },
              story_cover_image_url: { $first: "$story_cover_image_url" },
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
              story_title_name: 1,
              story_id: 1,
              story_details: 1,
              story_cover_image_url: 1,
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
            const decryptRes = decrypCryptoRequest(encryptRes);
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
        $and: [{ n_status: 1 }, { n_published: 1 }, { trending_news: 1 }],
      },
    ];
    try {
      await connectMongoDB();
      await Story.aggregate([
        { $match: _search },
        {
          $group: {
            _id: "$_id",
            story_title_name: { $first: "$story_title_name" },
            story_id: { $first: "$story_id" },
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
            story_title_name: 1,
            story_id: 1,
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
            const decryptRes = decrypCryptoRequest(encryptRes);
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
  }
}
