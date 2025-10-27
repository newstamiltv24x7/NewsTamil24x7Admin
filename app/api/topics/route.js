import { NextResponse } from "next/server";
import Topic from "@/models/topic";
import connectMongoDB from "@/libs/mongodb";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const { title, description } = await request.json();
  await connectMongoDB();
  const topicdata = new Topic({
    title,
    description,
  });
  await topicdata.save().then((result) => {
    sendResponse["appStatusCode"] = 0;
    sendResponse["message"] = "User added Successfully";
    sendResponse["payloadJson"] = result;
    sendResponse["error"] = [];
  });
  return NextResponse.json(sendResponse, { status: 200 });
}

export async function GET() {
    await connectMongoDB();
    await Topic.find().then((result) => {
      sendResponse["appStatusCode"] = 0;
      sendResponse["message"] = "Topic list";
      sendResponse["payloadJson"] = result;
      sendResponse["error"] = [];
    });
    return NextResponse.json(sendResponse, { status: 200 });
}

export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("id");
    await connectMongoDB();

    await Topic.findByIdAndDelete(id).then((result) => {
      sendResponse["appStatusCode"] = 0;
      sendResponse["message"] = "Deleted Successfully";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = [];
    });
    return NextResponse.json(sendResponse, { status: 200 });
}