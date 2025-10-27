import { NextResponse } from "next/server";
import connectMongoDB from "../../../../../../libs/mongodb";
import { verifyAccessToken } from "../../../../../../helper/helper";
import { Listicles } from "../../../../../../models/listiclesModel";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  const sub_id = request.nextUrl.searchParams.get("sub_id");

  const verified = verifyAccessToken();

  if (verified.success) {
    const body = {
      n_status: 0,
      n_published: 0,
    };

    await connectMongoDB();
    try {


      if(sub_id){

        await Listicles.updateOne(
          {"c_listicles_continue_item._id" :  sub_id},
          {$set: {
              'c_listicles_continue_item.$[].n_status': 0,
              'c_listicles_continue_item.$[].n_published': 0
          }},
          
      ).then((result) => {
        if (result) {
          sendResponse["appStatusCode"] = 0;
          sendResponse["message"] = "Deleted Successfully";
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "";
        } else {
          sendResponse["appStatusCode"] = 0;
          sendResponse["message"] = "Please check again! Not delete!";
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "";
        }
        return NextResponse.json(sendResponse, { status: 200 });
      });
      

      }else{

        await Listicles.findByIdAndUpdate(id,body).then((result) => {
          if (result) {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "Deleted Successfully";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = "";
          } else {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "Please check again! Not delete!";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = "";
          }
          return NextResponse.json(sendResponse, { status: 200 });
        });

      }
     

      
    } catch (err) {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Something went wrong!";
      return NextResponse.json(sendResponse, { status: 400 });
    }
    return NextResponse.json(sendResponse, { status: 200 });
  } else {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = "";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "token expired!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
