import { NextResponse } from "next/server";
import { Story } from "../../../../../../models/storyModel";
import { Categories } from "../../../../../../models/categoriesModel";
import { Control } from "../../../../../../models/controlModel";
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


const seprateArrayData = (data) => {
  let datas = [];

  data.map((list) => {
    datas.push({
      _id: list._id,
      story_subject_name: list.story_subject_name,
      story_title_name: list.story_title_name,
      story_sub_title_name: list.story_sub_title_name,
      story_id: list.story_id,
      main_category_id: list.main_category_id,
      story_cover_image_url: list.story_cover_image_url,
      story_desk_created_name: list.story_desk_created_name,
      seo_tag: list.seo_tag,
      seo_keywords: list.seo_keywords,
      createdAt: list.createdAt,
      updatedAt: list.updatedAt,
  n_status: list.n_status,
      n_published: list.n_published,
      n_story_order: list.n_story_order,
      post_status: list.post_status,
      pin_status: list.pin_status,
      youtube_embed_id: list.youtube_embed_id,
      c_createdName: list.c_createdName,
      c_slugName: list.c_slugName,
      c_userImg: list.c_userImg,
      c_about_user: list.c_about_user,
      c_category_slug_english_name: list.c_category_slug_english_name,
      c_category_name: list.c_category_name,
      c_sub_category_name: list.c_sub_category_name,
      view_count: list.view_count,
      view_control:list.view_control
    });
  });

  return datas;
};

const seprateData = (data) => {
  const datas = [];

  datas.push({
    _id: data[0]?._id,
    story_title_name: data[0]?.story_title_name,
    story_sub_title_name: data[0]?.story_sub_title_name,
    story_desk_created_name: data[0]?.story_desk_created_name,
    seo_tag: data[0]?.seo_tag,
    seo_keywords: data[0]?.seo_keywords,
    story_id: data[0]?.story_id,
    main_category_id: data[0]?.main_category_id,
    story_details: data[0]?.story_details,
    story_subject_name: data[0]?.story_subject_name,
    story_asked_title: data[0]?.story_asked_title,
    news_image_caption: data[0]?.news_image_caption,
    story_summary_snippet: data[0]?.story_summary_snippet,
story_asked_quotes_content: data[0]?.story_asked_quotes_content,
    story_asked_quotes_author: data[0]?.story_asked_quotes_author,
    story_asked_question: data[0]?.story_asked_question,
    blurb_title: data[0]?.blurb_title,
    blurb_content: data[0]?.blurb_content,
    twitter_embed_id: data[0]?.twitter_embed_id,
    youtube_embed_id: data[0]?.youtube_embed_id,
    facebook_embed_id: data[0]?.facebook_embed_id,
    instagram_embed_id: data[0]?.instagram_embed_id,
    threads_embed_id: data[0]?.threads_embed_id,
    author_desk: data[0]?.author_desk,
    story_cover_image_url: data[0]?.story_cover_image_url,
    createdAt: data[0]?.createdAt,
    updatedAt: data[0]?.updatedAt,
    n_status: data[0]?.n_status,
    n_published: data[0]?.n_published,
    n_story_order: data[0]?.n_story_order,
    post_status: data[0]?.post_status,
    pin_status: data[0]?.pin_status,
    c_createdName: data[0]?.c_createdName,
    c_slugName: data[0]?.c_slugName,
    c_userImg: data[0]?.c_userImg,
    c_about_user: data[0]?.c_about_user,
    c_category_name: data[0]?.c_category_name,
    view_count: data[0]?.view_count,
  });

  return datas;
};

function getUniqueListBy(arr, key) {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
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
    main_category_name,
    sub_category_name,
    url,
  } = await request.json();

  let fromDate = "";
  let toDate = "";

  try {
    await connectMongoDB();
    let _search = {};
    let n_limitTerm = n_limit;
    let n_pageTerm = n_page === 1 ? 0 : (n_page - 1) * n_limit;
    let searchTerm = c_search_term ? c_search_term : "";

    if (main_category_id !== "" && main_category_id !== undefined) {

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
    }else if (trending_news) {

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
    } else if (url) {

      const catData = await Categories.findOne({
        c_category_slug_english_name: url,
      });
      _search["$and"] = [
        {
          $and: [
            { n_status: 1 },
            { n_published: 1 },
            { c_save_type: "published" },
            { main_category_id: catData.c_category_id },
          ],
        },
      ];
    } else if (
      main_category_name &&
      (sub_category_name === undefined || sub_category_name === "")
    ) {

      const catData = await Categories.findOne({
        c_category_slug_english_name: main_category_name,
      });

      _search["$and"] = [
        {
          $and: [
            { n_status: 1 },
            { n_published: 1 },
            { c_save_type: "published" },
{ main_category_id: catData.c_category_id },
          ],
        },
      ];
    } else if (sub_category_name && main_category_name) {

      const catData = await Categories.findOne({
        c_category_slug_english_name: main_category_name,
      });
      const catData1 = await Categories.findOne({
        c_category_slug_english_name: sub_category_name,
      });

      _search["$and"] = [
        {
          $and: [
            { n_status: 1 },
            { n_published: 1 },
            { c_save_type: "published" },
            { main_category_id: catData.c_category_id },
            { sub_category_id: catData1.c_category_id },
          ],
        },
      ];
    } else if (flash_news) {

      const fromDate = new Date();
      const toDate = new Date(fromDate);
      toDate.setDate(toDate.getDate() - 1);
      _search["$and"] = [
        {
          $and: [
            { n_status: 1 },
            { n_published: 1 },
            { c_save_type: "published" },
            { flash_news: 1 },
            { createdAt: { $gte: toDate, $lte: fromDate } },
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
            { story_subject_name: { $regex: tags, $options: "i" } },
          ],
        },
      ];
    } else if (
      searchTerm !== "" &&
      main_category_id === undefined &&
      tags === undefined &&
      main_category_name === undefined
    ) {

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
            { seo_tag: { $regex: searchTerm, $options: "i" } },
            { seo_keywords: { $regex: searchTerm, $options: "i" } },
            { story_title_name: { $regex: searchTerm, $options: "i" } },
            { story_details: { $regex: searchTerm, $options: "i" } },
            { story_subject_name: { $regex: searchTerm, $options: "i" } },
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
      const data = {
        c_control_name:"Control Views Count"
      }
      const controlResult = await Control.find(data);



      await Story.aggregate([
        { $match: _search },
 { $unwind: "$main_category_id" },
        {
          $group: {
            _id: "$_id",
            story_subject_name: { $first: "$story_subject_name" },
            story_title_name: { $first: "$story_title_name" },
            story_sub_title_name: { $first: "$story_sub_title_name" },
            story_id: { $first: "$story_id" },
            main_category_id: { $first: "$main_category_id" },
            sub_category_id: { $first: "$sub_category_id" },
            story_cover_image_url: { $first: "$story_cover_image_url" },
            story_desk_created_name: { $first: "$story_desk_created_name" },
            seo_tag: { $first: "$seo_tag" },
            seo_keywords: { $first: "$seo_keywords" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
            n_story_order: { $first: "$n_story_order" },
            post_status: { $first: "$post_status" },
            pin_status: { $first: "$pin_status" },
            youtube_embed_id: { $first: "$youtube_embed_id" },
            view_count: { $first: "$view_count" },

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
          $unwind: {
            path: "$categories",
            preserveNullAndEmptyArrays: true,
          },
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
          $unwind: {
            path: "$subcategories",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            story_subject_name: 1,
            story_title_name: 1,
            story_sub_title_name: 1,
            story_id: 1,
            main_category_id: 1,
            story_cover_image_url: 1,
            story_desk_created_name: 1,
            seo_tag: 1,
            seo_keywords: 1,
            createdAt: 1,
            updatedAt: 1,
            c_category_name: "$categories.c_category_name",
            c_category_slug_english_name:
              "$categories.c_category_slug_english_name",
            c_sub_category_name: "$subcategories.c_category_name",
            n_story_order: 1,
            n_story_order: 1,
            post_status: 1,
            pin_status: 1,
            youtube_embed_id: 1,
            view_count: 1,
 view_control :controlResult[0]?.c_control_type
          },
        },
        {
          $sort: { pin_status: -1, n_story_order: -1, createdAt: -1 },
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
          const data2 = seprateArrayData(data1);

          datas.push({ data: data2, total_count: data[0].total_count });
          const returnResponse = mobilePaginations(n_page, n_limit);

          const encryptRes = encryptCryptoResponse(datas);
          // const decryptRes = decrypCryptoRequest(encryptRes);

          if (data[0].data.length > 0) {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "";
            sendResponse["n_page"] = returnResponse.n_page;
            sendResponse["n_limit"] = returnResponse.n_limit;
            sendResponse["payloadJson"] = encryptRes;
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
              story_title_name: { $first: "$story_title_name" },
              story_sub_title_name: { $first: "$story_sub_title_name" },
              story_desk_created_name: { $first: "$story_desk_created_name" },
              seo_tag: { $first: "$seo_tag" },
              seo_keywords: { $first: "$seo_keywords" },
              story_id: { $first: "$story_id" },
              main_category_id: { $first: "$main_category_id" },
              story_details: { $first: "$story_details" },
              story_subject_name: { $first: "$story_subject_name" },
              story_asked_title: { $first: "$story_asked_title" },
              news_image_caption: { $first: "$news_image_caption" },
              story_summary_snippet: { $first: "$story_summary_snippet" },
              story_asked_quotes_content: {
$first: "$story_asked_quotes_content",
              },
              story_asked_quotes_author: {
                $first: "$story_asked_quotes_author",
              },
              story_asked_question: { $first: "$story_asked_question" },
              blurb_title: { $first: "$blurb_title" },
              blurb_content: { $first: "$blurb_content" },
              twitter_embed_id: { $first: "$twitter_embed_id" },
              youtube_embed_id: { $first: "$youtube_embed_id" },
              facebook_embed_id: { $first: "$facebook_embed_id" },
              instagram_embed_id: { $first: "$instagram_embed_id" },
              threads_embed_id: { $first: "$threads_embed_id" },
              author_desk: { $first: "$author_desk" },
              story_cover_image_url: { $first: "$story_cover_image_url" },
              createdAt: { $first: "$createdAt" },
              updatedAt: { $first: "$updatedAt" },
              n_story_order: { $first: "$n_story_order" },
              post_status: { $first: "$post_status" },
              pin_status: { $first: "$pin_status" },
              view_count: { $first: "$view_count" },
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
            $project: {
              _id: 1,
              story_title_name: 1,
story_sub_title_name: 1,
              story_desk_created_name: 1,
              seo_tag: 1,
              seo_keywords: 1,
              main_category_id: 1,
              story_id: 1,
              story_details: 1,
              story_subject_name: 1,
              story_asked_title: 1,
              news_image_caption: 1,
              story_summary_snippet: 1,
              story_asked_quotes_content: 1,
              story_asked_quotes_author: 1,
              story_asked_question: 1,
              blurb_title: 1,
              blurb_content: 1,
              twitter_embed_id: 1,
              youtube_embed_id: 1,
              facebook_embed_id: 1,
              instagram_embed_id: 1,
              threads_embed_id: 1,
              author_desk: 1,
              story_cover_image_url: 1,
              createdAt: 1,
              updatedAt: 1,
              c_category_name: "$categories.c_category_name",
              n_story_order: 1,
              post_status: 1,
              pin_status: -1,
              view_count: 1,
            },
          },
          {
            $sort: { pin_status: -1, n_story_order: -1, createdAt: -1 },
          },
        ])
          .then((data) => {
            const data1 = seprateData(data);
const encryptRes = encryptCryptoResponse(data1);
            // const decryptRes = decrypCryptoRequest(encryptRes);
            if (data.length > 0) {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "";
              sendResponse["n_page"] = 0;
              sendResponse["n_limit"] = 0;
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
              story_title_name: { $first: "$story_title_name" },
              story_sub_title_name: { $first: "$story_sub_title_name" },
              story_desk_created_name: { $first: "$story_desk_created_name" },
              seo_tag: { $first: "$seo_tag" },
              seo_keywords: { $first: "$seo_keywords" },
              story_id: { $first: "$story_id" },
              main_category_id: { $first: "$main_category_id" },
story_details: { $first: "$story_details" },
              story_subject_name: { $first: "$story_subject_name" },
              story_asked_title: { $first: "$story_asked_title" },
              news_image_caption: { $first: "$news_image_caption" },
              story_summary_snippet: { $first: "$story_summary_snippet" },
              story_asked_quotes_content: {
                $first: "$story_asked_quotes_content",
              },
              story_asked_quotes_author: {
                $first: "$story_asked_quotes_author",
              },
              story_asked_question: { $first: "$story_asked_question" },
              blurb_title: { $first: "$blurb_title" },
              blurb_content: { $first: "$blurb_content" },
              twitter_embed_id: { $first: "$twitter_embed_id" },
              youtube_embed_id: { $first: "$youtube_embed_id" },
              facebook_embed_id: { $first: "$facebook_embed_id" },
              instagram_embed_id: { $first: "$instagram_embed_id" },
              threads_embed_id: { $first: "$threads_embed_id" },
              author_desk: { $first: "$author_desk" },
              story_cover_image_url: { $first: "$story_cover_image_url" },
              createdAt: { $first: "$createdAt" },
              updatedAt: { $first: "$updatedAt" },
              n_story_order: { $first: "$n_story_order" },
              post_status: { $first: "$post_status" },
              pin_status: { $first: "$pin_status" },
              view_count: { $first: "$view_count" },
              c_createdBy: { $first: "$c_createdBy" },

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
              story_title_name: 1,
              story_sub_title_name: 1,
              story_desk_created_name: 1,
              seo_tag: 1,
              seo_keywords: 1,
              main_category_id: 1,
              story_id: 1,
              story_details: 1,
              story_subject_name: 1,
              story_asked_title: 1,
              news_image_caption: 1,
              story_summary_snippet: 1,
              story_asked_quotes_content: 1,
              story_asked_quotes_author: 1,
              story_asked_question: 1,
              blurb_title: 1,
              blurb_content: 1,
              twitter_embed_id: 1,
              youtube_embed_id: 1,
              facebook_embed_id: 1,
instagram_embed_id: 1,
              threads_embed_id: 1,
              author_desk: 1,
              story_cover_image_url: 1,
              createdAt: 1,
              updatedAt: 1,
              c_category_name: "$categories.c_category_name",
              c_createdName:"$users.user_name",
              n_story_order: 1,
              post_status: 1,
              pin_status: -1,
              view_count: 1,
              c_createdBy: 1,
            },
          },
          {
            $sort: { pin_status: -1, n_story_order: -1, createdAt: -1 },
          },
        ])
          .then((data) => {
            const data1 = seprateData(data);
            const encryptRes = encryptCryptoResponse(data1);
            // const decryptRes = decrypCryptoRequest(encryptRes);
            if (data.length > 0) {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "";
              sendResponse["n_page"] = 0;
              sendResponse["n_limit"] = 0;
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
              story_title_name: { $first: "$story_title_name" },
              story_sub_title_name: { $first: "$story_sub_title_name" },
              story_id: { $first: "$story_id" },
              main_category_id: { $first: "$main_category_id" },
              seo_tag: { $first: "$seo_tag" },
              seo_keywords: { $first: "$seo_keywords" },
              story_details: { $first: "$story_details" },
              story_subject_name: { $first: "$story_subject_name" },
              story_asked_title: { $first: "$story_asked_title" },
              news_image_caption: { $first: "$news_image_caption" },
              story_summary_snippet: { $first: "$story_summary_snippet" },
              story_asked_quotes_content: {
                $first: "$story_asked_quotes_content",
              },
              story_asked_quotes_author: {
                $first: "$story_asked_quotes_author",
              },
              story_asked_question: { $first: "$story_asked_question" },
              blurb_title: { $first: "$blurb_title" },
              blurb_content: { $first: "$blurb_content" },
              twitter_embed_id: { $first: "$twitter_embed_id" },
              youtube_embed_id: { $first: "$youtube_embed_id" },
              facebook_embed_id: { $first: "$facebook_embed_id" },
              instagram_embed_id: { $first: "$instagram_embed_id" },
              threads_embed_id: { $first: "$threads_embed_id" },
 author_desk: { $first: "$author_desk" },
              story_cover_image_url: { $first: "$story_cover_image_url" },
              story_desk_created_name: { $first: "$story_desk_created_name" },
              createdAt: { $first: "$createdAt" },
              updatedAt: { $first: "$updatedAt" },
              n_story_order: { $first: "$n_story_order" },
              post_status: { $first: "$post_status" },
              pin_status: { $first: "$pin_status" },
              view_count: { $first: "$view_count" },
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
            $project: {
              _id: 1,
              story_title_name: 1,
              story_sub_title_name: 1,
              main_category_id: 1,
              seo_tag: 1,
              seo_keywords: 1,
              story_id: 1,
              story_details: 1,
              story_subject_name: 1,
              story_asked_title: 1,
              news_image_caption: 1,
              story_asked_quotes_content: 1,
              story_asked_quotes_author: 1,
              story_asked_question: 1,
story_summary_snippet: 1,
              blurb_title: 1,
              blurb_content: 1,
              twitter_embed_id: 1,
              youtube_embed_id: 1,
              facebook_embed_id: 1,
              instagram_embed_id: 1,
              threads_embed_id: 1,
              author_desk: 1,
              story_cover_image_url: 1,
              story_desk_created_name: 1,
              createdAt: 1,
              updatedAt: 1,
              c_category_name: "$categories.c_category_name",
              n_story_order: 1,
              post_status: 1,
              pin_status: 1,
              view_count: 1,
            },
          },
          {
            $sort: { pin_status: -1, n_story_order: -1, createdAt: -1 },
          },
        ])
          .then((data) => {
            const data1 = seprateData(data);
            const encryptRes = encryptCryptoResponse(data1);
            // const decryptRes = decrypCryptoRequest(encryptRes);
            if (data.length > 0) {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "";
              sendResponse["n_page"] = 0;
              sendResponse["n_limit"] = 0;
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
            story_title_name: { $first: "$story_title_name" },
            story_sub_title_name: { $first: "$story_sub_title_name" },
            story_cover_image_url: { $first: "$story_cover_image_url" },
            story_desk_created_name: { $first: "$story_desk_created_name" },
            main_category_id: { $first: "$main_category_id" },
            story_subject_name: { $first: "$story_subject_name" },
            story_asked_title: { $first: "$story_asked_title" },
            news_image_caption: { $first: "$news_image_caption" },
            story_asked_quotes_content: {
              $first: "$story_asked_quotes_content",
            },
            story_asked_quotes_author: { $first: "$story_asked_quotes_author" },
            story_asked_question: { $first: "$story_asked_question" },
            story_summary_snippet: { $first: "$story_summary_snippet" },
            blurb_title: { $first: "$blurb_title" },
            blurb_content: { $first: "$blurb_content" },
            seo_tag: { $first: "$seo_tag" },
            seo_keywords: { $first: "$seo_keywords" },
            story_id: { $first: "$story_id" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
            n_story_order: { $first: "$n_story_order" },
            post_status: { $first: "$post_status" },
            pin_status: { $first: "$pin_status" },
youtube_embed_id: { $first: "$youtube_embed_id" },
            view_count: { $first: "$view_count" },

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
          $project: {
            _id: 1,
            story_title_name: 1,
            story_sub_title_name: 1,
            story_desk_created_name: 1,
            story_cover_image_url: 1,
            main_category_id: 1,
            seo_tag: 1,
            story_subject_name: 1,
            story_asked_title: 1,
            news_image_caption: 1,
            story_asked_quotes_content: 1,
            story_asked_quotes_author: 1,
            story_asked_question: 1,
            story_summary_snippet: 1,
            blurb_title: 1,
            blurb_content: 1,
            seo_keywords: 1,
            story_id: 1,
            createdAt: 1,
            updatedAt: 1,
c_category_name: "$categories.c_category_name",
            n_story_order: 1,
            post_status: 1,
            pin_status: 1,
            view_count: 1,
          },
        },
        {
          $sort: { pin_status: -1, n_story_order: -1, createdAt: -1 },
        },
      ])
        .then((data) => {
          const data1 = seprateData(data);
          const encryptRes = encryptCryptoResponse(data1);
          // const decryptRes = decrypCryptoRequest(encryptRes);
          if (data.length > 0) {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "";
            sendResponse["n_page"] = 0;
            sendResponse["n_limit"] = 0;
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
