import { NextResponse } from "next/server";
import { Tags } from "../../../../../../models/tagsModel";
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
    c_tag_name,
    c_tag_state,
    c_redirect_url,
    Id,
    n_status,
    n_published,
  } = await request.json();

  const verified = verifyAccessToken();



  if (verified.success) {
    try {
      await connectMongoDB();

      if (Id) {
        const userRoleId = await Tags.findOne({
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
            c_tag_name: c_tag_name,
            c_tag_state: c_tag_state,
            c_redirect_url: c_redirect_url,
            c_updatedBy: verified.data.user_id,
            n_status: n_status,
            n_published: n_published,
          };

          await Tags.findByIdAndUpdate(Id, body)
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
        
        const TagsData = await Tags.findOne({
          c_tag_name:  c_tag_name
        });

        if (c_tag_name === "") {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter  Tags!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else if (TagsData !== null) {
           
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Already exist!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else{




          let tagsAdd = new Tags({
            c_tag_id: create_UUID(),
            c_tag_name,
            c_tag_state,
            c_redirect_url,
            c_createdBy: verified.data.user_id,
          });
          await tagsAdd.save().then(() => {
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

