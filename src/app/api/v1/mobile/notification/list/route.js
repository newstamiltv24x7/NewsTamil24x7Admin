import { NextResponse } from "next/server";
import { Notification } from "../../../../../../models/notificationModel";
import connectMongoDB from "../../../../../../libs/mongodb";
import { mobilePaginations } from "@/helper/helper";

let sendResponse = {
  appStatusCode: "",
  message: "",
  n_page: 0,
  n_limit: 0,
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const { n_page, n_limit, c_device_id } = await request.json();

  try {
    await connectMongoDB();

    let _search = {};
    let _search1 = {};
    let n_limitTerm = n_limit;
    let n_pageTerm = n_page === 1 ? 0 : (n_page - 1) * n_limit;
    // let searchTerm = c_search_term ? c_search_term : "";

    //  if(c_device_id !== ""){
    //         _search1["$and"] = [
    //             {
    //               $and: {c_notification_list:{$elemtMatch:{c_read_status:0}}},
    //             },

    //           ];
    //     }

    // if (searchTerm !== "") {
    //   _search["$and"] = [
    //     {
    //       $or: [{ c_notification_title: { $regex: searchTerm, $options: "i" } }],
    //       $and: [{ n_status: 1 }, { n_published: 1 }],
    //     },
    //   ];
    // } else {
    //   _search["$and"] = [
    //     {
    //       $and: [{ n_status: 1 }, { n_published: 1 },],
    //     },
    //   ];
    // }

    if (n_limitTerm !== "" && n_pageTerm !== "") {
      await connectMongoDB();

      await Notification.aggregate([
        {
          $match: {
            n_status: 1,
            n_published: 1,
            c_notification_list: {
              $elemMatch: { c_read_status: 1, c_device_id: c_device_id },
            },
          },
        },
        {
          $group: {
            _id: "$_id",
            c_notification_id: { $first: "$c_notification_id" },
            c_notification_title: { $first: "$c_notification_title" },
            c_notification_content: { $first: "$c_notification_content" },
            c_notification_redirect_url: {
              $first: "$c_notification_redirect_url",
            },
            c_notification_icon: { $first: "$c_notification_icon" },
            createdAt: { $first: "$createdAt" },
            n_status: { $first: "$n_status" },
            n_published: { $first: "$n_published" },
          },
        },
        {
          $project: {
            _id: 1,
            c_notification_id: 1,
            c_notification_title: 1,
            c_notification_content: 1,
            c_notification_redirect_url: 1,
            c_notification_icon: 1,
            createdAt: 1,
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
          const returnResponse = mobilePaginations(n_page, n_limit);
          if (data[0].data.length > 0) {
            sendResponse["appStatusCode"] = 0;
            sendResponse["n_page"] = returnResponse.n_page;
            sendResponse["n_limit"] = returnResponse.n_limit;
            sendResponse["n_limit"] = 0;
            sendResponse["payloadJson"] = data;
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
  } catch (err) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = [];
    sendResponse["n_page"] = 0;
    sendResponse["n_limit"] = 0;
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "Something went wrong!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
