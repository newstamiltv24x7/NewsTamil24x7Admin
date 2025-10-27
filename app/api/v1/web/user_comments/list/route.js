import { NextResponse } from "next/server";
import { Comment } from "../../../../../../models/commentsModel";
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

function createComments(comments, c_parent_comments_id = null) {
  const commentsList = [];
  let category;
  if (c_parent_comments_id == null) {
    category = comments.filter(
      (cate) =>
        cate.c_parent_comments_id == undefined && cate.c_comment_id.length > 0
    );
  } else {
    category = comments.filter(
      (cate) =>
        cate.c_parent_comments_id == c_parent_comments_id &&
        cate.c_comment_id.length > 0
    );
  }

  for (let cat of category) {
    commentsList.push({
      _id: cat._id,
      c_comment_id: cat.c_comment_id,
      user_id: cat.user_id,
      c_user_comment: cat.c_user_comment,
      c_comment_like: cat.c_comment_like,
      c_parent_comments_id: cat.c_parent_comments_id,
      n_status: cat.n_status,
      n_published: cat.n_published,
      user_name: cat.user_name,
      email: cat.email,
      c_user_img_url: cat.c_user_img_url,

      c_sub_comments: createComments(comments, cat.c_comment_id),
    });
  }

  return commentsList;
}

export async function POST(request) {
  const { n_page, n_limit, c_search_term, story_id } = await request.json();

  try {
    let _search = {};
    let n_limitTerm = n_limit;
    let n_pageTerm = n_page === 1 ? 0 : (n_page - 1) * n_limit;
    let searchTerm = c_search_term ? c_search_term : "";

    if (story_id) {
      _search["$and"] = [
        {
          $and: [{ n_status: 1 }, { n_published: 1 }, { story_id: story_id }],
        },
      ];
    } else if (searchTerm !== "") {
      _search["$and"] = [
        {
          $and: [
            { c_user_comment: { $regex: searchTerm, $options: "i" } },
            { n_status: 1 },
            { n_published: 1 },
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

      await Comment.aggregate([
        {
          $match: _search,
        },
        {
          $group: {
            _id: "$_id",
            c_user_comment: { $first: "$c_user_comment" },
            story_id: { $first: "$story_id" },
            c_comment_like: { $first: "$c_comment_like" },
            c_comment_id: { $first: "$c_comment_id" },
            user_id: { $first: "$user_id" },
            n_status: { $first: "$n_status" },
            n_published: { $first: "$n_published" },
            createdAt: { $first: "$createdAt" },
            c_createdBy: { $first: "$c_createdBy" },
          },
        },
        {
          $lookup: {
            from: "endusers",
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
            c_user_comment: 1,
            story_id: 1,
            c_comment_like: 1,
            c_comment_id: 1,
            user_id: 1,
            n_status: 1,
            n_published: 1,
            createdAt: 1,
            c_createdBy: 1,
            //   createdName: "$createdById.user_name",
            //   c_userImg: "$createdById.c_user_img_url",
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
    } else {
      sendResponse["appStatusCode"] = 3;
      sendResponse["message"] = "";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Invalid Payload";
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
  const id = request.nextUrl.searchParams.get("id");
  const story_id = request.nextUrl.searchParams.get("story_id");

  if (id) {
    const checkId = await Comment.findOne({ c_comment_id: id });
    if (checkId) {
      let _search = {};
      _search["$and"] = [
        {
          $and: [{ n_status: 1 }, { n_published: 1 }, { c_comment_id: id }],
        },
      ];

      try {
        await connectMongoDB();

        await Comment.aggregate([
          { $match: _search },
          {
            $group: {
              _id: "$_id",
  
              story_id: { $first: "$story_id" },
              c_comment_id: { $first: "$c_comment_id" },
              user_id: { $first: "$user_id" },
              c_user_comment: { $first: "$c_user_comment" },
              c_comment_like: { $first: "$c_comment_like" },
              c_parent_comments_id: { $first: "$c_parent_comments_id" },
              createdAt: { $first: "$createdAt" },
              c_createdBy: { $first: "$c_createdBy" },
              n_status: { $first: "$n_status" },
              n_published: { $first: "$n_published" },
            },
          },
          {
            $lookup: {
              from: "endusers",
              foreignField: "user_id",
              localField: "c_createdBy",
              as: "endusers",
            },
          },
          {
            $unwind: "$endusers",
          },
          {
            $project: {
              _id: 1,
              story_id: 1,
              c_user_comment: 1,
              user_id: 1,
              c_comment_like: 1,
              c_parent_comments_id: 1,
              c_comment_id: 1,
              createdAt: 1,
              c_createdBy: 1,
              user_name: "$endusers.user_name",
              email: "$endusers.email",
              c_user_img_url: "$endusers.c_user_img_url",
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
  }
  else if (story_id) {
    const checkStoryId = await Comment.findOne({ story_id: story_id });
    if (checkStoryId) {
      let _search = {};
      _search["$and"] = [
        {
          $and: [{ n_status: 1 }, { n_published: 1 }, { story_id: story_id }],
        },
      ];

      try {
        await connectMongoDB();

        await Comment.aggregate([
          { $match: _search },
          {
            $group: {
              _id: "$_id",
  
              story_id: { $first: "$story_id" },
              c_comment_id: { $first: "$c_comment_id" },
              user_id: { $first: "$user_id" },
              c_user_comment: { $first: "$c_user_comment" },
              c_comment_like: { $first: "$c_comment_like" },
              c_parent_comments_id: { $first: "$c_parent_comments_id" },
              createdAt: { $first: "$createdAt" },
              c_createdBy: { $first: "$c_createdBy" },
              n_status: { $first: "$n_status" },
              n_published: { $first: "$n_published" },
            },
          },
          {
            $lookup: {
              from: "endusers",
              foreignField: "user_id",
              localField: "c_createdBy",
              as: "endusers",
            },
          },
          {
            $unwind: "$endusers",
          },
          {
            $project: {
              _id: 1,
              story_id: 1,
              c_user_comment: 1,
              user_id: 1,
              c_comment_like: 1,
              c_parent_comments_id: 1,
              c_comment_id: 1,
              createdAt: 1,
              c_createdBy: 1,
              user_name: "$endusers.user_name",
              email: "$endusers.email",
              c_user_img_url: "$endusers.c_user_img_url",
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
  } 
  
  else {
    let _search = {};
    _search["$and"] = [
      {
        $and: [{ n_status: 1 }, { n_published: 1 }],
      },
    ];

    try {
      await connectMongoDB();

      await Comment.aggregate([
        { $match: _search },
        {
          $group: {
            _id: "$_id",

            story_id: { $first: "$story_id" },
            c_comment_id: { $first: "$c_comment_id" },
            user_id: { $first: "$user_id" },
            c_user_comment: { $first: "$c_user_comment" },
            c_comment_like: { $first: "$c_comment_like" },
            c_parent_comments_id: { $first: "$c_parent_comments_id" },
            createdAt: { $first: "$createdAt" },
            c_createdBy: { $first: "$c_createdBy" },
            n_status: { $first: "$n_status" },
            n_published: { $first: "$n_published" },
          },
        },
        {
          $lookup: {
            from: "endusers",
            foreignField: "user_id",
            localField: "c_createdBy",
            as: "endusers",
          },
        },
        {
          $unwind: "$endusers",
        },
        {
          $project: {
            _id: 1,
            story_id: 1,
            c_user_comment: 1,
            user_id: 1,
            c_comment_like: 1,
            c_parent_comments_id: 1,
            c_comment_id: 1,
            createdAt: 1,
            c_createdBy: 1,
            user_name: "$endusers.user_name",
            email: "$endusers.email",
            c_user_img_url: "$endusers.c_user_img_url",
            n_status: 1,
            n_published: 1,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ])
        .then((data) => {
          const comentsData = createComments(data);

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
  }
}
