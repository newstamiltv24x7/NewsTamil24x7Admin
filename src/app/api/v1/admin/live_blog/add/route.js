import { NextResponse } from "next/server";
import { LiveBlog } from "../../../../../../models/liveBlogModel";
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
    c_live_blog_title,
    c_live_blog_english_title,
    c_live_blog_content,
    c_live_blog_image_url,
    c_live_sub_blog,
    c_live_blog_short_name,
    c_live_blog_slug_title,
    Id,
    n_status,
    live_status,
  } = await request.json();

  try {
    await connectMongoDB();
    const verified = verifyAccessToken();
    if (verified.success) {
      if (Id) {
        const WebstoryId = await LiveBlog.findOne({
          _id: Id,
        });

        if (WebstoryId === null) {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter valid id!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else {
          const dummyAddArray = [];
          const body = {
            c_live_blog_title: c_live_blog_title,
            c_live_blog_english_title: c_live_blog_english_title,            
            c_live_blog_content: c_live_blog_content,
            c_live_blog_image_url: c_live_blog_image_url,
            c_live_blog_short_name: c_live_blog_short_name,
            c_live_blog_slug_title: c_live_blog_slug_title,
            c_updatedBy: verified.data.user_id,
            n_status: n_status,
            live_status: live_status,
          };
          c_live_sub_blog?.map((data) => {
            dummyAddArray.push({
              c_live_sub_blog_title: data.c_live_sub_blog_title,
              c_live_sub_blog_content: data.c_live_sub_blog_content,
              c_live_sub_blog_image_url: data.c_live_sub_blog_image_url,
              c_live_sub_blog_create_date: new Date(),
              n_status:data.n_status
            })
          })

          if (c_live_sub_blog) {
            body["c_live_sub_blog"] = dummyAddArray;
          }
          await LiveBlog.findByIdAndUpdate(Id, body)
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
        const storyTilteName = await LiveBlog.findOne({
          c_live_blog_title: c_live_blog_title,
        });

        if (c_live_blog_title === "") {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter Liveblog title name!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else if (storyTilteName) {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "LiveBlog already exist";
          return NextResponse.json(sendResponse, { status: 200 });
        } else {
          const dummyAddArray = [];
          c_live_sub_blog.map((data) => {
            dummyAddArray.push({
              c_live_sub_blog_title: data.c_live_sub_blog_title,
              c_live_sub_blog_content: data.c_live_sub_blog_content,
              c_live_sub_blog_image_url: data.c_live_sub_blog_image_url,
              c_live_sub_blog_create_date: new Date(),
              n_status: 1,
              n_published: 1,
            });
          });

          let webStoryData = new LiveBlog({
            c_live_blog_id: create_UUID(),
            c_live_blog_title: c_live_blog_title,
            c_live_blog_english_title: c_live_blog_english_title,
            c_live_blog_content: c_live_blog_content,
            c_live_blog_image_url: c_live_blog_image_url,
            c_live_blog_short_name: c_live_blog_short_name,
            c_live_blog_slug_title: c_live_blog_slug_title,
            c_live_sub_blog: dummyAddArray,
            c_createdBy: verified.data.user_id,
            live_status: 0,
          });

          await webStoryData
            .save()
            .then(() => {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "Live Blog added Successfully!";
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
