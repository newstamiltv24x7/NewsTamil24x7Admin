import { NextResponse } from "next/server";
import connectMongoDB from "../../../../../libs/mongodb";
import { verifyAccessToken } from "@/helper/helper";
const { headers } = require("next/headers");

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function GET() {
  try {
    await connectMongoDB();

    const headersList = headers();
    const authToken = headersList.get("authorization");

    if (authToken === null) {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Auth token null";
    } else if (authToken === "") {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Authetication token empty!";
    } else {
      if (authToken.length <= 6) {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = " token is empty!";
      } else {
        const verified = verifyAccessToken();

        // const expDate = (new Date('1970,1,1')).AddSeconds(verified.data.exp);

        // const myDate = new Date((verified.data.iat)*1000);
        // const mytime=myDate.toGMTString()
       

        if(verified.success){
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "success";
            sendResponse["payloadJson"] = verified;
            sendResponse["error"] = "";
        }else{
            sendResponse["appStatusCode"] = 4;
            sendResponse["message"] = "failure";
            sendResponse["payloadJson"] = verified;
            sendResponse["error"] = "Token Expired";    
        }

      }
    }

    return NextResponse.json(sendResponse, { status: 200 });
  } catch (err) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = "";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "Something went wrong!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
