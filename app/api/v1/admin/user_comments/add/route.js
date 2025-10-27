import { NextResponse } from "next/server";
import connectMongoDB from "../../../../../../libs/mongodb";
import { verifyAccessToken } from "@/helper/helper";
import { create_UUID } from "../../../../../../helper/helper";
import { Comment } from "../../../../../../models/commentsModel";

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
    n_status
  } = await request.json();

  try {
    await connectMongoDB();
    const verified = verifyAccessToken();

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
          n_status: n_status,
        };
       

        await Comment.findByIdAndUpdate(Id, body)
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

}

export async function GET(request) {
  const id = request.nextUrl.searchParams.get("id");

  if(id){
    sendResponse["appStatusCode"] = 0;
    sendResponse["message"] = "";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "";
    return NextResponse.json(sendResponse, { status: 200 });
  }else{
    sendResponse["appStatusCode"] = 0;
    sendResponse["message"] = "";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "";
    return NextResponse.json(sendResponse, { status: 200 });
  }
}
