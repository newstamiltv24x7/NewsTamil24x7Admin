import { NextResponse } from "next/server";
import connectMongoDB from "../../../../../../libs/mongodb";
import { Notification } from "../../../../../../models/notificationModel";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const { Id, c_device_id } = await request.json();

  try {
    await connectMongoDB();

    if (Id) {
      const notifiData = await Notification.findOne({ _id: Id });
      if (notifiData === null) {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = [];
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Please enter valid id!";
        return NextResponse.json(sendResponse, { status: 200 });
      } else {
        const dummyUpdateArray = [];
        notifiData.c_notification_list.map((list) =>{
            dummyUpdateArray.push({
                c_device_id: list.c_device_id,
                c_read_status: list.c_device_id === c_device_id ?  0 : (list.c_read_status === 0 ? 0: 1),
              });
        })

       

        await Notification.findOneAndUpdate(
          { _id: Id },
          {
            $set: {
                c_notification_list: dummyUpdateArray,
            },
          }
        )
          .then((data) => {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "this device notification readed!";
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
  } catch (err) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = "";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "Something went wrong!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
