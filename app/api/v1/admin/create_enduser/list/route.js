import { NextResponse } from "next/server";
import { EndUser } from "../../../../../../models/endUserModel";
import connectMongoDB from "../../../../../../libs/mongodb";
import { verifyAccessToken } from "../../../../../../helper/helper";

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
            $or: [
              { first_name: { $regex: searchTerm, $options: "i" } },
              { last_name: { $regex: searchTerm, $options: "i" } },
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

        await EndUser.aggregate([
          { $match: _search },
          {
            $group: {
              _id: "$_id",
              user_id: { $first: "$user_id" },
              first_name: { $first: "$first_name" },
              last_name: { $first: "$last_name" },
              user_name: { $first: "$user_name" },
              email: { $first: "$email" },
              c_user_img_url: { $first: "$c_user_img_url" },
              google_id: { $first: "$google_id" },
              createdAt: { $first: "$createdAt" },
            //   c_createdBy: { $first: "$c_createdBy" },
              n_status: { $first: "$n_status" },
              n_published: { $first: "$n_published" },
            },
          },
        //   {
        //     $lookup: {
        //       from: "users",
        //       localField: "c_createdBy",
        //       foreignField: "user_id",
        //       as: "users",
        //     },
        //   },
        //   {
        //     $unwind: "$users",
        //   },
          {
            $project: {
              _id: 1,
              user_id: 1,
              first_name: 1,
              last_name: 1,
              user_name: 1,
              email: 1,
              c_user_img_url: 1,
              google_id: 1,
              createdAt: 1,
            //   c_createdBy: 1,
            //   c_createdName: "$users.user_name",
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

  if (verified.success) {
    if (id) {
      const checkId = await EndUser.findOne({ user_id: id });
      if (checkId) {
        let _search = {};
        _search["$and"] = [
          {
            $and: [{ n_status: 1 }, { n_published: 1 }, { user_id: id }],
          },
        ];

        try {
          await connectMongoDB();

          await EndUser.aggregate([
            { $match: _search },
            {
              $group: {
                _id: "$_id",
                user_id: { $first: "$user_id" },
                first_name: { $first: "$first_name" },
                last_name: { $first: "$last_name" },
                user_name: { $first: "$user_name" },
                email: { $first: "$email" },
                c_user_img_url: { $first: "$c_user_img_url" },
                google_id: { $first: "$google_id" },
                createdAt: { $first: "$createdAt" },
                // c_createdBy: { $first: "$c_createdBy" },
                n_status: { $first: "$n_status" },
                n_published: { $first: "$n_published" },
              },
            },
            {
              $project: {
                _id: 1,
                user_id: 1,
                first_name: 1,
                last_name: 1,
                user_name: 1,
                email: 1,
                c_user_img_url: 1,
                google_id: 1,
                createdAt: 1,
                // c_createdBy: 1,
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
                sendResponse["payloadJson"] = data[0];
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
        await EndUser.aggregate([
          { $match: _search },
          {
            $group: {
              _id: "$_id",
              user_id: { $first: "$user_id" },
              first_name: { $first: "$first_name" },
              last_name: { $first: "$last_name" },
              user_name: { $first: "$user_name" },
              email: { $first: "$email" },
              c_user_img_url: { $first: "$c_user_img_url" },
              google_id: { $first: "$google_id" },
              createdAt: { $first: "$createdAt" },
            //   c_createdBy: { $first: "$c_createdBy" },
              n_status: { $first: "$n_status" },
              n_published: { $first: "$n_published" },
            },
          },
          {
            $project: {
              _id: 1,
              user_id: 1,
              first_name: 1,
              last_name: 1,
              user_name: 1,
              email: 1,
              c_user_img_url: 1,
              google_id: 1,
              createdAt: 1,
            //   c_createdBy: 1,
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
    }
  } else {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = "";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "token expired!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
