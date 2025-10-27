import admin from "firebase-admin";
import { Message } from "firebase-admin/messaging";
import { NextRequest, NextResponse } from "next/server";
import { FcmDeviceToken } from "@/models/fcmDeviceTokenModel";
import connectMongoDB from "@/libs/mongodb";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = require("@/service_key.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}


let sendResponse: any = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};









export async function POST(request: NextRequest) {
  const { tokens, title, message, link, icon, c_type} = await request.json();

  const messages = {
    notification: {
        title: title,
        body: message,
        imageUrl: icon
    },
    android: {
      data: {
        title: title,
        body: message,
        imageUrl: icon,
        link: link,
      },
    },
    webpush: link && {
      fcmOptions: {
        link
      },
    },
};




const sendPushNotifications = async (tokens :any) => {
  const BATCH_SIZE = 500;
  for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
      const batch = tokens.slice(i, i + BATCH_SIZE);
      try {
          // return await sendNotificationToBatch(batch); // Your function to send notification
          return await sendNotificationToBatch(batch); // Your function to send notification
      } catch (error) {
          console.error("Error sending batch:", error);
      }
  }
};
const sendNotificationToBatch =async (registrationTokens :any)=> {
  return await admin.messaging().sendEachForMulticast({ tokens : registrationTokens, notification: messages.notification, android: messages.android });
}

// LATEST MULTIPLE SEND NOTIFICATION

const messagePayload = {
  notification: {
      title: title,
      body: message,
      imageUrl: icon
  },
  android: {
    data: {
      title: title,
      body: message,
      imageUrl: icon,
      link: link,
    },
  },
  webpush: link && {
    fcmOptions: {
      link
    },
  },
};



// Function to send notifications in batches
const sendNotifications = async (registrationTokens:any, messagePayload:any) => {
  const BATCH_SIZE = 500; // FCM's limit
  for (let i = 0; i < registrationTokens.length; i += BATCH_SIZE) {
      const batch = registrationTokens.slice(i, i + BATCH_SIZE);
      try {
          const response = await admin.messaging().sendEachForMulticast({
              tokens: batch,
              notification: messagePayload.notification,
              android: messagePayload.android,
              webpush: messagePayload.webpush,
          });

          // Handle success and failures
          response.responses.forEach((res :any, index :any) => {
              if (!res.success) {
                  const token = batch[index];
                  const errorCode = res.error.code;

                  if (errorCode === "messaging/registration-token-not-registered") {
                      
                      // Remove invalid token from database
                      removeTokenFromDatabase(registrationTokens,token);
                  } else {
                      console.error(`Failed to send to token ${token}:`, res.error.message);
                  }
              }
          });

          
          return response;
      } catch (error) {
          console.error("Error sending batch notifications:", error);
          return error;
      }
  }
};

// Mock function to remove invalid tokens from the database
const removeTokenFromDatabase = (registrationTokens:any,token:any) => {
  const index = registrationTokens.indexOf(token);
  if (index > -1) {
    registrationTokens.splice(index, 1);
      
  }
};

  try {

    if (c_type === "web" || c_type === "mobile") {
      await connectMongoDB();
      await FcmDeviceToken.find({ c_fcm_device_type: c_type }).then(async (result :any) => {
          const registrationTokens :any = [];
          result.map((data :any) => {
            registrationTokens.push(data.c_fcm_device_token);
          });
          if (registrationTokens.length > 0) {
            // const resultData = await sendPushNotifications(registrationTokens);
            const resultData :any =await sendNotifications(registrationTokens, messagePayload);
            if(resultData?.responses[0].success){
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "Notification send successfully!";
              sendResponse["payloadJson"] = resultData;
              sendResponse["error"] = "";
              return NextResponse.json(sendResponse, { status: 200 });
            }else{
              sendResponse["appStatusCode"] = 4;
              sendResponse["message"] = "Notification send failure!";
              sendResponse["payloadJson"] = resultData;
              sendResponse["error"] = "";
              return NextResponse.json(sendResponse, { status: 400 });
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
    }else if(c_type === "web1"){
      await connectMongoDB();
      await FcmDeviceToken.find({ c_fcm_device_token: "dzdzCZLewUjVcSOe4_0yKy:APA91bFH3FQHm9tCSWIhUkfYDKA8peK0FryezWond_t0zIldTAb1TGxwGdT-Ph-7xr4XQiFaMZAA8_wmqvZ_tOQHKH54qaXSCWcVqziPPieyLAlarpIQtLY" }).then(async (result :any) => {
        const registrationTokens :any = [];
        result.map((data :any) => {
          registrationTokens.push(data.c_fcm_device_token);
        });
        if (registrationTokens.length > 0) {
          // const resultData = await sendPushNotifications(registrationTokens);
          const resultData :any =await sendNotifications(registrationTokens, messagePayload);
          
          if(resultData?.responses[0].success){
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "Notification send successfully!";
            sendResponse["payloadJson"] = resultData;
            sendResponse["error"] = "";
            return NextResponse.json(sendResponse, { status: 200 });
          }else{
            sendResponse["appStatusCode"] = 4;
            sendResponse["message"] = "Notification send failure!";
            sendResponse["payloadJson"] = resultData;
            sendResponse["error"] = "";
            return NextResponse.json(sendResponse, { status: 400 });
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
    }else if(c_type === "mobile1"){
      await connectMongoDB();
      await FcmDeviceToken.find({ c_fcm_device_token: "fU4PMxBiKC23OxFw-MSFqA:APA91bH4x2QiSRYIYTeZDFBOFVqDqCD0dZcmUPInaEcQsmbejPn8qvPAxUdsCIOxksVRV_0Xl7W2wLS-k9b7MAAi6s3SfA6nFg1xZYX2J5wYz8-UvJW5Rlg" }).then(async (result :any) => {
        const registrationTokens :any = [];
        result.map((data :any) => {
          registrationTokens.push(data.c_fcm_device_token);
        });
        if (registrationTokens.length > 0) {
          // const resultData = await sendPushNotifications(registrationTokens);
          const resultData :any =await sendNotifications(registrationTokens, messagePayload);
          
          if(resultData?.responses[0].success){
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "Notification send successfully!";
            sendResponse["payloadJson"] = resultData;
            sendResponse["error"] = "";
            return NextResponse.json(sendResponse, { status: 200 });
          }else{
            sendResponse["appStatusCode"] = 4;
            sendResponse["message"] = "Notification send failure!";
            sendResponse["payloadJson"] = resultData;
            sendResponse["error"] = "";
            return NextResponse.json(sendResponse, { status: 400 });
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
    }

    return NextResponse.json(sendResponse, { status: 200 });
  } catch (error) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = "Notification send failure!";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = error;
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
