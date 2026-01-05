import { NextResponse } from "next/server";
import { User } from "../../../../../../models/userModel";
import connectMongoDB from "../../../../../../libs/mongodb";
import {} from "../../../../../../helper/helper";

let sendResponse = {
  appStatusCode: "",
  message: "",
  n_page: 0,
  n_limit: 0,
  payloadJson: [],
  error: "",
};

export async function GET(request) {
  try {
    const name = request.nextUrl.searchParams.get("name");
    const url = request.nextUrl.searchParams.get("url");

    await connectMongoDB();

    let _search = { n_status: 1, n_published: 1 };

    if (name) {
      _search["$or"] = [
        { user_name: name },
        { user_name: { $regex: name, $options: "i" } },
      ];
    } else if (url) {
      _search["slug_name"] = url;
    } else {
      sendResponse.appStatusCode = 0;
      sendResponse.message = "Record not found!";
      sendResponse.payloadJson = [];
      sendResponse.error = [];
      return NextResponse.json(sendResponse, { status: 200 });
    }

    const users = await User.find(_search).lean();

    if (users && users.length > 0) {
      sendResponse.appStatusCode = 0;
      sendResponse.message = "";
      sendResponse.payloadJson = users;
      sendResponse.error = [];
    } else {
      sendResponse.appStatusCode = 0;
      sendResponse.message = "Record not found!";
      sendResponse.payloadJson = [];
      sendResponse.error = [];
    }

    return NextResponse.json(sendResponse, { status: 200 });
  } catch (err) {
    sendResponse.appStatusCode = 4;
    sendResponse.message = "";
    sendResponse.payloadJson = [];
    sendResponse.error = err;
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
