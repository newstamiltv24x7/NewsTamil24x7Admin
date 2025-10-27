import { NextResponse } from "next/server";
import connectMongoDB from "../../../../../../libs/mongodb";
import {
  create_UUID,
  verifyAccessToken,
} from "../../../../../../helper/helper";
import { Cards } from "../../../../../../models/cardsModel";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};


export async function POST(request) {
  const {
    c_cards_title,
    c_cards_embed_code,
    c_cards_share_url,
    c_cards_img_url,
    c_cards_parentId,
    c_cards_comments,
    c_cards_likes,
    c_cards_type,
    Id,
    n_status,
    n_published,
  } = await request.json();

  const verified = verifyAccessToken();



  if (verified.success) {
    try {
      await connectMongoDB();

      if (Id) {
        const userRoleId = await Cards.findOne({
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
            c_cards_title: c_cards_title,
            c_cards_embed_code: c_cards_embed_code,
            c_cards_share_url: c_cards_share_url,
            c_cards_img_url: c_cards_img_url,
            c_cards_comments: c_cards_comments,
            c_cards_likes: c_cards_likes,
            c_cards_type:c_cards_type,
            c_updatedBy: verified.data.user_id,
            n_status: n_status,
            n_published: n_published,
          };

          await Cards.findByIdAndUpdate(Id, body)
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
        
        const CardsData = await Cards.findOne({
          c_cards_title:  c_cards_title
        });

        if (c_cards_title === "") {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter cards title!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else if (CardsData !== null) {
           
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Already exist!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else{



          let cardsAdd = new Cards({
            c_cards_id: create_UUID(),
            c_cards_title,
            c_cards_embed_code,
            c_cards_share_url,
            c_cards_img_url,
            c_cards_comments,
            c_cards_parentId,
            c_cards_likes,
            c_cards_type,
            c_createdBy: verified.data.user_id,
          });

          if (c_cards_parentId !== "") {
            cardsAdd.c_cards_parentId = c_cards_parentId;
          }



          await cardsAdd.save().then(() => {
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

