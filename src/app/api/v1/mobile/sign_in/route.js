import { NextResponse } from "next/server";
import { EndUser } from "../../../../../models/endUserModel";
import { Consolelog } from "../../../../../models/consoleModel";
import connectMongoDB from "../../../../../libs/mongodb";
import { generateAccessToken, getDateTime } from "../../../../../helper/helper";
const { urlEncoder } = require("encryptdecrypt-everytime/src");
const bcrypt = require("bcryptjs");

import {
  encryptCryptoResponse,
  decrypCryptoRequest,
} from "../../../../../helper/helper";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const { email, password } = await request.json();

  try {
    await connectMongoDB();

    if (email && password) {
      await EndUser.findOne({
        email: email,
      })
        .then(async (data) => {
            await bcrypt
            .compare(password, data.password)
            .then((response) => {
              if (response) {
                const date_time = getDateTime();
                const tokenVerify = generateAccessToken({
                  _id: data._id,
                  user_id: data.user_id,
                  email: data.email,
                  mobile: data.mobile,
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

                if (data.user_id) {
                  let dataResults = {
                    first_name: data.first_name,
                    last_name: data.last_name,
                    user_name: data.user_name,
                    c_about_user: data.c_about_user,
                    mobile: data.mobile,
                    email: data.email,
                    user_id: data.user_id,
                    role: data.role,
                    tokenAccess: encryptedResults,
                    tokenExpiry: nextTenDays,
                  };

                  const consolelogdata = new Consolelog({
                    user_id: data._id,
                    user_name: data.user_name,
                    email: data.email,
                    sign_in_time: date_time,
                    sign_out_time: "",
                    n_status: 1,
                  });


                  const encryptRes = encryptCryptoResponse(dataResults);
                  const decryptRes = decrypCryptoRequest(encryptRes);


                  consolelogdata.save();
                  sendResponse["appStatusCode"] = 0;
                  sendResponse[
                    "message"
                  ] = `${data.user_name} login successfully`;
                  sendResponse["error"] = "";
                  sendResponse["payloadJson"] = decryptRes;
                } else {
                  sendResponse["appStatusCode"] = 4;
                  sendResponse["message"] = "";
                  sendResponse["error"] = "Invalid role";
                  sendResponse["payloadJson"] = [];
                }
              } else {
                sendResponse["appStatusCode"] = 4;
                sendResponse["message"] = "";
                sendResponse["error"] = "Invalid credential";
                sendResponse["payloadJson"] = [];
              }
            })
            .catch((err) => {
              sendResponse["appStatusCode"] = 4;
              sendResponse["message"] = "";
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = "Invalid credential";
            });
        })
        .catch((err) => {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = "";
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "User not found!!";
        });
    } else {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "";
      sendResponse["error"] = "Invalid Payload!";
      sendResponse["payloadJson"] = [];
    }
    return NextResponse.json(sendResponse, { status: 200 });
  } catch (error) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = "";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "Something went wrong!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
