import { NextResponse } from "next/server";
import connectMongoDB from "../../../../../../libs/mongodb";
import { VisitCountToken } from "../../../../../../models/visitCountModel";
import { create_UUID } from "../../../../../../helper/helper";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const { c_story_id, c_visit_url, c_visit_all_count } = await request.json();
  try {
    await connectMongoDB();
    if (c_story_id) {
      const visitData = await VisitCountToken.findOne({
        c_story_id: c_story_id,
      });

       if(visitData) {


        const checkDeviceData = await VisitCountToken.findOne({
          c_visit_all_count: { $elemMatch: { c_visit_device_id: c_visit_all_count[0]?.c_visit_device_id}},
        });

        


        if(checkDeviceData){
          await VisitCountToken.updateOne(
            {
              c_story_id: c_story_id,
              c_visit_all_count: { $elemMatch: { c_visit_device_id: c_visit_all_count[0]?.c_visit_device_id}},
            },
            { $inc: { "c_visit_all_count.$.c_visit_count": 1 } }
          ).then((result) => {
              
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "Updated Successfullyy!";
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
        }else{


          
          let dummyData = {
            c_visit_device_id: c_visit_all_count[0]?.c_visit_device_id,
            c_visit_device_type: c_visit_all_count[0]?.c_visit_device_type,
            c_visit_count: 1,
          };

          await VisitCountToken.findOneAndUpdate(
            { _id: visitData._id },
            {
              $push: {c_visit_all_count: dummyData},
            }
          ).then((data) => {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "Visit count added!";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = [];
            })
            .catch((error) => {
              sendResponse["appStatusCode"] = 4;
              sendResponse["message"] = "";
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = error;
            });
          return NextResponse.json(sendResponse, { status: 200 });




        }


      
      





      }else {
        let dummyData = {
          c_visit_device_id: c_visit_all_count[0]?.c_visit_device_id,
          c_visit_device_type: c_visit_all_count[0]?.c_visit_device_type,
          c_visit_count: 1,
        };

        let VisitCountTokenData = new VisitCountToken({
          c_visit_id: create_UUID(),
          c_story_id: c_story_id,
          c_visit_url,
          c_visit_all_count: dummyData,
        });

        await VisitCountTokenData.save().then(() => {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "Visit Count Added!";
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
      }
    } else {
      sendResponse["appStatusCode"] = 0;
      sendResponse["message"] = "Check your Visit count ";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = [];
      return NextResponse.json(sendResponse, { status: 200 });
    }
  } catch (err) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = "";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "Something went wrong!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
