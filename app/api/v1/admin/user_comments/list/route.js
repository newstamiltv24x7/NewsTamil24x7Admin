import { NextResponse } from "next/server";
import connectMongoDB from "../../../../../../libs/mongodb";
import { verifyAccessToken } from "@/helper/helper";
import { Comment } from "../../../../../../models/commentsModel";
import { Story } from "../../../../../../models/storyModel";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const {
    n_page,
    n_limit,
    c_search_term
  } = await request.json();


  const verified = verifyAccessToken();
  try {
    if (verified.success) {
      let _search = {};
      let n_limitTerm = n_limit;
      let n_pageTerm = n_page === 1 ? 0 : (n_page - 1) * n_limit;
      let searchTerm = c_search_term ? c_search_term : "";


      
      if (searchTerm !== "" ) {
        

        const result = await Story.findOne({ story_title_name : { $regex: searchTerm, $options: "i" } });

        

        if(result){
          _search["$or"] = [
            {
              $and: [
                { story_id: result.story_id },
                { n_published: 1 },
              ]
            },
          ];
        }else{
          _search["$or"] = [
            {
              $and: [
                { c_user_comment: { $regex: searchTerm, $options: "i" } },
                { n_published: 1 },
              ]
            },
          ];
        }

      } else {
        _search["$and"] = [
            {
              $and: [
                { n_published: 1 },
              ],
            },
          ];
        
      }

      if (n_limitTerm !== "" && n_pageTerm !== "") {
        await connectMongoDB();

        await Comment.aggregate([
          {
            $match: _search,
          },
          {
            $group: {
              _id: "$_id",
              story_id: { $first: "$story_id" },
              c_user_comment: { $first: "$c_user_comment" },
              c_comment_id: { $first: "$c_comment_id" },
              user_id: { $first: "$user_id" },
              c_comment_like: { $first: "$c_comment_like" },
              n_status: { $first: "$n_status" },
              n_published: { $first: "$n_published" },
              createdAt: { $first: "$createdAt" },
              c_createdBy: { $first: "$c_createdBy" },
            },
          },
          {
            $lookup: {
              from: "endusers",
              localField: "user_id",
              foreignField: "user_id",
              as: "endusers",
            },
          },
          {
            $unwind: {
              path: "$endusers",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "stories",
              localField: "story_id",
              foreignField: "story_id",
              as: "stories",
            },
          },
          {
            $unwind: {
              path: "$stories",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              story_id: 1,
              c_user_comment: 1,
              c_comment_id: 1,
              user_id: 1,
              c_comment_like: 1,
              n_status: 1,
              n_published: 1,
              createdAt: 1,
              c_createdBy: 1,
              createdName: "$endusers.user_name",
              story_title_name: "$stories.story_title_name",
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
  const status = request.nextUrl.searchParams.get("status");

  if (verified.success) {
    if (id) {
      let _search = {};
      _search["$and"] = [
        {
          $and: [{ n_published: 1 },{c_comment_id:id}],
        },
      ];

      try {
        await connectMongoDB();

        await Comment.aggregate([
          {
            $match: _search,
          },
          {
            $group: {
              _id: "$_id",
              story_id: { $first: "$story_id" },
              c_user_comment: { $first: "$c_user_comment" },
              c_comment_id: { $first: "$c_comment_id" },
              user_id: { $first: "$user_id" },
              c_comment_like: { $first: "$c_comment_like" },
              n_status: { $first: "$n_status" },
              n_published: { $first: "$n_published" },
              createdAt: { $first: "$createdAt" },
              c_createdBy: { $first: "$c_createdBy" },
            },
          },
          {
            $lookup: {
              from: "endusers",
              localField: "user_id",
              foreignField: "user_id",
              as: "endusers",
            },
          },
          {
            $unwind: {
              path: "$endusers",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "stories",
              localField: "story_id",
              foreignField: "story_id",
              as: "stories",
            },
          },
          {
            $unwind: {
              path: "$stories",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              story_id: 1,
              c_user_comment: 1,
              c_comment_id: 1,
              user_id: 1,
              c_comment_like: 1,
              n_status: 1,
              n_published: 1,
              createdAt: 1,
              c_createdBy: 1,
              createdName: "$endusers.user_name",
              story_title_name: "$stories.story_title_name",
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
    } else if (status) {
      
      let _search = {};
      _search["$and"] = [
        {
          $and: [{n_status: parseInt(status)},{ n_published: 1 }],
        },
      ];

      try {
        await connectMongoDB();

        await Comment.aggregate([
          {
            $match: _search,
          },
          {
            $group: {
              _id: "$_id",
              story_id: { $first: "$story_id" },
              c_user_comment: { $first: "$c_user_comment" },
              c_comment_id: { $first: "$c_comment_id" },
              user_id: { $first: "$user_id" },
              c_comment_like: { $first: "$c_comment_like" },
              n_status: { $first: "$n_status" },
              n_published: { $first: "$n_published" },
              createdAt: { $first: "$createdAt" },
              c_createdBy: { $first: "$c_createdBy" },
            },
          },
          {
            $lookup: {
              from: "endusers",
              localField: "user_id",
              foreignField: "user_id",
              as: "endusers",
            },
          },
          {
            $unwind: {
              path: "$endusers",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "stories",
              localField: "story_id",
              foreignField: "story_id",
              as: "stories",
            },
          },
          {
            $unwind: {
              path: "$stories",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              story_id: 1,
              c_user_comment: 1,
              c_comment_id: 1,
              user_id: 1,
              c_comment_like: 1,
              n_status: 1,
              n_published: 1,
              createdAt: 1,
              c_createdBy: 1,
              createdName: "$endusers.user_name",
              story_title_name: "$stories.story_title_name",
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
      let _search = {};
      _search["$and"] = [
        {
          $and: [{ n_published: 1 }],
        },
      ];

      try {
        await connectMongoDB();

        await Comment.aggregate([
          {
            $match: _search,
          },
          {
            $group: {
              _id: "$_id",
              story_id: { $first: "$story_id" },
              c_user_comment: { $first: "$c_user_comment" },
              c_comment_id: { $first: "$c_comment_id" },
              user_id: { $first: "$user_id" },
              c_comment_like: { $first: "$c_comment_like" },
              n_status: { $first: "$n_status" },
              n_published: { $first: "$n_published" },
              createdAt: { $first: "$createdAt" },
              c_createdBy: { $first: "$c_createdBy" },
            },
          },
          {
            $lookup: {
              from: "endusers",
              localField: "user_id",
              foreignField: "user_id",
              as: "endusers",
            },
          },
          {
            $unwind: {
              path: "$endusers",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "stories",
              localField: "story_id",
              foreignField: "story_id",
              as: "stories",
            },
          },
          {
            $unwind: {
              path: "$stories",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              story_id: 1,
              c_user_comment: 1,
              c_comment_id: 1,
              user_id: 1,
              c_comment_like: 1,
              n_status: 1,
              n_published: 1,
              createdAt: 1,
              c_createdBy: 1,
              createdName: "$endusers.user_name",
              story_title_name: "$stories.story_title_name",
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
