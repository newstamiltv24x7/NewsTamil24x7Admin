import { NextResponse } from "next/server";
import { YouTubeURL } from "../../../../../../models/youTubeURLModel";
import connectMongoDB from "../../../../../../libs/mongodb";
import { mobilePaginations } from "@/helper/helper";

import {
  encryptCryptoResponse,
  decrypCryptoRequest,
} from "../../../../../../helper/helper";

let sendResponse = {
  appStatusCode: "",
  message: "",
  n_page: 0,
  n_limit: 0,
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const { n_page, n_limit, c_search_term, c_video_type,c_youtube_type,n_url } = await request.json();

  try {
    let _search = {};
    let n_limitTerm = n_limit;
    let n_pageTerm = n_page === 1 ? 0 : (n_page - 1) * n_limit;
    let searchTerm = c_search_term ? c_search_term : "";
    if (c_video_type && (c_youtube_type === "" || c_youtube_type === undefined)) {
      _search["$and"] = [
        {
          $and: [
            { n_status: 1 },
            { n_published: 1 },
            { c_video_type: c_video_type },
          ],
        },
        {
          $or: [
            { c_slug_url: { $nin: [n_url] } }
          ],
        },
      ];
    }else if (c_video_type && c_youtube_type) {
      _search["$and"] = [
        {
          $and: [
            { n_status: 1 },
            { n_published: 1 },
            { c_video_type: c_video_type },
            { c_youtube_type: c_youtube_type },
          ],
        },
        {
          $or: [
            { c_slug_url: { $nin: [n_url] } }
          ],
        },
      ];
    }else if (c_youtube_type) {
      _search["$and"] = [
        {
          $and: [
            { n_status: 1 },
            { n_published: 1 },
            { c_youtube_type: c_youtube_type },
          ],
        },
        {
          $or: [
            { c_slug_url: { $nin: [n_url] } }
          ],
        },
      ];
    }else if (searchTerm !== "") {
      _search["$and"] = [
        {
          $or: [{ c_url_title: { $regex: searchTerm, $options: "i" } }],
        },
      ];
    } else {
      _search["$and"] = [
        {
          $or: [{ n_status: 1 }, { n_published: 1 }],
        },
      ];
    }

    if (n_limitTerm !== "" && n_pageTerm !== "") {
      await connectMongoDB();

      await YouTubeURL.aggregate([
        {
          $match: _search,
        },
        {
          $group: {
            _id: "$_id",
            c_url_title: { $first: "$c_url_title" },
            c_slug_url: { $first: "$c_slug_url" },
            c_url_subject: { $first: "$c_url_subject" },
            c_url_content: { $first: "$c_url_content" },
            c_url_id: { $first: "$c_url_id" },
            c_url_link: { $first: "$c_url_link" },
            c_url_web_link: { $first: "$c_url_web_link" },
            c_thumbanail_image: { $first: "$c_thumbanail_image" },
            c_video_type: { $first: "$c_video_type" },
            c_youtube_type: { $first: "$c_youtube_type" },
            c_url_order_id: { $first: "$c_url_order_id" },
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
            c_url_title: 1,
            c_slug_url: 1,
            c_url_subject: 1,
            c_url_content: 1,
            c_url_id: 1,
            c_url_link: 1,
            c_url_web_link: 1,
            c_video_type: 1,
            c_youtube_type: 1,
            c_thumbanail_image: 1,
            c_url_order_id: 1,
            n_status: 1,
            n_published: 1,
            createdAt: 1,
            c_createdBy: 1,
            createdName: "$createdById.user_name",
          },
        },
        {
          $sort: { c_url_order_id: -1, updatedAt: -1 },
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
          const returnResponse = mobilePaginations(n_page, n_limit);
          const encryptRes = encryptCryptoResponse(data);
          const decryptRes = decrypCryptoRequest(encryptRes);
          if (data[0].data.length > 0) {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "";
            sendResponse["n_page"] = returnResponse.n_page;
            sendResponse["n_limit"] = returnResponse.n_limit;
            sendResponse["payloadJson"] = decryptRes;
            sendResponse["error"] = [];
          } else {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "Record not found!";
            sendResponse["n_page"] = 0;
            sendResponse["n_limit"] = 0;
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = [];
          }
        })
        .catch((err) => {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = "";
          sendResponse["n_page"] = 0;
          sendResponse["n_limit"] = 0;
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = err;
        });
      return NextResponse.json(sendResponse, { status: 200 });
    } else {
      sendResponse["appStatusCode"] = 3;
      sendResponse["message"] = "";
      sendResponse["n_page"] = 0;
      sendResponse["n_limit"] = 0;
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Invalid Payload";
      return NextResponse.json(sendResponse, { status: 200 });
    }
  } catch (error) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = [];
    sendResponse["n_page"] = 0;
    sendResponse["n_limit"] = 0;
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "Something went wrong!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}

export async function GET(request) {
  const id = request.nextUrl.searchParams.get("id");
  const url = request.nextUrl.searchParams.get("url");

  if (id) {
    const checkId = await YouTubeURL.findOne({ c_url_id: id });
    if (checkId) {
      let _search = {};
      _search["$and"] = [
        {
          $and: [{ n_status: 1 }, { n_published: 1 }, { c_url_id: id }],
        },
      ];

      try {
        await connectMongoDB();

        await YouTubeURL.aggregate([
          { $match: _search },
          {
            $group: {
              _id: "$_id",
              c_url_title: { $first: "$c_url_title" },
              c_slug_url: { $first: "$c_slug_url" },
              c_url_subject: { $first: "$c_url_subject" },
              c_url_content: { $first: "$c_url_content" },
              c_url_id: { $first: "$c_url_id" },
              c_url_link: { $first: "$c_url_link" },
              c_url_web_link: { $first: "$c_url_web_link" },
              c_thumbanail_image: { $first: "$c_thumbanail_image" },
              c_video_type: { $first: "$c_video_type" },
              c_youtube_type: { $first: "$c_youtube_type" },
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
              c_url_title: 1,
              c_slug_url: 1,
              c_url_subject: 1,
              c_url_content: 1,
              c_url_id: 1,
              c_url_link: 1,
              c_url_web_link: 1,
              c_thumbanail_image: 1,
              c_video_type: 1,
              c_youtube_type: 1,
              createdAt: 1,
              c_createdBy: 1,
              c_createdName: "$users.user_name",
              n_status: 1,
              n_published: 1,
            },
          },
          {
            $sort: { c_url_order_id: -1, updatedAt: -1 },
          },
        ])
          .then((data) => {
            const encryptRes = encryptCryptoResponse(data);
            const decryptRes = decrypCryptoRequest(encryptRes);
            if (data.length > 0) {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "";
              sendResponse["payloadJson"] = decryptRes;
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
  }else if (url) {
    const checkUrl = await YouTubeURL.findOne({ c_slug_url: url });
    if (checkUrl) {
      let _search = {};
      _search["$and"] = [
        {
          $and: [{ n_status: 1 }, { n_published: 1 }, { c_slug_url: url }],
        },
      ];

      try {
        await connectMongoDB();

        await YouTubeURL.aggregate([
          { $match: _search },
          {
            $group: {
              _id: "$_id",
              c_url_title: { $first: "$c_url_title" },
              c_slug_url: { $first: "$c_slug_url" },
              c_url_subject: { $first: "$c_url_subject" },
              c_url_content: { $first: "$c_url_content" },
              c_url_id: { $first: "$c_url_id" },
              c_url_link: { $first: "$c_url_link" },
              c_url_web_link: { $first: "$c_url_web_link" },
              c_thumbanail_image: { $first: "$c_thumbanail_image" },
              c_video_type: { $first: "$c_video_type" },
              c_youtube_type: { $first: "$c_youtube_type" },              
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
              c_url_title: 1,
              c_slug_url: 1,
              c_url_subject: 1,
              c_url_content: 1,
              c_url_id: 1,
              c_url_link: 1,
              c_url_web_link: 1,
              c_thumbanail_image: 1,
              c_video_type: 1,
              c_youtube_type: 1,
              createdAt: 1,
              c_createdBy: 1,
              c_createdName: "$users.user_name",
              n_status: 1,
              n_published: 1,
            },
          },
          {
            $sort: { c_url_order_id: -1, updatedAt: -1 },
          },
        ])
          .then((data) => {
            const encryptRes = encryptCryptoResponse(data);
            const decryptRes = decrypCryptoRequest(encryptRes);
            if (data.length > 0) {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "";
              sendResponse["n_page"] = 0;
              sendResponse["n_limit"] = 0;
              sendResponse["payloadJson"] = decryptRes;
              sendResponse["error"] = [];
            } else {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "Record not found!";
              sendResponse["n_page"] = 0;
              sendResponse["n_limit"] = 0;
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = [];
            }
          })
          .catch((err) => {
            sendResponse["appStatusCode"] = 4;
            sendResponse["message"] = "";
            sendResponse["n_page"] = 0;
            sendResponse["n_limit"] = 0;
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

      await YouTubeURL.aggregate([
        { $match: _search },
        {
          $group: {
            _id: "$_id",
            c_url_title: { $first: "$c_url_title" },
            c_slug_url: { $first: "$c_slug_url" },
            c_url_subject: { $first: "$c_url_subject" },
            c_url_content: { $first: "$c_url_content" },
            c_url_id: { $first: "$c_url_id" },
            c_url_link: { $first: "$c_url_link" },
            c_url_web_link: { $first: "$c_url_web_link" },
            c_thumbanail_image: { $first: "$c_thumbanail_image" },
            c_video_type: { $first: "$c_video_type" },
            c_youtube_type: { $first: "$c_youtube_type" },            
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
            c_url_title: 1,
            c_slug_url: 1,
            c_url_subject: 1,
            c_url_content: 1,
            c_url_id: 1,
            c_url_link: 1,
            c_url_web_link: 1,
            c_thumbanail_image: 1,
            c_video_type: 1,
            c_youtube_type: 1,
            createdAt: 1,
            c_createdBy: 1,
            c_createdName: "$users.user_name",
            n_status: 1,
            n_published: 1,
          },
        },
        {
          $sort: { c_url_order_id: -1, updatedAt: -1 },
        },
      ])
        .then((data) => {
          const encryptRes = encryptCryptoResponse(data);
          const decryptRes = decrypCryptoRequest(encryptRes);
          if (data.length > 0) {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "";
            sendResponse["n_page"] = 0;
            sendResponse["n_limit"] = 0;
            sendResponse["payloadJson"] = decryptRes;
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
          sendResponse["n_page"] = 0;
          sendResponse["n_limit"] = 0;
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = err;
        });

      return NextResponse.json(sendResponse, { status: 200 });
    } catch (err) {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "";
      sendResponse["n_page"] = 0;
      sendResponse["n_limit"] = 0;
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Something went wrong!";
      return NextResponse.json(sendResponse, { status: 400 });
    }
  }
}
