import { NextResponse } from "next/server";
import { Memes } from "../../../../../../models/memesModel";
import connectMongoDB from "../../../../../../libs/mongodb";
import { verifyAccessToken } from "@/helper/helper";
import { create_UUID } from "../../../../../../helper/helper";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const { c_memes_title, c_memes_img_link, Id, n_status } = await request.json();

  try {
    await connectMongoDB();
    const verified = verifyAccessToken();

    if (verified.success) {
      if (Id) {
        const memesId = await Memes.findOne({
          _id: Id,
        });

        if (memesId === null) {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter valid id!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else {
          const body = {
            c_memes_title: c_memes_title,
            c_updatedBy: verified.data.user_id,
            n_status: n_status,
          };

          await Memes.findByIdAndUpdate(Id, body)
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

        
        const memestitleData = await Memes.findOne({
          c_memes_title: c_memes_title,
        });
        

        if (memestitleData !== null) {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "This Title already exist";
          return NextResponse.json(sendResponse, { status: 200 });
        } else if (c_memes_title === "") {
           
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter memes title name!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else {

          let memesData = new Memes({
            c_memes_title,
            c_memes_id: create_UUID(),
            c_memes_img_link: c_memes_img_link,
            c_createdBy: verified.data.user_id,
          });

          
         

          await memesData.save().then(() => {
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
        }
        return NextResponse.json(sendResponse, { status: 200 });
      }
    } else {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = verified.error;
      return NextResponse.json(sendResponse, { status: 400 });
    }
  } catch (err) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = "";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "Something went wrong!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
