import { NextResponse } from "next/server";
import { User } from "../../../../../../models/userModel";
import connectMongoDB from "../../../../../../libs/mongodb";
import {create_UUID} from "../../../../../../helper/helper"
import slugify from "slugify";
const bcrypt = require("bcryptjs");

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const { first_name, last_name, email, role, c_role_id, c_user_img_url,c_about_user } = await request.json();

  let password = "Admin@1234";
  
  try {
    await connectMongoDB();

   
    const checkUserEmail = await User.findOne({
      email: email,
    });
   
    

  
    if(email === ""){
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = [];
      sendResponse["payloadJson"] = [];
      sendResponse["error"] =
      "Email num is required";
      
    }
    else if (checkUserEmail) {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = [];
      sendResponse["payloadJson"] = [];
      sendResponse["error"] =
        "Please check. user email already exist";
      
    }  
    
    else {

      const hashPass = await bcrypt.hash(password, 10);
      const user_name = first_name + " " + last_name;

      const slugString = user_name.replace(/[^\w\s]|_/g, "");
      const slug_name = slugify(slugString, {
        replacement: "-",
        remove: undefined,
        lower: true,
        strict: false,
        locale: "vi",
        trim: true,
      });

      

      const userdata = new User({
        user_id: create_UUID(),
        first_name,
        last_name,
        user_name,
        email,
        role,
        c_role_id, 
        c_user_img_url,
        c_about_user,
        slug_name,
        password: hashPass,
      });
      await userdata.save().then((result) => {
        sendResponse["appStatusCode"] = 0;
        sendResponse["message"] = "User added Successfully";
        sendResponse["payloadJson"] = result;
        sendResponse["error"] = [];
      });
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
