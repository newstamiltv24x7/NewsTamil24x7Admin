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
    // Skip attempting a DB connection during Next.js production build
    // This avoids Mongoose buffering timeouts when Next pre-renders pages at build-time
    if (process.env.NEXT_PHASE === 'phase-production-build' || process.env.SKIP_DB_DURING_BUILD === 'true') {
      sendResponse["appStatusCode"] = 0;
      sendResponse["message"] = "skipped MongoDB connect during build";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "";
      return NextResponse.json(sendResponse, { status: 200 });
    }

    await mongoose.set("strictQuery", false);
    await mongoose.connect(connectionURL);
    sendResponse["appStatusCode"] = 0;
    sendResponse["message"] = "connected to MongoDB";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "";
    return NextResponse.json(sendResponse, { status: 200 });
  } catch (error) {
    sendResponse["appStatusCode"] = 1;
    sendResponse["message"] = "cannot connect to MongoDB";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = String(error);
    return NextResponse.json(sendResponse, { status: 500 });
  }
};
export default connectMongoDB;