import { NextResponse } from "next/server";
import { WebComponentCategory } from "../../../../../../models/webComponentCategory";
import connectMongoDB from "../../../../../../libs/mongodb";
import { verifyAccessToken } from "../../../../../../helper/helper";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function GET(request) {
  const verified = verifyAccessToken();
  const id = request.nextUrl.searchParams.get("id");

  if (verified.success) {
    if (id) {
      const checkId = await WebComponentCategory.findOne({ c_web_component_category_id: id });
      if (checkId) {
        let _search = {};
        _search["$and"] = [
          {
            $and: [{ n_status: 1 }, { n_published: 1 }, { c_web_component_category_id: id }],
          },
        ];

        try {
          await connectMongoDB();

          await WebComponentCategory.aggregate([
            { $match: _search },
            {
              $group: {
                _id: "$_id",
                c_web_component_category_name: { $first: "$c_web_component_category_name" },
                c_web_component_category_id: { $first: "$c_web_component_category_id" },
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
                c_web_component_category_name: 1,
                c_web_component_category_id: 1,
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
        await WebComponentCategory.aggregate([
          { $match: _search },
          {
            $group: {
              _id: "$_id",
              c_web_component_category_name: { $first: "$c_web_component_category_name" },
              c_web_component_category_id: { $first: "$c_web_component_category_id" },
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
              c_web_component_category_name: 1,
              c_web_component_category_id: 1,
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
