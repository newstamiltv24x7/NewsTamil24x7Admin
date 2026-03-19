import mongoose from "mongoose";
import { NextResponse } from "next/server";

// const connectionURL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.zomdyai.mongodb.net/?retryWrites=true&w=majority`;
const connectionURL = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_IP}/${process.env.MONGO_DATABASE}?authSource=${process.env.MONGO_DATABASE}&readPreference=primary&directConnection=true&ssl=false`;

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

const connectMongoDB = async () => {
  try {

    await mongoose.set("strictQuery", false);
    await mongoose.connect(connectionURL);
    sendResponse["appStatusCode"] = 0;
    sendResponse["message"] = "connected to MongoDB";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "";
    return NextResponse.json(sendResponse, { status: 200 });
  } catch (error) {
    sendResponse["appStatusCode"] = 0;
    sendResponse["message"] = "cannot connected to MongoDB";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = error;
    throw new Error(error);

    return NextResponse.json(sendResponse, { status: 400 });
  }
};
export default connectMongoDB;
