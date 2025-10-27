import { NextResponse } from "next/server";
import { Collections } from "../../../../../../models/collectionsModel";
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
    c_collection_name,
    c_collection_url,
    c_collection_description,
    c_parent_id,
    c_collection_social_img_url,
    c_collection_type,
    c_collection_state,
    Id,
    n_status,
    n_published,
  } = await request.json();

  const verified = verifyAccessToken();



  if (verified.success) {
    try {
      await connectMongoDB();

      if (Id) {
        const userRoleId = await Collections.findOne({
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
            c_collection_name: c_collection_name,
            c_collection_url: c_collection_url,
            c_collection_description: c_collection_description,
            c_collection_social_img_url: c_collection_social_img_url,
            c_collection_type: c_collection_type,
            c_collection_state: c_collection_state,
            c_updatedBy: verified.data.user_id,
            n_status: n_status,
            n_published: n_published,
          };

          await Collections.findByIdAndUpdate(Id, body)
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
        
        const CollectionData = await Collections.findOne({
          c_collection_name:  c_collection_name
        });

        if (c_collection_name === "") {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter collection!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else if (CollectionData !== null) {
           
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Already exist!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else{




          let collectionAdd = new Collections({
            c_collection_id: create_UUID(),
            c_collection_name,
            c_collection_url,
            c_collection_description,
            c_collection_social_img_url,
            c_parent_id,
            c_collection_type,
            c_collection_state,
            c_createdBy: verified.data.user_id,
          });

          if (c_parent_id !== "") {
            collectionAdd.c_parent_id = c_parent_id;
          }



          await collectionAdd.save().then(() => {
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

