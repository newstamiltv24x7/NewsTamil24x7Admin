import { NextResponse } from "next/server";
import connectMongoDB from "../../../../../../../libs/mongodb";
import { ArticleTemplate } from "../../../../../../../models/articleTemplateModel";
import {create_UUID, verifyAccessToken} from "../../../../../../../helper/helper"

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const { art_template_name, Id, n_status } = await request.json();
  const verified = verifyAccessToken();


if(verified.success){

  try {
    await connectMongoDB();
    const checkArticleTemplate = await ArticleTemplate.findOne({
      art_template_name: art_template_name,
    });

    if (Id) {
      const aricleTemplateId = await ArticleTemplate.findOne({
        _id: Id,
      });

      if (aricleTemplateId === null) {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = [];
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Please enter valid id!";
        return NextResponse.json(sendResponse, { status: 200 });
      } else {
        const body = {
          art_template_name: art_template_name,
          c_updatedBy : verified.data.user_id,
          n_status: n_status,
        };
        await ArticleTemplate.findByIdAndUpdate(Id, body)
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
      if (art_template_name === "") {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = [];
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Title is required";
        return NextResponse.json(sendResponse, { status: 200 });
      } else if (checkArticleTemplate) {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = [];
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Article Template already exist";
        return NextResponse.json(sendResponse, { status: 200 });
      } else {
        const articleTemplatedata = new ArticleTemplate({
          art_template_name,
          art_template_id: create_UUID(),
          c_createdBy : verified.data.user_id
        });

        await articleTemplatedata.save().then((result) => {
          sendResponse["appStatusCode"] = 0;
          sendResponse["message"] = "Article Template added Successfully";
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

}else{
  sendResponse["appStatusCode"] = 4;
  sendResponse["message"] = "";
  sendResponse["payloadJson"] = [];
  sendResponse["error"] = verified.error;
  return NextResponse.json(sendResponse, { status: 400 });
}


}


