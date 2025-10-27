import { NextResponse } from "next/server";
import { User } from "../../../../../models/userModel";
const { urlEncoder } = require("encryptdecrypt-everytime/src");
import connectMongoDB from "../../../../../libs/mongodb";

import {
  generateAccessTokenForget,
  generateAccessToken,
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
  const { email, c_redirect } = await request.json();

  try {
    await connectMongoDB();
    await User.findOne({
      email: email,
    }).then(async (userData) => {



      
      if(userData) {
        let data = {
          email: userData.email,
          id: userData._id,
        };
        let token = generateAccessTokenForget(data);
        // let token1 = generateAccessToken(data);
        

        const sampleData = [token];
        const secretKey = process.env.ENCY_DECY_SECRET;
        const encryptedToken = urlEncoder(
          secretKey,
          JSON.stringify(sampleData)
        );

        let mailData = {
          from: "no-reply@datasense.in", // sender address
          to: `${email}`, // list of receivers
          subject: "News Tamil 24 X 7 Password Reset",
          text: "Login Credential",
          html: ``,
        };
        mailData["html"] = `
        <b>Hai ${userData.first_name} ${userData.last_name},</b>
        <h4>Click on the below link to reset your password!</h4>
        <br/>
        <h5>${c_redirect}/token?${encryptedToken}</h5>
        </br>
        <h5><b>Thank You, </b> <br /> News Tamil 24 X 7</h5>
      `;

        const result = emailSend(mailData)

        if(result){
          sendResponse["appStatusCode"] = 0;
          sendResponse["message"] = "Email Send Successfully";
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "";
        }else{
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = "";
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = err;
        }
        return NextResponse.json(sendResponse, { status: 200 });
   

       
      } else {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Email is not registered with us!";
      }

      
    });

    return NextResponse.json(sendResponse, { status: 200 });
    
  } catch (err) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = "";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "Something went wrong!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
