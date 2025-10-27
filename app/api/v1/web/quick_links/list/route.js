import { NextResponse } from "next/server";
import { LiveBlog } from "../../../../../../models/liveBlogModel";
import { Listicles } from "../../../../../../models/listiclesModel";
import connectMongoDB from "../../../../../../libs/mongodb";
// import { Control } from "../../../../../../models/controlModel";
import {
  encryptCryptoResponse,
  decrypCryptoRequest,
} from "../../../../../../helper/helper";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

const sortedArray = (obj) =>{
  return obj.sort((a,b) =>  b.c_live_sub_blog_create_date- a.c_live_sub_blog_create_date);
  }
  
  const sortByArray = (data) => {
    let datas = [];
    data.map((list) => {
      datas.push({
        _id: list?._id,
        c_live_blog_title: list?.c_live_blog_title,
        c_live_blog_english_title: list?.c_live_blog_english_title,
        c_live_blog_content: list?.c_live_blog_content,
        c_live_blog_image_url: list?.c_live_blog_image_url,
        c_live_blog_short_name: list?.c_live_blog_short_name,
        c_live_blog_slug_title: list?.c_live_blog_slug_title,
        live_status: list?.live_status,
        c_live_blog_id: list?.c_live_blog_id,
        c_live_sub_blog: sortedArray(list?.c_live_sub_blog),
        createdAt: list?.createdAt,
        c_createdBy: list?.c_createdBy,
        n_status: list?.n_status,
        n_published: list?.n_published,
        c_createdName: list?.c_createdName,
        c_userImg: list?.c_userImg,
      });
    });
  
    return datas;
  };

function createList(data,typeData) {
  const dataList = [];

  if(typeData === "listicle"){
    for (let cat of data) {
      dataList.push({
        _id: cat._id,
        id: cat.c_listicles_id,
        short_name: cat.c_listicles_short_name,
        title: cat.c_listicles_title,
        img: cat.c_listicles_img,
        redirect_url: cat.c_listicles_slug_title,
        type: typeData,
        createdAt:cat.createdAt
      });
    }
  
    return dataList;
  }else if(typeData === "live-blog"){
    for (let cat of data) {
      dataList.push({
        _id: cat._id,
        id: cat.c_live_blog_id,
        short_name: cat.c_live_blog_short_name,
        title: cat.c_live_blog_title,
        img: cat.c_live_blog_image_url,
        redirect_url: cat.c_live_blog_slug_title,
        type: typeData,
        createdAt:cat.createdAt
      });
    }
  
    return dataList;
  }


}

export async function POST(request) {
  const { n_page, n_limit, c_search_term } = await request.json();

  try {
    let _search = {};
    let n_limitTerm = n_limit;
    let n_pageTerm = n_page === 1 ? 0 : (n_page - 1) * n_limit;
    let searchTerm = c_search_term ? c_search_term : "";

    if (searchTerm !== "") {
      _search["$and"] = [
        {
          $and: [
            { c_live_blog_title: { $regex: searchTerm, $options: "i" } },
            { n_status: 1 },
            { n_published: 1 },
          ],
        },
      ];
    } else {
      _search["$and"] = [
        {
          $and: [{ n_status: 1 }, { n_published: 1 }],
        },
      ];
    }

    if (n_limitTerm !== "" && n_pageTerm !== "") {
      await connectMongoDB();

      await LiveBlog.aggregate([
        {
          $match: _search,
        },
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
          $lookup: {
            from: "users",
            localField: "c_createdBy",
            foreignField: "user_id",
            as: "createdById",
          },
        },
        {
          $unwind: {
            path: "$createdById",
            preserveNullAndEmptyArrays: true,
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
            createdName: "$createdById.user_name",
            c_userImg: "$createdById.c_user_img_url",
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $facet: {
            data: [{ $skip: n_pageTerm }, { $limit: n_limitTerm }],
            total_count: [
              {
                $count: "count",
              },
            ],
          },
        },
      ])
        .then((data) => {
          const encryptRes = encryptCryptoResponse(data);
          const decryptRes = decrypCryptoRequest(encryptRes);
          if (data[0].data.length > 0) {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "";
            sendResponse["payloadJson"] = encryptRes;
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
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = err;
        });
      return NextResponse.json(sendResponse, { status: 200 });
    } else {
      sendResponse["appStatusCode"] = 3;
      sendResponse["message"] = "";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Invalid Payload";
      return NextResponse.json(sendResponse, { status: 200 });
    }
  } catch (error) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = [];
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "Something went wrong!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}

export async function GET(request) {

  // const controlData = await Control.find();
  const id = request.nextUrl.searchParams.get("id");
  const url = request.nextUrl.searchParams.get("url");
  const type = request.nextUrl.searchParams.get("type");

  if (id && type === "listicle") {
    const checkId = await Listicles.findOne({ c_listicles_id: id });
    if (checkId) {
      let _search = {};

      if (id !== "") {
        _search["$and"] = [
          {
            $and: [{ n_status: 1 }, { n_published: 1 },{c_listicles_id: id}]
          },
        ];
      } else {
        _search["$and"] = [
          {
            $and: [{ n_status: 1 }, { n_published: 1 }]
          },
        ];
      }

    try {
      await connectMongoDB();
      await Listicles.aggregate([
        { $match: _search },
        {
          $set: {
            c_listicles_continue_item: {
              $sortArray: {
                input: "$c_listicles_continue_item",
                sortBy: { c_listicles_continue_create_date: -1 },
              },
            },
          },
        },
        {
          $group: {
            _id: "$_id",
            c_category_id: { $first: "$c_category_id" },
            c_listicles_id: { $first: "$c_listicles_id" },
            c_listicles_title: { $first: "$c_listicles_title" },
            c_listicles_slug_title: { $first: "$c_listicles_slug_title" },
            c_listicles_short_name: { $first: "$c_listicles_short_name" },
            c_listicles_sub_title: { $first: "$c_listicles_sub_title" },
            c_listicles_img: { $first: "$c_listicles_img" },
            c_listicles_content: { $first: "$c_listicles_content" },
            c_listicles_continue_item: {
              $first: "$c_listicles_continue_item",
            },
            createdAt: { $first: "$createdAt" },
            c_createdBy: { $first: "$c_createdBy" },
            n_status: { $first: "$n_status" },
            n_published: { $first: "$n_published" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "c_createdBy",
            foreignField: "user_id",
            as: "users",
          },
        },
        {
          $unwind: "$users",
        },
        {
          $lookup: {
            from: "categories",
            localField: "c_category_id",
            foreignField: "c_category_id",
            as: "categories",
          },
        },
        {
          $unwind: "$categories",
        },
        {
          $project: {
            _id: 1,
            c_listicles_title: 1,
            c_listicles_slug_title: 1,
            c_listicles_short_name: 1,
            c_category_id: 1,
            c_listicles_sub_title: 1,
            c_listicles_img: 1,
            c_listicles_content: 1,
            c_listicles_id: 1,
            c_listicles_continue_item: 1,
            createdAt: 1,
            c_createdBy: 1,
            c_createdName: "$users.user_name",
            c_userImg: "$users.c_user_img_url",
            c_category_name: "$categories.c_category_name",
            n_status: 1,
            n_published: 1,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ]).then((data) => {
          const encryptRes = encryptCryptoResponse(data);
          const decryptRes = decrypCryptoRequest(encryptRes);
          if (decryptRes.length > 0) {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "";
            sendResponse["payloadJson"] = encryptRes;
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
    } else {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Invalid Id!";
      return NextResponse.json(sendResponse, { status: 400 });
    }
  } else if (url && type === "listicle") {
    const checkUrl = await Listicles.findOne({ c_listicles_slug_title: url });
    if (checkUrl) {
      let _search = {};

      if (id !== "") {
        _search["$and"] = [
          {
            $and: [{ n_status: 1 }, { n_published: 1 },{c_listicles_slug_title: url}]
          },
        ];
      } else {
        _search["$and"] = [
          {
            $and: [{ n_status: 1 }, { n_published: 1 }]
          },
        ];
      }

    try {
      await connectMongoDB();
      await Listicles.aggregate([
        { $match: _search },
        {
          $set: {
            c_listicles_continue_item: {
              $sortArray: {
                input: "$c_listicles_continue_item",
                sortBy: { c_listicles_continue_create_date: -1 },
              },
            },
          },
        },
        {
          $group: {
            _id: "$_id",
            c_category_id: { $first: "$c_category_id" },
            c_listicles_id: { $first: "$c_listicles_id" },
            c_listicles_title: { $first: "$c_listicles_title" },
            c_listicles_slug_title: { $first: "$c_listicles_slug_title" },
            c_listicles_short_name: { $first: "$c_listicles_short_name" },
            c_listicles_sub_title: { $first: "$c_listicles_sub_title" },
            c_listicles_img: { $first: "$c_listicles_img" },
            c_listicles_content: { $first: "$c_listicles_content" },
            c_listicles_continue_item: {
              $first: "$c_listicles_continue_item",
            },
            createdAt: { $first: "$createdAt" },
            c_createdBy: { $first: "$c_createdBy" },
            n_status: { $first: "$n_status" },
            n_published: { $first: "$n_published" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "c_createdBy",
            foreignField: "user_id",
            as: "users",
          },
        },
        {
          $unwind: "$users",
        },
        {
          $lookup: {
            from: "categories",
            localField: "c_category_id",
            foreignField: "c_category_id",
            as: "categories",
          },
        },
        {
          $unwind: "$categories",
        },
        {
          $project: {
            _id: 1,
            c_listicles_title: 1,
            c_listicles_slug_title: 1,
            c_listicles_short_name: 1,
            c_category_id: 1,
            c_listicles_sub_title: 1,
            c_listicles_img: 1,
            c_listicles_content: 1,
            c_listicles_id: 1,
            c_listicles_continue_item: 1,
            createdAt: 1,
            c_createdBy: 1,
            c_createdName: "$users.user_name",
            c_userImg: "$users.c_user_img_url",
            c_category_name: "$categories.c_category_name",
            n_status: 1,
            n_published: 1,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ]).then((data) => {
          const encryptRes = encryptCryptoResponse(data);
          const decryptRes = decrypCryptoRequest(encryptRes);
          if (decryptRes.length > 0) {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "";
            sendResponse["payloadJson"] = encryptRes;
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
    } else {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Invalid Id!";
      return NextResponse.json(sendResponse, { status: 400 });
    }
  } else if(id && type === "live-blog"){
    const checkId = await LiveBlog.findOne({ c_live_blog_id: id });
    if (checkId) {
      let _search = {};
      _search["$and"] = [
        {
          $and: [{ n_status: 1 }, { n_published: 1 }, { c_live_blog_id: id }],
        },
      ];

      try {
        await connectMongoDB();

        await LiveBlog.aggregate([
          { $match: _search },
          {
            $group: {
              _id: "$_id",
              c_live_blog_title: { $first: "$c_live_blog_title" },
              c_live_blog_english_title: { $first: "$c_live_blog_english_title" },              
              c_live_blog_content: { $first: "$c_live_blog_content" },
              c_live_blog_image_url: { $first: "$c_live_blog_image_url" },
              c_live_blog_short_name: { $first: "$c_live_blog_short_name" },
              c_live_blog_slug_title: { $first: "$c_live_blog_slug_title" },
              c_live_blog_id: { $first: "$c_live_blog_id" },
              c_live_sub_blog: { $first: "$c_live_sub_blog" },
              createdAt: { $first: "$createdAt" },
              c_createdBy: { $first: "$c_createdBy" },
              n_status: { $first: "$n_status" },
              n_published: { $first: "$n_published" },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "c_createdBy",
              foreignField: "user_id",
              as: "users",
            },
          },
          {
            $unwind: "$users",
          },
          {
            $project: {
              _id: 1,
              c_live_blog_title: 1,
              c_live_blog_english_title: 1,
              c_live_blog_content: 1,
              c_live_blog_image_url: 1,
              c_listicles_short_name: 1,
              c_listicles_slug_title: 1,
              c_live_blog_id: 1,
              c_live_sub_blog: 1,
              createdAt: 1,
              c_createdBy: 1,
              c_createdName: "$users.user_name",
              c_userImg: "$users.c_user_img_url",
              n_status: 1,
              n_published: 1,
            },
          },
          {
            $sort: { createdAt: -1 },
          },
        ])
          .then((data) => {
            const datas = sortByArray(data)
            const encryptRes = encryptCryptoResponse(datas);
            const decryptRes = decrypCryptoRequest(encryptRes);
            if (decryptRes.length > 0) {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "";
              sendResponse["payloadJson"] = encryptRes;
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
    } else {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Invalid Id!";
      return NextResponse.json(sendResponse, { status: 400 });
    }
  
  }else if(url && type === "live-blog"){
    const checkUrl = await LiveBlog.findOne({ c_live_blog_slug_title: url });
    if (checkUrl) {
      let _search = {};
      _search["$and"] = [
        {
          $and: [{ n_status: 1 }, { n_published: 1 }, { c_live_blog_slug_title: url }],
        },
      ];

      try {
        await connectMongoDB();

        await LiveBlog.aggregate([
          { $match: _search },
          {
            $group: {
              _id: "$_id",
              c_live_blog_title: { $first: "$c_live_blog_title" },
              c_live_blog_english_title: { $first: "$c_live_blog_english_title" },              
              c_live_blog_content: { $first: "$c_live_blog_content" },
              c_live_blog_image_url: { $first: "$c_live_blog_image_url" },
              c_live_blog_short_name: { $first: "$c_live_blog_short_name" },
              c_live_blog_slug_title: { $first: "$c_live_blog_slug_title" },
              c_live_blog_id: { $first: "$c_live_blog_id" },
              c_live_sub_blog: { $first: "$c_live_sub_blog" },
              createdAt: { $first: "$createdAt" },
              c_createdBy: { $first: "$c_createdBy" },
              n_status: { $first: "$n_status" },
              n_published: { $first: "$n_published" },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "c_createdBy",
              foreignField: "user_id",
              as: "users",
            },
          },
          {
            $unwind: "$users",
          },
          {
            $project: {
              _id: 1,
              c_live_blog_title: 1,
              c_live_blog_english_title: 1,
              c_live_blog_content: 1,
              c_live_blog_image_url: 1,
              c_listicles_short_name: 1,
              c_listicles_slug_title: 1,
              c_live_blog_id: 1,
              c_live_sub_blog: 1,
              createdAt: 1,
              c_createdBy: 1,
              c_createdName: "$users.user_name",
              c_userImg: "$users.c_user_img_url",
              n_status: 1,
              n_published: 1,
            },
          },
          {
            $sort: { createdAt: -1 },
          },
        ])
          .then((data) => {
            const datas = sortByArray(data)
            const encryptRes = encryptCryptoResponse(datas);
            const decryptRes = decrypCryptoRequest(encryptRes);
            if (decryptRes.length > 0) {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "";
              sendResponse["payloadJson"] = encryptRes;
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
    } else {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Invalid Id!";
      return NextResponse.json(sendResponse, { status: 400 });
    }
  
  } else {
    let _search = {};

    _search["$and"] = [
      {
        $and: [{ n_status: 1 }, { n_published: 1 }],
      },
    ];

    try {
      await connectMongoDB();
      await Listicles.aggregate([
        { $match: _search },
        { $limit: 5 },
        {
          $set: {
            c_listicles_continue_item: {
              $sortArray: {
                input: "$c_listicles_continue_item",
                sortBy: { c_listicles_continue_create_date: -1 },
              },
            },
          },
        },
        {
          $group: {
            _id: "$_id",
            c_category_id: { $first: "$c_category_id" },
            c_listicles_id: { $first: "$c_listicles_id" },
            c_listicles_title: { $first: "$c_listicles_title" },
            c_listicles_slug_title: { $first: "$c_listicles_slug_title" },
            c_listicles_short_name: { $first: "$c_listicles_short_name" },
            c_listicles_sub_title: { $first: "$c_listicles_sub_title" },
            c_listicles_img: { $first: "$c_listicles_img" },
            c_listicles_content: { $first: "$c_listicles_content" },
            c_listicles_continue_item: {
              $first: "$c_listicles_continue_item",
            },
            createdAt: { $first: "$createdAt" },
            c_createdBy: { $first: "$c_createdBy" },
            n_status: { $first: "$n_status" },
            n_published: { $first: "$n_published" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "c_createdBy",
            foreignField: "user_id",
            as: "users",
          },
        },
        {
          $unwind: "$users",
        },
        {
          $lookup: {
            from: "categories",
            localField: "c_category_id",
            foreignField: "c_category_id",
            as: "categories",
          },
        },
        {
          $unwind: "$categories",
        },
        {
          $project: {
            _id: 1,
            c_listicles_title: 1,
            c_listicles_slug_title: 1,
            c_listicles_short_name: 1,
            c_category_id: 1,
            c_listicles_sub_title: 1,
            c_listicles_img: 1,
            c_listicles_content: 1,
            c_listicles_id: 1,
            c_listicles_continue_item: 1,
            createdAt: 1,
            c_createdBy: 1,
            c_createdName: "$users.user_name",
            c_userImg: "$users.c_user_img_url",
            c_category_name: "$categories.c_category_name",
            n_status: 1,
            n_published: 1,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ]).then(async(data) => {

     


        try {
          await connectMongoDB();
    
          await LiveBlog.aggregate([
            { $match: _search },
            { $limit: 5 },
            {
              $group: {
                _id: "$_id",
                c_live_blog_title: { $first: "$c_live_blog_title" },
                c_live_blog_content: { $first: "$c_live_blog_content" },
                c_live_blog_image_url: { $first: "$c_live_blog_image_url" },
                c_live_blog_short_name: { $first: "$c_live_blog_short_name" },
                c_live_blog_slug_title: { $first: "$c_live_blog_slug_title" },
                c_live_blog_id: { $first: "$c_live_blog_id" },
                c_live_sub_blog: { $first: "$c_live_sub_blog" },
                createdAt: { $first: "$createdAt" },
                c_createdBy: { $first: "$c_createdBy" },
                n_status: { $first: "$n_status" },
                n_published: { $first: "$n_published" },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "c_createdBy",
                foreignField: "user_id",
                as: "users",
              },
            },
            {
              $unwind: "$users",
            },
            {
              $project: {
                _id: 1,
                c_live_blog_title: 1,
                c_live_blog_content: 1,
                c_live_blog_image_url: 1,
                c_live_blog_short_name: 1,
                c_live_blog_slug_title: 1,
                c_live_blog_id: 1,
                c_live_sub_blog: 1,
                createdAt: 1,
                c_createdBy: 1,
                c_createdName: "$users.user_name",
                c_userImg: "$users.c_user_img_url",
                n_status: 1,
                n_published: 1,
              },
            },
            {
              $sort: { createdAt: -1 },
            },
          ])
            .then((data1) => {

              const listValue1 = createList(data,"listicle")
              const listValue2 = createList(data1,"live-blog")

              const listValue3 = [...listValue1, ...listValue2]

             const results =  listValue3.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));



              const encryptRes = encryptCryptoResponse(results.slice(0, 5));
              const decryptRes = decrypCryptoRequest(encryptRes);

              if (decryptRes.length > 0) {
                sendResponse["appStatusCode"] = 0;
                sendResponse["message"] = "";
                sendResponse["payloadJson"] = encryptRes;
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
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Something went wrong!";
      return NextResponse.json(sendResponse, { status: 400 });
    }
  }
}
