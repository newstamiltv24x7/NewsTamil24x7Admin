import { NextResponse } from "next/server";
import connectMongoDB from "../../../../../../libs/mongodb";
import { Control } from "../../../../../../models/controlModel";
import {
    encryptCryptoResponse,
    decrypCryptoRequest,
  } from "../../../../../../helper/helper";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};


export async function GET(request) {
    const id = request.nextUrl.searchParams.get("id");
  
      if (id) {
        const checkId = await Control.findOne({ c_control_id: id });
        if (checkId) {
          let _search = {};
          _search["$and"] = [
            {
              $and: [{ n_status: 1 }, { n_published: 1 }, { c_control_id: id }],
            },
          ];
  
          try {
            await connectMongoDB();
  
            await Control.aggregate([
              { $match: _search },
              {
                $group: {
                  _id: "$_id",
                  c_control_type: { $first: "$c_control_type" },
                  c_control_name: { $first: "$c_control_name" },                
                  c_control: { $first: "$c_control" },                
                  createdAt: { $first: "$createdAt" },
                  c_createdBy: { $first: "$c_createdBy" },
                  n_status: { $first: "$n_status" },
                  n_published: { $first: "$n_published" },
                },
              },
              {
                $lookup: {
                  from: "users",
                  localField: "c_createdBy",
                  foreignField: "user_id",
                  as: "users",
                },
              },
              {
                $unwind: "$users",
              },
              {
                $project: {
                  _id: 1,
                  c_control_type: 1,
                  c_control_name: 1,
                  c_control: 1,
                  createdAt: 1,
                  c_createdBy: 1,
                  c_createdName: "$users.user_name",
                  n_status: 1,
                  n_published: 1,
                },
              },
              {
                $sort: { createdAt: 1 },
              },
            ])
              .then((data) => {
                  const encryptRes = encryptCryptoResponse(data[0]);
              const decryptRes = decrypCryptoRequest(encryptRes);
                if (data.length > 0) {
                  sendResponse["appStatusCode"] = 0;
                  sendResponse["message"] = "";
                  sendResponse["payloadJson"] = decryptRes;
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
          } catch (err) {
            sendResponse["appStatusCode"] = 4;
            sendResponse["message"] = "";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = "Something went wrong!";
            return NextResponse.json(sendResponse, { status: 400 });
          }
        } else {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = "";
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Invalid Id!";
          return NextResponse.json(sendResponse, { status: 400 });
        }
      } else {
        let _search = {};
        _search["$and"] = [
          {
            $and: [{ n_status: 1 }, { n_published: 1 }],
          },
        ];
  
        try {
          await connectMongoDB();
          await Control.aggregate([
            { $match: _search },
            {
              $group: {
                _id: "$_id",
                c_control_type: { $first: "$c_control_type" },
                c_control_name: { $first: "$c_control_name" },              
                c_control: { $first: "$c_control" },              
                createdAt: { $first: "$createdAt" },
                c_createdBy: { $first: "$c_createdBy" },
                n_status: { $first: "$n_status" },
                n_published: { $first: "$n_published" },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "c_createdBy",
                foreignField: "user_id",
                as: "users",
              },
            },
            {
              $unwind: "$users",
            },
            {
              $project: {
                _id: 1,
                c_control_type: 1,
                c_control_name: 1,
                c_control: 1,
                createdAt: 1,
                c_createdBy: 1,
                c_createdName: "$users.user_name",
                n_status: 1,
                n_published: 1,
              },
            },
            {
              $sort: { createdAt: 1 },
            },
          ])
            .then((data) => {
              const encryptRes = encryptCryptoResponse(data);
              const decryptRes = decrypCryptoRequest(encryptRes);
              if (data.length > 0) {
                sendResponse["appStatusCode"] = 0;
                sendResponse["message"] = "";
                sendResponse["payloadJson"] = decryptRes;
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
        } catch (err) {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = "";
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Something went wrong!";
          return NextResponse.json(sendResponse, { status: 400 });
        }
      }
  
  }

export async function POST(request) {
  const { n_page, n_limit, c_search_term } =
    await request.json();


  try {
    await connectMongoDB();



      let _search = {};
      let n_limitTerm = n_limit;
      let n_pageTerm = n_page === 1 ? 0 : (n_page - 1) * n_limit;
      let searchTerm = c_search_term ? c_search_term : "";

      _search["$and"] = [
        {
          $and: [{ n_status: 1 }, { n_published: 1 }],
        }
      ];

      if (n_limitTerm !== "" && n_pageTerm !== "") {
        await connectMongoDB();

        await Control.aggregate([
          { $match: _search },
          {
            $group: {
              _id: "$_id",
              c_control_type: { $first: "$c_control_type" },
              c_control_name: { $first: "$c_control_name" },
              c_control: { $first: "$c_control" },
              createdAt: { $first: "$createdAt" },
              c_createdBy: { $first: "$c_createdBy" },
              n_status: { $first: "$n_status" },
              n_published: { $first: "$n_published" },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "c_createdBy",
              foreignField: "user_id",
              as: "users",
            },
          },
          {
            $unwind: "$users",
          },
          {
            $project: {
              _id: 1,
              c_control_type: 1,
              c_control_name: 1,
              c_control: 1,
              createdAt: 1,
              c_createdBy: 1,
              c_createdName: "$users.user_name",
              n_status: 1,
              n_published: 1
            },
          },
          {
            $sort: { createdAt: 1 },
          },
          {
            $facet: {
              data: [{ $skip: n_pageTerm }, { $limit: n_limitTerm }],
              total_count: [
                {
                  $count: "count",
                },
              ],
            },
          },
        ])
          .then((data) => {
            const encryptRes = encryptCryptoResponse(data);
            const decryptRes = decrypCryptoRequest(encryptRes);
            if (data[0].data.length > 0) {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "";
              sendResponse["payloadJson"] = decryptRes;
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
        sendResponse["appStatusCode"] = 3;
        sendResponse["message"] = "";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Invalid Payload";
        return NextResponse.json(sendResponse, { status: 200 });
      }
    
  } catch (err) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = [];
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "Something went wrong!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}


