import { NextResponse } from "next/server";
import { Advertisement } from "../../../../../../models/advertisementModel";
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
    c_advt_title,
    c_advt_type,
    c_advt_banner_url,
    c_advt_banner_redirect_url,
    c_banner_start_date,
    c_banner_start_time,
    c_banner_end_date,
    c_banner_end_time,
    c_target_device,
    c_banner_width,
    c_banner_height,
    c_banner_position,
    c_banner_view_pages,
    c_banner_target_country_id,
    c_banner_target_state_id,
    c_banner_target_city_id,
    Id,
    c_advt_google_script,
    n_status,
    n_published,
  } = await request.json();

  const verified = verifyAccessToken();

  if (verified.success) {
    try {
      await connectMongoDB();

      if (Id) {
        const userRoleId = await Advertisement.findOne({
          _id: Id,
        });

        if (userRoleId === null) {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter valid id!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else {
          const body = {
            c_advt_title: c_advt_title,
            c_advt_type: c_advt_type,
            c_advt_banner_url: c_advt_banner_url,
            c_advt_banner_redirect_url: c_advt_banner_redirect_url,
            c_banner_start_date: new Date(c_banner_start_date).toISOString(),
            c_banner_start_time: c_banner_start_time,
            c_banner_end_date: new Date(c_banner_end_date).toISOString(),
            c_banner_end_time: c_banner_end_time,
            c_target_device: c_target_device,
            c_banner_width: c_banner_width,
            c_banner_height: c_banner_height,
            c_banner_position: c_banner_position,
            c_banner_view_pages: c_banner_view_pages,
            c_banner_target_country_id: c_banner_target_country_id,
            c_banner_target_state_id: c_banner_target_state_id,
            c_banner_target_city_id: c_banner_target_city_id,
            c_updatedBy: verified.data.user_id,
            n_status: n_status,
            n_published: n_published,
          };

          await Advertisement.findByIdAndUpdate(Id, body)
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
        const AdvertisementData = await Advertisement.findOne({
          c_advt_title: c_advt_title,
        });

        if (c_advt_title === "") {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter Advertisement Title!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else if (AdvertisementData) {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = " Advertisement Title already exist";
          return NextResponse.json(sendResponse, { status: 200 });
        } else {
          let addv = new Advertisement({
            c_advt_title,
            c_advt_id: create_UUID(),
            c_advt_type,
            c_advt_banner_url,
            c_advt_banner_redirect_url,
            c_banner_start_date: new Date(c_banner_start_date).toISOString(),
            c_banner_start_time,
            c_banner_end_date: new Date(c_banner_end_date).toISOString(),
            c_banner_end_time,
            c_target_device,
            c_banner_width,
            c_banner_height,
            c_banner_position,
            c_banner_view_pages,
            c_banner_target_country_id,
            c_banner_target_state_id,
            c_banner_target_city_id,
            c_createdBy: verified.data.user_id,
          });

          if (c_advt_google_script) {
            addv.c_advt_google_script = c_advt_google_script;
          }

          await addv
            .save()
            .then(() => {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "Advertisement added Successfully!";
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
