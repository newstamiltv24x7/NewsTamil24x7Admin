import { NextResponse } from "next/server";
import { YouTubeURL } from "../../../../../../models/youTubeURLModel";
import connectMongoDB from "../../../../../../libs/mongodb";
import { verifyAccessToken } from "@/helper/helper";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const { Id, c_url_order_id } = await request.json();
  // const { Id, c_category_order } = await request.json();



  const verified = verifyAccessToken();

  if(verified){

    try {
      await connectMongoDB();
      
  
      if (Id !== undefined && c_url_order_id !=="") {
  
          const body = {
              _id: Id,
          }
          const body1 ={
              c_url_order_id: c_url_order_id,
          }
  
        const categoryeId = await YouTubeURL.findOne(body);
        const categoryeOrderChanes = await YouTubeURL.findOne(body1);
  
  
        if (categoryeId === null) {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter valid id!";
          return NextResponse.json(sendResponse, { status: 400 });
        } else if(c_url_order_id === categoryeId.c_url_order_id){
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "This sequence already exits!";
          return NextResponse.json(sendResponse, { status: 400 });
        }
        
        else {
  
  
          const body = {
              c_url_order_id: c_url_order_id,
          }
          const body1 = {
              c_url_order_id: categoryeId.c_url_order_id,
          }
  
     
  
          await YouTubeURL.findByIdAndUpdate({_id:Id}, body).then(async () => {
              await YouTubeURL.findByIdAndUpdate({_id:categoryeOrderChanes._id}, body1).then(()=>{
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "Updated Successfully!";
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = [];
              }) 
            })
            .catch((err) => {
              sendResponse["appStatusCode"] = 4;
              sendResponse["message"] = "Invalid Id";
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = err;
            });
  
  
          return NextResponse.json(sendResponse, { status: 200 });
        }
      }
  
  
  
  
      
    } catch (err) {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "Error";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Something went wrong!";
      return NextResponse.json(sendResponse, { status: 400 });
    }


  }else{
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = "";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "token expired!";
    return NextResponse.json(sendResponse, { status: 400 });
  }



 
}



