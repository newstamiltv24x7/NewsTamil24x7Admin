import { NextResponse } from "next/server";
import { Story } from "../../../../../../models/storyModel";
import { Categories } from "../../../../../../models/categoriesModel";
import connectMongoDB from "../../../../../../libs/mongodb";
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

function getUniqueListBy(arr, key) {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
}

export async function POST(request) {
  const { n_page, n_limit, c_search_term } = await request.json();


  try {
    await connectMongoDB();

    let _search = {};
    let n_limitTerm = n_limit;
    let n_pageTerm = n_page === 1 ? 0 : (n_page - 1) * n_limit;
    let searchTerm = c_search_term ? c_search_term : "";

    if (searchTerm !== "") {
      _search["$and"] = [
        {
          $or: [{ story_title_name: { $regex: searchTerm, $options: "i" } }],
          $and: [{ n_status: 1 }, { n_published: 1 }],
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

      await Story.aggregate([
        { $match: _search },
        {
          $group: {
            _id: "$_id",
            story_title_name: { $first: "$story_title_name" },
            story_sub_title_name: { $first: "$story_sub_title_name" },            
            story_published_options: { $first: "$story_published_options" },
            createdAt: { $first: "$createdAt" },
            c_createdBy: { $first: "$c_createdBy" },
            n_status: { $first: "$n_status" },
            n_published: { $first: "$n_published" },
          },
        },
        {
          $project: {
            _id: 1,
            story_title_name: 1,
            story_sub_title_name: 1,
            story_published_options: 1,
            createdAt: 1,
            c_createdBy: 1,
            n_status: 1,
            n_published: 1,
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
  } catch (err) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = [];
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "Something went wrong!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}

export async function GET(request) {
  const id = request.nextUrl.searchParams.get("id");
  const url = request.nextUrl.searchParams.get("url");
  const sub = request.nextUrl.searchParams.get("sub");


  if (id) {
    const checkId = await Story.findOne({ story_id: id });
    if (checkId) {
      let _search = {};

      _search["$and"] = [
        {
          $and: [{ n_status: 1 }, { n_published: 1 }, { story_id: id }, {story_published_options : { $elemMatch : { story_published_status : 0 ,story_published_id: "0d5b395001b7"  } }} ],
        }
      ];



      try {
        await connectMongoDB();

        await Story.aggregate([
          { $match: _search },
          {
            $group: {
              _id: "$_id",
              story_title_name: { $first: "$story_title_name" },
              story_sub_title_name: { $first: "$story_sub_title_name" },  
              story_details: { $first: "$story_details" },  
              createdAt: { $first: "$createdAt" },
              c_createdBy: { $first: "$c_createdBy" },
              n_status: { $first: "$n_status" },
              n_published: { $first: "$n_published" },
            },
          },
          {
            $project: {
              _id: 1,
              story_title_name: 1,
              story_sub_title_name: 1,
              story_details: 1,
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
            const data1 = getUniqueListBy(data,"c_category_name")
            const encryptRes = encryptCryptoResponse(data1);
            const decryptRes = decrypCryptoRequest(encryptRes);
            if (data.length > 0) {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "";
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
  }else if (url) {
  
    const checkurl = await Categories.findOne({ c_category_slug_english_name: url });

    
    
    if (checkurl !== null) {
      let _search = {};

      _search["$and"] = [
        {
          $and: [{ n_status: 1 }, { n_published: 1 },{ main_category_id : {$elemMatch :{"$all":[checkurl.c_category_id]} }},{story_published_options: { $elemMatch : { c_opt_id: "0d5b395001b7", opt_check: 1 } }} ],
        }
      ];



      try {
        await connectMongoDB();

        await Story.aggregate([
          { $match: _search },
          { $sort: { timestamp: -1 } },
          {
            $group: {
              _id: "$_id",
              story_id: { $first: "$story_id" },
              story_title_name: { $first: "$story_title_name" },
              story_sub_title_name: { $first: "$story_sub_title_name" },
              story_details: { $first: "$story_details" },  
              story_subject_name: { $first: "$story_subject_name" },
              main_category_id: { $first: "$main_category_id" },
              story_cover_image_url: { $first: "$story_cover_image_url" },
              story_desk_created_name: { $first: "$story_desk_created_name" },            
              createdAt: { $first: "$createdAt" },
              updatedAt: { $first: "$updatedAt" },
              c_createdBy: { $first: "$c_createdBy" },
              n_status: { $first: "$n_status" },
              n_published: { $first: "$n_published" },
            },
          },
          
          {
              $lookup: {
                from: "categories",
                localField: "main_category_id",
                foreignField: "c_category_id",
                as: "categories",
              },
            },
            {
              $unwind: "$categories",
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
              story_id: 1,
              story_title_name: 1,
              story_sub_title_name: 1,
              story_details: 1,
              story_subject_name: 1,
              main_category_id: 1,
              story_cover_image_url: 1,
              story_desk_created_name: 1,
              createdAt: 1,
              updatedAt: 1,
              c_createdBy: 1,
              n_status: 1,
              n_published: 1,
              c_category_name: "$categories.c_category_name",
              c_category_slug_english_name: "$categories.c_category_slug_english_name",
              c_category_id: "$categories.c_category_id",
              c_createdName: "$users.user_name",
            },
          },
          { $sort: { _id: -1 } },
          { $limit: 15 },
        ])
          .then((data) => {
            const data1 = getUniqueListBy(data,"story_title_name")
            const encryptRes = encryptCryptoResponse(data1);
            const decryptRes = decrypCryptoRequest(encryptRes);
            if (data.length > 0) {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "";
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
    else {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Invalid Id!";
      return NextResponse.json(sendResponse, { status: 400 });
    }
  } else if (sub) {

    const checkSuburl = await Categories.findOne({ c_category_slug_english_name: sub });
    if (checkSuburl !== null) {
      let _search = {};
      _search["$and"] = [
        {
          $and: [{ n_status: 1 }, { n_published: 1 },{ sub_category_id: checkSuburl.c_category_id },{story_published_options: { $elemMatch : { c_opt_id: "0d5b395001b7", opt_check: 1 } }} ],
        }
      ];

      try {
        await connectMongoDB();
        await Story.aggregate([
          { $match: _search },
          { $sort: { timestamp: -1 } },
          {
            $group: {
              _id: "$_id",
              story_id: { $first: "$story_id" },
              story_title_name: { $first: "$story_title_name" },
              story_sub_title_name: { $first: "$story_sub_title_name" },
              story_details: { $first: "$story_details" },  
              story_subject_name: { $first: "$story_subject_name" },
              main_category_id: { $first: "$main_category_id" },
              sub_category_id: { $first: "$sub_category_id" },
              story_cover_image_url: { $first: "$story_cover_image_url" },
              story_desk_created_name: { $first: "$story_desk_created_name" },            
              createdAt: { $first: "$createdAt" },
              updatedAt: { $first: "$updatedAt" },
              c_createdBy: { $first: "$c_createdBy" },
              n_status: { $first: "$n_status" },
              n_published: { $first: "$n_published" },
            },
          },
          
          {
              $lookup: {
                from: "categories",
                localField: "sub_category_id",
                foreignField: "c_category_id",
                as: "categories",
              },
            },
            {
              $unwind: "$categories",
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
              story_id: 1,
              story_title_name: 1,
              story_sub_title_name: 1,
              story_details: 1,
              story_subject_name: 1,
              main_category_id: 1,
              story_cover_image_url: 1,
              story_desk_created_name: 1,
              createdAt: 1,
              updatedAt: 1,
              c_createdBy: 1,
              n_status: 1,
              n_published: 1,
              c_category_name: "$categories.c_category_name",
              c_category_slug_english_name: "$categories.c_category_slug_english_name",
              c_category_id: "$categories.c_category_id",
              c_createdName: "$users.user_name",
            },
          },
          { $sort: { _id: -1 } },
          { $limit: 15 },
        ])
          .then((data) => {
            const data1 = getUniqueListBy(data,"story_title_name")
            const encryptRes = encryptCryptoResponse(data1);
            const decryptRes = decrypCryptoRequest(encryptRes);
            if (data.length > 0) {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "";
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
    else {
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
        $and: [{ n_status: 1 }, { n_published: 1 },{story_published_options: { $elemMatch : { c_opt_id: "0d5b395001b7", opt_check: 1 } }} ],
      }
    ];
    try {
      await connectMongoDB();
      await Story.aggregate([
        { $match: _search },
        {
          $group: {
            _id: "$main_category_id",
            story_id: { $first: "$story_id" },
            story_title_name: { $first: "$story_title_name" },
            story_sub_title_name: { $first: "$story_sub_title_name" },    
            // story_details: { $first: "$story_details" },          
            story_subject_name: { $first: "$story_subject_name" },
            main_category_id: { $first: "$main_category_id" },
            sub_category_id: { $first: "$sub_category_id" },
            story_cover_image_url: { $first: "$story_cover_image_url" },
            story_desk_created_name: { $first: "$story_desk_created_name" },            
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
            c_createdBy: { $first: "$c_createdBy" },
            n_status: { $first: "$n_status" },
            n_published: { $first: "$n_published" },
          },
        },
        {
            $lookup: {
              from: "categories",
              localField: "main_category_id",
              foreignField: "c_category_id",
              as: "categories",
            },
          },
          {
            $unwind: "$categories",
          },

          {
            $lookup: {
              from: "categories",
              localField: "sub_category_id",
              foreignField: "c_category_id",
              as: "subcategories",
            },
          },
          {
            $unwind: "$subcategories",
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
            story_id: 1,
            story_title_name: 1,
            story_sub_title_name: 1,
            // story_details: 1,
            story_subject_name: 1,
            main_category_id: 1,
            sub_category_id: 1,
            story_cover_image_url: 1,
            story_desk_created_name: 1,
            createdAt: 1,
            updatedAt: 1,
            c_createdBy: 1,
            n_status: 1,
            n_published: 1,
            c_category_name: "$categories.c_category_name",            
            c_category_slug_english_name: "$categories.c_category_slug_english_name",
            c_category_id: "$categories.c_category_id",
            c_sub_category_name: "$subcategories.c_category_name",            
            c_sub_category_slug_english_name: "$subcategories.c_category_slug_english_name",
            c_sub_category_id: "$subcategories.c_category_id",
            c_createdName: "$users.user_name",
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ])
        .then((data) => {
          const data1 = getUniqueListBy(data,"c_category_name")
            const encryptRes = encryptCryptoResponse(data1);
            const decryptRes = decrypCryptoRequest(encryptRes);
          if (data.length > 0) {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "";
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
