import { NextResponse } from "next/server";
import { WebStories } from "../../../../../../models/webStoriesModel";
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
  const {
    c_web_story_title,
    c_web_story_slug_name,
    c_web_story_cover_img,
    c_web_story_images,
    Id,
    n_status,
  } = await request.json();

  try {
    await connectMongoDB();
    const verified = verifyAccessToken();
    if (verified.success) {
      if (Id) {
        const WebstoryId = await WebStories.findOne({
          _id: Id,
        });

        if (WebstoryId === null) {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter valid id!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else {
          const body = {
            c_web_story_title: c_web_story_title,
            c_web_story_slug_name: c_web_story_slug_name,
            c_web_story_cover_img: c_web_story_cover_img,
            c_web_story_images:c_web_story_images,
            c_updatedBy: verified.data.user_id,
            n_status: n_status,
          };

          await WebStories.findByIdAndUpdate(Id, body)
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
        const storyTilteName = await WebStories.findOne({
          c_web_story_title: c_web_story_title,
        });

        if (c_web_story_title === "") {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter story title name!";
          return NextResponse.json(sendResponse, { status: 200 });
        }else if (c_web_story_cover_img === "") {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter story cover image!";
          return NextResponse.json(sendResponse, { status: 200 });
        }else if (storyTilteName) {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Story already exist";
          return NextResponse.json(sendResponse, { status: 200 });
        } else {
          let webStoryData = new WebStories({
            c_web_story_title,
            c_web_story_slug_name,
            c_web_story_cover_img,
            c_web_story_id: create_UUID(),
            c_web_story_images:c_web_story_images,
            c_createdBy: verified.data.user_id,
          });

          await webStoryData
            .save()
            .then(() => {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "New web Story added Successfully!";
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
