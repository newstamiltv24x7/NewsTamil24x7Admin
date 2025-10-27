import { NextResponse } from "next/server";
import { Story } from "../../../../../../models/storyModel";
import connectMongoDB from "@/libs/mongodb";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const { Id, n_story_order } = await request.json();

  try {
    await connectMongoDB();
    

    if (Id !== undefined && n_story_order !=="") {

        const body = {
            _id: Id,
        }
        const body1 ={
            n_story_order: n_story_order,
        }

      const storyId = await Story.findOne(body);
      const storyOrderChanges = await Story.findOne(body1);


      if (storyId === null) {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = [];
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Please enter valid id!";
        return NextResponse.json(sendResponse, { status: 400 });
      } else if(n_story_order === storyId.n_story_order){
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = [];
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "This sequence already exits!";
        return NextResponse.json(sendResponse, { status: 400 });
      }
      
      else {


        const body = {
            n_story_order: n_story_order,
        }
        const body1 = {
            n_story_order: storyId.n_story_order,
        }

   

        await Story.findByIdAndUpdate({_id:Id}, body).then(async () => {
            await Story.findByIdAndUpdate({_id:storyOrderChanges._id}, body1).then(()=>{
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
}
