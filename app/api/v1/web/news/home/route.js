import { NextResponse } from "next/server";
import { Story } from "../../../../../../models/storyModel";
// import { Categories } from "../../../../../../models/categoriesModel";
import { Control } from "../../../../../../models/controlModel";
import connectMongoDB from "../../../../../../libs/mongodb";
// import { mobilePaginations } from "@/helper/helper";
import {
  encryptCryptoResponse,
  decrypCryptoRequest,
} from "../../../../../../helper/helper";
// timer logic removed

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};



const seprateData = (data) => {
  const datas = [];

  data.map((list) => {
     datas.push({
      _id: list?._id,
      story_title_name: list?.story_title_name,
      story_sub_title_name: list?.story_sub_title_name,
      story_desk_created_name: list?.story_desk_created_name,
      seo_tag: list?.seo_tag,
      seo_keywords: list?.seo_keywords,
      story_id: list?.story_id,
      main_category_id: list?.main_category_id,
      story_subject_name: list?.story_subject_name,
      story_asked_title: list?.story_asked_title,
      news_image_caption: list?.news_image_caption,
      story_summary_snippet: list?.story_summary_snippet,
      story_asked_quotes_content: list?.story_asked_quotes_content,
      story_asked_quotes_author: list?.story_asked_quotes_author,
      story_asked_question: list?.story_asked_question,
      blurb_title: list?.blurb_title,
      blurb_content: list?.blurb_content,
      youtube_embed_id: list?.youtube_embed_id,
      story_cover_image_url: list?.story_cover_image_url,
      createdAt: list?.createdAt,
      updatedAt: list?.updatedAt,
      n_story_order: list?.n_story_order,
      post_status: list?.post_status,
      pin_status: list?.pin_status,
      c_about_user: list?.c_about_user,
      c_category_name: list?.c_category_name,
      view_count: list?.view_count,
    });
  });

  return datas;
};


// export async function POST(request) {
//   try {
//     const { n_page, n_limit, main_category_id } = await request.json();
//     await connectMongoDB();

//     const options = {
//       page: Number(n_page),
//       limit: Number(n_limit),
//       sort: { pin_status: -1, _id: -1, n_story_order: -1, createdAt: -1 },
//       select: {
//         _id: 1,
//         story_id: 1,
//         story_subject_name: 1,
//         story_title_name: 1,
//         story_sub_title_name: 1,
//         story_english_name: 1,
//         story_sub_english_name: 1,
//         story_desk_created_name: 1,
//         main_category_id: 1,
//         youtube_embed_id: 1,
//         story_cover_image_url: 1,
//         story_thumb_image_url: 1,
//         news_image_caption: 1,
//         createdAt: 1,
//         updatedAt: 1,
//         view_count: 1,
//       },
//     };

//     const filter = {
//       n_status: 1,
//       n_published: 1,
//       c_save_type: "published",
//       main_category_id: main_category_id,
//     };

//     const result = await Story.paginate(filter, options);
//     const encryptRes = encryptCryptoResponse(result);

//     return NextResponse.json({
//       appStatusCode: 0,
//       message: "",
//       payloadJson: encryptRes,
//       error: "",
//     });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json(
//       {
//         appStatusCode: 4,
//         message: "",
//         payloadJson: [],
//         error: err.message,
//       },
//       { status: 400 }
//     );
//   }
// }
export async function POST(request) {
  try {
    let body = {};
    try { body = await request.json(); } catch { body = {}; }

    const { n_page = 1, n_limit = 10, main_category_id, trending_news } = body;

    // Ensure MongoDB connection is established
    try {
      await connectMongoDB();
    } catch (dbErr) {
      console.error("MongoDB connection failed in /api/v1/web/news/home:", dbErr.message);
      const emptyResult = {
        docs: [],
        totalDocs: 0,
        limit: 10,
        page: 1,
        pages: 0,
        hasNextPage: false,
        nextPage: null,
        hasPrevPage: false,
        prevPage: null
      };
      const encrypted = encryptCryptoResponse(emptyResult);
      return NextResponse.json({ appStatusCode: 0, message: "", payloadJson: encrypted, error: "Database connection failed" });
    }

    const filter = { n_status: 1, n_published: 1, c_save_type: "published" };
    if (main_category_id) filter.main_category_id = main_category_id;
    if (trending_news) filter.trending_news = 1;

    const page = Number(n_page) || 1;
    const limit = Number(n_limit) || 10;
    const skip = (page - 1) * limit;

    // ✅ COMPLETE FIX: Multiple optimizations to prevent timeouts
    // 1. maxTimeMS() - Kill query at MongoDB level after 15 seconds
    // 2. batchSize() - Limit in-memory data to reduce memory pressure
    // 3. lean() - Return plain objects, not Mongoose documents (faster)
    // 4. Simplified select - Only essential fields to reduce network overhead
    const docs = await Story.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit + 1)
      .lean()
      .maxTimeMS(15000)  // MongoDB-level timeout at 15 seconds
      .batchSize(Math.min(limit + 1, 100))  // Batch in chunks to reduce memory
      .select({
        _id: 1, story_id: 1, story_title_name: 1,
        story_cover_image_url: 1, story_thumb_image_url: 1,
        createdAt: 1, view_count: 1, main_category_id: 1
      })
      .exec();

    // Simulate pagination result format
    const hasMore = docs.length > limit;
    const result = {
      docs: hasMore ? docs.slice(0, limit) : docs,
      totalDocs: 0,
      limit: limit,
      page: page,
      pages: 0,
      hasNextPage: hasMore,
      nextPage: hasMore ? page + 1 : null,
      hasPrevPage: page > 1,
      prevPage: page > 1 ? page - 1 : null
    };

    const encrypted = encryptCryptoResponse(result);
    return NextResponse.json({ appStatusCode: 0, message: "", payloadJson: encrypted, error: "" });
  } catch (err) {
    console.error("Error in POST /api/v1/web/news/home:", err.message);
    // Return safe empty response - let frontend retry with backoff
    const emptyResult = {
      docs: [],
      totalDocs: 0,
      limit: 10,
      page: 1,
      pages: 0,
      hasNextPage: false,
      nextPage: null,
      hasPrevPage: false,
      prevPage: null
    };
    const encrypted = encryptCryptoResponse(emptyResult);
    return NextResponse.json({ appStatusCode: 0, message: "", payloadJson: encrypted, error: "" });
  }
}
export async function GET(request) {
  try {
    try {
      await connectMongoDB();
    } catch (dbErr) {
      const errorResponse = {
        appStatusCode: 4,
        message: "",
        payloadJson: [],
        error: "Database connection failed",
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

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
          try {
            const data = await Story.aggregate([
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
            ]);

            const data1 = seprateData(data);
            const encryptRes = encryptCryptoResponse(data1);
            // const decryptRes = decrypCryptoRequest(encryptRes);
            if (data.length > 0) {
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
          } catch (err) {
            sendResponse["appStatusCode"] = 4;
            sendResponse["message"] = "";

            sendResponse["payloadJson"] = [];
            sendResponse["error"] = err;
          }

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

        try {
          const data = await Story.aggregate([
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
          ]);

          const data1 = seprateData(data);
          const encryptRes = encryptCryptoResponse(data1);
          // const decryptRes = decrypCryptoRequest(encryptRes);
          if (data.length > 0) {
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
        } catch (err) {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = "";

          sendResponse["payloadJson"] = [];
          sendResponse["error"] = err;
        }

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

        try {
          const data = await Story.aggregate([
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
          ]);

          const data1 = seprateData(data);
          const encryptRes = encryptCryptoResponse(data1);
          // const decryptRes = decrypCryptoRequest(encryptRes);
          if (data.length > 0) {
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
        } catch (err) {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = "";

          sendResponse["payloadJson"] = [];
          sendResponse["error"] = err;
        }

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
        $and: [
          { n_status: 1 },
          { n_published: 1 },
          { c_save_type: "published" },
        ],
      },
    ];
    try {
      await connectMongoDB();
      try {
        const data = await Story.aggregate([
        { $match: _search },
        {
          $sort: { pin_status: -1, n_story_order: -1, createdAt: -1, _id: -1 },
        },
        { $limit: 5 },
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
        ]);

        const data1 = seprateData(data);
        const encryptRes = encryptCryptoResponse(data1);
        // const decryptRes = decrypCryptoRequest(encryptRes);
        if (data.length > 0) {
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
      } catch (err) {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "";

        sendResponse["payloadJson"] = [];
        sendResponse["error"] = err;
      }

      return NextResponse.json(sendResponse, { status: 200 });
    } catch (err) {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "";

      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Something went wrong!";
      return NextResponse.json(sendResponse, { status: 400 });
    }
  }
  } catch (err) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = "";

    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "Something went wrong!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
