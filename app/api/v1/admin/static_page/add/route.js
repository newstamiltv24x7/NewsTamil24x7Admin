import { NextResponse } from "next/server";
import { StaticPage } from "../../../../../../models/staticPageModel";
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
    
    c_static_menu_page_id,
    c_static_page_title,
    c_static_page_description,
    c_static_page_keywords,
    c_static_page_content,
    Id,
    n_status,
    n_published,
  } = await request.json();

  const verified = verifyAccessToken();



  if (verified.success) {
    try {
      await connectMongoDB();

      if (Id) {
        const userRoleId = await StaticPage.findOne({
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
            
            c_static_menu_page_id: c_static_menu_page_id,
            c_static_page_title: c_static_page_title,
            c_static_page_description: c_static_page_description,
            c_static_page_keywords: c_static_page_keywords,
            c_static_page_content: c_static_page_content,
            c_updatedBy: verified.data.user_id,
            n_status: n_status,
            n_published: n_published,
          };

          await StaticPage.findByIdAndUpdate(Id, body)
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
        
        const StaticPageData = await StaticPage.findOne({
          c_static_page_title:  c_static_page_title
        });

        if (c_static_page_title === "") {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter static page!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else if (StaticPageData !== null) {
           
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Already exist!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else{




          let StaticPageData = new StaticPage({
            c_static_page_id: create_UUID(),
            
            c_static_menu_page_id,
            c_static_page_title,
            c_static_page_description,
            c_static_page_keywords,
            
            c_static_page_content,
            c_createdBy: verified.data.user_id,
          });
          await StaticPageData.save().then(() => {
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

