import { NextResponse } from "next/server";
import connectMongoDB from "../../../../../../libs/mongodb";
import { Cards } from "../../../../../../models/cardsModel";
import {  mobilePaginations } from "@/helper/helper";
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
  const { n_page, n_limit, c_search_term } = await request.json();

  try {
    await connectMongoDB();

    let _search = {};
    let n_limitTerm = n_limit;
    let n_pageTerm = n_page === 1 ? 0 : (n_page - 1) * n_limit;
    let searchTerm = c_search_term ? c_search_term : "";

    if (searchTerm !== "") {
      _search["$and"] = [
        {
          $or: [{ c_cards_title: { $regex: searchTerm, $options: "i" } }],
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

      await Cards.aggregate([
        { $match: _search },
        {
          $group: {
            _id: "$_id",            
            c_cards_id: { $first: "$c_cards_id" },
            c_cards_title: { $first: "$c_cards_title" },
            c_cards_embed_code: { $first: "$c_cards_embed_code" },
            c_cards_parentId: { $first: "$c_cards_parentId" },
            c_cards_share_url: { $first: "$c_cards_share_url" },
            c_cards_img_url: { $first: "$c_cards_img_url" },    
            c_cards_comments: { $first: "$c_cards_comments" },
            c_cards_type: { $first: "$c_cards_type" },
            c_cards_likes: { $first: "$c_cards_likes" },
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
            c_cards_id: 1,
            c_cards_title: 1,
            c_cards_parentId: 1,
            c_cards_share_url: 1,
            c_cards_img_url: 1,
            c_cards_comments: 1,
            c_cards_type: 1,
            c_cards_likes: 1,
            createdAt: 1,
            c_createdBy: 1,
            c_createdName: "$users.user_name",
            n_status: 1,
            n_published: 1,
            c_cards_embed_code: 1,
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
            const returnResponse = mobilePaginations(n_page, n_limit);
          if (data[0].data.length > 0) {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "";
            sendResponse["payloadJson"] = data;
            sendResponse["n_page"] = returnResponse.n_page;
            sendResponse["n_limit"] = returnResponse.n_limit;
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
    const checkId = await Cards.findOne({ c_cards_id: id });
    if (checkId) {
      let _search = {};
      _search["$and"] = [
        {
          $and: [
            { n_status: 1 },
            { n_published: 1 },
            { c_cards_id: id },
          ],
        },
      ];

      try {
        await connectMongoDB();

        await Cards.aggregate([
          { $match: _search },
          {
            $group: {
              _id: "$_id",
              c_cards_id: { $first: "$c_cards_id" },
              c_cards_title: { $first: "$c_cards_title" },
              c_cards_embed_code: { $first: "$c_cards_embed_code" },
              c_cards_parentId: { $first: "$c_cards_parentId" },
              c_cards_share_url: { $first: "$c_cards_share_url" },
              c_cards_img_url: { $first: "$c_cards_img_url" },    
              c_cards_comments: { $first: "$c_cards_comments" },
              c_cards_type: { $first: "$c_cards_type" },
              c_cards_likes: { $first: "$c_cards_likes" },
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
              c_cards_id: 1,
              c_cards_title: 1,
              c_cards_embed_code: 1,
              c_cards_parentId: 1,
              c_cards_share_url: 1,
              c_cards_img_url: 1,
              c_cards_comments: 1,
              c_cards_type: 1,
              c_cards_likes: 1,
              createdAt: 1,
              c_createdBy: 1,
              c_createdName: "$users.user_name",
              n_status: 1,
              n_published: 1,
            },
          },
          {
            $sort: { createdAt: -1 },
          },
        ])
          .then((data) => {
           
            const encryptRes = encryptCryptoResponse(data[0]);
            const decryptRes = decrypCryptoRequest(encryptRes);
            if (data.length > 0) {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "";
              sendResponse["payloadJson"] = decryptRes;
            sendResponse["n_page"] = 0;
            sendResponse["n_limit"] = 0;
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
      await Cards.aggregate([
        { $match: _search },
        {
          $group: {
            _id: "$_id",
            c_cards_id: { $first: "$c_cards_id" },
            c_cards_title: { $first: "$c_cards_title" },
            c_cards_embed_code: { $first: "$c_cards_embed_code" },
            c_cards_parentId: { $first: "$c_cards_parentId" },
            c_cards_share_url: { $first: "$c_cards_share_url" },
            c_cards_img_url: { $first: "$c_cards_img_url" },    
            c_cards_comments: { $first: "$c_cards_comments" },
            c_cards_type: { $first: "$c_cards_type" },
            c_cards_likes: { $first: "$c_cards_likes" },
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
            c_cards_id: 1,
            c_cards_title: 1,
            c_cards_embed_code: 1,
            c_cards_share_url: 1,
            c_cards_img_url: 1,
            c_cards_comments: 1,
            c_cards_type: 1,
            c_cards_likes: 1,
            createdAt: 1,
            c_createdBy: 1,
            c_createdName: "$users.user_name",
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
            sendResponse["payloadJson"] = decryptRes;
            sendResponse["n_page"] = 0;
            sendResponse["n_limit"] = 0;
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
