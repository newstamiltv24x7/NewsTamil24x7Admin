import { NextResponse } from "next/server";
import { RobotsTxt } from "../../../../../../models/robotsTxtModel";
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
    c_robots_txt,
    c_robots_txt_type,
    Id,
    n_status,
    n_published,
  } = await request.json();

  const verified = verifyAccessToken();

  if (verified.success) {
    try {
      await connectMongoDB();

      if (Id) {
        
        const userRoleId = await RobotsTxt.findOne({
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
            c_robots_txt: c_robots_txt,
            c_robots_txt_type: c_robots_txt_type,
            c_updatedBy: verified.data.user_id,
            n_status: n_status,
            n_published: n_published,
          };

          await RobotsTxt.findByIdAndUpdate(Id, body)
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
        
        const RobotsTxtData = await RobotsTxt.findOne({
          c_robots_txt_type:  c_robots_txt_type
        });
        if (c_robots_txt === "") {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter Robots Txt!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else if (RobotsTxtData !== null) {
           
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Already exist";
          return NextResponse.json(sendResponse, { status: 200 });
        } else if(RobotsTxtData === null) {

            
          let robotsTxts = new RobotsTxt({
            c_robots_txt,
            c_robots_txt_id: create_UUID(),
            c_robots_txt_type,
            c_createdBy: verified.data.user_id,
          });

         
          await robotsTxts.save()
            .then(() => {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "Robots Txt added Successfully!";
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
