export async function GET(request) {
  let sendResponse = {
    appStatusCode: 0,
    message: "",
    payloadJson: [],
    error: "",
  };

  try {
    await connectMongoDB();
  } catch (dbErr) {
    console.error("MongoDB connection failed in /api/v1/web/news/latest GET:", dbErr.message);
    const emptyResult = [];
    const encryptRes = encryptCryptoResponse(emptyResult);
    sendResponse["appStatusCode"] = 0;
    sendResponse["message"] = "Connection failed";
    sendResponse["payloadJson"] = encryptRes;
    return NextResponse.json(sendResponse, { status: 200 });
  }

  const id = request.nextUrl.searchParams.get("id");
  const url = request.nextUrl.searchParams.get("url");
  const main_category_id = request.nextUrl.searchParams.get("category");

  try {
    if (id) {
      const checkId = await Story.findOne({ story_id: id });
      if (!checkId) {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Invalid Id!";
        return NextResponse.json(sendResponse, { status: 400 });
      }

      const _search = {
        "$and": [
          {
            "$and": [
              { n_status: 1 },
              { n_published: 1 },
              { story_id: id },
              { c_save_type: "published" },
            ],
          },
        ],
      };

      // ✅ FIX: Use await instead of .then()
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
            story_asked_quotes_content: { $first: "$story_asked_quotes_content" },
            story_asked_quotes_author: { $first: "$story_asked_quotes_author" },
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
        { $unwind: "$categories" },
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
        { $sort: { pin_status: -1, n_story_order: -1, createdAt: -1 } },
      ]);

      // ✅ Process data inside try block BEFORE returning
      if (data.length > 0) {
        const data1 = seprateData(data);
        const encryptRes = encryptCryptoResponse(data1);
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

    } else if (url) {
      const checkUrl = await Story.findOne({ story_desk_created_name: url });
      if (!checkUrl) {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Invalid URL!";
        return NextResponse.json(sendResponse, { status: 400 });
      }

      const _search = {
        "$and": [
          {
            "$and": [
              { n_status: 1 },
              { n_published: 1 },
              { story_desk_created_name: url },
              { c_save_type: "published" },
            ],
          },
        ],
      };

      // ✅ FIX: Use await instead of .then()
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
            story_asked_quotes_content: { $first: "$story_asked_quotes_content" },
            story_asked_quotes_author: { $first: "$story_asked_quotes_author" },
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
        { $unwind: "$categories" },
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
        { $sort: { pin_status: -1, n_story_order: -1, createdAt: -1 } },
      ]);

      // ✅ Process data inside try block BEFORE returning
      if (data.length > 0) {
        const data1 = seprateData(data);
        const encryptRes = encryptCryptoResponse(data1);
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

    } else if (main_category_id) {
      const checkId = await Story.findOne({ main_category_id: main_category_id });
      if (!checkId) {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Invalid category!";
        return NextResponse.json(sendResponse, { status: 400 });
      }

      const _search = {
        "$and": [
          {
            "$and": [
              { n_status: 1 },
              { n_published: 1 },
              { main_category_id: main_category_id },
              { c_save_type: "published" },
            ],
          },
        ],
      };

      // ✅ FIX: Use await instead of .then()
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
            story_asked_quotes_content: { $first: "$story_asked_quotes_content" },
            story_asked_quotes_author: { $first: "$story_asked_quotes_author" },
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
        { $unwind: "$categories" },
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
        { $sort: { pin_status: -1, n_story_order: -1, createdAt: -1 } },
      ]);

      // ✅ Process data inside try block BEFORE returning
      if (data.length > 0) {
        const data1 = seprateData(data);
        const encryptRes = encryptCryptoResponse(data1);
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

    } else {
      // Default: return latest news
      const _search = {
        "$and": [
          {
            "$and": [
              { n_status: 1 },
              { n_published: 1 },
              { c_save_type: "published" },
            ],
          },
        ],
      };

      // ✅ FIX: Use await instead of .then()
      const data = await Story.aggregate([
        { $match: _search },
        { $sort: { timestamp: -1 } },
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
            story_asked_quotes_content: { $first: "$story_asked_quotes_content" },
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
        { $unwind: "$categories" },
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
            youtube_embed_id: 1,
            view_count: 1,
          },
        },
        { $sort: { pin_status: -1, n_story_order: -1, createdAt: -1, _id: -1 } },
        { $limit: 5 },
      ]);

      // ✅ Process data inside try block BEFORE returning
      if (data.length > 0) {
        const data1 = seprateData(data);
        const encryptRes = encryptCryptoResponse(data1);
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
    }

    return NextResponse.json(sendResponse, { status: 200 });

  } catch (err) {
    console.error("Error in GET /api/v1/web/news/latest:", err.message);
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = "";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = err.message || "Something went wrong!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
