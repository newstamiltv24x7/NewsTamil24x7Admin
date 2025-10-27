import { NextResponse } from "next/server";
import { File } from "../../../../../models/fileModel";

const https = require("https");
const fs = require("fs");
const axios = require("axios");

import {
  imageTowebp,
  validateImageSize,
  verifyAccessToken,
  create_UUID,
} from "../../../../../helper/helper";
import AWS from "aws-sdk";
// import sharp from "sharp";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});
const s3 = new AWS.S3();
const bucketName = process.env.AWS_BUCKET_NAME;

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

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

// const uploadToS3 = (data, callback) => {
//     s3.putObject({
//       Bucket: bucketName,
//       Key: key,
//       Body: data,
//       ContentType: 'image/jpeg' // Modify content type according to your image type
//     }, (err, res) => {
//       if (err) {
//         callback(err);
//       } else {
//         callback(null, res);
//       }
//     });
//   };

async function downloadImage(url, filename) {
  const response = await axios.get(url, { responseType: "arraybuffer" });

  fs.writeFile(filename, response.data, (err) => {
    if (err) throw err;
    
  });
}

// const downloadImage = (url, callback) => {
//     https.get(url, response => {
//       let data = '';
//       response.setEncoding('binary');

//       response.on('data', chunk => {
//         data += chunk;
//       });

//       response.on('end', () => {
//         callback(null, data);
//       });
//     }).on('error', err => {
//       callback(err);
//     });
//   };

export async function POST(request) {
  const { url_file } = await request.json();
  const fileName = `${Date.now().toString()}-images/image1.jpg`;

  downloadImage(url_file, fileName, async (err, imageData) => {
    if (err) {
      console.error("Error downloading image:", err);
    } else {
      const buffer = Buffer.from(await imageData.arrayBuffer());
      const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: buffer
      };

      const result = await uploadToS3(params);

      

      //     console.error('imgae data response:', imageData);
      //     const result = await uploadToS3(imageData, (uploadErr, uploadRes) => {
      //     if (uploadErr) {
      //       console.error('Error uploading image to S3:', uploadErr);
      //     } else {
      
      //           sendResponse["appStatusCode"] = 0;
      // sendResponse["message"] = "Image added Successfully";
      // sendResponse["payloadJson"] = result;
      // sendResponse["error"] = [];

      //     }
      //   });
    }
  });

  return NextResponse.json(sendResponse, { status: 200 });
  

  //   const file = fs.createWriteStream(imageName);

  //   https.get(imageUrl, response => {
  //     response.pipe(file);

  //     file.on('finish', () => {

  //       file.close();
  
  //     });
  //   }).on('error', err => {
  //     fs.unlink(imageName);
  //     console.error(`Error downloading image: ${err.message}`);
  //   });
  

  //   sendResponse["appStatusCode"] = 0;
  //   sendResponse["message"] = "Image added Successfully";
  //   sendResponse["payloadJson"] = url_file;
  //   sendResponse["error"] = [];
  //   return NextResponse.json(sendResponse, { status: 200 });

  

  //   if (verified.success) {
  //     try {
  //       const formData = await request.formData();
  //       const file = formData.get("c_file");
  //       const fileType = formData.get("file_type");
  //       const fileName = `${Date.now().toString()}-${file.name}`;

  //       if (file.size === 0) {
  //         sendResponse["appStatusCode"] = 4;
  //         sendResponse["message"] = "Please select a file.";
  //         sendResponse["payloadJson"] = [];
  //         sendResponse["error"] = "";
  //         return NextResponse.json(sendResponse, { status: 200 });
  //       } else {

  //         const buffer = Buffer.from(await file.arrayBuffer());
  //         // const buffer1 = await sharp(buffer).metadata();
  //         // const buffer2 = Buffer.from(await buffer1.arrayBuffer());
  
  //         const params = {
  //           Bucket: bucketName,
  //           Key: fileName,
  //           Body: buffer,
  //         };

  //         const result = await uploadToS3(params);

  //         if (result) {
  //           const returResults = {
  //             c_file: result.Key,
  //             c_file_url: result.Location,
  //           };

  //           sendResponse["appStatusCode"] = 0;
  //           sendResponse["message"] = "Image added Successfully";
  //           sendResponse["payloadJson"] = returResults;
  //           sendResponse["error"] = [];
  //           return NextResponse.json(sendResponse, { status: 200 });

  //           let FileData = new File({
  //             c_file_id: create_UUID(),
  //             c_file_name : result.Key,
  //             c_file_url: result.Location,
  //             c_file_type :fileType,
  //             c_createdBy: verified.data.user_id,
  //           });

  //           await FileData.save().then(() => {
  //               sendResponse["appStatusCode"] = 0;
  //               sendResponse["message"] = "Image added Successfully";
  //               sendResponse["payloadJson"] = returResults;
  //               sendResponse["error"] = [];

  //             })
  //             .catch((err) => {
  //               sendResponse["appStatusCode"] = 4;
  //               sendResponse["message"] = "";
  //               sendResponse["payloadJson"] = [];
  //               sendResponse["error"] = err;
  //             });
  //          return NextResponse.json(sendResponse, { status: 200 });
  //         } else {
  //           sendResponse["appStatusCode"] = 4;
  //           sendResponse["message"] = "";
  //           sendResponse["payloadJson"] = [];
  //           sendResponse["error"] = "Image Cannot Upload";
  //           return NextResponse.json(sendResponse, { status: 400 });
  //         }
  //       }
  //     } catch (error) {
  //       sendResponse["appStatusCode"] = 4;
  //       sendResponse["message"] = "";
  //       sendResponse["payloadJson"] = [];
  //       sendResponse["error"] = "Failed to upload files.";
  //       return NextResponse.json(sendResponse, { status: 400 });
  //     }
  //   } else {
  //     sendResponse["appStatusCode"] = 4;
  //     sendResponse["message"] = "";
  //     sendResponse["payloadJson"] = [];
  //     sendResponse["error"] = "token expired!";
  //     return NextResponse.json(sendResponse, { status: 400 });
  //   }
}
