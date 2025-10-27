import { NextResponse } from "next/server";
import { Story } from "../../../../../models/storyModel";
import { User } from "@/models/userModel";
import connectMongoDB from "../../../../../libs/mongodb";
import { verifyAccessToken } from "@/helper/helper";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const { n_page, n_limit, c_search_term, c_from_date, c_to_date } =
    await request.json();

  const verified = verifyAccessToken();
  try {
    if (verified.success) {
      let _search = {};
      let n_limitTerm = n_limit;
      let n_pageTerm = n_page === 1 ? 0 : (n_page - 1) * n_limit;
      let searchTerm = c_search_term ? c_search_term : "";

      let fromDate = "";
      let toDate = "";
      if (c_from_date !== "" && c_to_date !== "") {
        // fromDate = new Date(c_from_date).toISOString();
        // toDate = new Date(c_to_date).toISOString();

        fromDate = new Date(c_from_date);
    toDate = new Date(c_to_date);
    toDate.setDate(toDate.getDate() + 1);
      }





      if (fromDate !== "" && toDate !== "") {


        if (searchTerm !== "") {
          
          _search["$and"] = [
            {
              $or: [{ story_title_name: { $regex: searchTerm, $options: "i" } }],
              $and: [{ createdAt: { $gte: fromDate, $lte: toDate } }],
            },
          ];
        } else {
         
          _search["$and"] = [
            {
              $or: [{ n_status: 1 }, { n_published: 1 }],
              $and: [{ createdAt: { $gte: fromDate, $lte: toDate } }],
            },
          ];
        }
      } else {
        if (searchTerm !== "") {
          _search["$and"] = [
            {
              $or: [{ story_title_name: { $regex: searchTerm, $options: "i" } }],
            },
          ];
        } else {
          _search["$and"] = [
            {
              $or: [{ n_status: 1 }, { n_published: 1 }],
            },
          ];
        }
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
              story_english_name: { $first: "$story_english_name" },
              story_english_name: { $first: "$story_english_name" },
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
              story_published_options: { $first: "$story_published_options" },
              n_status: { $first: "$n_status" },
              n_published: { $first: "$n_published" },
              createdAt: { $first: "$createdAt" },
              createdBy: { $first: "$createdBy" },
            },
          },
          {
            $lookup: {
              from: 'users',
              // localField: 'createdBy',
              // foreignField: '_id',
              let: {searchId: {$toObjectId: "$createdBy"}}, 
              pipeline:[
                {$match: {$expr:[ {_id: "$$searchId"}]}},
                {$project:{user_name: 1}}
              ],
              as: 'users'
            }
        },
          // {
          //   $unwind: "$Users",
          // },
          // {
          //   $project:
          //   {
              
              
          //     story_title_name: 1,
          //     story_english_name: 1,
          //     story_english_name: 1,
          //     story_desk_created_name: 1,
          //     article_template_id: 1,
          //     story_summary_snippet: 1,
          //     main_category_id: 1,
          //     sub_category_id: 1,
          //     country_id: 1,
          //     state_id: 1,
          //     city_id: 1,
          //     reviwer_id: 1,
          //     story_cover_image_url: 1,
          //     story_thumb_image_url: 1,
          //     story_video_type: 1,
          //     story_video_url: 1,
          //     news_image_caption: 1,
          //     seo_tag: 1,
          //     seo_keywords: 1,
          //     story_author_block: 1,
          //     story_credit_name: 1,
          //     story_details: 1,
          //     story_published_options: 1,
          //     createdAt:1,
          //     createdBy: 1,
          //     role: '$user.role',  
          //   }
          // },
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
            if (data[0].data.length > 0) {
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
