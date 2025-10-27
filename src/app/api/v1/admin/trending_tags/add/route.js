import { NextResponse } from "next/server";
import { TrendingTags } from "../../../../../../models/trendingTagsModel";
import connectMongoDB from "../../../../../../libs/mongodb";
import {
  create_UUID,
  verifyAccessToken,
} from "../../../../../../helper/helper";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const {
    c_trending_tag_name
  } = await request.json();

  const verified = verifyAccessToken();



  if (verified.success) {
    try {
      await connectMongoDB();


        const TrendingTagsData = await TrendingTags.find();
        if(c_trending_tag_name.length === 0){
            sendResponse["appStatusCode"] = 4;
                  sendResponse["message"] = "";
                  sendResponse["payloadJson"] = [];
                  sendResponse["error"] = "Please enter trending tag name";
        }
        else if(TrendingTagsData.length === 0){
            let TrendingtagsAdd = new TrendingTags({
                c_trending_tag_id: create_UUID(),
                c_trending_tag_name,
                c_createdBy: verified.data.user_id,
              });
              await TrendingtagsAdd.save().then(() => {
                  sendResponse["appStatusCode"] = 0;
                  sendResponse["message"] = "Added Successfully!";
                  sendResponse["payloadJson"] = [];
                  sendResponse["error"] = [];
                })
                .catch((err) => {
                  sendResponse["appStatusCode"] = 4;
                  sendResponse["message"] = "";
                  sendResponse["payloadJson"] = [];
                  sendResponse["error"] = err;
                });

        }else{
          
            let checkId =(TrendingTagsData[0]._id).toString();

            await TrendingTags.findOneAndUpdate(

                { _id: checkId},
                {
                  $set: {c_trending_tag_name: c_trending_tag_name},
                }
              ).then((data) => {

                if(data){
                    sendResponse["appStatusCode"] = 0;
                sendResponse["message"] = "Updated Successfully!";
                sendResponse["payloadJson"] = [];
                sendResponse["error"] = [];
                }else{
                    sendResponse["appStatusCode"] = 4;
                sendResponse["message"] = "Not Updated!";
                sendResponse["payloadJson"] = [];
                sendResponse["error"] = [];
                }
                })
                .catch((error) => {
                  sendResponse["appStatusCode"] = 4;
                  sendResponse["message"] = "";
                  sendResponse["payloadJson"] = [];
                  sendResponse["error"] = error;
                });

            
        }


        return NextResponse.json(sendResponse, { status: 200 });


        if (c_trending_tag_name === "") {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter  Tags!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else if (TrendingTagsData !== null) {
           
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Already exist!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else{


          let TrendingtagsAdd = new TrendingTags({
            c_trending_tag_id: create_UUID(),
            c_trending_tag_name,
            c_createdBy: verified.data.user_id,
          });
          await TrendingtagsAdd.save().then(() => {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "Added Successfully!";
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
    sendResponse["error"] = "token expired!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}

