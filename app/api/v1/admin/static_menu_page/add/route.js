import { NextResponse } from "next/server";
import { StaticMenuPage } from "../../../../../../models/staticMenuPageModel";
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
    c_static_menu_page_name,
    c_static_menu_page_eng__name,
    Id,
    n_status,
    n_published,
  } = await request.json();

  const verified = verifyAccessToken();



  if (verified.success) {
    try {
      await connectMongoDB();

      if (Id) {
        const userRoleId = await StaticMenuPage.findOne({
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
            c_static_menu_page_name: c_static_menu_page_name,
            c_static_menu_page_eng__name: c_static_menu_page_eng__name,
            c_updatedBy: verified.data.user_id,
            n_status: n_status,
            n_published: n_published,
          };

          await StaticMenuPage.findByIdAndUpdate(Id, body)
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
        
        const StaticMenuPageData = await StaticMenuPage.findOne({
          c_static_menu_page_name:  c_static_menu_page_name
        });

        if (c_static_menu_page_name === "") {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter static page!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else if (StaticMenuPageData !== null) {
           
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Already exist!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else{




          let StaticMenuPageData = new StaticMenuPage({
            c_static_menu_page_id: create_UUID(),
            c_static_menu_page_name,
            c_static_menu_page_eng__name,
            c_createdBy: verified.data.user_id,
          });
          await StaticMenuPageData.save().then(() => {
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

