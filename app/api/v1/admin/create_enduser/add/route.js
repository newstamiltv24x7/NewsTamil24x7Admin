import { NextResponse } from "next/server";
import { EndUser } from "../../../../../../models/endUserModel";
import connectMongoDB from "../../../../../../libs/mongodb";
import {create_UUID} from "../../../../../../helper/helper"
const bcrypt = require("bcryptjs");

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const { first_name, last_name, d_o_b, email, mobile, password, c_password, c_user_img_url,c_about_user } =
    await request.json();

 const role = "user"
  try {
    await connectMongoDB();

    

    const hashPass = await bcrypt.hash(password, 10);
    
    const user_name = first_name + " " + last_name;
  
    const checkMobile = await EndUser.findOne({
      mobile: mobile,
    });

    const checkUserEmail = await EndUser.findOne({
      email: email,
    });

    

    if(password !== c_password){
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "Password not matched";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = [];
    }else if(checkUserEmail !== null){
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "Already added this email";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = [];
    }else if(checkMobile !== null){
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "Already added this mobile number";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = [];
    }
    
    else if(checkUserEmail === null && checkUserEmail === null){
      const userdata = new EndUser({
      user_id: create_UUID(),
      first_name,
      last_name,
      user_name,
      d_o_b,
      email,
      mobile,
      role,
      c_user_img_url,
      c_about_user,
      password: hashPass,
      c_password
    });
    await userdata.save().then((result) => {
      if(result){
        sendResponse["appStatusCode"] = 0;
        sendResponse["message"] = "User added Successfully";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = [];
      }else{
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "User Not added";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = error;
      }

    });
    }else{
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "This User already added!!";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = [];
    }


    

    return NextResponse.json(sendResponse, { status: 200 });

    
    

    const text = mobile.toString();

    const firstLetter = text.charAt(0);
    if(mobile === ""){
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = [];
      sendResponse["payloadJson"] = [];
      sendResponse["error"] =
        "Mobile num is required";
      
    }else if (firstLetter <= "5") {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = [];
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Invalid Mobile Numbers";
      
    } else if (mobile.toString().length !== 10) {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = [];
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Please Enter Valid Mobile Number";
      
    }
    else if(email === ""){
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = [];
      sendResponse["payloadJson"] = [];
      sendResponse["error"] =
      "Email num is required";
      
    }
    else if (checkMobile || checkUserEmail) {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = [];
      sendResponse["payloadJson"] = [];
      sendResponse["error"] =
        "Please check. mobile or user email already exist";
      
    }  else {

     





      

    }
    return NextResponse.json(sendResponse, { status: 200 });
  } catch (err) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = err;
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "Something went wrong!!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
