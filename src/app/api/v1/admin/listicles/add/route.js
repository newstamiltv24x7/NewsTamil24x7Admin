import { NextResponse } from "next/server";
import connectMongoDB from "../../../../../../libs/mongodb";
import {
  create_UUID,
  verifyAccessToken,
} from "../../../../../../helper/helper";
import { Listicles } from "../../../../../../models/listiclesModel";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const { c_category_id,c_listicles_short_name,c_listicles_title,c_listicles_slug_title,c_listicles_sub_title,c_listicles_content,c_listicles_img, c_listicles_continue_item, Id, n_status, n_published} =
    await request.json();

  const verified = verifyAccessToken();

  if (verified.success) {
    try {
      await connectMongoDB();

      if (Id) {
        
        const listiclesId = await Listicles.findOne({
          _id: Id,
        });

        

        if (listiclesId === null) {
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
      
              await Listicles.findByIdAndUpdate(Id, body)
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
          if(c_listicles_continue_item.length >0){
            c_listicles_continue_item.map((data) => {
              dummyUpdateArray.push({
                c_listicles_continue_sub_title: data.c_listicles_continue_sub_title,
                c_listicles_continue_content: data.c_listicles_continue_content,
                c_listicles_continue_img: data.c_listicles_continue_img,
                n_status:data.n_status,
              })
            })
          }else{
            dummyUpdateArray.push({})
          }

              
              await Listicles.findOneAndUpdate(
                { _id: Id },
                {
                  $set: {
                    c_category_id: c_category_id,
                    c_listicles_short_name: c_listicles_short_name,
                    c_listicles_title :c_listicles_title,
                    c_listicles_slug_title: c_listicles_slug_title,
                    c_listicles_sub_title:c_listicles_sub_title,
                    c_listicles_img: c_listicles_img,
                    c_listicles_content:c_listicles_content,
                  c_listicles_continue_item: dummyUpdateArray
                },
                }
              ).then((data) => {
    
                sendResponse["appStatusCode"] = 0;
                sendResponse["message"] = "Listicles updated Successfully!";
                sendResponse["payloadJson"] = [];
                sendResponse["error"] = [];
                })
                .catch((error) => {
                  sendResponse["appStatusCode"] = 4;
                  sendResponse["message"] = "";
                  sendResponse["payloadJson"] = [];
                  sendResponse["error"] = error;
                });
            }
          
          return NextResponse.json(sendResponse, { status: 200 });
        }
      } else {
        const ListiclesData = await Listicles.findOne({
          c_listicles_title: c_listicles_title,
        });
        if(c_listicles_short_name === ""){
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter listicles short name!";
          return NextResponse.json(sendResponse, { status: 200 });
        }else if (c_listicles_title === "") {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter listicles Title!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else if (ListiclesData) {


          const dummyUpdateArray =[];
          c_listicles_continue_item.map((data) => {
            dummyUpdateArray.push({
              c_listicles_continue_sub_title: data.c_listicles_continue_sub_title,
              c_listicles_continue_content: data.c_listicles_continue_content,
              c_listicles_continue_img: data.c_listicles_continue_img,
              c_listicles_continue_create_date: new Date(),
              n_status:1,
              n_published:1
            })
          })



          await Listicles.findOneAndUpdate(
            { _id: ListiclesData._id },
            {
              $push: {c_listicles_continue_item: dummyUpdateArray},
            }
          ).then((data) => {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "Listicles added Successfully!";
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
          c_listicles_continue_item.map((data) => {
            dummyAddArray.push({
              c_listicles_continue_sub_title: data.c_listicles_continue_sub_title,
              c_listicles_continue_content: data.c_listicles_continue_content,
              c_listicles_continue_img: data.c_listicles_continue_img,
              c_listicles_continue_create_date: new Date(),
              n_status:1,
              n_published:1
            })
          })


          let Listicle = new Listicles({
            c_category_id,
            c_listicles_short_name,
            c_listicles_title,
            c_listicles_slug_title,
            c_listicles_sub_title,
            c_listicles_content,
            c_listicles_img,
            c_listicles_id: create_UUID(),
            c_listicles_continue_item:dummyAddArray,
            c_createdBy: verified.data.user_id,
          });

          await Listicle.save()
            .then(() => {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "Listicles added Successfully!";
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
