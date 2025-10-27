import { NextResponse } from "next/server";
import { Categories } from "../../../../../../models/categoriesModel";
import connectMongoDB from "@/libs/mongodb";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const {Id, c_category_order,c_spl_category_order } =await request.json();

  try {
    await connectMongoDB();


    if(c_spl_category_order){

      if (Id !== undefined && c_spl_category_order !=="") {

        const body = {
            _id: Id,
        }
        const body1 ={
            c_spl_category_order: c_spl_category_order,
        }

      const categoryeId = await Categories.findOne(body);
      const categoryeOrderChanes = await Categories.findOne(body1);


      if (categoryeId === null) {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = [];
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Please enter valid id!";
        return NextResponse.json(sendResponse, { status: 400 });
      } else if(c_spl_category_order === categoryeId.c_spl_category_order){
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = [];
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "This sequence already exits!";
        return NextResponse.json(sendResponse, { status: 400 });
      }
      
      else {
        const body = {
            c_spl_category_order: c_spl_category_order,
        }
        const body1 = {
            c_spl_category_order: categoryeId.c_spl_category_order,
        }

   

        await Categories.findByIdAndUpdate({_id:Id}, body).then(async () => {
            await Categories.findByIdAndUpdate({_id:categoryeOrderChanes._id}, body1).then(()=>{
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


    }else{
      if (Id !== undefined && c_category_order !=="") {

        const body = {
            _id: Id,
        }
        const body1 ={
            c_category_order: c_category_order,
        }

      const categoryeId = await Categories.findOne(body);
      const categoryeOrderChanes = await Categories.findOne(body1);


      if (categoryeId === null) {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = [];
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Please enter valid id!";
        return NextResponse.json(sendResponse, { status: 400 });
      } else if(c_category_order === categoryeId.c_category_order){
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = [];
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "This sequence already exits!";
        return NextResponse.json(sendResponse, { status: 400 });
      }
      
      else {
        const body = {
            c_category_order: c_category_order,
        }
        const body1 = {
            c_category_order: categoryeId.c_category_order,
        }

   

        await Categories.findByIdAndUpdate({_id:Id}, body).then(async () => {
            await Categories.findByIdAndUpdate({_id:categoryeOrderChanes._id}, body1).then(()=>{
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
    }

    
    




    
  } catch (err) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = "Error";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "Something went wrong!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
