import { NextResponse } from "next/server";
import { RobotsTxt } from "../../../../../../models/robotsTxtModel";
import connectMongoDB from "../../../../../../libs/mongodb";
import { verifyAccessToken } from "../../../../../../helper/helper";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  const verified = verifyAccessToken();

  if (verified.success) {
    const body = {
        n_status: 0,
        n_published: 0,
        c_deletedBy: verified.data.user_id,
      };


    await connectMongoDB();
    try {
      await RobotsTxt.findByIdAndUpdate(id, body).then((result) => {
        sendResponse["appStatusCode"] = 0;
        sendResponse["message"] = "Deleted Successfully";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "";
      });
    } catch (err) {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Something went wrong!";
      return NextResponse.json(sendResponse, { status: 400 });
    }
    return NextResponse.json(sendResponse, { status: 200 });
  } else {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = "";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "token expired!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
