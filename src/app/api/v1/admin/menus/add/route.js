import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import { create_UUID, verifyAccessToken } from "@/helper/helper";
import { Menus } from "../../../../../../models/menuModel";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const {
    c_menu_name,
    c_menu_url_link,
    c_parentId,
    Id,
    n_status,
  } = await request.json();

  try {
    await connectMongoDB();
    const verified = verifyAccessToken();

    const checkMenus = await Menus.findOne({
      c_menu_name: c_menu_name,
    });


    if (verified.success) {
      if (Id !== undefined) {
        const MenusId = await Menus.findOne({
          _id: Id,
        });

        if (MenusId === null) {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter valid id!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else {
          const body = {
            c_menu_name: c_menu_name,
            c_menu_url_link: c_menu_url_link,
            n_status: n_status,
          };
          await Menus.findByIdAndUpdate(Id, body)
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
        }
      } else {
        if (c_menu_name === "") {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = "";
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Menu name is required";
          return NextResponse.json(sendResponse, { status: 200 });
        } else if (checkMenus !== null) {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Menu already exist";
          return NextResponse.json(sendResponse, { status: 200 });
        } else if (checkMenus === null) {
          const result = await Menus.find().sort({ _id: -1 }).limit(1);
          const Menusdata = {
            c_menu_id: create_UUID(),
            c_menu_name,
            c_menu_url_link,
            c_parentId,
            c_createdBy: verified.data.user_id,
          };

          if (c_parentId !== "") {
            Menusdata.c_parentId = c_parentId;
          }

          const MenusData = new Menus(Menusdata);

          await MenusData
            .save()
            .then((result) => {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "Menus added Successfully";
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
    } else {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = verified.error;
      return NextResponse.json(sendResponse, { status: 400 });
    }
  } catch (err) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = "Error";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "Something went wrong!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
