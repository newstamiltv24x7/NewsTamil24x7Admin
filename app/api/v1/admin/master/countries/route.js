import { NextResponse } from "next/server";
// import connectMongoDB from "../../../../../../libs/mongodb";
import { Countries } from "../../../../../../models/countriesModel";
import connectMongoDB from "../../../../../../libs/mongodb";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function GET() {
  let data = {
    n_published: 1,
  };

  try {
    await connectMongoDB();
    await Countries.find(data)
      .sort({ createdAt: -1 })
      .then((data) => {
        if (data?.length >= 0) {
          let insertArray = [];
          data.map((item) => {
            let dummyValue = {
              _id: item._id,
              country_id: item.id,
              country_name: item.name,
              n_status: item.n_status,
              n_published: item.n_published,
            };
            insertArray.push(dummyValue);
          });

          sendResponse["appStatusCode"] = 0;
          sendResponse["message"] = "";
          sendResponse["payloadJson"] = insertArray;
          sendResponse["error"] = "";
        } else {
          sendResponse["appStatusCode"] = 0;
          sendResponse["message"] = "Record not found!";
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "";
        }
      })
      .catch((err) => {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = err;
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
