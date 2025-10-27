import { NextResponse } from "next/server";
import { EndUser } from "../../../../../models/endUserModel";
import connectMongoDB from "../../../../../libs/mongodb";
import {create_UUID, generateAccessToken, getDateTime, encryptCryptoResponse,decrypCryptoRequest} from "../../../../../helper/helper";
const bcrypt = require("bcryptjs");
const { urlEncoder } = require("encryptdecrypt-everytime/src");

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const { first_name, last_name,google_id, email, password, c_password, c_user_img_url } = await request.json();

  

 const role = "user";
 const pass = password === undefined ? "Password@123" : password;
 const c_pass = c_password === undefined ? "Password@123" : c_password;

  if(google_id){

    try {
      await connectMongoDB();
      const hashPass = await bcrypt.hash(pass, 1);
      const user_name = first_name + " " + last_name;
      const userData = await EndUser.findOne({
        email: email,
      });
  
      if(pass !== c_pass){
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "Password not matched";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = [];
      }else if(userData !== null){
  
        const date_time = getDateTime();
        const tokenVerify = generateAccessToken({
          _id: userData._id,
          user_id: userData.user_id,
          email: userData.email,
          date_time: date_time,
        });
        
  
  
        const today = new Date();
        const nextTenDays = new Date(today.getTime());
        nextTenDays.setDate(nextTenDays.getDate() + 1);
        const sampleData = [tokenVerify];
        const secretKey = process.env.ENCY_DECY_SECRET;
        const encryptedResults = urlEncoder(
          secretKey,
          JSON.stringify(sampleData)
        );
  
  
      
  
        if(userData){
          let dataResults = {
            first_name: userData.first_name,
            last_name: userData.last_name,
            user_name: userData.user_name,
            email: userData.email,
            user_id: userData.user_id,
            role: userData.role,
            c_user_img_url:userData.c_user_img_url,
            tokenAccess: encryptedResults,
            tokenExpiry: nextTenDays
          }
  
          const encryptRes = encryptCryptoResponse(dataResults);
          const decryptRes = decrypCryptoRequest(encryptRes);
  
          sendResponse["appStatusCode"] = 0;
          sendResponse["message"] = "login Successfully";
          sendResponse["payloadJson"] = decryptRes;
          sendResponse["error"] = [];
        }else{
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = "User Not added";
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = error;
        }
  
  
        return NextResponse.json(sendResponse, { status: 200 });
  
  
      }
      
      else if(userData === null){
        const userdata = new EndUser({
        user_id: create_UUID(),
        first_name,
        last_name,
        user_name,
        email,
        role,
        c_user_img_url,
        password: hashPass,
        c_password : c_pass,
        google_id
      });
      await userdata.save().then((result) => {
        const date_time = getDateTime();
        const tokenVerify = generateAccessToken({
          _id: result._id,
          user_id: result.user_id,
          email: result.email,
          password: password,
          date_time: date_time,
        });
  
        const today = new Date();
        const nextTenDays = new Date(today.getTime());
        nextTenDays.setDate(nextTenDays.getDate() + 10);
        const sampleData = [tokenVerify];
        const secretKey = process.env.ENCY_DECY_SECRET;
        const encryptedResults = urlEncoder(
          secretKey,
          JSON.stringify(sampleData)
        );
  
        if(result){
          let dataResults = {
            first_name: result.first_name,
            last_name: result.last_name,
            user_name: result.user_name,
            email: result.email,
            user_id: result.user_id,
            role: result.role,
            c_user_img_url:result.c_user_img_url,
            tokenAccess: encryptedResults,
            tokenExpiry: nextTenDays
          }
  
  
  
          const encryptRes = encryptCryptoResponse(dataResults);
          const decryptRes = decrypCryptoRequest(encryptRes);
  
          sendResponse["appStatusCode"] = 0;
          sendResponse["message"] = "User added Successfully";
          sendResponse["payloadJson"] = decryptRes;
          sendResponse["error"] = [];
        }else{
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = "User Not added";
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = error;
        }
        return NextResponse.json(sendResponse, { status: 200 });
  
      });

  
      }else{
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "This User already added!!";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = [];
      }
  
  
      
  
      return NextResponse.json(sendResponse, { status: 200 });
  
      
      
    } catch (err) {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = err;
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Something went wrong!!";
      return NextResponse.json(sendResponse, { status: 400 });
    }
  }else{










    try {
      await connectMongoDB();
      const hashPass = await bcrypt.hash(pass, 1);
      const user_name = first_name + " " + last_name;
      const userData = await EndUser.findOne({
        email: email,
      });
      if(first_name === "" || first_name === null || first_name === undefined){
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "Please enter your first name";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = [];
      }else if(last_name === "" || last_name === null || last_name === undefined){
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "Please enter your last name";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = [];
      }else if(email === "" || email === null || email === undefined){
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "Please enter your valid email";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = [];
      }else if(password === "" || c_password === "" || password === null || c_password === null || password === undefined || c_password === undefined){
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "Please enter your password";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = [];
      }
      else if(password !== c_password){
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "Password not matched";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = [];
      }else if(userData !== null){
  
        const date_time = getDateTime();
        const tokenVerify = generateAccessToken({
          _id: userData._id,
          user_id: userData.user_id,
          email: userData.email,
          date_time: date_time,
        });
        
  
  
        const today = new Date();
        const nextTenDays = new Date(today.getTime());
        nextTenDays.setDate(nextTenDays.getDate() + 1);
        const sampleData = [tokenVerify];
        const secretKey = process.env.ENCY_DECY_SECRET;
        const encryptedResults = urlEncoder(
          secretKey,
          JSON.stringify(sampleData)
        );
  
  
      
  
        if(userData){


          // let dataResults = {
          //   first_name: userData.first_name,
          //   last_name: userData.last_name,
          //   user_name: userData.user_name,
          //   email: userData.email,
          //   user_id: userData.user_id,
          //   role: userData.role,
          //   c_user_img_url:userData.c_user_img_url,
          //   tokenAccess: encryptedResults,
          //   tokenExpiry: nextTenDays
          // }
  
          // const encryptRes = encryptCryptoResponse(dataResults);
          // const decryptRes = decrypCryptoRequest(encryptRes);
  
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = "User Already Exits !";
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "User Already Exits!!!";
        }else{
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = "User Not added";
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = error;
        }
  
  
        return NextResponse.json(sendResponse, { status: 200 });
  
  
      }
      
      else if(userData === null){
        const userdata = new EndUser({
        user_id: create_UUID(),
        first_name,
        last_name,
        user_name,
        email,
        role,
        c_user_img_url,
        password: hashPass,
        c_password : c_pass,
        google_id: ""
      });
      await userdata.save().then((result) => {
        const date_time = getDateTime();
        const tokenVerify = generateAccessToken({
          _id: result._id,
          user_id: result.user_id,
          email: result.email,
          password: password,
          date_time: date_time,
        });
  
        const today = new Date();
        const nextTenDays = new Date(today.getTime());
        nextTenDays.setDate(nextTenDays.getDate() + 10);
        const sampleData = [tokenVerify];
        const secretKey = process.env.ENCY_DECY_SECRET;
        const encryptedResults = urlEncoder(
          secretKey,
          JSON.stringify(sampleData)
        );
  
        if(result){
          let dataResults = {
            first_name: result.first_name,
            last_name: result.last_name,
            user_name: result.user_name,
            email: result.email,
            user_id: result.user_id,
            role: result.role,
            c_user_img_url:result.c_user_img_url,
            tokenAccess: encryptedResults,
            tokenExpiry: nextTenDays
          }
  
  
  
          // const encryptRes = encryptCryptoResponse(dataResults);
          // const decryptRes = decrypCryptoRequest(encryptRes);
  
          sendResponse["appStatusCode"] = 0;
          sendResponse["message"] = "User created Successfully";
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = [];
        }else{
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = "User Not added";
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = error;
        }
        return NextResponse.json(sendResponse, { status: 200 });
  
      });

  
      }else{
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "This User already added!!";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = [];
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





}
