import { NextResponse } from "next/server";
import connectMongoDB from "../../../../../../libs/mongodb";
import { create_UUID } from "../../../../../../helper/helper";
import { PollOptions } from "../../../../../../models/pollModel";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const {c_poll_id,c_poll_answer_id } = await request.json();
    try {
      await connectMongoDB();

      if (c_poll_id) {
        const pollId = await PollOptions.findOne({
          c_poll_id: c_poll_id,
        });

        if (pollId === null) {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter valid id!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else {

            
    
        
            await PollOptions.updateOne({"c_poll_id":c_poll_id,"c_poll_answer": { $elemMatch: { "poll_answer_id": c_poll_answer_id } }},
                { "$inc": { "c_poll_answer.$.poll_count": 1 } }
            ).then((result) => {
            
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "Updated Successfullyy!";
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
        

        sendResponse["appStatusCode"] = 0;
        sendResponse["message"] = "Check your Poll ";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = [];
        return NextResponse.json(sendResponse, { status: 200 });
  
      }
    } catch (err) {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Something went wrong!";
      return NextResponse.json(sendResponse, { status: 400 });
    }
  

 
}

