import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { File } from "../../../../../models/fileModel";
import { verifyAccessToken } from "../../../../../helper/helper";
import { S3Client,DeleteObjectCommand  } from "@aws-sdk/client-s3";

// import { readFileSync } from 'fs'



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

export async function POST(request) {
    const {c_file} = await request.json();
    const verified = verifyAccessToken();


    if (verified.success) { 
      try {
        if (c_file === "") {
    
            sendResponse["appStatusCode"] = 4;
            sendResponse["message"] = "Please select a file.";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = "";
            return NextResponse.json(sendResponse,{status: 200})
        }
        
    
        const response = await deleteFileToS3(c_file);
        const storyId = await File.findOne({
        c_file_name : c_file
        });
        // const response1 = await File.findByIdAndDelete(storyId._id)
    
        const body1 = {
          n_status: 0,
          n_published: 0,
          c_deletedBy: verified.data.user_id,
        };
    
          await File.findByIdAndUpdate(storyId._id, body1).then((result) => {
    
            if(result){
                sendResponse["appStatusCode"] = 0;
                sendResponse["message"] = "Image deleted Successfully";
                sendResponse["payloadJson"] = [];
                sendResponse["error"] = "";
            }else{
                sendResponse["appStatusCode"] = 4;
                sendResponse["message"] = "Not Deleted";
                sendResponse["payloadJson"] = [];
                sendResponse["error"] = "";
            }
            
          });
       
    
          return NextResponse.json(sendResponse,{status: 200})
     
       
       
      } catch (error) {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Something went wrong";
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
