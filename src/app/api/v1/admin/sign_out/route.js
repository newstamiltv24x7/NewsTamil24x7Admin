import { cookies } from "next/headers";
import { NextResponse } from "next/server";

let sendResponse = {
    appStatusCode: "",
    message: "",
    payloadJson: [],
    error: "",
  };
  
  export async function POST(request) {
    const { token} = await request.json();

   
    try {
        // token = token.filter((token) =>{
        //  return token.token !== token 
        // })
        cookies(token,null,{
            expires: new Date(Date.now())
        })

        sendResponse["appStatusCode"] = 0;
        sendResponse["message"] = `logout successfully`;
        sendResponse["error"] = "";
        sendResponse["payloadJson"] = [];
        return NextResponse.json(sendResponse, { status: 200 });
       
    } catch (error) {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = `logout successfully`;
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Something went wrong!";
        return NextResponse.json(sendResponse, { status: 400 });
    }

  }