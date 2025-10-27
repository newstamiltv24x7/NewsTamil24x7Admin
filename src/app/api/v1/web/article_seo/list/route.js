import { NextResponse } from "next/server";
import { Story } from "../../../../../../models/storyModel";
import connectMongoDB from "../../../../../../libs/mongodb";
import { mobilePaginations } from "@/helper/helper";
import {
  encryptCryptoResponse,
  decrypCryptoRequest,
} from "../../../../../../helper/helper";

let sendResponse = {
  appStatusCode: "",
  message: "",
  n_page: 0,
  n_limit: 0,
  payloadJson: [],
  error: "",
};

function getUniqueListBy(arr, key) {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
}


function createCategories(categorieses, c_parentId = null) {
  const categoryList = [];
  let category;
  if (c_parentId == null) {
    category = categorieses.filter((cate) => cate.c_parentId == undefined && cate.story_id.length > 0);
  } else {
    category = categorieses.filter((cate) => cate.c_parentId == c_parentId && cate.story_id.length > 0);
  }

  for (let cat of category) {
    // const re = process.env.NEXT_PUBLIC_BASE_URL.concat('article/')
    // const reUrl = re.concat(cat.story_desk_created_name.toLowerCase());


const text1 = process.env.NEXT_PUBLIC_BASE_URL;
const text2 = cat.story_desk_created_name.toLowerCase();
const resultReUrl = text1.concat("article/", text2);



    categoryList.push({
      _id: cat._id,
      story_id: cat.story_id,
      story_title_name: cat.story_title_name,
      story_sub_title_name: cat.story_sub_title_name,
      story_desk_created_name: cat.story_desk_created_name,
      redirect_url: resultReUrl,
      story_cover_image_url: cat.story_cover_image_url,
      story_thumb_image_url: cat.story_thumb_image_url,
      story_subject_name: cat.story_subject_name,
      seo_tag: cat.seo_tag,
      seo_keywords: cat.seo_keywords,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,   
      story_details: cat.story_details,   
      c_createdBy: cat.c_createdBy,
      n_status: cat.n_status,
      n_published: cat.n_published,
    });
  }

  return categoryList;
}

export async function POST(request) {
  const {
    n_page,
    n_limit,
    c_search_term,
    main_category_id,
    trending_news,
    flash_news,
    c_from_date,
    c_to_date,
    tags,
  } = await request.json();

  let fromDate = "";
  let toDate = "";

  try {
    await connectMongoDB();
    let _search = {};
    let n_limitTerm = n_limit;
    let n_pageTerm = n_page === 1 ? 0 : (n_page - 1) * n_limit;
    let searchTerm = c_search_term ? c_search_term : "";

    if (trending_news) {
      
      _search["$and"] = [
        {
          $and: [
            { n_status: 1 },
            { n_published: 1 },
            { c_save_type: "published" },
            { trending_news: 1 },
          ],
        },
      ];
    } else if (flash_news) {
      
      _search["$and"] = [
        {
          $and: [
            { n_status: 1 },
            { n_published: 1 },
            { c_save_type: "published" },
            { flash_news: 1 },
          ],
        },
      ];
    } else if (tags !== "" && tags !== undefined) {
      
      _search["$and"] = [
        {
          $and: [
            { n_status: 1 },
            { n_published: 1 },
            { c_save_type: "published" },
          ],
        },
        {
          $or: [
            { seo_tag: { $regex: tags, $options: "i" } },
            { seo_keywords: { $regex: tags, $options: "i" } },
            { story_title_name: { $regex: tags, $options: "i" } },
            { story_details: { $regex: tags, $options: "i" } },
          ],
        },
      ];
    } else if (searchTerm !== "" && main_category_id === "") {
      
      _search["$and"] = [
        {
          $and: [
            { n_status: 1 },
            { n_published: 1 },
            { story_title_name: { $regex: searchTerm, $options: "i" } },
            { c_save_type: "published" },
          ],
        },
      ];
    } else if (searchTerm !== "" && main_category_id !== "") {
      
      _search["$and"] = [
        {
          $and: [
            { n_status: 1 },
            { n_published: 1 },
            { story_title_name: { $regex: searchTerm, $options: "i" } },
            { main_category_id: main_category_id },
            { c_save_type: "published" },
          ],
        },
      ];
    } else if (
      main_category_id !== "" &&
      c_from_date !== undefined &&
      c_to_date !== undefined
    ) {
      
      fromDate = new Date(c_from_date);
      toDate = new Date(c_to_date);
      toDate.setDate(toDate.getDate() + 1);
      _search["$and"] = [
        {
          $and: [
            { n_status: 1 },
            { n_published: 1 },
            { main_category_id: main_category_id },
            { createdAt: { $gte: fromDate, $lte: toDate } },
            { c_save_type: "published" },
          ],
        },
      ];
    } else if (main_category_id !== "") {
      
      _search["$and"] = [
        {
          $and: [
            { n_status: 1 },
            { n_published: 1 },
            { main_category_id: main_category_id },
            { c_save_type: "published" },
          ],
        },
      ];
    } else {
      
      _search["$and"] = [
        {
          $and: [
            { n_status: 1 },
            { n_published: 1 },
            { c_save_type: "published" },
          ],
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
            story_desk_created_name: { $first: "$story_desk_created_name" },
            story_cover_image_url: { $first: "$story_cover_image_url" },
            story_thumb_image_url: { $first: "$story_thumb_image_url" },
            story_subject_name: { $first: "$story_subject_name" },
            seo_tag: { $first: "$seo_tag" },
            seo_keywords: { $first: "$seo_keywords" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },  
            story_details: { $first: "$story_details" },                        
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
            story_desk_created_name: 1,
            story_cover_image_url: 1,
            story_thumb_image_url: 1,
            story_subject_name: 1,
            seo_tag: 1,
            seo_keywords: 1,
            createdAt: 1,
            updatedAt: 1,
            story_details: 1,
            c_createdBy: 1,
            n_status: 1,
            n_published: 1,
          },
        },
        {
          $sort: { n_story_order: -1, createdAt: -1 },
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
       
          const datas = [];
          const data1 = getUniqueListBy(data[0].data, "story_id");
          datas.push({ data: data1, total_count: data[0].total_count });

          const returnResponse = mobilePaginations(n_page, n_limit);
          const encryptRes = encryptCryptoResponse(datas);
          const decryptRes = decrypCryptoRequest(encryptRes);

          if (data[0].data.length > 0) {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "";
            sendResponse["n_page"] = returnResponse.n_page;
            sendResponse["n_limit"] = returnResponse.n_limit;
            sendResponse["payloadJson"] = decryptRes;
            sendResponse["error"] = [];
          } else {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "Record not found!";
            sendResponse["n_page"] = 0;
            sendResponse["n_limit"] = 0;
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = [];
          }
        })
        .catch((err) => {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = "";
          sendResponse["n_page"] = 0;
          sendResponse["n_limit"] = 0;
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = err;
        });
      return NextResponse.json(sendResponse, { status: 200 });
    } else {
      sendResponse["appStatusCode"] = 3;
      sendResponse["message"] = "";
      sendResponse["n_page"] = 0;
      sendResponse["n_limit"] = 0;
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Invalid Payload";
      return NextResponse.json(sendResponse, { status: 200 });
    }
  } catch (err) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = [];
    sendResponse["n_page"] = 0;
    sendResponse["n_limit"] = 0;
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "Something went wrong!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}

export async function GET(request) {
  const id = request.nextUrl.searchParams.get("id");
  const url = request.nextUrl.searchParams.get("url");
  const main_category_id = request.nextUrl.searchParams.get("category");
  const c_createdBy = request.nextUrl.searchParams.get("c_createdBy");
  if (id) {
    const checkId = await Story.findOne({ story_id: id });
    if (checkId) {
      let _search = {};
      _search["$and"] = [
        {
          $and: [
            { n_status: 1 },
            { n_published: 1 },
            { story_id: id },
            { c_save_type: "published" },
          ],
        },
      ];

      try {
        await connectMongoDB();

        await Story.aggregate([
          { $match: _search },
          { $limit: 10 },
          {
            $group: {
                _id: "$_id",
                story_id: { $first: "$story_id" },
                story_title_name: { $first: "$story_title_name" },
                story_sub_title_name: { $first: "$story_sub_title_name" },
                story_desk_created_name: { $first: "$story_desk_created_name" },
                story_cover_image_url: { $first: "$story_cover_image_url" },
                story_thumb_image_url: { $first: "$story_thumb_image_url" },
                story_subject_name: { $first: "$story_subject_name" },
                seo_tag: { $first: "$seo_tag" },
                seo_keywords: { $first: "$seo_keywords" },
                createdAt: { $first: "$createdAt" },
                updatedAt: { $first: "$updatedAt" },
                story_details: { $first: "$story_details" },                
                c_createdBy: { $first: "$c_createdBy" },
                n_status: { $first: "$n_status" },
                n_published: { $first: "$n_published" },
            },
          },
          {
            $project: {
                _id: 1,
                story_id: 1,
                story_title_name: 1,
                story_sub_title_name: 1,
                story_desk_created_name: 1,
                story_cover_image_url: 1,
                story_thumb_image_url: 1,
                story_subject_name: 1,
                seo_tag: 1,
                seo_keywords: 1,
                createdAt: 1,
                updatedAt: 1,
                story_details: 1,
                c_createdBy: 1,
                n_status: 1,
                n_published: 1,
            },
          },
          {
            $sort: { n_story_order: -1, createdAt: -1 },
          },
        ])
          .then((data) => {
            const seoData = createCategories(data)

            const encryptRes = encryptCryptoResponse(seoData);
            const decryptRes = decrypCryptoRequest(encryptRes);
            if (data.length > 0) {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "";
              sendResponse["n_page"] = 0;
              sendResponse["n_limit"] = 0;
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
            sendResponse["n_page"] = 0;
            sendResponse["n_limit"] = 0;
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = err;
          });

        return NextResponse.json(sendResponse, { status: 200 });
      } catch (err) {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "";
        sendResponse["n_page"] = 0;
        sendResponse["n_limit"] = 0;
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Something went wrong!";
        return NextResponse.json(sendResponse, { status: 400 });
      }
    } else {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "";
      sendResponse["n_page"] = 0;
      sendResponse["n_limit"] = 0;
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Invalid Id!";
      return NextResponse.json(sendResponse, { status: 400 });
    }
  } else if (c_createdBy) {
    const checkCreatedBy = await Story.findOne({ c_createdBy: c_createdBy });
    if (checkCreatedBy) {
      let _search = {};
      _search["$and"] = [
        {
          $and: [
            { n_status: 1 },
            { n_published: 1 },
            { c_createdBy: c_createdBy },
            { c_save_type: "published" },
          ],
        },
      ];

      try {
        await connectMongoDB();

        await Story.aggregate([
          { $match: _search },
          { $limit: 10 },
          {
            $group: {
                _id: "$_id",
                story_id: { $first: "$story_id" },
                story_title_name: { $first: "$story_title_name" },
                story_sub_title_name: { $first: "$story_sub_title_name" },
                story_desk_created_name: { $first: "$story_desk_created_name" },
                story_cover_image_url: { $first: "$story_cover_image_url" },
                story_thumb_image_url: { $first: "$story_thumb_image_url" },
                story_subject_name: { $first: "$story_subject_name" },
                seo_tag: { $first: "$seo_tag" },
                seo_keywords: { $first: "$seo_keywords" },
                createdAt: { $first: "$createdAt" },
                updatedAt: { $first: "$updatedAt" },  
                story_details: { $first: "$story_details" },                              
                c_createdBy: { $first: "$c_createdBy" },
                n_status: { $first: "$n_status" },
                n_published: { $first: "$n_published" },
            },
          },
          
          {
            $project: {
                _id: 1,
                story_id: 1,
                story_title_name: 1,
                story_sub_title_name: 1,
                story_desk_created_name: 1,
                story_cover_image_url: 1,
                story_thumb_image_url: 1,
                story_subject_name: 1,
                seo_tag: 1,
                seo_keywords: 1,
                createdAt: 1,
                updatedAt: 1,
                story_details: 1,
                c_createdBy: 1,
                n_status: 1,
                n_published: 1,
            },
          },
          {
            $sort: { n_story_order: -1, createdAt: -1 },
          },
        ])
          .then((data) => {
            const seoData = createCategories(data)
            const encryptRes = encryptCryptoResponse(seoData);
            const decryptRes = decrypCryptoRequest(encryptRes);
            if (data.length > 0) {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "";
              sendResponse["n_page"] = 0;
              sendResponse["n_limit"] = 0;
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
            sendResponse["n_page"] = 0;
            sendResponse["n_limit"] = 0;
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = err;
          });

        return NextResponse.json(sendResponse, { status: 200 });
      } catch (err) {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "";
        sendResponse["n_page"] = 0;
        sendResponse["n_limit"] = 0;
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Something went wrong!";
        return NextResponse.json(sendResponse, { status: 400 });
      }
    } else {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "";
      sendResponse["n_page"] = 0;
      sendResponse["n_limit"] = 0;
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Invalid Id!";
      return NextResponse.json(sendResponse, { status: 400 });
    }
  } else if (url) {
    const checkUrl = await Story.findOne({ story_desk_created_name: url });
    if (checkUrl) {
      let _search = {};
      _search["$and"] = [
        {
          $and: [
            { n_status: 1 },
            { n_published: 1 },
            { story_desk_created_name: url },
            { c_save_type: "published" },
          ],
        },
      ];

      try {
        await connectMongoDB();

        await Story.aggregate([
          { $match: _search },
          { $limit: 10 },
          {
            $group: {
                _id: "$_id",
                story_id: { $first: "$story_id" },
                story_title_name: { $first: "$story_title_name" },
                story_sub_title_name: { $first: "$story_sub_title_name" },
                story_desk_created_name: { $first: "$story_desk_created_name" },
                story_cover_image_url: { $first: "$story_cover_image_url" },
                story_thumb_image_url: { $first: "$story_thumb_image_url" },
                story_subject_name: { $first: "$story_subject_name" },
                seo_tag: { $first: "$seo_tag" },
                seo_keywords: { $first: "$seo_keywords" },
                createdAt: { $first: "$createdAt" },
                updatedAt: { $first: "$updatedAt" },
                story_details: { $first: "$story_details" },                  
                c_createdBy: { $first: "$c_createdBy" },
                n_status: { $first: "$n_status" },
                n_published: { $first: "$n_published" },
            },
          },
          {
            $project: {
                _id: 1,
                story_id: 1,
                story_title_name: 1,
                story_sub_title_name: 1,
                story_desk_created_name: 1,
                story_cover_image_url: 1,
                story_thumb_image_url: 1,
                story_subject_name: 1,
                seo_tag: 1,
                seo_keywords: 1,
                createdAt: 1,
                updatedAt: 1,
                story_details : 1,
                c_createdBy: 1,
                n_status: 1,
                n_published: 1,
            },
          },
          {
            $sort: { n_story_order: -1, createdAt: -1 },
          },
        ])
          .then((data) => {
            const seoData = createCategories(data)
            const encryptRes = encryptCryptoResponse(seoData);
            const decryptRes = decrypCryptoRequest(encryptRes);
            if (data.length > 0) {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "";
              sendResponse["n_page"] = 0;
              sendResponse["n_limit"] = 0;
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
            sendResponse["n_page"] = 0;
            sendResponse["n_limit"] = 0;
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = err;
          });

        return NextResponse.json(sendResponse, { status: 200 });
      } catch (err) {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "";
        sendResponse["n_page"] = 0;
        sendResponse["n_limit"] = 0;
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Something went wrong!";
        return NextResponse.json(sendResponse, { status: 400 });
      }
    } else {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "";
      sendResponse["n_page"] = 0;
      sendResponse["n_limit"] = 0;
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Invalid Id!";
      return NextResponse.json(sendResponse, { status: 400 });
    }
  } else if (main_category_id) {
    const checkId = await Story.findOne({ main_category_id: main_category_id });
    if (checkId) {
      let _search = {};
      _search["$and"] = [
        {
          $and: [
            { n_status: 1 },
            { n_published: 1 },
            { main_category_id: main_category_id },
            { c_save_type: "published" },
          ],
        },
      ];

      try {
        await connectMongoDB();

        await Story.aggregate([
          { $match: _search },
          { $limit: 10 },
          {
            $group: {
                _id: "$_id",
                story_id: { $first: "$story_id" },
                story_title_name: { $first: "$story_title_name" },
                story_sub_title_name: { $first: "$story_sub_title_name" },
                story_desk_created_name: { $first: "$story_desk_created_name" },
                story_cover_image_url: { $first: "$story_cover_image_url" },
                story_thumb_image_url: { $first: "$story_thumb_image_url" },
                story_subject_name: { $first: "$story_subject_name" },
                seo_tag: { $first: "$seo_tag" },
                seo_keywords: { $first: "$seo_keywords" },
                createdAt: { $first: "$createdAt" },
                updatedAt: { $first: "$updatedAt" },  
                story_details: { $first: "$story_details" },                
                c_createdBy: { $first: "$c_createdBy" },
                n_status: { $first: "$n_status" },
                n_published: { $first: "$n_published" },
            },
          },
         
          {
            $project: {
                _id: 1,
                story_id: 1,
                story_title_name: 1,
                story_sub_title_name: 1,
                story_desk_created_name: 1,
                story_cover_image_url: 1,
                story_thumb_image_url: 1,
                story_subject_name: 1,
                seo_tag: 1,
                seo_keywords: 1,
                createdAt: 1,
                updatedAt: 1,
                story_details: 1,
                c_createdBy: 1,
                n_status: 1,
                n_published: 1,
            },
          },
          {
            $sort: { n_story_order: -1, createdAt: -1 },
          },
        ])
          .then((data) => {
            const seoData = createCategories(data)
            const encryptRes = encryptCryptoResponse(seoData);
            const decryptRes = decrypCryptoRequest(encryptRes);
            if (data.length > 0) {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "";
              sendResponse["n_page"] = 0;
              sendResponse["n_limit"] = 0;
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
            sendResponse["n_page"] = 0;
            sendResponse["n_limit"] = 0;
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = err;
          });

        return NextResponse.json(sendResponse, { status: 200 });
      } catch (err) {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "";
        sendResponse["n_page"] = 0;
        sendResponse["n_limit"] = 0;
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Something went wrong!";
        return NextResponse.json(sendResponse, { status: 400 });
      }
    } else {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "";
      sendResponse["n_page"] = 0;
      sendResponse["n_limit"] = 0;
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Invalid Id!";
      return NextResponse.json(sendResponse, { status: 400 });
    }
  } else {
    let _search = {};
    _search["$and"] = [
      {
        $and: [
          { n_status: 1 },
          { n_published: 1 },
          { c_save_type: "published" },
          // { main_category_id: { $nin: ["d121363c2a79"] } },
        ],
      },
    ];
    try {
      await connectMongoDB();
      await Story.aggregate([
        { $match: _search },
        { $limit: 300 },
        {
          $group: {
            _id: "$_id",
            story_id: { $first: "$story_id" },
            story_title_name: { $first: "$story_title_name" },
            story_sub_title_name: { $first: "$story_sub_title_name" },
            story_desk_created_name: { $first: "$story_desk_created_name" },
            story_cover_image_url: { $first: "$story_cover_image_url" },
            story_thumb_image_url: { $first: "$story_thumb_image_url" },
            story_subject_name: { $first: "$story_subject_name" },
            seo_tag: { $first: "$seo_tag" },
            seo_keywords: { $first: "$seo_keywords" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },   
            story_details: { $first: "$story_details" },        
            c_createdBy: { $first: "$c_createdBy" },
            n_status: { $first: "$n_status" },
            n_published: { $first: "$n_published" },
          },
        },

        {
          $project: {
            _id: 1,
            story_id: 1,
            story_title_name: 1,
            story_sub_title_name: 1,
            story_desk_created_name: 1,
            story_cover_image_url: 1,
            story_thumb_image_url: 1,
            story_subject_name: 1,
            seo_tag: 1,
            seo_keywords: 1,
            createdAt: 1,
            updatedAt: 1,
            story_details: 1,            
            c_createdBy: 1,
            n_status: 1,
            n_published: 1,
          },
        },
        {
          $sort: { n_story_order: -1, createdAt: -1 },
        },
      ])
        .then((data) => {

          const seoData = createCategories(data)

          

          const encryptRes = encryptCryptoResponse(seoData);
          const decryptRes = decrypCryptoRequest(encryptRes);
          if (data.length > 0) {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "";
            sendResponse["n_page"] = 0;
            sendResponse["n_limit"] = 0;
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
          sendResponse["n_page"] = 0;
          sendResponse["n_limit"] = 0;
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = err;
        });

      return NextResponse.json(sendResponse, { status: 200 });
    } catch (err) {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "";
      sendResponse["n_page"] = 0;
      sendResponse["n_limit"] = 0;
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Something went wrong!";
      return NextResponse.json(sendResponse, { status: 400 });
    }
  }
}
