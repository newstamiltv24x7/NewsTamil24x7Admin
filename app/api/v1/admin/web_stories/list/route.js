import { NextResponse } from "next/server";
import { WebStories } from "../../../../../../models/webStoriesModel";
import connectMongoDB from "../../../../../../libs/mongodb";
import { verifyAccessToken } from "@/helper/helper";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const { n_page, n_limit, c_search_term} =
    await request.json();

  const verified = verifyAccessToken();
  try {
    if (verified.success) {
      let _search = {};
      let n_limitTerm = n_limit;
      let n_pageTerm = n_page === 1 ? 0 : (n_page - 1) * n_limit;
      let searchTerm = c_search_term ? c_search_term : "";

      if (searchTerm !== "") {
        _search["$and"] = [
          {
            $and: [{ c_web_story_title: { $regex: searchTerm, $options: "i" } }, { n_published: 1 }],
          },
        ];
      } else {
        _search["$and"] = [
          {
            $and: [{ n_published: 1 }],
          },
        ];
      }

      if (n_limitTerm !== "" && n_pageTerm !== "") {
        await connectMongoDB();

        await WebStories.aggregate([
          {
            $match: _search,
          },
          {
            $group: {
              _id: "$_id",
              c_web_story_title: { $first: "$c_web_story_title" },
              c_web_story_slug_name: { $first: "$c_web_story_slug_name" },
              c_web_story_cover_img: { $first: "$c_web_story_cover_img" },              
              c_web_story_id: { $first: "$c_web_story_id" },
              c_web_story_images: { $first: "$c_web_story_images" },
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
              c_web_story_title: 1,
              c_web_story_slug_name: 1,
              c_web_story_cover_img: 1,
              c_web_story_id: 1,
              c_web_story_images: 1,
              n_status: 1,
              n_published: 1,
              createdAt: 1,
              c_createdBy: 1,
              createdName: "$createdById.user_name",
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
  } catch (error) {
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
        const checkId = await WebStories.findOne({ c_web_story_id: id });
        if (checkId) {
          let _search = {};
          _search["$and"] = [
            {
              $and: [{ n_status: 1 }, { n_published: 1 }, { c_web_story_id: id }],
            },
          ];
  
          try {
            await connectMongoDB();
  
            await WebStories.aggregate([
              { $match: _search },
              {
                $group: {
                  _id: "$_id",
                  c_web_story_title: { $first: "$c_web_story_title" },
                  c_web_story_slug_name: { $first: "$c_web_story_slug_name" },
                  c_web_story_cover_img: { $first: "$c_web_story_cover_img" },                  
                  c_web_story_id: { $first: "$c_web_story_id" },
                  c_web_story_images: { $first: "$c_web_story_images" },
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
              },{
                $project: {
                  _id: 1,
                  c_web_story_title: 1,
                  c_web_story_slug_name: 1,
                  c_web_story_cover_img: 1,
                  c_web_story_id: 1,
                  c_web_story_images: 1,
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
  
          await WebStories.aggregate([
            { $match: _search },
            {
              $group: {
                _id: "$_id",
                c_web_story_title: { $first: "$c_web_story_title" },
                c_web_story_slug_name: { $first: "$c_web_story_slug_name" },                
                c_web_story_cover_img: { $first: "$c_web_story_cover_img" },
                c_web_story_id: { $first: "$c_web_story_id" },
                c_web_story_images: { $first: "$c_web_story_images" },
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
                c_web_story_title: 1,
                c_web_story_slug_name: 1,
                c_web_story_cover_img: 1,
                c_web_story_id: 1,
                c_web_story_images: 1,
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
