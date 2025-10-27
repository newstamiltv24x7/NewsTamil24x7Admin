import { NextResponse } from "next/server";
import connectMongoDB from "../../../../../../../libs/mongodb";
import { ArticleTemplate } from "../../../../../../../models/articleTemplateModel";
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

  if (verified.success) {
    try {
      await connectMongoDB();

      if(id){
        let data = {
          n_published: 1,
          _id: id,
        };
        await ArticleTemplate.find(data)
        .sort({ createdAt: -1 })
        .then((data) => {
          if (data?.length === 0) {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "Recored not found!";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = "";
          } else {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "";
            sendResponse["payloadJson"] = data;
            sendResponse["error"] = "";
          }
        })
        .catch((err) => {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = "";
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = err;
        });
      }else{
        let data = {
          n_published: 1,
        };
        await ArticleTemplate.find(data)
        .sort({ createdAt: -1 })
        .then((data) => {
          if (data?.length === 0) {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "Recored not found!";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = "";
          } else {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "";
            sendResponse["payloadJson"] = data;
            sendResponse["error"] = "";
          }
        })
        .catch((err) => {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = "";
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = err;
        });
      }

      return NextResponse.json(sendResponse, { status: 200 });
    } catch (err) {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = err;
      return NextResponse.json(sendResponse, { status: 400 });
    }
  } else {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = "";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = verified.error;
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
