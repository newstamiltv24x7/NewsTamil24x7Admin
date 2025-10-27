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


export async function DELETE(request) {
  const Id = request.nextUrl.searchParams.get("id");
  const verified = verifyAccessToken();

if(verified.success){
  try {
    await connectMongoDB();
    const aricleTemplateId = await ArticleTemplate.findOne({
      _id: Id,
    });
    
    if (aricleTemplateId === null) {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Please enter valid id!";
    } else if (aricleTemplateId.n_published === 0) {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "This data already deleted!";
    } else {
      const body = {
        n_status: 0,
        n_published: 0,
        c_deletedBy: verified.data.user_id
      };
      await ArticleTemplate.findByIdAndUpdate(Id, body)
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
}else{
  sendResponse["appStatusCode"] = 4;
  sendResponse["message"] = "";
  sendResponse["payloadJson"] = [];
  sendResponse["error"] = verified.error;
  return NextResponse.json(sendResponse, { status: 400 });
}



}
