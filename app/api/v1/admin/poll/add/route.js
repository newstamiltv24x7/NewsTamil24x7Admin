import { NextResponse } from "next/server";
import connectMongoDB from "../../../../../../libs/mongodb";
import { create_UUID,verifyAccessToken } from "../../../../../../helper/helper";
import { PollOptions } from "../../../../../../models/pollModel";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const { c_poll_question,c_poll_answer, Id, n_status } = await request.json();

  const verified = verifyAccessToken();

  if (verified.success) {
    try {
      await connectMongoDB();
  
      if (Id) {
        const pollId = await PollOptions.findOne({
          c_poll_id: Id,
        });
  
        if (pollId === null) {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter valid id!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else {
          const body = {
            c_poll_question: c_poll_question,
            c_poll_answer:c_poll_answer,
            n_status: n_status,
            c_updatedBy: verified.data.user_id,
          };
  
          await PollOptions.findByIdAndUpdate(Id, body)
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
        const pollName = await PollOptions.findOne({
          c_poll_question: c_poll_question,
        });
  
      
  
        if (c_poll_question === "") {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter poll!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else if (pollName) {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = " Poll already exist";
          return NextResponse.json(sendResponse, { status: 200 });
        } else {
          let dumArr = [];
          c_poll_answer.map(((data) =>
           { dumArr.push({
              poll_answer: data.poll_answer,
              poll_answer_id:create_UUID(),
              poll_count:  data.poll_count
            })}
          ))


          let pollData = new PollOptions({
            c_poll_question,
            c_poll_answer:dumArr,
            c_poll_id: create_UUID(),
            c_createdBy: verified.data.user_id,
          });
  
          await pollData.save()
            .then(() => {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "Poll added Successfully!";
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = [];
            })
            .catch((err) => {
              sendResponse["appStatusCode"] = 4;
              sendResponse["message"] = "";
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = err;
            });
          return NextResponse.json(sendResponse, { status: 200 });
        }
      }
    } catch (err) {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Something went wrong!";
      return NextResponse.json(sendResponse, { status: 400 });
    }
  }else{
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = "";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "token expired!";
    return NextResponse.json(sendResponse, { status: 400 });
  }

 
}

