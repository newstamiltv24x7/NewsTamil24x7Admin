import { NextResponse } from "next/server";
import { Story } from "../../../../../../models/storyModel";
import connectMongoDB from "../../../../../../libs/mongodb";
import { verifyAccessToken } from "@/helper/helper";
import { create_UUID, transporter } from "../../../../../../helper/helper";
import path from "path"

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};


const keyFile = path.join(process.cwd(), 'news-tamil-434706-p6-e3998b8efde6.json');

// Scopes required for the Indexing API
const scopes = ['https://www.googleapis.com/auth/indexing'];

// URL for the Indexing API
const apiUrl = 'https://indexing.googleapis.com/v3/urlNotifications:publish';

async function getAccessToken() {
  const auth = new GoogleAuth({
    keyFile: keyFile,
    scopes: scopes,
  });

  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();
  return accessToken.token;
}

async function publishUrlNotification(url, type) {
  try {
    const accessToken = await getAccessToken();
  
    const response = await axios.post(apiUrl, {
      url: url,
      type: type,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  
  
    
  } catch (error) {
    console.error('Error publishing URL notification:', error.response ? error.response.data : error.message);
  }
  }

function emailSend(mailData) {
  return new Promise(async (resolve, reject) => {
    await transporter.sendMail(mailData, function async(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

export async function POST(request) {
  const {
    story_subject_name,
    story_title_name,
    story_sub_title_name,
    story_english_name,
    story_sub_english_name,
    story_desk_created_name,
    article_template_id,
    story_summary_snippet,
    main_category_id,
    sub_category_id,
    country_id,
    state_id,
    city_id,
    reviwer_id,
    story_cover_image_url,
    story_thumb_image_url,
    story_video_type,
    story_video_url,
    news_image_caption,
    seo_tag,
    seo_keywords,
    story_author_block,
    story_credit_name,
    story_details,
    blurb_title,
    blurb_content,
    story_asked_title,
    story_asked_quotes_content,
    story_asked_quotes_author,
    story_asked_question,
    story_live_article,
    story_paid_content,
    story_published_options,
    c_schedule_date,
    c_schedule_Time,
    c_save_type,
    trending_news,
    flash_news,
    Id,
    n_status,
    twitter_embed_id,
    youtube_embed_id,
    facebook_embed_id,
    instagram_embed_id,
    threads_embed_id,
    c_createdBy,
    pair_id,
    post_status,
    replaced_url,
    pin_status,
    live_status,
    view_count
  } = await request.json();

  try {
    await connectMongoDB();
    const verified = verifyAccessToken();
    if (verified.success) {
      if (Id) {
        const storyId = await Story.findOne({
          _id: Id,
        });

        if (storyId === null) {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter valid id!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else {
          const lastID = await Story.findOne().sort({ n_story_order: -1 });
          const lastLiveID = await Story.findOne().sort({ live_id: -1});
          const body = {
            story_subject_name: story_subject_name,
            story_title_name: story_title_name,
            story_sub_title_name: story_sub_title_name,
            story_english_name: story_english_name,
            story_sub_english_name: story_sub_english_name,
            story_desk_created_name: story_desk_created_name,
            article_template_id: article_template_id,
            story_summary_snippet: story_summary_snippet,
            main_category_id: main_category_id,
            sub_category_id: sub_category_id,
            country_id: country_id,
            state_id: state_id,
            city_id: city_id,
            reviwer_id: reviwer_id,
            story_cover_image_url: story_cover_image_url,
            story_thumb_image_url: story_thumb_image_url,
            story_video_type: story_video_type,
            story_video_url: story_video_url,
            news_image_caption: news_image_caption,
            seo_tag: seo_tag,
            seo_keywords: seo_keywords,
            story_author_block: story_author_block,
            story_credit_name: story_credit_name,
            story_details: story_details,
            blurb_title: blurb_title,
            blurb_content: blurb_content,
            story_asked_title: story_asked_title,
            story_asked_quotes_content: story_asked_quotes_content,
            story_asked_quotes_author: story_asked_quotes_author,
            story_asked_question: story_asked_question,
            story_live_article: story_live_article,
            story_paid_content: story_paid_content,
            story_published_options: story_published_options,
            c_schedule_date: c_schedule_date,
            c_schedule_Time: c_schedule_Time,
            c_save_type: c_save_type,
            trending_news: trending_news,
            flash_news: flash_news,
            c_updatedBy: verified.data.user_id,
            n_status: n_status,
            twitter_embed_id: twitter_embed_id,
            youtube_embed_id: youtube_embed_id,
            facebook_embed_id: facebook_embed_id,
            instagram_embed_id: instagram_embed_id,
            threads_embed_id: threads_embed_id,
            pair_id:pair_id,
            post_status:post_status,
            replaced_url:replaced_url,
            n_story_order: c_save_type === "Submit for Review" ? lastID.n_story_order+1 : lastID ? lastID.n_story_order : 1,
            // author_desk:verified.data.user_id,
            c_createdBy:
              c_createdBy === "" ? verified.data.user_id : c_createdBy,
            pin_status:pin_status,
            live_status:live_status,
            view_count: view_count
          };



          // let mailData = {
          //   from: "no-reply@datasense.in", // sender address
          //   to: `${c_subscriber_email}`, // list of receivers
          //   subject: "Verified Email News Tamil 24 X 7",
          //   text: "Verified Email",
          //   html: ``,
          // };

          // mailData["html"] = `
          //   <b>Hai ${c_subscriber_email},</b>
          //   <h4>Click on the below link to verify your email!</h4>
          //   <br/>
          //   <a href="${c_redirect}/verified?${encryptedToken}">
          //   <button> Verify Email</button>
          //   </a>
          //   </br>
          //   <h5><b>Thank You for subscribe, </b> <br /> News Tamil 24 X 7</h5>
          // `;

          // const result = emailSend(mailData);





          await Story.findByIdAndUpdate(Id, body)
            .then(() => {
              const url = `${process.env.NEXT_PUBLIC_BASE_URL}article/${body.story_desk_created_name}`
              const type = "URL_UPDATED";
              if(body.c_save_type === "published" && process.env.NEXT_PUBLIC_SERVER === "Live"){
                publishUrlNotification(url,type)
              }
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "Updated Successfully!";
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = [];
            })
            .catch((err) => {
              sendResponse["appStatusCode"] = 4;
              sendResponse["message"] = "Invalid Id";
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = err;
            });


          return NextResponse.json(sendResponse, { status: 200 });
        }
      } else {
        const lastID = await Story.findOne().sort({ n_story_order: -1});
        const lastLiveID = await Story.findOne().sort({ live_id: -1});


        if(pair_id !== "" && post_status === 2){
          const findPairId = await Story.findOne({pair_id: pair_id});
          if(findPairId !== null){
          sendResponse["appStatusCode"] = 5;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please Check Review Page";
          return NextResponse.json(sendResponse, { status: 200 });
          }

         
          
        }
        if (story_subject_name === "") {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter story subject name";
        } else if (story_title_name === "") {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter story title name";
          return NextResponse.json(sendResponse, { status: 200 });
        } 
        // else if (storyTilteName) {
        //   sendResponse["appStatusCode"] = 4;
        //   sendResponse["message"] = [];
        //   sendResponse["payloadJson"] = [];
        //   sendResponse["error"] = "Story already exist";
        //   return NextResponse.json(sendResponse, { status: 200 });
        // } 
        else {
          let storyData = new Story({
            story_subject_name,
            story_title_name,
            story_id: create_UUID(),
            story_sub_title_name,
            story_english_name,
            story_sub_english_name,
            story_desk_created_name,
            article_template_id,
            story_summary_snippet,
            main_category_id,
            sub_category_id,
            country_id,
            state_id,
            city_id,
            reviwer_id,
            story_cover_image_url,
            story_thumb_image_url,
            story_video_type,
            story_video_url,
            news_image_caption,
            seo_tag,
            seo_keywords,
            story_author_block,
            story_live_article,
            story_paid_content,
            story_credit_name,
            story_details,
            blurb_title,
            blurb_content,
            story_asked_title,
            story_asked_quotes_content,
            story_asked_quotes_author,
            story_asked_question,
            story_published_options,
            c_schedule_date,
            c_schedule_Time,
            c_save_type,
            trending_news,
            flash_news,
            live_id: lastLiveID ? lastLiveID.live_id + 1 : 1,
            twitter_embed_id,
            youtube_embed_id,
            facebook_embed_id,
            instagram_embed_id,
            threads_embed_id,
            n_story_order: lastID ? lastID.n_story_order + 1 : 1,
            c_createdBy:
              c_createdBy === "" ? verified.data.user_id : c_createdBy,
            author_desk: verified.data.user_id,
            pair_id,
            post_status,
            replaced_url,
            pin_status:0,
            live_status,
            view_count: view_count
          });
          
          


          // const emailBody = {
          //   story_title_name : body.story_title_name,
          //   story_sub_title_name : body.story_sub_title_name,
          //   story_cover_image_url : body.story_cover_image_url,
          // }
          
          
            // sendEmailNotification(emailBody)


          await storyData.save().then(() => {

            const url = `${process.env.NEXT_PUBLIC_BASE_URL}article/${storyData.story_desk_created_name}`
            const type = "URL_UPDATED";
            if(storyData.c_save_type === "published" && process.env.NEXT_PUBLIC_SERVER === "Live"){
              publishUrlNotification(url,type)
            }
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "New Story added Successfully!";
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = [];
            })
            .catch((err) => {
              sendResponse["appStatusCode"] = 4;
              sendResponse["message"] = "";
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = err;
            });
        }
        return NextResponse.json(sendResponse, { status: 200 });
      }
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
}
