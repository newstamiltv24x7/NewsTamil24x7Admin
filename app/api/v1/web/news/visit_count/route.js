import { NextResponse } from "next/server";
import { Story } from "../../../../../../models/storyModel";
import connectMongoDB from "../../../../../../libs/mongodb";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const { c_story_id } = await request.json();

  try {
   
    if (c_story_id) {
        await connectMongoDB();
      const storyData = await Story.findOne({
        story_id: c_story_id,
      });
      // console.log(storyData,"<<< STORY DATA")
    
      if (storyData) {
        await Story.updateOne({
            _id: storyData?._id,
        },{ 
          $inc: { view_count: 1 }
         },{ timestamps: false }
         ).then(async (result) => {
          // console.log(result,"<<< RESULTDD")
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "Visited!!";
            sendResponse["payloadJson"] = storyData?.updatedAt;
            sendResponse["error"] = [];
              return NextResponse.json(sendResponse, { status: 200 });
          }).catch((err) => {
            sendResponse["appStatusCode"] = 4;
            sendResponse["message"] = "Invalid Id";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = err;
          });
          return NextResponse.json(sendResponse, { status: 200 });
      }
      return NextResponse.json(sendResponse, { status: 200 });
    } else {
      sendResponse["appStatusCode"] = 0;
      sendResponse["message"] = "Check your View count ";
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

export async function GET(){
    sendResponse["appStatusCode"] = 0;
    sendResponse["message"] = "";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "testing";
    return NextResponse.json(sendResponse, { status: 200 });
}
