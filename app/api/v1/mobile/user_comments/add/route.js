import { NextResponse } from "next/server";
import connectMongoDB from "../../../../../../libs/mongodb";
import { verifyAccessToken } from "@/helper/helper";
import { create_UUID } from "../../../../../../helper/helper";
import { Comment } from "../../../../../../models/commentsModel";
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
  const {
    c_user_comment,
    c_comment_like,
    c_parent_comments_id,
    Id,
  } = await request.json();


    await connectMongoDB();
    const verified = verifyAccessToken();


    if (verified.success) {

      try{
        
    if (Id) {
      const CommentsId = await Comment.findOne({
        _id: Id,
      });

      if (CommentsId === null) {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = [];
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Please enter valid id!";
        return NextResponse.json(sendResponse, { status: 200 });
      } else {
        const body = {
          user_id: verified.data.user_id,
          c_comment_id: c_comment_id,
          c_user_comment: c_user_comment,
          c_comment_like: c_comment_like,
          c_comment_dislike: c_comment_dislike,
          c_parent_comments_id: c_parent_comments_id,
          c_updatedBy: verified.data.user_id,
          n_status: n_status,
        };

        await Comments.findByIdAndUpdate(Id, body)
          .then(() => {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "Updated Successfully!";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = [];
          })
          .catch((err) => {
            sendResponse["appStatusCode"] = 4;
            sendResponse["message"] = "Invalid Id";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = err;
          });

        return NextResponse.json(sendResponse, { status: 200 });
      }
    } else {
      let commentsRecord = new Comment({
        c_comment_id: create_UUID(),
        user_id: verified.data.user_id,
        c_user_comment,
        c_comment_like,
        c_createdBy: verified.data.user_id,
      });

      if (c_parent_comments_id !== "") {
        commentsRecord.c_parent_comments_id = c_parent_comments_id;
      }

      await commentsRecord
        .save()
        .then(() => {
          sendResponse["appStatusCode"] = 0;
          sendResponse["message"] = "Comments Added Successfully!";
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = [];
        })
        .catch((err) => {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = "";
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = err;
        });
    }

    return NextResponse.json(sendResponse, { status: 200 });
  } catch (err) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = "";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "Something went wrong!";
    return NextResponse.json(sendResponse, { status: 400 });
  }


    }else {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "token expired!";
      return NextResponse.json(sendResponse, { status: 400 });
    }



}
