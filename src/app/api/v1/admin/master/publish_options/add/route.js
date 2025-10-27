import { NextResponse } from "next/server";
import { PublishOptions } from "../../../../../../../models/publishOptionsModel";
import connectMongoDB from "../../../../../../../libs/mongodb";
import { create_UUID } from "../../../../../../../helper/helper"

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
          c_opt_id: create_UUID(),
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

