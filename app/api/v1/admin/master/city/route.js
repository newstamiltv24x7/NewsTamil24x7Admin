import { NextResponse } from "next/server";
// import connectMongoDB from "../../../../../../libs/mongodb";
import { City } from "../../../../../../models/cityModel";
import connectMongoDB from "../../../../../../libs/mongodb";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};


export async function POST(request) {
    const { country_id,state_id,city_id, Id, n_status } = await request.json();
    
    let data = {
        country_id: country_id,
        state_id: state_id,
      };
      if(city_id){
        data["id"] =city_id
      }
    
     
      try {
        await connectMongoDB();

        if(country_id === ""){
            sendResponse["appStatusCode"] = 4;
            sendResponse["message"] = "";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = "Please enter country id!";
            return NextResponse.json(sendResponse, { status: 200 });
        }
        if(state_id === ""){
            sendResponse["appStatusCode"] = 4;
            sendResponse["message"] = "";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = "Please enter state id!";
            return NextResponse.json(sendResponse, { status: 200 });
        }else{
            await City.find(data)
            .sort({ createdAt: -1 })
            .then((data) => {
              if (data?.length >= 0) {

                let insertArray = [];
                data.map((item) => {
                  let dummyValue = {
                    _id: item._id,
                    city_id: item.id,
                    city_name: item.name,
                    country_id: item.country_id,
                    state_id: item.state_id,
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
        }

        return NextResponse.json(sendResponse, { status: 200 });
      } catch (err) {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Something went wrong!";
        return NextResponse.json(sendResponse, { status: 400 });
      }
  
  }

