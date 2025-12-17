import { NextResponse } from "next/server";
import { SeoContent } from "../../../../../../models/seoContentModel";
import connectMongoDB from "../../../../../../libs/mongodb";
import {
  create_UUID,
  verifyAccessToken,
} from "../../../../../../helper/helper";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const {
    c_seo_category_id,
    c_seo_page_title,
    c_seo_page_description,
    c_seo_page_keywords,
    c_seo_social_image_sharing,
    c_seo_scripts,
    n_status,
    n_published,
    c_seo_content_id
  } = await request.json();



  const verified = verifyAccessToken();

 
  if (verified.success) {
    try {
      await connectMongoDB();

      if (c_seo_content_id !== "") {
        const userRoleId = await SeoContent.findOne({
          c_seo_content_id: c_seo_content_id,
        });
        
        if (userRoleId === null) {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter valid id!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else {
          const body = {
            c_seo_category_id: c_seo_category_id,
            c_seo_page_title: c_seo_page_title,
            c_seo_page_description: c_seo_page_description,
            c_seo_page_keywords: c_seo_page_keywords,
            c_seo_social_image_sharing: c_seo_social_image_sharing,
            c_seo_scripts: c_seo_scripts,
            c_updatedBy: verified.data.user_id,
            n_status: n_status,
            n_published: n_published,
          };
          
         const Id = userRoleId._id.toString()

          await SeoContent.findByIdAndUpdate(Id, body)
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

        
        const SeoContentData = await SeoContent.findOne({
          c_seo_category_id: c_seo_category_id,
        });
        
        if (c_seo_category_id === "") {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter Seo Category title!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else if (SeoContentData !== null) {



          await SeoContent.findOneAndUpdate(
            {_id: SeoContentData._id },
            {
              $set: {
                c_seo_content_id: SeoContentData.c_seo_content_id,
                c_seo_page_title,
                c_seo_page_description,
                c_seo_page_keywords,
                c_seo_social_image_sharing,
                c_seo_scripts,
                n_status: 1,
                n_published: 1,
              },
            }
          )
            .then((data) => {
              
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "Added Successfully!!";
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = [];
            })
            .catch((error) => {
              sendResponse["appStatusCode"] = 4;
              sendResponse["message"] = "";
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = error;
            });

          return NextResponse.json(sendResponse, { status: 200 });
        } else if (SeoContentData === null) {
          let SeoContentData = new SeoContent({
            c_seo_content_id: create_UUID(),
            c_seo_category_id,
            c_seo_page_title,
            c_seo_page_description,
            c_seo_page_keywords,
            c_seo_social_image_sharing,
            c_seo_scripts,
            c_createdBy: verified.data.user_id,
          });

          await SeoContentData.save()
            .then(() => {
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
          return NextResponse.json(sendResponse, { status: 200 });
        }
      }
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
    sendResponse["error"] = "token expired!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
