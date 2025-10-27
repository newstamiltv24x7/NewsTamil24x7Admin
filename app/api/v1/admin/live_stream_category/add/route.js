import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import { create_UUID, verifyAccessToken } from "@/helper/helper";
import { LiveStreamCategory } from "@/models/liveStreamCategoryModel";
// import { LiveStreamCategory } from "../../../../../../models/liveStreamCategoryModel";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const {
    c_live_stream_category_name,
    Id,
    n_status,
  } = await request.json();

  try {
    await connectMongoDB();
    const verified = verifyAccessToken();

    

    const checkCategory = await LiveStreamCategory.findOne({
      c_live_stream_category_name: c_live_stream_category_name,
    });

    if (verified.success) {
      if (Id !== undefined) {
        const categoryeId = await LiveStreamCategory.findOne({
          _id: Id,
        });

        if (categoryeId === null) {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter valid id!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else {

          
          const body = {
            c_live_stream_category_name: c_live_stream_category_name,
            n_status: n_status,
          };
          await LiveStreamCategory.findByIdAndUpdate(Id, body)
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
        if (c_live_stream_category_name === "") {
            

          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = "";
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Category name is required";
          return NextResponse.json(sendResponse, { status: 200 });
        } else if (checkCategory !== null) {
            

          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Live StreamCategory already exist";
          return NextResponse.json(sendResponse, { status: 200 });
        } else if (checkCategory === null) {
            
          const result = await LiveStreamCategory.find().sort({ _id: -1 }).limit(1);



          const categorydata = {
            c_live_stream_category_id: create_UUID(),
            c_live_stream_category_name,
            c_createdBy: verified.data.user_id,
          };

          const LiveStreamCategoryData = new LiveStreamCategory(categorydata);

          

          await LiveStreamCategoryData.save().then((result) => {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "LiveStream Category added Successfully";
              sendResponse["payloadJson"] = result;
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
    } else {
      
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "Invaild Token !!";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = verified.error;
      return NextResponse.json(sendResponse, { status: 400 });
    }
  } catch (err) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = "Error";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "Something went wrong!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
