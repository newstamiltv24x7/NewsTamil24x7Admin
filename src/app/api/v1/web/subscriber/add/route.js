import { NextResponse } from "next/server";
import { Subscriber } from "../../../../../../models/subscriberModel";
import connectMongoDB from "../../../../../../libs/mongodb";
import {
  create_UUID,
  generateAccessTokenForget,
  transporter,
} from "../../../../../../helper/helper";
// import { urlEncoder } from "encryptdecrypt-everytime/src";
const { urlEncoder } = require("encryptdecrypt-everytime/src");

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

function emailSend(mailData) {
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
  const {
    c_subscriber_email,
    c_subscriber_activate,
    Id,
    n_status,
    n_published,
    c_redirect,
  } = await request.json();

  try {
    await connectMongoDB();

    if (Id) {
      const userRoleId = await Subscriber.findOne({
        _id: Id,
      });

      if (userRoleId === null) {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = [];
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Please enter valid id!";
        return NextResponse.json(sendResponse, { status: 200 });
      } else {
        const body = {
          c_subscriber_email: c_subscriber_email,
          c_subscriber_activate: c_subscriber_activate,
          n_status: n_status,
          n_published: n_published,
        };

        await Subscriber.findByIdAndUpdate(Id, body)
          .then(() => {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "Updated Successfully!";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = [];
          })
          .catch((err) => {
            sendResponse["appStatusCode"] = 4;
            sendResponse["message"] = "Invalid Id";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = err;
          });
        return NextResponse.json(sendResponse, { status: 200 });
      }
    } else {
      const SubscriberData = await Subscriber.findOne({
        c_subscriber_email: c_subscriber_email,
      });

      if (c_subscriber_email === "") {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = [];
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Please enter  Subscriber email!";
        return NextResponse.json(sendResponse, { status: 200 });
      } else if (SubscriberData !== null) {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = [];
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "This email already exist!";
        return NextResponse.json(sendResponse, { status: 200 });
      } else {
        let subscriberAdd = new Subscriber({
          c_subscriber_id: create_UUID(),
          c_subscriber_email,
        });

        await subscriberAdd
          .save()
          .then(async () => {
            await Subscriber.findOne({
              c_subscriber_email: c_subscriber_email,
            }).then(async (subScribersData) => {
              if (subScribersData) {
                let data = {
                  email: subScribersData.c_subscriber_email,
                  id: subScribersData._id,
                };

                let token = generateAccessTokenForget(data);

                const sampleData = [token];
                const secretKey = process.env.ENCY_DECY_SECRET;
                const encryptedToken = urlEncoder(
                  secretKey,
                  JSON.stringify(sampleData)
                );

                

                let mailData = {
                  from: "no-reply@datasense.in", // sender address
                  to: `${c_subscriber_email}`, // list of receivers
                  subject: "Verified Email News Tamil 24 X 7",
                  text: "Verified Email",
                  html: ``,
                };

                mailData["html"] = `
                  <b>Hai ${c_subscriber_email},</b>
                  <h4>Click on the below link to verify your email!</h4>
                  <br/>
                  <a href="${c_redirect}/verified?${encryptedToken}">
                  <button> Verify Email</button>
                  </a>
                  </br>
                  <h5><b>Thank You for subscribe, </b> <br /> News Tamil 24 X 7</h5>
                `;

                const result = emailSend(mailData);

                if (result) {
                  sendResponse["appStatusCode"] = 0;
                  sendResponse["message"] = "Added Successfully!";
                  sendResponse["payloadJson"] = [];
                  sendResponse["error"] = [];
                } else {
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

              return NextResponse.json(sendResponse, { status: 200 });
            });

            return NextResponse.json(sendResponse, { status: 200 });
          })
          .catch((err) => {
            sendResponse["appStatusCode"] = 4;
            sendResponse["message"] = "";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = err;
          });
        return NextResponse.json(sendResponse, { status: 200 });
      }
    }
  } catch (err) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = "";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "Something went wrong!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
