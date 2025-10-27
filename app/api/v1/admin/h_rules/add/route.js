import { NextResponse } from "next/server";
import { HRules } from "../../../../../../models/hRulesModel";
import { SocialHandlePage } from "../../../../../../models/socialHandlePageModel";
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
    c_h_rules_name,
    c_h_rules_description,
    c_h_rules_tags,
    c_h_rules_location,
    c_h_rules_other_category,
    c_h_rules_autor,
    c_h_rules_handle_page,
  } = await request.json();




  c_h_rules_handle_page.map(async(data) =>{

    const userRoleId = await SocialHandlePage.findOne({
      c_social_handle_page_id: data?.c_handle_page_id,
    });


    const body = {
      c_social_handle_page_id: data?.c_handle_page_id,
      c_social_handle_page_flag: data?.c_social_handle_page_flag
    };

    await SocialHandlePage.findByIdAndUpdate((userRoleId._id).toString(), body)
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

  })










  const verified = verifyAccessToken();

  if (verified.success) {
    try {
      await connectMongoDB();

      const hRulesData = await HRules.find();
      if (c_h_rules_name.length === 0) {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Please enter trending tag name";
      } else if (hRulesData.length === 0) {
        let HRulesAdd = new HRules({
          c_h_rules_id: create_UUID(),
          c_h_rules_name,
          c_h_rules_description,
          c_h_rules_tags,
          c_h_rules_location,
          c_h_rules_other_category,
          c_h_rules_autor,
          c_h_rules_handle_page,
          c_createdBy: verified.data.user_id,
        });
        await HRulesAdd.save()
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
      } else {
        let checkId = hRulesData[0]._id.toString();

        await HRules.findOneAndUpdate(
          { _id: checkId },
          {
            $set: {
              c_h_rules_name: c_h_rules_name,
              c_h_rules_description: c_h_rules_description,
              c_h_rules_tags: c_h_rules_tags,
              c_h_rules_location: c_h_rules_location,
              c_h_rules_other_category: c_h_rules_other_category,
              c_h_rules_autor: c_h_rules_autor,
              c_h_rules_handle_page: c_h_rules_handle_page,
            },
          }
        )
          .then((data) => {
            if (data) {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "Updated Successfully!";
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = [];
            } else {
              sendResponse["appStatusCode"] = 4;
              sendResponse["message"] = "Not Updated!";
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = [];
            }
          })
          .catch((error) => {
            sendResponse["appStatusCode"] = 4;
            sendResponse["message"] = "";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = error;
          });
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
    sendResponse["error"] = "token expired!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
