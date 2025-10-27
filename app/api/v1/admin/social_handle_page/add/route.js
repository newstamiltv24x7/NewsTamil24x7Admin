import { NextResponse } from "next/server";
import { SocialHandlePage } from "../../../../../../models/socialHandlePageModel";
import connectMongoDB from "../../../../../../libs/mongodb";
import {
  create_UUID,
  verifyAccessToken,
} from "../../../../../../helper/helper";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const {
    c_social_handle_page_title,
    c_social_handle_category_id,
    c_social_handle_page_name,
    c_social_handle_page_h_rules_name,
    c_social_handle_page_status,
    c_social_handle_page_type,
    Id,
    n_status,
    n_published,
  } = await request.json();

  const verified = verifyAccessToken();

  if (verified.success) {
    try {
      await connectMongoDB();

      if (Id) {
        
        const userRoleId = await SocialHandlePage.findOne({
          _id: Id,
        });

        if (userRoleId === null) {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter valid id!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else {
          const body = {
            c_social_handle_page_title: c_social_handle_page_title,
            c_social_handle_category_id: c_social_handle_category_id,
            c_social_handle_page_name: c_social_handle_page_name,
            c_social_handle_page_h_rules_name:
              c_social_handle_page_h_rules_name,
            c_social_handle_page_status: c_social_handle_page_status,
            c_social_handle_page_type: c_social_handle_page_type,
            c_updatedBy: verified.data.user_id,
            n_status: n_status,
            n_published: n_published,
          };

          await SocialHandlePage.findByIdAndUpdate(Id, body)
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
        const socialHandlePageData = await SocialHandlePage.findOne({
          c_social_handle_page_name: c_social_handle_page_name,
        });
        if (c_social_handle_page_name === "") {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter Socail Handle Page title!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else if (c_social_handle_page_title === "") {
            sendResponse["appStatusCode"] = 4;
            sendResponse["message"] = [];
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = "Please enter Socail Handle Page title!";
            return NextResponse.json(sendResponse, { status: 200 });
          } else if (socialHandlePageData !== null) {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Already exist";
          return NextResponse.json(sendResponse, { status: 200 });
        } else if (socialHandlePageData === null) {
          let socialHandlePageData = new SocialHandlePage({
            c_social_handle_page_id: create_UUID(),
            c_social_handle_page_title,
            c_social_handle_category_id,
            c_social_handle_page_name,
            c_social_handle_page_h_rules_name,
            c_social_handle_page_status,
            c_social_handle_page_type,
            c_createdBy: verified.data.user_id,
          });

          await socialHandlePageData
            .save()
            .then(() => {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "Added Successfully!";
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = [];
            })
            .catch((err) => {
              sendResponse["appStatusCode"] = 4;
              sendResponse["message"] = "";
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = err;
            });
          return NextResponse.json(sendResponse, { status: 200 });
        }
      }
    } catch (err) {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Something went wrong!";
      return NextResponse.json(sendResponse, { status: 400 });
    }
  } else {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = "";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "token expired!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
