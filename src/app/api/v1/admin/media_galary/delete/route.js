import { NextResponse } from "next/server";
import { File } from "../../../../../../models/fileModel";
import connectMongoDB from "../../../../../../libs/mongodb";
import { verifyAccessToken } from "@/helper/helper";
import { S3Client,DeleteObjectCommand  } from "@aws-sdk/client-s3";



const s3Client= new S3Client({
    region:process.env.AWS_SECRET_REGION,
    credentials:{
      accessKeyId:process.env.AWS_ACCESS_KEY,
      secretAccessKey:process.env.AWS_SECRET_KEY
    }
  })
  
  async function deleteFileToS3(fileName) {
   
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
    });
  
    try {
      const response = await s3Client.send(command);
      return response;
    } catch (error) {
      // throw error;
      return error;
    }
  }



let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};



export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  const c_file = request.nextUrl.searchParams.get("c_file");
  await connectMongoDB();

  const verified = verifyAccessToken();

  try {
    if (verified.success) {

        if (c_file === "") {

            sendResponse["appStatusCode"] = 4;
            sendResponse["message"] = "Please select a file.";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = "";
            return NextResponse.json(sendResponse,{status: 200})
        }else if(id === ""){
            sendResponse["appStatusCode"] = 4;
            sendResponse["message"] = "Please enter id.";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = "";
            return NextResponse.json(sendResponse,{status: 200})
        }else{
            const body = {
                n_status: 0,
                n_published: 0,
                c_deletedBy: verified.data.user_id,
              };
              


              // await File.findByIdAndDelete(id)


              await File.findByIdAndUpdate(id,body)
                .then(async (result) => {
                  if (result) {
                    // const response = await deleteFileToS3(c_file);
                    sendResponse["appStatusCode"] = 0;
                    sendResponse["message"] = "Deleted Successfully";
                    sendResponse["payloadJson"] = [];
                    sendResponse["error"] = "";
                  } else {
                    sendResponse["appStatusCode"] = 4;
                    sendResponse["message"] = "";
                    sendResponse["payloadJson"] = [];
                    sendResponse["error"] = "Invalid Id";
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

      
      
    } else {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = [];
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = verified.error;
      return NextResponse.json(sendResponse, { status: 200 });
    }
  } catch (error) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = [];
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "Something went wrong!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
