import { NextResponse } from "next/server";
import { Consolelog } from "../../../../../models/consoleModel";
import connectMongoDB from "../../../../../libs/mongodb";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const { n_limit, n_page, c_search_term } = await request.json();


    try {
      await connectMongoDB();

      let _search = {};
      let n_limits = n_limit;
      let n_pages = n_page === 1 ? 0 : (n_page - 1) * n_limit;
      let searchTerm = c_search_term ? c_search_term : "";
      
      if (searchTerm) {
        _search["$or"] = [
          {
            $or: [
              { user_name: { $regex: searchTerm, $options: "i" } },
              { email: { $regex: searchTerm, $options: "i" } },
              { sign_in_time: { $regex: searchTerm, $options: "i" } },
              { sign_out_time: { $regex: searchTerm, $options: "i" } },
            ],
          },
        ];
      } else {
        _search["$or"] = [
          {
            $or: [{ n_status: 1 }, { n_published: 1 }],
          },
        ];
      }
      
      

    

      if (n_limits !== "" && n_pages !== "") {

      

        Consolelog.aggregate([
          {
            $match: _search,
          },
          {
            $group: {
              _id: "$_id",
              user_name: { $first: "$user_name" },
              email: { $first: "$email" },
              sign_in_time: { $first: "$sign_in_time" },
              sign_out_time: { $first: "$sign_out_time" },
              n_status: { $first: "$n_status" },
            },
          },
          {
            $sort: { createdAt: -1 },
          },
          {
            $facet: {
              data: [{ $skip: n_pages }, { $limit: n_limits }],
              total_count: [
                {
                  $count: "count",
                },
              ],
            },
          },
        ]).then((data) => {
           
            if (data.length > 0) {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "";
              sendResponse["payloadJson"] = data;
              sendResponse["error"] = [];
            } else {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "Record not found!";
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = [];
            }
          })
          .catch((err) => {
            sendResponse["appStatusCode"] = 4;
            sendResponse["message"] = "";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = err;

          });
          return NextResponse.json(sendResponse, { status: 200 });
      } else {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Invalid Payloads";
      }
      return NextResponse.json(sendResponse, { status: 200 });
    } catch (err) {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = err;
      return NextResponse.json(sendResponse, { status: 400 });
    }
}

export async function GET() {
  try {
    await connectMongoDB();
    await Consolelog.find()
      .sort({ createdAt: -1 })
      .then((data) => {
        if (data?.length >= 0) {
          sendResponse["appStatusCode"] = 0;
          sendResponse["message"] = "";
          sendResponse["payloadJson"] = data;
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
    sendResponse["error"] = err;
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
