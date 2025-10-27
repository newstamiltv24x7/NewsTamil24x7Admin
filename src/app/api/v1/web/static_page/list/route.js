import { NextResponse } from "next/server";
import { StaticPage } from "../../../../../../models/staticPageModel";
import { StaticMenuPage } from "../../../../../../models/staticMenuPageModel";
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
    await connectMongoDB();

    let _search = {};
    let n_limitTerm = n_limit;
    let n_pageTerm = n_page === 1 ? 0 : (n_page - 1) * n_limit;
    let searchTerm = c_search_term ? c_search_term : "";

    if (searchTerm !== "") {
      _search["$and"] = [
        {
          $or: [{ c_static_page_title: { $regex: searchTerm, $options: "i" } }],
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

      await StaticPage.aggregate([
        { $match: _search },
        {
          $group: {
            _id: "$_id",
            c_static_page_id: { $first: "$c_static_page_id" },
            c_static_menu_page_id: { $first: "$c_static_menu_page_id" },
            c_static_page_title: { $first: "$c_static_page_title" },
            c_static_page_description: { $first: "$c_static_page_description" },
            c_static_page_keywords: { $first: "$c_static_page_keywords" },
            c_static_page_content: { $first: "$c_static_page_content" },
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
            from: "staticmenupages",
            localField: "c_static_menu_page_id",
            foreignField: "c_static_menu_page_id",
            as: "staticmenupages",
          },
        },
        {
          $unwind: "$staticmenupages",
        },
        {
          $project: {
            _id: 1,
            c_static_page_id: 1,
            c_static_menu_page_id: 1,
            c_static_page_title: 1,
            c_static_page_description: 1,
            c_static_page_keywords: 1,
            c_static_page_content: 1,
            createdAt: 1,
            c_createdBy: 1,
            c_createdName: "$users.user_name",
            c_static_page_name: "$staticmenupages.c_static_page_name",
            c_static_page_eng__name: "$staticmenupages.c_static_page_eng__name",

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
          const encryptRes = encryptCryptoResponse(data);
          const decryptRes = decrypCryptoRequest(encryptRes);
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
  const menuid = request.nextUrl.searchParams.get("menu_id");
  const menuname = request.nextUrl.searchParams.get("menu_name");

  if (id) {
    const checkId = await StaticPage.findOne({ c_static_page_id: id });
    if (checkId) {
      let _search = {};
      _search["$and"] = [
        {
          $and: [{ n_status: 1 }, { n_published: 1 }, { c_static_page_id: id }],
        },
      ];

      try {
        await connectMongoDB();

        await StaticPage.aggregate([
          { $match: _search },
          {
            $group: {
              _id: "$_id",
              c_static_page_id: { $first: "$c_static_page_id" },
              c_static_menu_page_id: { $first: "$c_static_menu_page_id" },
              c_static_page_title: { $first: "$c_static_page_title" },
              c_static_page_description: {
                $first: "$c_static_page_description",
              },
              c_static_page_keywords: { $first: "$c_static_page_keywords" },
              c_static_page_content: { $first: "$c_static_page_content" },
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
              from: "staticmenupages",
              localField: "c_static_menu_page_id",
              foreignField: "c_static_menu_page_id",
              as: "staticmenupages",
            },
          },
          {
            $unwind: "$staticmenupages",
          },
          {
            $project: {
              _id: 1,
              c_static_page_id: 1,
              c_static_menu_page_id: 1,
              c_static_page_title: 1,
              c_static_page_description: 1,
              c_static_page_keywords: 1,
              c_static_page_content: 1,
              createdAt: 1,
              c_createdBy: 1,
              c_createdName: "$users.user_name",
              c_static_page_name: "$staticmenupages.c_static_page_name",
              c_static_page_eng__name:
                "$staticmenupages.c_static_page_eng__name",
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
  } else if (menuid) {
    const checkId = await StaticPage.findOne({ c_static_menu_page_id: menuid });
    if (checkId) {
      let _search = {};
      _search["$and"] = [
        {
          $and: [
            { n_status: 1 },
            { n_published: 1 },
            { c_static_menu_page_id: menuid },
          ],
        },
      ];

      try {
        await connectMongoDB();

        await StaticPage.aggregate([
          { $match: _search },
          {
            $group: {
              _id: "$_id",
              c_static_page_id: { $first: "$c_static_page_id" },
              c_static_menu_page_id: { $first: "$c_static_menu_page_id" },
              c_static_page_title: { $first: "$c_static_page_title" },
              c_static_page_description: {
                $first: "$c_static_page_description",
              },
              c_static_page_keywords: { $first: "$c_static_page_keywords" },
              c_static_page_content: { $first: "$c_static_page_content" },
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
              from: "staticmenupages",
              localField: "c_static_menu_page_id",
              foreignField: "c_static_menu_page_id",
              as: "staticmenupages",
            },
          },
          {
            $unwind: "$staticmenupages",
          },
          {
            $project: {
              _id: 1,
              c_static_page_id: 1,
              c_static_menu_page_id: 1,
              c_static_page_title: 1,
              c_static_page_description: 1,
              c_static_page_keywords: 1,
              c_static_page_content: 1,
              createdAt: 1,
              c_createdBy: 1,
              c_createdName: "$users.user_name",
              c_static_page_name: "$staticmenupages.c_static_page_name",
              c_static_page_eng__name:
                "$staticmenupages.c_static_page_eng__name",
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
  } else if (menuname) {
    const checkName = await StaticMenuPage.findOne({
      c_static_menu_page_eng__name: menuname,
    });
    const checkStatus = await StaticPage.findOne({
      c_static_menu_page_id: checkName.c_static_menu_page_id,
    });
    
    if (checkStatus) {
      let _search = {};
      _search["$and"] = [
        {
          $and: [
            { n_status: 1 },
            { n_published: 1 },
            { c_static_menu_page_id: checkName.c_static_menu_page_id },
          ],
        },
      ];

      try {
        await connectMongoDB();

        await StaticPage.aggregate([
          { $match: _search },
          {
            $group: {
              _id: "$_id",
              c_static_page_id: { $first: "$c_static_page_id" },
              c_static_menu_page_id: { $first: "$c_static_menu_page_id" },
              c_static_page_title: { $first: "$c_static_page_title" },
              c_static_page_description: {
                $first: "$c_static_page_description",
              },
              c_static_page_keywords: { $first: "$c_static_page_keywords" },
              c_static_page_content: { $first: "$c_static_page_content" },
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
              from: "staticmenupages",
              localField: "c_static_menu_page_id",
              foreignField: "c_static_menu_page_id",
              as: "staticmenupages",
            },
          },
          {
            $unwind: "$staticmenupages",
          },
          {
            $project: {
              _id: 1,
              c_static_page_id: 1,
              c_static_menu_page_id: 1,
              c_static_page_title: 1,
              c_static_page_description: 1,
              c_static_page_keywords: 1,
              c_static_page_content: 1,
              createdAt: 1,
              c_createdBy: 1,
              c_createdName: "$users.user_name",
              c_static_page_name: "$staticmenupages.c_static_page_name",
              c_static_page_eng__name:
                "$staticmenupages.c_static_page_eng__name",
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
      await StaticPage.aggregate([
        { $match: _search },
        {
          $group: {
            _id: "$_id",
            c_static_page_id: { $first: "$c_static_page_id" },
            c_static_menu_page_id: { $first: "$c_static_menu_page_id" },
            c_static_page_title: { $first: "$c_static_page_title" },
            c_static_page_description: { $first: "$c_static_page_description" },
            c_static_page_keywords: { $first: "$c_static_page_keywords" },
            c_static_page_content: { $first: "$c_static_page_content" },
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
            from: "staticmenupages",
            localField: "c_static_menu_page_id",
            foreignField: "c_static_menu_page_id",
            as: "staticmenupages",
          },
        },
        {
          $unwind: "$staticmenupages",
        },
        {
          $project: {
            _id: 1,
            c_static_page_id: 1,
            c_static_menu_page_id: 1,
            c_static_page_title: 1,
            c_static_page_description: 1,
            c_static_page_keywords: 1,
            c_static_page_content: 1,
            createdAt: 1,
            c_createdBy: 1,
            c_createdName: "$users.user_name",
            c_static_page_name: "$staticmenupages.c_static_page_name",
            c_static_page_eng__name: "$staticmenupages.c_static_page_eng__name",
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
