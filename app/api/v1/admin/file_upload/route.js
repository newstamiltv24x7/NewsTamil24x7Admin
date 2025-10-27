import { NextResponse } from "next/server";
import { File } from "../../../../../models/fileModel";
import {
  imageTowebp,
  validateImageSize,
  verifyAccessToken,
  create_UUID,
  checkFileType,
} from "../../../../../helper/helper";
import AWS from "aws-sdk";
import sharp from "sharp";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});
const s3 = new AWS.S3();
const bucketName = process.env.AWS_BUCKET_NAME;




const client= new S3Client({
  region:process.env.AWS_SECRET_REGION,
  credentials:{
    accessKeyId:process.env.AWS_ACCESS_KEY,
    secretAccessKey:process.env.AWS_SECRET_KEY
  }
})




let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};


const imageUrlToBase64 = async (url) => {
  const data = await fetch(url);
  const blob = await data.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    };
    reader.onerror = reject;
  });
};

function uploadToS2(params) {
  return new Promise((resolve, reject) => {

    s3.upload(params, (err, data) => {
      
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}


function uploadToS3(params) {
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}



function uploadToS4(command) {
  return new Promise((resolve, reject) => {
    client.send(command).then(data => {
      
    });
  });
}







export async function POST(request) {
  const verified = verifyAccessToken();

  if (verified.success) {
    try {
      const formData = await request.formData();
      const file = formData.get("c_file");
      const fileType = formData.get("file_type");
      const imageCaptionName = formData.get("c_image_caption_name");
      const fileReName = `${Date.now().toString()}-${file.name}`;
      const fileName = fileReName.toLowerCase().replace(/\s+/g, "");

      

      if (file.size === 0) {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "Please select a file.";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "";
        return NextResponse.json(sendResponse, { status: 200 });
      } else if (file.size >= 5242880) {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "More then 5MB Not allowed";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "";
        return NextResponse.json(sendResponse, { status: 200 });
      } else if (!checkFileType(file.type)) {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "please check your file type";
        return NextResponse.json(sendResponse, { status: 200 });
      } 
      
      
      
      else {
        const buffer = Buffer.from(await file.arrayBuffer());
        const compressedBuffer = await sharp(buffer).jpeg({quality: 50}).toBuffer();
        // const reader = new FileReader(file);
        // const base64data = reader.result.split(',')[1];
        // const buffer = await sharp(Buffer.from(base64data, "base64")).composite([{ input: "public/watermark/logo.png", gravity: "northwest" }]).toBuffer();

   
      const params = {
          Bucket: bucketName,
          Key: fileName,
          Body: compressedBuffer
        };


       

         const result = await uploadToS2(params);





        // const buffer = await sharp(Buffer.from(base64data, "base64")).composite([{ input: "public/watermark/logo.png", gravity: "northwest" }]).toBuffer();
        // const params = new GetObjectCommand({ 
        //   Bucket: bucketName, 
        //   Key: fileName,
        //   Body: buffer,
        // });

        // const result = await uploadToS3(params)


        // const buffer = await sharp(Buffer.from(file, "base64")).composite([{ input: "public/watermark/logo.png", gravity: "northwest" }]).toBuffer();


      //   const params = {
      //     Bucket: bucketName,
      //     Key: fileName,
      //     Body: buffer,
      //     ContentType: "image/png", 
      // };
      // const result = await s3.send(new PutObjectCommand(params));






        if (result) {
          const returResults = {
            c_file: result.Key,
            c_file_url: result.Location,
          };


          let FileData = new File({
            c_file_id: create_UUID(),
            c_file_name: result.Key,
            c_file_url: result.Location,
            c_image_caption_name: imageCaptionName ? imageCaptionName : "",
            c_file_type: fileType,
            c_createdBy: verified.data.user_id,
          });

          await FileData.save()
            .then(() => {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "Image added Successfully";
              sendResponse["payloadJson"] = returResults;
              sendResponse["error"] = [];
            })
            .catch((err) => {
              sendResponse["appStatusCode"] = 4;
              sendResponse["message"] = "";
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = err;
            });


          sendResponse["appStatusCode"] = 0;
          sendResponse["message"] = "Image added Successfully";
          sendResponse["payloadJson"] = returResults;
          sendResponse["error"] = [];

          return NextResponse.json(sendResponse, { status: 200 });
        } else {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = "";
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Image Cannot Upload";
          return NextResponse.json(sendResponse, { status: 400 });
        }




      }
    } catch (error) {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Failed to upload files.";
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
