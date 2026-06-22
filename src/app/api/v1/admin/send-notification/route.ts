import admin from "firebase-admin";
import { NextRequest, NextResponse } from "next/server";
import { FcmDeviceToken } from "@/models/fcmDeviceTokenModel";
import connectMongoDB from "@/libs/mongodb";

if (!admin.apps.length) {
  const serviceAccount = require("@/service_key.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const BATCH_SIZE = 500;

const sendNotifications = async (registrationTokens: string[], messagePayload: any) => {
  const tokensToDelete: string[] = [];

  for (let i = 0; i < registrationTokens.length; i += BATCH_SIZE) {
    const batch = registrationTokens.slice(i, i + BATCH_SIZE);
    try {
      const response = await admin.messaging().sendEachForMulticast({
        tokens: batch,
        notification: messagePayload.notification,
        android: messagePayload.android,
        webpush: messagePayload.webpush,
      });

      response.responses.forEach((res: any, index: number) => {
        if (!res.success) {
          const token = batch[index];
          const errorCode = res.error?.code;

          if (
            errorCode === "messaging/registration-token-not-registered" ||
            errorCode === "messaging/mismatched-credential" ||
            res.error?.message?.includes("SenderId mismatch")
          ) {
            // Mark for deletion from MongoDB
            tokensToDelete.push(token);
          } else {
            console.error(`Failed to send to token ${token}:`, res.error?.message);
          }
        }
      });

      // Delete all bad tokens from MongoDB in one query
      if (tokensToDelete.length > 0) {
        await FcmDeviceToken.deleteMany({ c_fcm_device_token: { $in: tokensToDelete } });
        console.log(`Deleted ${tokensToDelete.length} invalid tokens from DB`);
      }

      return response;
    } catch (error) {
      console.error("Error sending batch notifications:", error);
      throw error;
    }
  }
};

export async function POST(request: NextRequest) {
  // Bug fix: sendResponse must be inside the handler, not module-level
  const sendResponse: any = {
    appStatusCode: "",
    message: "",
    payloadJson: [],
    error: "",
  };

  try {
    const { tokens, title, message, link, icon, c_type } = await request.json();

    const messagePayload = {
      notification: { title, body: message, imageUrl: icon },
      android: {
        data: { title, body: message, imageUrl: icon, link },
      },
      webpush: link ? { fcmOptions: { link } } : undefined,
    };

    if (c_type === "web" || c_type === "mobile") {
      await connectMongoDB();
      const result = await FcmDeviceToken.find({ c_fcm_device_type: c_type });
      const registrationTokens = result.map((d: any) => d.c_fcm_device_token);

      if (registrationTokens.length === 0) {
        sendResponse["appStatusCode"] = 4;
        sendResponse["error"] = "No registration tokens found";
        return NextResponse.json(sendResponse, { status: 200 });
      }

      const resultData: any = await sendNotifications(registrationTokens, messagePayload);

      if (resultData?.responses?.[0]?.success) {
        sendResponse["appStatusCode"] = 0;
        sendResponse["message"] = "Notification sent successfully!";
        sendResponse["payloadJson"] = resultData;
      } else {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "Notification send failure!";
        sendResponse["payloadJson"] = resultData;
        return NextResponse.json(sendResponse, { status: 400 });
      }
    }

    return NextResponse.json(sendResponse, { status: 200 });
  } catch (error) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = "Notification send failure!";
    sendResponse["error"] = error;
    return NextResponse.json(sendResponse, { status: 400 });
  }
}