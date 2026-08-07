import { NextResponse } from "next/server";
import { UserRole } from "../../../../../../models/userRoleModel";
import connectMongoDB from "../../../../../../libs/mongodb";
import { verifyAccessToken } from "@/helper/helper";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function GET(request) {
  const id = request.nextUrl.searchParams.get("id");
  const verified = verifyAccessToken();

  if (!verified.success) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = "";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "token expired!";
    return NextResponse.json(sendResponse, { status: 400 });
  }

  try {
    await connectMongoDB();

    if (id) {
      const checkId = await UserRole.findOne({ c_role_id: id });
      if (!checkId) {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Invalid Id!";
        return NextResponse.json(sendResponse, { status: 400 });
      }

      // Build search query
      let _search = {
        n_status: 1,
        n_published: 1,
        c_role_id: id,
      };

      if (verified.data.c_role_id !== "16f01165898b") {
        _search.c_role_id = { $nin: ["16f01165898b"] };
      }

      // Use simple find() instead of aggregate
      const data = await UserRole.find(_search)
        .sort({ createdAt: -1 })
        .select("_id c_role_name c_role_id createdAt n_status n_published")
        .limit(1)
        .lean();

      if (data.length > 0) {
        sendResponse["appStatusCode"] = 0;
        sendResponse["message"] = "";
        sendResponse["payloadJson"] = data[0];
        sendResponse["error"] = [];
      } else {
        sendResponse["appStatusCode"] = 0;
        sendResponse["message"] = "Record not found!";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = [];
      }

      return NextResponse.json(sendResponse, { status: 200 });
    } else {
      // Build search query
      let _search = {
        n_status: 1,
        n_published: 1,
        c_role_id: { $nin: ["16f01165898b"] },
      };

      // Use simple find() instead of aggregate
      const data = await UserRole.find(_search)
        .sort({ createdAt: -1 })
        .select("_id c_role_name c_role_id createdAt c_createdBy n_status n_published")
        .lean();

      if (data.length > 0) {
        sendResponse["appStatusCode"] = 0;
        sendResponse["message"] = "";
        sendResponse["payloadJson"] = data;
        sendResponse["error"] = [];
      } else {
        sendResponse["appStatusCode"] = 0;
        sendResponse["message"] = "Record not found!";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = [];
      }
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