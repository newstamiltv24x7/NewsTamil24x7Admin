import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import { create_UUID, verifyAccessToken } from "@/helper/helper";
import { Categories } from "@/models/categoriesModel";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};


export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await connectMongoDB();

  const body = {
    n_status: 0,
    n_published: 0,
  };

  try {
    await Categories.findByIdAndUpdate(id, body).then((result) => {
      if (result) {
        sendResponse["appStatusCode"] = 0;
        sendResponse["message"] = "Deleted Successfully";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "";
      } else {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Invalid Id!";
      }
    });
    return NextResponse.json(sendResponse, { status: 200 });
  } catch (error) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = "";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "Something went wrong";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
