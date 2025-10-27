import { NextResponse } from "next/server";
import connectMongoDB from "../../../../../../libs/mongodb";
import { Story } from "../../../../../../models/storyModel";
import { LiveBlog } from "../../../../../../models/liveBlogModel";
import { Control } from "../../../../../../models/controlModel";
import {
  encryptCryptoResponse,
  decrypCryptoRequest,
} from "../../../../../../helper/helper";

let sendResponse = {
  appStatusCode: "",
  message: "",
  type: "",
  payloadJson: [],
  error: "",
};

function createList(data, type) {
  const dataList = [];

  for (let cat of data) {
    if (type === "stories" || type === "yes") {
      dataList.push({
        _id: cat._id,
        title: cat.story_title_name,
        img: cat.story_cover_image_url,
        redirect_url: cat.story_desk_created_name,
      });
    } else if (type === "live_blog") {
      dataList.push({
        _id: cat._id,
        title: cat.c_live_blog_title,
        img: cat.c_live_blog_image_url,
        redirect_url: cat.c_live_blog_id,
      });
    } else {
      dataList.push({
        _id: cat._id,
        title: cat.story_title_name,
        img: cat.story_cover_image_url,
        redirect_url: cat.story_desk_created_name,
      });
    }
  }

  return dataList;
}

export async function POST(request) {
  try {
    await connectMongoDB();
    const controlData = await Control.findOne();
    const { n_page, n_limit, c_search_term } = await request.json();
    sendResponse["appStatusCode"] = 0;
    sendResponse["message"] = "";
    sendResponse["type"] = controlData.c_control_type;
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = [];
    return NextResponse.json(sendResponse, { status: 200 });
  } catch (err) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = "";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "Something went wrong!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}

export async function GET() {
  await connectMongoDB();
  const controlData = await Control.find();

  

  if (controlData[1]?.c_control_name === "Control Breaking News" || controlData[1].c_control_type === "yes") {
    try {
      let _search = {};
      _search["$and"] = [
        {
          $and: [
            { n_status: 1 },
            { n_published: 1 },
            { live_status: 1 },
            { c_save_type: "published" },
          ],
        },
      ];

      await Story.aggregate([
        { $match: _search },
        { $sort: { createdAt: -1 } },
        { $limit: 10},
        {
          $group: {
            _id: "$_id",
            story_subject_name: { $first: "$story_subject_name" },
            story_title_name: { $first: "$story_title_name" },
            story_sub_title_name: { $first: "$story_sub_title_name" },
            story_id: { $first: "$story_id" },
            story_cover_image_url: { $first: "$story_cover_image_url" },
            story_desk_created_name: { $first: "$story_desk_created_name" },
            live_status: { $first: "$live_status" },
            createdAt: { $first: "$createdAt" },
            c_createdBy: { $first: "$c_createdBy" },
            n_status: { $first: "$n_status" },
            n_published: { $first: "$n_published" },
          },
        },
        {
          $project: {
            _id: 1,
            story_subject_name: 1,
            story_title_name: 1,
            story_sub_title_name: 1,
            story_id: 1,
            story_cover_image_url: 1,
            story_desk_created_name: 1,
            live_status: 1,
            createdAt: 1,
            c_createdBy: 1,
            n_status: 1,
            n_published: 1,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ])
        .then((data) => {
          
          
          const categoryData = createList(data, controlData.c_control_type);
          const encryptRes = encryptCryptoResponse(categoryData);
          const decryptRes = decrypCryptoRequest(encryptRes);
          if (data.length > 0) {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "";
            sendResponse["type"] = controlData.c_control_type;
            sendResponse["payloadJson"] = decryptRes;
            sendResponse["error"] = [];
          } else {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "Record not found!";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = [];
          }
        })
        .catch((err) => {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = "";
          sendResponse["type"] = "";
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = err;
        });

      return NextResponse.json(sendResponse, { status: 200 });
    } catch (err) {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Something went wrong!";
      return NextResponse.json(sendResponse, { status: 400 });
    }
  } else if (controlData[2]?.c_control_name === "Control Quick Links" || controlData[2].c_control_type === "yes") {
    try {
      let _search = {};
      _search["$and"] = [
        {
          $and: [{ n_status: 1 }, { n_published: 1 }, { live_status: 1 }],
        },
      ];
      await connectMongoDB();
      await LiveBlog.aggregate([
        { $match: _search },
        { $limit: 30},
        {
          $group: {
            _id: "$_id",
            c_live_blog_title: { $first: "$c_live_blog_title" },
            c_live_blog_content: { $first: "$c_live_blog_content" },
            c_live_blog_image_url: { $first: "$c_live_blog_image_url" },
            c_live_blog_id: { $first: "$c_live_blog_id" },
            c_live_sub_blog: { $first: "$c_live_sub_blog" },
            n_status: { $first: "$n_status" },
            n_published: { $first: "$n_published" },
            createdAt: { $first: "$createdAt" },
            c_createdBy: { $first: "$c_createdBy" },
          },
        },
        {
          $project: {
            _id: 1,
            c_live_blog_title: 1,
            c_live_blog_id: 1,
            c_live_blog_content: 1,
            c_live_blog_image_url: 1,
            c_live_sub_blog: 1,
            n_status: 1,
            n_published: 1,
            createdAt: 1,
            c_createdBy: 1,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ])
        .then((data) => {
          const categoryData = createList(data, controlData.c_control_type);
          const encryptRes = encryptCryptoResponse(categoryData);
          const decryptRes = decrypCryptoRequest(encryptRes);
          if (data.length > 0) {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "";
            sendResponse["type"] = controlData.c_control_type;
            sendResponse["payloadJson"] = decryptRes;
            sendResponse["error"] = [];
          } else {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "Record not found!";
            sendResponse["type"] = controlData.c_control_type;
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = [];
          }
        })
        .catch((err) => {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = "";
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = err;
        });

      return NextResponse.json(sendResponse, { status: 200 });
    } catch (err) {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "";
      sendResponse["type"] = "";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Something went wrong!";
      return NextResponse.json(sendResponse, { status: 400 });
    }
  } else {
    sendResponse["appStatusCode"] = 0;
    sendResponse["message"] = "Record not found";
    sendResponse["type"] = controlData.c_control_type;
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
