import { NextResponse } from "next/server";
import { File } from "../../../../../models/fileModel";
import {
  imageTowebp,
  validateImageSize,
  verifyAccessToken,
  create_UUID,
  checkFileType,
  getBase64,
  imageCloudUpload,
} from "../../../../../helper/helper";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

const convertBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export async function POST(request) {
  const { c_file } = await request.json();
  try {
    // const formData = await request.formData();
    // const file = formData.get("c_file");
    const fileName = `${Date.now().toString()}`;
    const returnRedults = await imageCloudUpload(c_file, fileName.toString());


    sendResponse["appStatusCode"] = 0;
    sendResponse["message"] = "Image added to cloud";
    sendResponse["payloadJson"] = returnRedults;
    sendResponse["error"] = [];
    return NextResponse.json(sendResponse, { status: 200 });

  } catch (error) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = "";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "Failed to upload files.";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
