import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import { create_UUID, verifyAccessToken } from "@/helper/helper";
import { SideBarMenu } from "../../../../../../models/sidebarMenuModel";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const {
    title,
    type,
    active,
    path,
    menucontent,
    c_parentId,
    Id,
    n_status,
  } = await request.json();

  try {
    await connectMongoDB();
    const verified = verifyAccessToken();

    const checkMenus = await SideBarMenu.findOne({
      title: title,
    });

    const lastID = await SideBarMenu.findOne().sort({ _id: -1 });

    if (verified.success) {
      if (Id !== undefined) {
        const MenusId = await SideBarMenu.findOne({
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
            title: title,
            type: type,
            active: active,
            path: path,
            menucontent: menucontent,
            n_status: n_status,
          };
          await SideBarMenu.findByIdAndUpdate(Id, body)
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
        if (title === "") {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = "";
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Live Blog name is required";
          return NextResponse.json(sendResponse, { status: 200 });
        } else if (checkMenus !== null) {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Live Blog already exist";
          return NextResponse.json(sendResponse, { status: 200 });
        } else if (checkMenus === null) {
          const result = await SideBarMenu.find().sort({ _id: -1 }).limit(1);


          const SideBarMenusdata = {
            c_menu_id: create_UUID(),
            title,
            lanClass:"lan-8",
            id : lastID ? lastID.id + 1 : 1,
            type,
            active,
            path,
            menucontent,
            c_parentId,
            c_createdBy: verified.data.user_id,
          };

          if (c_parentId !== "") {
            SideBarMenusdata.c_parentId = c_parentId;
          }

          const MenusData = new SideBarMenu(SideBarMenusdata);

          await MenusData.save()
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
