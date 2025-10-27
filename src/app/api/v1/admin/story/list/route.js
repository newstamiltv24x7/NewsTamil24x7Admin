import { NextResponse } from "next/server";
import { Story } from "../../../../../../models/storyModel";
import connectMongoDB from "../../../../../../libs/mongodb";
import { verifyAccessToken } from "@/helper/helper";
import { User } from "@/models/userModel";
import { UserRole } from "@/models/userRoleModel";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

function visitArrayCountTotal(visitArray) {
  let returArray = 0;
  visitArray.map((data) => {
    data.map((list) => {
      returArray += list.c_visit_count;
    });
  });
  return returArray;
}


const seprateArrayData = (data) => {
  let datas = [];

  data.map((list) => {
    datas.push({
      _id: list?._id,
      story_title_name: list?.story_title_name,
      story_subject_name: list?.story_subject_name,
      story_id: list?.story_id,
      reviwer_id: list?.reviwer_id,
      story_cover_image_url: list?.story_cover_image_url,
      c_save_type: list?.c_save_type,
      n_story_order: list?.n_story_order,
      n_status: list?.n_status,
      n_published: list?.n_published,
      createdAt: list?.createdAt,
      updatedAt: list?.updatedAt,
      c_createdBy: list?.c_createdBy,
      author_desk: list?.author_desk,
      post_status: list?.post_status,
      replaced_url: list?.replaced_url,
      live_status: list?.live_status,
      pin_status: list?.pin_status,
      createdName: list?.createdName,
      reviwerName: list?.reviwerName,
      view_count: list?.view_count,
      // visitcount: visitArrayCountTotal(list?.visitcount)
      //   ? visitArrayCountTotal(list?.visitcount)
      //   : 0
    });
  });

  return datas;
};

export async function POST(request) {
  const {
    n_page,
    n_limit,
    c_search_term,
    c_from_date,
    c_to_date,
    c_reviwer_id,
    c_hour,
    c_main_category_id,
    c_sub_category_id,
    c_save_type,
    trash,
  } = await request.json();

  const verified = verifyAccessToken();
  

  const userRole = await UserRole.findOne({
    c_role_id: verified.data.c_role_id,
  });
  
  try {
    if (verified.success) {
      let _search = {};
      let n_limitTerm = n_limit;
      let n_pageTerm = n_page === 1 ? 0 : (n_page - 1) * n_limit;
      let searchTerm = c_search_term ? c_search_term : "";

      let fromDate = "";
      let toDate = "";
      let fromHour = "";
      let toHour = "";
      // if (trash === "trash" && trash !== undefined) {
      //   _search["$and"] = [
      //     {
      //       $and: [{ n_status: 0 }, { n_published: 0 }],
      //     },
      //   ];
      // } else 
      
      
      if (
        searchTerm !== "" &&
        c_from_date !== "" &&
        c_to_date !== "" &&
        c_reviwer_id !== "" &&
        c_hour !== "" &&
        c_main_category_id !== "" &&
        c_sub_category_id !== ""
      ) {
        
        fromDate = new Date(c_from_date);
        toDate = new Date(c_to_date);
        toDate.setDate(toDate.getDate() + 1);

        _search["$and"] = [
          {
            $and: [
              { createdAt: { $gte: fromDate, $lte: toDate } },
              { story_title_name: { $regex: searchTerm, $options: "i" } },
              { reviwer_id: c_reviwer_id },
              { createdAt: { $gte: fromHour, $lte: toHour } },
              { main_category_id: c_main_category_id },
              { sub_category_id: c_sub_category_id },
              // { n_status: 1 },
              { n_published: 1 },
              { c_save_type: c_save_type },
            ],
          },
        ];
      } else if (searchTerm !== "" && c_from_date !== "" && c_to_date !== "") {
        

        fromDate = new Date(c_from_date);
        toDate = new Date(c_to_date);
        toDate.setDate(toDate.getDate() + 1);
        _search["$and"] = [
          {
            $and: [
              { createdAt: { $gte: fromDate, $lte: toDate } },
              { story_title_name: { $regex: searchTerm, $options: "i" } },
              // { n_status: 1 },
              { n_published: 1 },
              { c_save_type: c_save_type },
            ],
          },
        ];
      } else if (
        c_save_type !== "" &&
        searchTerm === "" &&
        c_from_date === "" &&
        c_to_date === "" &&
        c_reviwer_id === "" &&
        c_hour === "" &&
        c_main_category_id === "" &&
        c_sub_category_id === ""
      ) {
        
        

        if (
          userRole.c_role_id !== "9386b7e94c7e" &&
          userRole.c_role_id !== "52576c6ee821"
        ) {
          
          _search["$and"] = [
            {
              $and: [
                // { n_status: 1 },
                { n_published: 1 },
                { c_save_type: c_save_type },
              ],
            },
          ];
        } else if (userRole.c_role_id === "9386b7e94c7e") {
          

          if (c_save_type === "published") {
            
            _search["$and"] = [
              {
                $and: [
                  // { n_status: 1 },
                  { n_published: 1 },
                  { c_save_type: c_save_type },
                ],
              },
            ];
          } else if (c_save_type === "submitforreview") {
            
            _search["$and"] = [
              {
                $and: [
                  // { n_status: 1 },
                  { n_published: 1 },
                  { c_save_type: c_save_type },
                  { c_createdBy: verified.data.user_id },
                ],
              },
            ];
          } else if (c_save_type === "save") {
            
            _search["$and"] = [
              {
                $and: [
                  // { n_status: 1 },
                  { n_published: 1 },
                  { c_save_type: c_save_type },
                  { c_createdBy: verified.data.user_id },
                ],
              },
            ];
          } else if (c_save_type === "scheduleforlater") {
            
            _search["$and"] = [
              {
                $and: [
                  // { n_status: 1 },
                  { n_published: 1 },
                  { c_save_type: c_save_type },
                ],
              },
            ];
          }
        } else if (
          userRole.c_role_id === "52576c6ee821" &&
          c_save_type !== "published"
        ) {
          
          _search["$and"] = [
            {
              $and: [
                // { n_status: 1 },
                { n_published: 1 },
                { c_save_type: c_save_type },
                { reviwer_id: verified.data.user_id },
              ],
            },
          ];
        }
        else {
          
          _search["$and"] = [
            {
              $and: [
                // { n_status: 1 },
                { n_published: 1 },
                { c_save_type: c_save_type }
              ],
            },
          ];
        }
      } else if (searchTerm !== "") {
        

        _search["$and"] = [
          {

            $and: [
              
              // { n_status: 1 },
              { n_published: 1 },
              { c_save_type: c_save_type },
            ],
            $or:[
              { story_title_name: { $regex: searchTerm, $options: "i" } },
              { story_subject_name : { $regex: searchTerm, $options: "i" } },
              { story_sub_title_name : { $regex: searchTerm, $options: "i" } },
              { story_sub_english_name : { $regex: searchTerm, $options: "i" } },
            ]
          },
        ];
      } else if (c_from_date !== "" && c_to_date !== "") {
        

        fromDate = new Date(c_from_date);
        toDate = new Date(c_to_date);
        toDate.setDate(toDate.getDate() + 1);

        _search["$and"] = [
          {
            $and: [
              { createdAt: { $gte: fromDate, $lte: toDate } },
              // { n_status: 1 },
              { n_published: 1 },
              { c_save_type: c_save_type },
            ],
          },
        ];
      } else if (c_reviwer_id !== "") {
        

        _search["$and"] = [
          {
            $and: [
              { reviwer_id: c_reviwer_id },
              // { n_status: 1 },
              { n_published: 1 },
              { c_save_type: c_save_type },
            ],
          },
        ];
      } else if (c_hour !== "") {
        

        fromHour = new Date();
        toHour = new Date();
        fromHour.setHours(fromHour.getHours() - c_hour);
        _search["$and"] = [
          {
            $and: [
              { createdAt: { $gte: fromHour, $lte: toHour } },
              // { n_status: 1 },
              { n_published: 1 },
              { c_save_type: c_save_type },
            ],
          },
        ];
      } else if (c_main_category_id !== "") {
        
        if (verified.data.c_role_id === "9386b7e94c7e") {
          _search["$and"] = [
            {
              $and: [
                { author_desk: verified.data.c_role_id },
                { main_category_id: c_main_category_id },
                { c_save_type: c_save_type },
                // { n_status: 1 },
                { n_published: 1 },
              ],
            },
          ];
        } else {
          _search["$and"] = [
            {
              $and: [
                { main_category_id: c_main_category_id },
                { c_save_type: c_save_type },
                // { n_status: 1 },
                { n_published: 1 },
              ],
            },
          ];
        }
      } else if (c_main_category_id !== "" && c_sub_category_id !== "") {
        

        _search["$and"] = [
          {
            $and: [
              { main_category_id: c_main_category_id },
              { sub_category_id: c_sub_category_id },
              // { n_status: 1 },
              { n_published: 1 },
              { c_save_type: c_save_type },
            ],
          },
        ];
      } else if (
        searchTerm !== "" ||
        (c_from_date !== "" && c_to_date !== "") ||
        c_reviwer_id !== "" ||
        c_hour !== "" ||
        c_main_category_id !== ""
      ) {
        

        fromDate = new Date(c_from_date);
        toDate = new Date(c_to_date);
        toDate.setDate(toDate.getDate() + 1);
        _search["$and"] = [
          {
            $and: [
              // { n_status: 1 },
              { n_published: 1 },
              { c_save_type: c_save_type },
            ],
            $or: [
              { createdAt: { $gte: fromDate, $lte: toDate } },
              { story_title_name: { $regex: searchTerm, $options: "i" } },
              { reviwer_id: c_reviwer_id },
              { createdAt: { $gte: fromHour, $lte: toHour } },
              { main_category_id: c_main_category_id },
              { sub_category_id: c_sub_category_id },
            ],

          }
          
        ];
      } else {
        
        _search["$and"] = [
          {
            $and: [
              // { n_status: 1 },
              { n_published: 1 },
              { main_category_id: c_main_category_id },
              { c_save_type: c_save_type },
            ],
          },
        ];
      }

      if (n_limitTerm !== "" && n_pageTerm !== "") {
        await connectMongoDB();

        await Story.aggregate([
          {
            $match: _search,
          },
          {
            $group: {
              _id: "$_id",
              story_title_name: { $first: "$story_title_name" },
              story_subject_name: { $first: "$story_subject_name" },
              story_id: { $first: "$story_id" },
              reviwer_id: { $first: "$reviwer_id" },
              story_cover_image_url: { $first: "$story_cover_image_url" },
              c_save_type: { $first: "$c_save_type" },
              n_story_order: { $first: "$n_story_order" },
              trending_news: { $first: "$trending_news" },
              flash_news: { $first: "$flash_news" },
              n_status: { $first: "$n_status" },
              n_published: { $first: "$n_published" },
              createdAt: { $first: "$createdAt" },
              updatedAt: { $first: "$updatedAt" },
              c_createdBy: { $first: "$c_createdBy" },
              author_desk: { $first: "$author_desk" },
              post_status: { $first: "$post_status" },
              replaced_url: { $first: "$replaced_url" },
              live_status: { $first: "$live_status" },
              pin_status: { $first: "$pin_status" },
              view_count: { $first: "$view_count" },
              
              
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
            $lookup: {
              from: "users",
              localField: "reviwer_id",
              foreignField: "user_id",
              as: "reviwerById",
            },
          },
          {
            $unwind: {
              path: "$reviwerById",
              preserveNullAndEmptyArrays: true,
            },
          },
          // {
          //   $lookup: {
          //     from: "visitcounttokens",
          //     localField: "story_id",
          //     foreignField: "c_story_id",
          //     as: "visitcounttokens",
          //   },
          // },
          {
            $project: {
              _id: 1,
              story_subject_name: 1,
              story_id: 1,
              story_title_name: 1,
              reviwer_id: 1,
              story_cover_image_url: 1,
              c_save_type: 1,
              n_story_order: 1,
              post_status: 1,
              n_status: 1,
              n_published: 1,
              createdAt: 1,
              updatedAt: 1,
              c_createdBy: 1,
              author_desk: 1,
              replaced_url: 1,
              live_status: 1,
              createdName: "$createdById.user_name",
              reviwerName: "$reviwerById.user_name",
              // visitcount: "$visitcounttokens.c_visit_all_count",
              pin_status: 1,
              view_count: 1
            },
          },
          {
            // $sort: { n_story_order: -1 },
            $sort: {pin_status: -1, n_story_order: -1, createdAt: -1 },
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
            const data1 = seprateArrayData(data[0].data);
            datas.push({ data: data1, total_count: data[0].total_count });
            if (data[0].data.length > 0) {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "";
              sendResponse["payloadJson"] = datas;
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
    } else {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = [];
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = verified.error;
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
  const verified = verifyAccessToken();

  const StoryId = request.nextUrl.searchParams.get("Id");

  if (verified.success) {
    if (StoryId) {
      const checkId = await Story.findOne({ story_id: StoryId });
      if (checkId) {
        let _search = {};
        _search["$and"] = [
          {
            $and: [{ n_published: 1 }, { story_id: StoryId }],
          },
        ];

        try {
          await connectMongoDB();

          await Story.aggregate([
            { $match: _search },
            {
              $group: {
                _id: "$_id",
                story_subject_name: { $first: "$story_subject_name" },
                story_id: { $first: "$story_id" },
                story_title_name: { $first: "$story_title_name" },
                story_sub_title_name: { $first: "$story_sub_title_name" },
                story_english_name: { $first: "$story_english_name" },
                story_sub_english_name: { $first: "$story_sub_english_name" },
                story_desk_created_name: { $first: "$story_desk_created_name" },
                article_template_id: { $first: "$article_template_id" },
                story_summary_snippet: { $first: "$story_summary_snippet" },
                main_category_id: { $first: "$main_category_id" },
                sub_category_id: { $first: "$sub_category_id" },
                country_id: { $first: "$country_id" },
                state_id: { $first: "$state_id" },
                city_id: { $first: "$city_id" },
                reviwer_id: { $first: "$reviwer_id" },
                story_cover_image_url: { $first: "$story_cover_image_url" },
                story_thumb_image_url: { $first: "$story_thumb_image_url" },
                story_video_type: { $first: "$story_video_type" },
                story_video_url: { $first: "$story_video_url" },
                news_image_caption: { $first: "$news_image_caption" },
                seo_tag: { $first: "$seo_tag" },
                seo_keywords: { $first: "$seo_keywords" },
                story_author_block: { $first: "$story_author_block" },
                story_credit_name: { $first: "$story_credit_name" },
                story_details: { $first: "$story_details" },
                blurb_content: { $first: "$blurb_content" },
                blurb_title: { $first: "$blurb_title" },
                twitter_embed_id: { $first: "$twitter_embed_id" },
                youtube_embed_id: { $first: "$youtube_embed_id" },
                facebook_embed_id: { $first: "$facebook_embed_id" },
                instagram_embed_id: { $first: "$instagram_embed_id" },
                threads_embed_id: { $first: "$threads_embed_id" },
                author_desk: { $first: "$author_desk" },
                story_asked_title: { $first: "$story_asked_title" },
                story_asked_quotes_content: {
                  $first: "$story_asked_quotes_content",
                },
                story_asked_quotes_author: {
                  $first: "$story_asked_quotes_author",
                },
                story_asked_question: { $first: "$story_asked_question" },
                story_paid_content: { $first: "$story_paid_content" },
                story_live_article: { $first: "$story_live_article" },
                trending_news: { $first: "$trending_news" },
                flash_news: { $first: "$flash_news" },
                story_published_options: { $first: "$story_published_options" },
                c_save_type: { $first: "$c_save_type" },
                n_story_order: { $first: "$n_story_order" },
                createdAt: { $first: "$createdAt" },
                updatedAt: { $first: "$updatedAt" },
                c_createdBy: { $first: "$c_createdBy" },
                n_status: { $first: "$n_status" },
                n_published: { $first: "$n_published" },
                pair_id: { $first: "$pair_id" },
                post_status: { $first: "$post_status" },
                replaced_url: { $first: "$replaced_url" },
                live_status: { $first: "$live_status" },
                pin_status: { $first: "$pin_status" },
                view_count: { $first: "$view_count" },
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
              $unwind: {
                path: "$subcategories",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "reviwer_id",
                foreignField: "user_id",
                as: "reviwers",
              },
            },
            {
              $unwind: {
                path: "$reviwers",
                preserveNullAndEmptyArrays: true,
              },
            },

            {
              $lookup: {
                from: "countries",
                localField: "country_id",
                foreignField: "id",
                as: "countriesById",
              },
            },
            {
              $unwind: {
                path: "$countriesById",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "states",
                localField: "state_id",
                foreignField: "id",
                as: "statesById",
              },
            },
            {
              $unwind: {
                path: "$statesById",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "cities",
                localField: "city_id",
                foreignField: "id",
                as: "citiesById",
              },
            },
            {
              $unwind: {
                path: "$citiesById",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 1,
                story_subject_name: 1,
                story_id: 1,
                story_title_name: 1,
                story_sub_title_name: 1,
                story_english_name: 1,
                story_sub_english_name: 1,
                story_desk_created_name: 1,
                article_template_id: 1,
                story_summary_snippet: 1,
                main_category_id: 1,
                sub_category_id: 1,
                country_id: 1,
                state_id: 1,
                city_id: 1,
                reviwer_id: 1,
                story_cover_image_url: 1,
                story_thumb_image_url: 1,
                story_video_type: 1,
                story_video_url: 1,
                news_image_caption: 1,
                seo_tag: 1,
                seo_keywords: 1,
                story_author_block: 1,
                story_credit_name: 1,
                blurb_title: 1,
                twitter_embed_id: 1,
                youtube_embed_id: 1,
                facebook_embed_id: 1,
                instagram_embed_id: 1,
                threads_embed_id: 1,
                author_desk: 1,
                blurb_content: 1,
                story_details: 1,
                story_asked_title: 1,
                story_asked_quotes_content: 1,
                story_asked_quotes_author: 1,
                story_asked_question: 1,
                story_paid_content: 1,
                story_live_article: 1,
                trending_news: 1,
                flash_news: 1,
                story_published_options: 1,
                c_save_type: 1,
                n_story_order: 1,
                createdAt: 1,
                updatedAt: 1,
                c_createdBy: 1,
                c_createdName: "$users.user_name",
                main_category_name: "$categories.c_category_name",
                sub_category_name: "$subcategories.c_category_name",
                reviwerName: "$reviwers.user_name",
                country_name: "$countriesById.name",
                state_name: "$statesById.name",
                city_name: "$citiesById.name",
                n_status: 1,
                n_published: 1,
                pair_id: 1,
                post_status: 1,
                replaced_url: 1,
                live_status: 1,
                pin_status: 1,
                view_count: 1
              },
            },
            {
              $sort: { n_story_order: -1 },
            },
          ])
            .then((data) => {
              if (data.length > 0) {
                sendResponse["appStatusCode"] = 0;
                sendResponse["message"] = "";
                sendResponse["payloadJson"] = data[0];
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
          $and: [ { n_published: 1 }],
        },
      ];

      try {
        await connectMongoDB();

        await Story.aggregate([
          { $match: _search },
          {
            $group: {
              _id: "$_id",
              story_subject_name: { $first: "$story_subject_name" },
              story_id: { $first: "$story_id" },
              story_title_name: { $first: "$story_title_name" },
              story_sub_title_name: { $first: "$story_sub_title_name" },
              story_english_name: { $first: "$story_english_name" },
              story_sub_english_name: { $first: "$story_sub_english_name" },
              story_desk_created_name: { $first: "$story_desk_created_name" },
              article_template_id: {
                $first: "$article_template_id",
              },
              story_summary_snippet: { $first: "$story_summary_snippet" },
              main_category_id: { $first: "$main_category_id" },
              sub_category_id: { $first: "$sub_category_id" },
              country_id: { $first: "$country_id" },
              state_id: { $first: "$state_id" },
              city_id: { $first: "$city_id" },
              reviwer_id: {
                $first: "$reviwer_id",
              },
              story_cover_image_url: { $first: "$story_cover_image_url" },
              story_thumb_image_url: { $first: "$story_thumb_image_url" },
              story_video_type: { $first: "$story_video_type" },
              story_video_url: { $first: "$story_video_url" },
              news_image_caption: { $first: "$news_image_caption" },
              seo_tag: { $first: "$seo_tag" },
              seo_keywords: { $first: "$seo_keywords" },
              story_author_block: { $first: "$story_author_block" },
              story_credit_name: { $first: "$story_credit_name" },
              blurb_content: { $first: "$blurb_content" },
              blurb_title: { $first: "$blurb_title" },
              twitter_embed_id: { $first: "$twitter_embed_id" },
              youtube_embed_id: { $first: "$youtube_embed_id" },
              facebook_embed_id: { $first: "$facebook_embed_id" },
              instagram_embed_id: { $first: "$instagram_embed_id" },
              threads_embed_id: { $first: "$threads_embed_id" },
              author_desk: { $first: "$author_desk" },
              story_details: { $first: "$story_details" },
              story_asked_title: { $first: "$story_asked_title" },
              story_asked_quotes_content: {
                $first: "$story_asked_quotes_content",
              },
              story_asked_quotes_author: {
                $first: "$story_asked_quotes_author",
              },
              story_asked_question: { $first: "$story_asked_question" },
              story_paid_content: { $first: "$story_paid_content" },
              story_live_article: { $first: "$story_live_article" },
              trending_news: { $first: "$trending_news" },
              flash_news: { $first: "$flash_news" },
              story_published_options: { $first: "$story_published_options" },
              c_save_type: { $first: "$c_save_type" },
              n_story_order: { $first: "$n_story_order" },
              createdAt: { $first: "$createdAt" },
              updatedAt: { $first: "$updatedAt" },
              c_createdBy: { $first: "$c_createdBy" },
              n_status: { $first: "$n_status" },
              n_published: { $first: "$n_published" },
              pair_id: { $first: "$pair_id" },
              post_status: { $first: "$post_status" },
              replaced_url: { $first: "$replaced_url" },
              live_status: { $first: "$live_status" },
              pin_status: { $first: "$pin_status" },
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
            $unwind: {
              path: "$subcategories",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "reviwer_id",
              foreignField: "user_id",
              as: "reviwers",
            },
          },
          {
            $unwind: {
              path: "$reviwers",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $lookup: {
              from: "countries",
              localField: "country_id",
              foreignField: "id",
              as: "countriesById",
            },
          },
          {
            $unwind: {
              path: "$countriesById",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "states",
              localField: "state_id",
              foreignField: "id",
              as: "statesById",
            },
          },
          {
            $unwind: {
              path: "$statesById",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "cities",
              localField: "city_id",
              foreignField: "id",
              as: "citiesById",
            },
          },
          {
            $unwind: {
              path: "$citiesById",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              story_subject_name: 1,
              story_id: 1,
              story_title_name: 1,
              story_sub_title_name: 1,
              story_english_name: 1,
              story_sub_english_name: 1,
              story_desk_created_name: 1,
              article_template_id: 1,
              story_summary_snippet: 1,
              main_category_id: 1,
              sub_category_id: 1,
              country_id: 1,
              state_id: 1,
              city_id: 1,
              reviwer_id: 1,
              story_cover_image_url: 1,
              story_thumb_image_url: 1,
              story_video_type: 1,
              story_video_url: 1,
              news_image_caption: 1,
              seo_tag: 1,
              seo_keywords: 1,
              story_author_block: 1,
              story_credit_name: 1,
              blurb_title: 1,
              twitter_embed_id: 1,
              youtube_embed_id: 1,
              facebook_embed_id: 1,
              instagram_embed_id: 1,
              threads_embed_id: 1,
              author_desk: 1,
              blurb_content: 1,
              story_details: 1,
              story_asked_title: 1,
              story_asked_quotes_content: 1,
              story_asked_quotes_author: 1,
              story_asked_question: 1,
              story_paid_content: 1,
              story_live_article: 1,
              trending_news: 1,
              flash_news: 1,
              story_published_options: 1,
              c_save_type: 1,
              n_story_order: 1,
              createdAt: 1,
              updatedAt: 1,
              c_createdBy: 1,
              c_createdName: "$users.user_name",
              main_category_name: "$categories.c_category_name",
              sub_category_name: "$subcategories.c_category_name",
              reviwerName: "$reviwers.user_name",
              country_name: "$countriesById.name",
              state_name: "$statesById.name",
              city_name: "$citiesById.name",
              n_status: 1,
              n_published: 1,
              pair_id: 1,
              post_status: 1,
              replaced_url: 1,
              live_status: 1,
              pin_status: 1
            },
          },
          {
            $sort: { n_story_order: -1 },
          },
        ])
          .then((data) => {
            if (data.length > 0) {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "";
              sendResponse["payloadJson"] = data;
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
  } else {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = "";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "token expired!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
