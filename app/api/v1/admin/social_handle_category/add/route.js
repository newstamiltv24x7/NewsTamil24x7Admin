import { NextResponse } from "next/server";
import { SocialHandleCategory } from "../../../../../../models/socialHandleCategoryModel";
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
    c_social_handle_category_title,
    Id,
    n_status,
    n_published,
  } = await request.json();

  const verified = verifyAccessToken();

  if (verified.success) {
    try {
      await connectMongoDB();

      if (Id) {
        
        const userRoleId = await SocialHandleCategory.findOne({
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
            c_social_handle_category_title: c_social_handle_category_title,
            c_updatedBy: verified.data.user_id,
            n_status: n_status,
            n_published: n_published,
          };

          await SocialHandleCategory.findByIdAndUpdate(Id, body)
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
        
        const socialHandleCategoryData = await SocialHandleCategory.findOne({
          c_social_handle_category_title:  c_social_handle_category_title
        });
        if (c_social_handle_category_title === "") {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter Socail Handle Category title!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else if (socialHandleCategoryData !== null) {
           
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Already exist";
          return NextResponse.json(sendResponse, { status: 200 });
        } else if(socialHandleCategoryData === null) {

            
          let SocialHandleCategoryData = new SocialHandleCategory({
            c_social_handle_category_id: create_UUID(),
            c_social_handle_category_title,
            c_createdBy: verified.data.user_id,
          });

         
          await SocialHandleCategoryData.save()
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
