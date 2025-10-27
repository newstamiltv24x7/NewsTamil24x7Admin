import { NextResponse } from "next/server";
import gcm from "node-gcm";
import { FcmDeviceToken } from "../../../../../../models/fcmDeviceTokenModel";
import { Notification } from "../../../../../../models/notificationModel";
import connectMongoDB from "@/libs/mongodb";
import { create_UUID, verifyAccessToken } from "@/helper/helper";


let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};



function sendNotification(message, registrationTokens) {
  const sender = new gcm.Sender(process.env.NEXT_PUBLIC_SENDER_TOKEN);
  return new Promise(async (resolve, reject) => {
    await sender.send(
      message,
      { registrationTokens: registrationTokens },
      function (err, response) {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      }
    );
  });
}




function saveNotification(
  c_title,
  c_content,
  c_img_url,
  c_redirect_id,
  registrationTokens
) {
  return new Promise(async (resolve, reject) => {
    let dummyArray = [];

    registrationTokens.map((data) => {
      dummyArray.push({
        c_device_id: data,
        c_read_status: 1,
      });
    });
    let notificationData = new Notification({
      c_notification_id: create_UUID(),
      c_notification_title: c_title,
      c_notification_content: c_content,
      c_notification_icon: c_img_url,
      c_notification_redirect_url: c_redirect_id,
      c_notification_list: dummyArray,
    });

    await notificationData
      .save()
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export async function POST(request) {
  const {
    c_title,
    c_content,
    c_img_url,
    c_redirect_id,
    story_desk_created_name,
    c_type,
  } = await request.json();

  try {
    const message = new gcm.Message({
      notification: {
        title: c_title,
        icon: c_img_url,
        click_action: c_type === "web" ? story_desk_created_name : c_redirect_id,
        body: c_content,
      },
      data: {
        c_title: c_title,
        c_content: c_content,
        c_img_url: c_img_url,
        c_redirect_id: c_redirect_id,
        story_desk_created_name: story_desk_created_name,
      },
    });

    await connectMongoDB();

    if (c_type === "web" || c_type === "mobile") {
      await FcmDeviceToken.find({ c_fcm_device_type: c_type }).then(
        (result) => {
          

          const registrationTokens = [];
          const registrationDevices = [];

          result.map((data) => {
            registrationTokens.push(data.c_fcm_device_token);
          });
          result.map((data1) => {
            registrationDevices.push(data1.c_fcm_device_id);
          });

          

          // registrationTokens.push(process.env.DEVICE_TOKEN);

          if (registrationTokens.length > 0) {
            const resultdata = sendNotification(message, registrationTokens);

            


            // const resultdata = sendNotification(message);


            const saveresultData = saveNotification(
              c_title,
              c_content,
              c_img_url,
              c_redirect_id,
              registrationDevices
            );
            

            if (resultdata) {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "";
              sendResponse["payloadJson"] = "Notification send successfully!";
              sendResponse["error"] = "";
            } else {
              sendResponse["appStatusCode"] = 4;
              sendResponse["message"] = "";
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = "Notification Not send!";
            }
          } else {
            sendResponse["appStatusCode"] = 4;
            sendResponse["message"] = "";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = "cannot found registration token";
          }

          return NextResponse.json(sendResponse, { status: 200 });
        }
      );
    } else {
      await FcmDeviceToken.find().then((result) => {
        const registrationTokens = [];
        const registrationDevices = [];

        result.map((data) => {
          registrationTokens.push(data.c_fcm_device_token);
        });
        result.map((data1) => {
          registrationDevices.push(data1.c_fcm_device_id);
        });

        // registrationTokens.push(process.env.DEVICE_TOKEN);

        if (registrationTokens.length > 0) {
          const resultdata = sendNotification(message, registrationTokens);
          const saveresultData = saveNotification(
            c_title,
            c_content,
            c_img_url,
            c_redirect_id,
            registrationDevices
          );
          if (resultdata) {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "";
            sendResponse["payloadJson"] =
              "Notification send both successfully!";
            sendResponse["error"] = "";
          } else {
            sendResponse["appStatusCode"] = 4;
            sendResponse["message"] = "";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = "Notification Not send!";
          }
        } else {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = "";
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "cannot found registration token";
        }
      });
    }

    return NextResponse.json(sendResponse, { status: 200 });
  } catch (error) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = [];
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "Something went wrong!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
