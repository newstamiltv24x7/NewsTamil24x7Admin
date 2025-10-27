import { NextResponse } from "next/server";
import { Story } from "../../../../../../models/storyModel";
import connectMongoDB from "../../../../../../libs/mongodb";
import { verifyAccessToken, imageCloudUpload } from "@/helper/helper";
import { create_UUID } from "../../../../../../helper/helper";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

function json_sorter(json) {
  json = json.sort((a, b) => {
    if (b.id > a.id) {
      return -1;
    }
  });
  return json;
}

function randomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function removeTags(str) {
  if (str === null || str === "") return false;
  else str = str.toString();

  // Regular expression to identify HTML tags in
  // the input string. Replacing the identified
  // HTML tag with a null string.
  const str1 = str.replace(/(<([^>]+)>)/gi, "");
  const str2 = str1.replace(/(\r\n|\n|\r)/gm, "");
  const str3 = str2.replace(/(<p[^>]+?>|<p>|<\/p>)/gim, "");
  const str4 = str3.replace(/(<strong[^>]+?>|<strong>|<\/strong>)/gim, "");

  const first300 = str4.slice(0, 600).concat("...");
  return first300;
}

function categoryStatusByReturn(status) {
  switch (status) {
    case 1:
      return "7da3907760f8"; //cinima
    case 2:
      return "d4c7bf55d27e"; // politics
    case 3:
      return "5a32ff5d2353"; // Current Affair
    case 4:
      return "d4c7bf55d27e"; // dummy
    case 5:
      return "fafae78715bc"; // health
    case 6:
      return "3d4071f97189"; //sports
    case 7:
      return "b59918d8f812"; //Special Story
    case 8:
      return "d4c7bf55d27e"; // dummy
    case 9:
      return "d4c7bf55d27e"; // dummy
    case 10:
      return "d4c7bf55d27e"; // dummy
    case 11:
      return "90bb5b2019b2"; // business
    case 12:
      return "d4c7bf55d27e"; // dummy
    case 13:
      return "d4c7bf55d27e"; // dummy
    case 14:
      return "d4c7bf55d27e"; // dummy
    case 15:
      return "7ea1a0ba23e5"; // crime
    case 16:
      return "495d486fc896"; // tamil nadu
    case 17:
      return "d4c7bf55d27e"; //Dont know category
    case 18:
      return "9c5403191856"; // national
    case 19:
      return "33ac01eb34b4"; // world
    case 20:
      return "0f3e9af68c87"; // Astrology
    case 21:
      return "07eda33b2eaa"; // Spirituality
    case 22:
      return "d94952816ba7"; // Weather

    default:
      return "All";
  }
}

export async function POST(request) {
  const { body } = await request.json();

  const bodySort = json_sorter(body);

  try {
    await connectMongoDB();
    const verified = verifyAccessToken();
    if (verified.success) {
      // try{

      var dummyArray = [];
      var pushData;

      body.map(async (item) => {
        const fileName = `${Date.now().toString()}`;
        const returnRedults = await imageCloudUpload(
          `https://newsmalyalam.com/${item.image_big}`,
          fileName.toString()
        );
        pushData = {
          Id: "",
          story_id: create_UUID(),
          story_title_name: `${item.title}`,
          story_sub_title_name: ` ${
            item.content ? removeTags(item.content) : item.title
          }`,
          story_english_name: `${item.summary}`,
          story_sub_english_name: `${item.summary}`,
          story_desk_created_name: `tamil nadu/${item.title_slug}`,
          article_template_id: "",
          story_summary_snippet: "",
          main_category_id: categoryStatusByReturn(item.category_id),
          country_id: "101",
          state_id: "4035",
          city_id: "131517",
          reviwer_id: "",
          story_cover_image_url: returnRedults.original_img,
          story_thumb_image_url: returnRedults.resizeSmall_img,
          live_image_auto_crop: returnRedults.autocrop_img,
          live_image_slider: returnRedults.resizeSlider_img,
          live_image_mid: returnRedults.resizeMid_img,
          live_image_small: returnRedults.resizeSmall_img,
          story_video_type: "",
          news_image_caption: "news caption",
          story_details: `${item.content}`,
          story_published_options: [],
          seo_keywords: [item.keywords],
          seo_tag: [
            "Pudukottai district",
            " DMK",
            " water pandal",
            "  Kerala Law Minister",
            " CCTV footage",
            " district councilor",
            " internal dispute",
          ],
          story_author_block: 0,
          story_credit_name: [
            {
              story_credit: "",
              story_name: "",
            },
          ],
          story_video_url: "",
          min_read_display: 2,
          story_live_article: 0,
          story_paid_content: 0,
          c_save_type: "published",
          trending_news: randomNumber(0, 1),
          flash_news: randomNumber(0, 1),
          n_status: item.status,
          n_published: 1,
          live_title_slug: item.title_slug,
          live_id: item.id,
          live_lang_id: item.lang_id,
          live_category_id: item.category_id,
          live_image_mime: item.image_mime,
          live_image_storage: item.image_storage,
          live_pageviews: item.pageviews,
          live_need_auth: item.need_auth,
          live_is_slider: item.is_slider,
          live_slider_order: item.slider_order,
          live_is_featured: item.is_featured,
          live_featured_order: item.featured_order,
          live_is_recommended: item.is_recommended,
          live_is_breaking: item.is_breaking,
          live_is_scheduled: item.is_scheduled,
          live_visibility: item.visibility,
          live_show_right_column: item.show_right_column,
          live_post_type: item.post_type,
          live_video_storage: item.video_storage,
          live_user_id: item.user_id,
          live_status: item.status,
          live_show_post_url: item.show_post_url,
          live_show_item_numbers: item.show_item_numbers,
          live_is_poll_public: item.is_poll_public,
          created_at: new Date(item.created_at),
          // createdAt: new Date(item.created_at),
          // updatedAt: new Date(item.created_at),
          
          c_createdBy: verified.data.user_id,
        };
        dummyArray.push(pushData);
      });

      setTimeout(() => {
        if(dummyArray.length > 0) {
           Story.insertMany(dummyArray)
            .then(() => {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "New Stories added";
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = [];
            })
            .catch((err) => {
              sendResponse["appStatusCode"] = 4;
              sendResponse["message"] = "";
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = err;
            });

        } else {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = "New Stories Not added";
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = [];
        }
      }, 42000);

     

      return NextResponse.json(sendResponse, { status: 200 });

      await Story.insertMany(dummyArray)
        .then(() => {
          sendResponse["appStatusCode"] = 0;
          sendResponse["message"] = "New Stories added";
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = [];
        })
        .catch((err) => {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = "";
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = err;
        });

      return NextResponse.json(sendResponse, { status: 200 });
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

  //   try {
  //     await connectMongoDB();
  //     const verified = verifyAccessToken();
  //     if (verified.success) {
  //       if (Id) {
  //         const storyId = await Story.findOne({
  //           _id: Id,
  //         });

  //         if (storyId === null) {
  //           sendResponse["appStatusCode"] = 4;
  //           sendResponse["message"] = [];
  //           sendResponse["payloadJson"] = [];
  //           sendResponse["error"] = "Please enter valid id!";
  //           return NextResponse.json(sendResponse, { status: 200 });
  //         } else {
  //           const body = {
  //             story_title_name: story_title_name,
  //             story_sub_title_name: story_sub_title_name,
  //             story_english_name: story_english_name,
  //             story_sub_english_name: story_sub_english_name,
  //             story_desk_created_name: story_desk_created_name,
  //             article_template_id: article_template_id,
  //             story_summary_snippet: story_summary_snippet,
  //             main_category_id: main_category_id,
  //             sub_category_id: sub_category_id,
  //             country_id: country_id,
  //             state_id: state_id,
  //             city_id: city_id,
  //             reviwer_id: reviwer_id,
  //             story_cover_image_url: story_cover_image_url,
  //             story_thumb_image_url: story_thumb_image_url,
  //             story_video_type: story_video_type,
  //             story_video_url: story_video_url,
  //             news_image_caption: news_image_caption,
  //             seo_tag: seo_tag,
  //             seo_keywords: seo_keywords,
  //             story_author_block: story_author_block,
  //             story_credit_name: story_credit_name,
  //             story_details: story_details,
  //             story_live_article: story_live_article,
  //             story_paid_content: story_paid_content,
  //             story_published_options: story_published_options,
  //             c_schedule_date: c_schedule_date,
  //             c_schedule_Time: c_schedule_Time,
  //             c_save_type:c_save_type,
  //             trending_news: trending_news,
  //             flash_news: flash_news,
  //             c_updatedBy: verified.data.user_id,
  //             n_status: n_status,
  //           };

  //           await Story.findByIdAndUpdate(Id, body)
  //             .then(() => {
  //               sendResponse["appStatusCode"] = 0;
  //               sendResponse["message"] = "Updated Successfully!";
  //               sendResponse["payloadJson"] = [];
  //               sendResponse["error"] = [];
  //             })
  //             .catch((err) => {
  //               sendResponse["appStatusCode"] = 4;
  //               sendResponse["message"] = "Invalid Id";
  //               sendResponse["payloadJson"] = [];
  //               sendResponse["error"] = err;
  //             });

  //           return NextResponse.json(sendResponse, { status: 200 });
  //         }
  //       } else {
  //         const storyTilteName = await Story.findOne({
  //           story_title_name: story_title_name,
  //         });

  //         if (story_title_name === "") {
  //           sendResponse["appStatusCode"] = 4;
  //           sendResponse["message"] = [];
  //           sendResponse["payloadJson"] = [];
  //           sendResponse["error"] = "Please enter story title name!";
  //           return NextResponse.json(sendResponse, { status: 200 });
  //         } else if (storyTilteName) {
  //           sendResponse["appStatusCode"] = 4;
  //           sendResponse["message"] = [];
  //           sendResponse["payloadJson"] = [];
  //           sendResponse["error"] = "Story already exist";
  //           return NextResponse.json(sendResponse, { status: 200 });
  //         } else {
  //           let storyData = new Story({
  //             story_title_name,
  //             story_id: create_UUID(),
  //             story_sub_title_name,
  //             story_english_name,
  //             story_sub_english_name,
  //             story_desk_created_name,
  //             article_template_id,
  //             story_summary_snippet,
  //             main_category_id,
  //             sub_category_id,
  //             country_id,
  //             state_id,
  //             city_id,
  //             reviwer_id,
  //             story_cover_image_url,
  //             story_thumb_image_url,
  //             story_video_type,
  //             story_video_url,
  //             news_image_caption,
  //             seo_tag,
  //             seo_keywords,
  //             story_author_block,
  //             story_live_article,
  //             story_paid_content,
  //             story_credit_name,
  //             story_details,
  //             story_published_options,
  //             c_schedule_date,
  //             c_schedule_Time,
  //             c_save_type,
  //             trending_news,
  //             flash_news,
  //             c_createdBy: verified.data.user_id,
  //           });

  //           await storyData
  //             .save()
  //             .then(() => {
  //               sendResponse["appStatusCode"] = 0;
  //               sendResponse["message"] = "New Story added Successfully!";
  //               sendResponse["payloadJson"] = [];
  //               sendResponse["error"] = [];
  //             })
  //             .catch((err) => {
  //               sendResponse["appStatusCode"] = 4;
  //               sendResponse["message"] = "";
  //               sendResponse["payloadJson"] = [];
  //               sendResponse["error"] = err;
  //             });
  //         }
  //         return NextResponse.json(sendResponse, { status: 200 });
  //       }

  //     } else {
  //       sendResponse["appStatusCode"] = 4;
  //       sendResponse["message"] = "";
  //       sendResponse["payloadJson"] = [];
  //       sendResponse["error"] = verified.error;
  //       return NextResponse.json(sendResponse, { status: 400 });
  //     }
  //   } catch (err) {
  //     sendResponse["appStatusCode"] = 4;
  //     sendResponse["message"] = "";
  //     sendResponse["payloadJson"] = [];
  //     sendResponse["error"] = "Something went wrong!";
  //     return NextResponse.json(sendResponse, { status: 400 });
  //   }
}
