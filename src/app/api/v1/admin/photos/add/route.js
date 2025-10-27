import { NextResponse } from "next/server";
import connectMongoDB from "../../../../../../libs/mongodb";
import {
  create_UUID,
  verifyAccessToken,
} from "../../../../../../helper/helper";
import { Photos } from "../../../../../../models/photosModel";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const {c_photos_short_name,c_photos_title,c_photos_slug_title,c_photos_sub_title,c_photos_content,c_photos_img, c_photos_continue_item, Id, n_status, n_published} =
    await request.json();

  const verified = verifyAccessToken();

  if (verified.success) {
    try {
      await connectMongoDB();

      if (Id) {
        const photosId = await Photos.findOne({
          _id: Id,
        });

        if (photosId === null) {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter valid id!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else {

          if(n_status === 0 ||n_status === 1){
           
            const body = {
              n_status: n_status,
            };
    
            await Photos.findByIdAndUpdate(Id, body)
              .then(() => {
                sendResponse["appStatusCode"] = 0;
                sendResponse["message"] = "Updated Successfully!";
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
            const dummyUpdateArray =[];
            if(c_photos_continue_item.length >0){
              c_photos_continue_item.map((data) => {
                dummyUpdateArray.push({
                  c_photos_continue_sub_title: data.c_photos_continue_sub_title,
                  c_photos_continue_img: data.c_photos_continue_img,
                  n_status:data.n_status,
                })
              })
            }else{
              dummyUpdateArray.push({})
            }
  
  
            await Photos.findOneAndUpdate(
              { _id: Id },
              {
                $set: {
                  c_photos_short_name: c_photos_short_name,
                  c_photos_title :c_photos_title,
                  c_photos_slug_title: c_photos_slug_title,
                  c_photos_sub_title:c_photos_sub_title,
                  c_photos_img: c_photos_img,
                  c_photos_content:c_photos_content,
                c_photos_continue_item: dummyUpdateArray
              },
              }
            ).then((data) => {
  
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "Photos updated Successfully!";
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



         
        }
      } else {
        const PhotosData = await Photos.findOne({
          c_photos_title: c_photos_title,
        });
        if(c_photos_short_name === ""){
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter photos short name!";
          return NextResponse.json(sendResponse, { status: 200 });
        }else if (c_photos_title === "") {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter photos Title!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else if (PhotosData) {


          const dummyUpdateArray =[];
          c_photos_continue_item.map((data) => {
            dummyUpdateArray.push({
              c_photos_continue_sub_title: data.c_photos_continue_sub_title,
              c_photos_continue_img: data.c_photos_continue_img,
              c_photos_continue_create_date: new Date(),
              n_status:1,
              n_published:1
            })
          })



          await Photos.findOneAndUpdate(
            { _id: PhotosData._id },
            {
              $push: {c_photos_continue_item: dummyUpdateArray},
            }
          ).then((data) => {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "Photos added Successfully!";
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
        } else {

          const dummyAddArray =[];
          c_photos_continue_item.map((data) => {
            dummyAddArray.push({
              c_photos_continue_sub_title: data.c_photos_continue_sub_title,
              c_photos_continue_img: data.c_photos_continue_img,
              c_photos_continue_create_date: new Date(),
              n_status:1,
              n_published:1
            })
          })


          let Listicle = new Photos({
            c_photos_short_name,
            c_photos_title,
            c_photos_slug_title,
            c_photos_sub_title,
            c_photos_content,
            c_photos_img,
            c_photos_id: create_UUID(),
            c_photos_continue_item:dummyAddArray,
            c_createdBy: verified.data.user_id,
          });

          await Listicle.save()
            .then(() => {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "Photos added Successfully!";
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
