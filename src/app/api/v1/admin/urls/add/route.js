import { NextResponse } from "next/server";
import { YouTubeURL } from "../../../../../../models/youTubeURLModel";
import connectMongoDB from "../../../../../../libs/mongodb";
import { verifyAccessToken } from "@/helper/helper";
import { create_UUID } from "../../../../../../helper/helper";
import slugify from "slugify";
import { getTranslateApi } from "@/apiFunctions/ApiAction";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const { c_live_stream_category_id,c_url_subject,c_url_title,c_url_content, c_url_link,c_url_web_link, c_thumbanail_image, Id, n_status,c_video_type,c_youtube_type,c_createdBy,c_slug_url } = await request.json();

  try {
    await connectMongoDB();
    const verified = verifyAccessToken();

    if (verified.success) {
      if (Id) {
        const youtubeurlId = await YouTubeURL.findOne({
          _id: Id,
        });

        if (youtubeurlId === null) {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter valid id!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else {


          const convertResult = await getTranslateApi(c_url_title);
          const convertedLength = convertResult?.length;
          const slugString = convertResult?.flat(convertedLength)?.at(0).replace(/[^\w\s]|_/g, "");
          const slug_name = slugify(slugString, {
            replacement: "-",
            remove: undefined,
            lower: true,
            strict: false,
            locale: "vi",
            trim: true,
          });


          const body = {
            c_live_stream_category_id:c_live_stream_category_id,
            c_url_subject: c_url_subject,
            c_url_title: c_url_title,
            c_url_content: c_url_content,
            c_url_link:c_url_link,
            c_url_web_link:c_url_web_link,
            c_thumbanail_image:c_thumbanail_image,
            c_video_type: c_video_type === "" ? "posted" : c_video_type, 
            c_youtube_type: c_youtube_type === "" ? "video" : c_youtube_type,
            c_createdBy: verified.data.user_id,
            c_slug_url: slug_name,
            c_updatedBy: verified.data.user_id,
            n_status: n_status,
          };


          await YouTubeURL.findByIdAndUpdate(Id, body)
            .then(() => {
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

        
        const urltitleData = await YouTubeURL.findOne({
          c_url_title: c_url_title,
        });



        const result = await YouTubeURL.find().sort({ _id: -1 }).limit(1);
        

        if (urltitleData !== null) {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "This Title already exist";
          return NextResponse.json(sendResponse, { status: 200 });
        } else if (c_url_title === "") {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter url title name!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else if (c_url_subject === "") {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter subject!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else {


          const convertResult = await getTranslateApi(c_url_title);
          const convertedLength = convertResult?.length;
          const slugString = convertResult?.flat(convertedLength)?.at(0).replace(/[^\w\s]|_/g, "");
          const slug_name = slugify(slugString, {
            replacement: "-",
            remove: undefined,
            lower: true,
            strict: false,
            locale: "vi",
            trim: true,
          });

          let urlData = new YouTubeURL({
            c_live_stream_category_id,
            c_url_subject,
            c_url_title,
            c_url_content,
            c_url_id: create_UUID(),
            c_slug_url: slug_name,
            c_url_link: c_url_link,
            c_url_web_link:c_url_web_link,
            c_video_type: c_video_type === "" ? "posted" : c_video_type,
            c_youtube_type: c_youtube_type === "" ? "video" : c_youtube_type,
            c_thumbanail_image:c_thumbanail_image,
            c_createdBy: verified.data.user_id,
          });

          if(result.length === 0){
            urlData.c_url_order_id = 1
          }else{
            urlData.c_url_order_id = result[0].c_url_order_id + 1;
          }
          await urlData.save().then(() => {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "Added Successfully!";
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
