import { NextResponse } from "next/server";
import { YouTubeURL } from "../../../../../../models/youTubeURLModel";
import connectMongoDB from "../../../../../../libs/mongodb";
import { verifyAccessToken } from "@/helper/helper";

export async function POST(request) {
  let _body;
  try { _body = await request.json(); } catch(e) {
    return Response.json({ appStatusCode: 3, message: "", payloadJson: [], error: "Invalid JSON body" }, { status: 400 });
  }
  const { Id, c_url_order_id, c_category_order } = _body;

  const sendResponse = { appStatusCode: "", message: "", payloadJson: [], error: "" };

  const verified = verifyAccessToken();
  if (verified) {
    try {
      await connectMongoDB();

      if (Id !== undefined && c_url_order_id !== "") {
        const categoryeId = await YouTubeURL.findOne({ _id: Id });
        const categoryeOrderChanes = await YouTubeURL.findOne({ c_url_order_id: c_url_order_id });

        if (categoryeId === null) {
          sendResponse.appStatusCode = 4;
          sendResponse.error = "Please enter valid id!";
          return NextResponse.json(sendResponse, { status: 400 });
        } else if (c_url_order_id === categoryeId.c_url_order_id) {
          sendResponse.appStatusCode = 4;
          sendResponse.error = "This sequence already exits!";
          return NextResponse.json(sendResponse, { status: 400 });
        } else {
          await YouTubeURL.findByIdAndUpdate({ _id: Id }, { c_url_order_id: c_url_order_id });
          await YouTubeURL.findByIdAndUpdate({ _id: categoryeOrderChanes._id }, { c_url_order_id: categoryeId.c_url_order_id });
          sendResponse.appStatusCode = 0;
          sendResponse.message = "Updated Successfully!";
          return NextResponse.json(sendResponse, { status: 200 });
        }
      }
    } catch (err) {
      sendResponse.appStatusCode = 4;
      sendResponse.error = "Something went wrong!";
      return NextResponse.json(sendResponse, { status: 400 });
    }
  } else {
    sendResponse.appStatusCode = 4;
    sendResponse.error = "token expired!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}