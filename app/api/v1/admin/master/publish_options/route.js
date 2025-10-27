import { NextResponse } from "next/server";
import { PublishOptions } from "../../../../../../models/publishOptionsModel";
import connectMongoDB from "../../../../../../libs/mongodb";
import { create_UUID } from "../../../../../../helper/helper";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const { opt_title, opt_sub_title, Id, n_status } = await request.json();

  try {
    await connectMongoDB();
    const checkOptionTitle = await PublishOptions.findOne({
      opt_title: opt_title,
    });
    const checkUserOptionSubTitle = await PublishOptions.findOne({
      opt_sub_title: opt_sub_title,
    });

    if (Id) {
      const optionsId = await PublishOptions.findOne({
        _id: Id,
      });

      if (optionsId === null) {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = [];
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Please enter valid id!";
        return NextResponse.json(sendResponse, { status: 200 });
      } else {
        const body = {
          opt_title: opt_title,
          opt_sub_title: opt_sub_title,
          n_status: n_status,
        };
        await PublishOptions.findByIdAndUpdate(Id, body)
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
      if (opt_title === "") {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = [];
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Title is required";
        return NextResponse.json(sendResponse, { status: 200 });
      } else if (opt_sub_title === "") {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = [];
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Sub Title is required";
        return NextResponse.json(sendResponse, { status: 200 });
      } else if (checkOptionTitle || checkUserOptionSubTitle) {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = [];
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Publish Options already exist";
        return NextResponse.json(sendResponse, { status: 200 });
      } else {
        const optionsdata = new PublishOptions({
          c_opt_id: create_UUID,
          opt_title,
          opt_sub_title,
        });

        await optionsdata.save().then((result) => {
          sendResponse["appStatusCode"] = 0;
          sendResponse["message"] = "Publish Options added Successfully";
          sendResponse["payloadJson"] = result;
          sendResponse["error"] = [];
        });
        return NextResponse.json(sendResponse, { status: 200 });
      }
    }
  } catch (err) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = err._message;
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = err;
    return NextResponse.json(sendResponse, { status: 400 });
  }
}

export async function GET() {
  let data = {
    n_status: 1,
    n_published: 1,
  };
  try {
    await connectMongoDB();
    await PublishOptions.find(data)
      .sort({ createdAt: 1 })
      .then((data) => {
        if (data?.length >= 0) {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "";
            sendResponse["payloadJson"] = data;
            sendResponse["error"] = "";
          } else {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "Record not found!";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = "";
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
    sendResponse["error"] = err;
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
export async function DELETE(request) {

    const Id = request.nextUrl.searchParams.get("id");

    
    try {
      await connectMongoDB();
      const optionsId = await PublishOptions.findOne({
        _id: Id,
      });
     
      if (optionsId === null) {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Please enter valid id!";
        
      }else if(optionsId.n_published === 0 ){
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "This data already deleted!";
      } else {
        const body = {
            n_status: 0,
            n_published: 0,
        };
        await PublishOptions.findByIdAndUpdate(Id, body)
          .then(() => {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "This data deleted successfully!";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = [];
          })
          .catch((err) => {
            sendResponse["appStatusCode"] = 4;
            sendResponse["message"] = "Invalid Id";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = err;
          });
       
      }
      return NextResponse.json(sendResponse, { status: 200 });
    } catch (err) {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "something went wrong";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Something went wrong!";
      return NextResponse.json(sendResponse, { status: 400 });
    }
  }