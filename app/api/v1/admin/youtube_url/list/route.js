import { NextResponse } from "next/server";
import { WebStories } from "../../../../../../models/webStoriesModel";
import connectMongoDB from "../../../../../../libs/mongodb";
import { verifyAccessToken } from "@/helper/helper";

const {google} = require('googleapis');



const callBackFunction = async (blogger,params) => {

    return new Promise((resolve, reject) => {
        blogger.blogs.get(params)
        .then(res => {
            resolve(res)
        
        })
        .catch(error => {
            reject(error)
        //   console.error(error);
        });

    });
  };



let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};






export async function POST() {

  try {
    sendResponse["appStatusCode"] = 0;
    sendResponse["message"] = [];
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "";
    return NextResponse.json(sendResponse, { status: 200 }); 
  } catch (error) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = [];
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "Something went wrong!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}

export async function GET() {
    const blogger = google.blogger({
        version: 'v3',
        auth: 'AIzaSyALZkGxMSsSmIW3lA5j-qUPrq2D24Q_TAg'
      });
      const params = {
        blogId: '3213900'
      };

  try {
    const dataResults =await callBackFunction(blogger,params)
    sendResponse["appStatusCode"] = 0;
    sendResponse["message"] = [];
    sendResponse["payloadJson"] = dataResults;
    sendResponse["error"] = "";
    return NextResponse.json(sendResponse, { status: 200 }); 
  } catch (error) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = [];
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "Something went wrong!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
    
  }
