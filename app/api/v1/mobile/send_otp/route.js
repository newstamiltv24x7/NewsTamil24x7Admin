import { NextResponse } from "next/server";
import { EndUser } from "../../../../../models/endUserModel";
import { OTP } from "../../../../../models/otpModel";
import connectMongoDB from "../../../../../libs/mongodb";
// import {create_UUID } from "../../../../../helper/helper";

import {
  transporter,
} from "../../../../../helper/helper";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

function  emailSend( mailData) {
  return new Promise(async (resolve, reject) => {
    await transporter.sendMail(mailData, function async(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });


  });
}


export async function POST(request) {
  const { email } = await request.json();
  try{
    await connectMongoDB();

    await EndUser.findOne({
      email: email,
    })
      .then(async (data) => {
        if(data){
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = "";
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "This user already registered!";
        
        return NextResponse.json(sendResponse, { status: 200 });
      }else{
        const otpValue = Math.floor(1000 + Math.random() * 9000);
          let mailData = {
              from: "no-reply@info.tamilnews24@gmail.com", // sender address
              to: `${email}`, // list of receivers
              subject: "Email OTP verification from News Tamil 24x7",
              text: "OTP MESSAGE",
              html: ``,
            };
            mailData["html"] = `
            <b>Dear Reader,</b>
            <p>Thanks for registering to <b> https://www.newstamil.tv/ </b></p>
            <p>To activate your account, use the following OTP.</p>
            <h2><b>${otpValue}</b>.</h2> <p>OTP valid only for 5 mins.</p>
            <p>Do not share with anyone.</p>
            <p>Regards, <br /> News Tamil 24x7</p>
          `;
      
            const resultData = emailSend(mailData)
      
            if(resultData){

              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "OTP Send Successfully";
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = "";


              // return NextResponse.json(sendResponse, { status: 200 });

              let otpAdd = new OTP({
                  otp: otpValue,
                  email,
                });

                await otpAdd.save().then(() => {
                  sendResponse["appStatusCode"] = 0;
                  sendResponse["message"] = "OTP Send Successfully";
                  sendResponse["payloadJson"] = [];
                  sendResponse["error"] = [];
                })
                .catch((err) => {
                  sendResponse["appStatusCode"] = 4;
                  sendResponse["message"] = "";
                  sendResponse["payloadJson"] = [];
                  sendResponse["error"] = err;
                });
              return NextResponse.json(sendResponse, { status: 200 });

              
            }else{
              sendResponse["appStatusCode"] = 4;
              sendResponse["message"] = "";
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = err;
              return NextResponse.json(sendResponse, { status: 200 });
            }
            
      }
      })
      .catch((err) => {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = err;
      });




    return NextResponse.json(sendResponse, { status: 200 });
  }catch(err){
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = "";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = err;
    return NextResponse.json(sendResponse, { status: 400 });
  }

  
}
