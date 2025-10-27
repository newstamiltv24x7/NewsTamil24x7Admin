import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import { verifyAccessToken } from "@/helper/helper";
import { Menus } from "../../../../../../models/menuModel";
import { SideBarMenu } from "../../../../../../models/sidebarMenuModel";
import { UserPrivileges } from "@/models/userPrivilegesModel";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};


function createSubMenus(menus, c_parentId = null) {
    const menusList = [];
    let menu;
    if (c_parentId == null) {
      menu = menus.filter((cate) => cate.c_parentId == undefined);
    } else {
      menu = menus.filter((cate) => cate.c_parentId == c_parentId);
    }
  
    for (let cat of menu) {
      menusList.push({
        _id: cat._id,
        title: cat.title,
        id: cat.id,
        type: cat.type,
        path: cat.path,
        active: cat.active,
        lanClass: cat.lanClass,
        menucontent: cat.menucontent,
        c_menu_id: cat.c_menu_id,
        c_parentId: cat.c_parentId,
        createdAt: cat.createdAt,
        c_createdName: cat.c_createdName,
        n_status: cat.n_status,
        n_published: cat.n_published,
        children: createSubMenus(menus, cat.c_menu_id),
      });
    }
  
    return menusList;
  }

function createMenus(menus, c_parentId = null) {
  const menusList = [];
  let menu;
  if (c_parentId == null) {
    menu = menus.filter((cate) => cate.c_parentId == undefined);
  } else {
    menu = menus.filter((cate) => cate.c_parentId == c_parentId);
  }

  for (let cat of menu) {
    menusList.push({
      _id: cat._id,
      title: cat.title,
      id: cat.id,
      type: cat.type,
      path: cat.path,
      active: cat.active,
      lanClass: cat.lanClass,
      menucontent: cat.menucontent,
      c_menu_id: cat.c_menu_id,
      c_parentId: cat.c_parentId,
      createdAt: cat.createdAt,
      c_createdName: cat.c_createdName,
      n_status: cat.n_status,
      n_published: cat.n_published,
      Items: createSubMenus(menus, cat.c_menu_id),
    });
  }

  return menusList;
}

export async function POST(request) {
  const { c_search_term } = await request.json();

  let searchTerm = c_search_term ? c_search_term : "";

  if (searchTerm !== "") {
    let _search = {};

    _search["$and"] = [
      {
        $and: [
          { n_status: 1 },
          { n_published: 1 },
          { title: { $regex: searchTerm, $options: "i" } },
        ],
      },
    ];

    try {
      await connectMongoDB();

      await SideBarMenu.aggregate([
        { $match: _search },
        {
          $group: {
            _id: "$_id",
            title: { $first: "$title" },
            c_menu_id: { $first: "$c_menu_id" },
            type: { $first: "$type" },
            id: { $first: "$id" },
            path: { $first: "$path" },
            active: { $first: "$active" },
            lanClass: { $first: "$lanClass" },
            menucontent: { $first: "$menucontent" },
            c_parentId: { $first: "$c_parentId" },
            createdAt: { $first: "$createdAt" },
            c_createdBy: { $first: "$c_createdBy" },
            n_status: { $first: "$n_status" },
            n_published: { $first: "$n_published" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "c_createdBy",
            foreignField: "user_id",
            as: "users",
          },
        },
        {
          $unwind: "$users",
        },
        {
          $project: {
            _id: 1,
            title: 1,
            c_menu_id: 1,
            type: 1,
            id: 1,
            path: 1,
            active: 1,
            lanClass: 1,
            menucontent: 1,
            c_parentId: 1,
            createdAt: 1,
            c_createdBy: 1,
            c_createdName: "$users.user_name",
            n_status: 1,
            n_published: 1,
          },
        },
        {
          $sort: { createdAt: 1 },
        },
      ])
        .then((data) => {
          if (data.length > 0) {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "";
            sendResponse["payloadJson"] = data;
            sendResponse["error"] = [];
          } else {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "Record not found!";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = [];
          }
        })
        .catch((err) => {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = "";
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = err;
        });

      return NextResponse.json(sendResponse, { status: 200 });
    } catch (err) {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Something went wrong!";
      return NextResponse.json(sendResponse, { status: 400 });
    }
  } else {
    let _search = {};

    _search["$and"] = [
      {
        $and: [{ n_status: 1 }, { n_published: 1 }],
      },
    ];

    try {
      await connectMongoDB();

      await SideBarMenu.aggregate([
        { $match: _search },
        {
          $group: {
            _id: "$_id",
            title: { $first: "$title" },
            c_menu_id: { $first: "$c_menu_id" },
            type: { $first: "$type" },
            id: { $first: "$id" },
            path: { $first: "$path" },
            active: { $first: "$active" },
            lanClass: { $first: "$lanClass" },
            menucontent: { $first: "$menucontent" },
            c_parentId: { $first: "$c_parentId" },
            createdAt: { $first: "$createdAt" },
            c_createdBy: { $first: "$c_createdBy" },
            n_status: { $first: "$n_status" },
            n_published: { $first: "$n_published" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "c_createdBy",
            foreignField: "user_id",
            as: "users",
          },
        },
        {
          $unwind: "$users",
        },
        {
          $project: {
            _id: 1,
            title: 1,
            c_menu_id: 1,
            type: 1,
            id: 1,
            path: 1,
            active: 1,
            lanClass: 1,
            menucontent: 1,
            c_parentId: 1,
            createdAt: 1,
            c_createdBy: 1,
            c_createdName: "$users.user_name",
            n_status: 1,
            n_published: 1,
          },
        },
        {
          $sort: { createdAt: 1 },
        },
      ])
        .then((data) => {
          if (data.length > 0) {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "";
            sendResponse["payloadJson"] = data;
            sendResponse["error"] = [];
          } else {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "Record not found!";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = [];
          }
        })
        .catch((err) => {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = "";
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = err;
        });

      return NextResponse.json(sendResponse, { status: 200 });
    } catch (err) {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Something went wrong!";
      return NextResponse.json(sendResponse, { status: 400 });
    }
  }
}

export async function GET(request) {
  const verified = verifyAccessToken();
  const id = request.nextUrl.searchParams.get("id");

  if (verified.success) {
    if (id) {
      
      const checkId = await SideBarMenu.findOne({ c_menu_id: id });
      if (checkId) {
        let _search = {};
        _search["$and"] = [
          {
            $and: [{ n_status: 1 }, { n_published: 1 }, { c_menu_id: id }],
          },
        ];

        try {
          await connectMongoDB();

          await SideBarMenu.aggregate([
            { $match: _search },
            {
              $group: {
                _id: "$_id",
                title: { $first: "$title" },
                c_menu_id: { $first: "$c_menu_id" },
                type: { $first: "$type" },
                id: { $first: "$id" },
                path: { $first: "$path" },
                active: { $first: "$active" },
                lanClass: { $first: "$lanClass" },
                menucontent: { $first: "$menucontent" },
                c_parentId: { $first: "$c_parentId" },
                createdAt: { $first: "$createdAt" },
                c_createdBy: { $first: "$c_createdBy" },
                n_status: { $first: "$n_status" },
                n_published: { $first: "$n_published" },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "c_createdBy",
                foreignField: "user_id",
                as: "users",
              },
            },
            {
              $unwind: "$users",
            },
            {
              $project: {
                _id: 1,
                title: 1,
                c_menu_id: 1,
                type: 1,
                id: 1,
                path: 1,
                active: 1,
                lanClass: 1,
                menucontent: 1,
                c_parentId: 1,
                createdAt: 1,
                c_createdBy: 1,
                c_createdName: "$users.user_name",
                n_status: 1,
                n_published: 1,
              },
            },
            {
              $sort: { createdAt: 1 },
            },
          ])
            .then((data) => {
              const MenusList = createMenus(data);
              if (data.length > 0) {
                sendResponse["appStatusCode"] = 0;
                sendResponse["message"] = "";
                sendResponse["payloadJson"] = MenusList;
                sendResponse["error"] = [];
              } else {
                sendResponse["appStatusCode"] = 0;
                sendResponse["message"] = "Record not found!";
                sendResponse["payloadJson"] = [];
                sendResponse["error"] = [];
              }
            })
            .catch((err) => {
              sendResponse["appStatusCode"] = 4;
              sendResponse["message"] = "";
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = err;
            });

          return NextResponse.json(sendResponse, { status: 200 });
        } catch (err) {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = "";
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Something went wrong!";
          return NextResponse.json(sendResponse, { status: 400 });
        }
      } else {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Invalid Id!";
        return NextResponse.json(sendResponse, { status: 400 });
      }
    } else {
      
    let _search = {};
      const checkArray = [];
      const userPrivilegeData = await UserPrivileges.findOne({
        c_role_id: verified.data.c_role_id,
      });
      Array.isArray(userPrivilegeData.c_menu_privileges) && userPrivilegeData.c_menu_privileges.map((data) =>{
        checkArray.push(data.menu_privileage_id)
      })
      _search["$and"] = [
        {
          $and: [
            { n_status: 1 }, 
            { n_published: 1 },
            { c_menu_id: {$in: checkArray}}
          ],
        },
      ];



      
      // _search["$and"] = [
      //   {
      //     $and: [{ n_status: 1 }, { n_published: 1 }],
      //   },
      // ];



     
      try {
        await connectMongoDB();
        await SideBarMenu.aggregate([
          { $match: _search },
          {
            $group: {
              _id: "$_id",
              title: { $first: "$title" },
              c_menu_id: { $first: "$c_menu_id" },
              type: { $first: "$type" },
              id: { $first: "$id" },
              path: { $first: "$path" },
              active: { $first: "$active" },
              lanClass: { $first: "$lanClass" },
              menucontent: { $first: "$menucontent" },
              c_parentId: { $first: "$c_parentId" },
              createdAt: { $first: "$createdAt" },
              c_createdBy: { $first: "$c_createdBy" },
              n_status: { $first: "$n_status" },
              n_published: { $first: "$n_published" },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "c_createdBy",
              foreignField: "user_id",
              as: "users",
            },
          },
          {
            $unwind: "$users",
          },
          {
            $project: {
              _id: 1,
              title: 1,
              c_menu_id: 1,
              type: 1,
              id: 1,
              path: 1,
              active: 1,
              lanClass: 1,
              menucontent: 1,
              c_parentId: 1,
              createdAt: 1,
              c_createdBy: 1,
              c_createdName: "$users.user_name",
              n_status: 1,
              n_published: 1,
            },
          },
          {
            $sort: { createdAt: 1 },
          },
        ])
          .then((data) => {
           
        

            const MenusList = createMenus(data);


            if (data.length > 0) {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "";
              sendResponse["payloadJson"] = MenusList;
              sendResponse["error"] = [];
            } else {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "Record not found!";
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = [];
            }
          })
          .catch((err) => {
            sendResponse["appStatusCode"] = 4;
            sendResponse["message"] = "";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = err;
          });

        return NextResponse.json(sendResponse, { status: 200 });
      } catch (err) {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Something went wrong!";
        return NextResponse.json(sendResponse, { status: 400 });
      }
    }
  } else {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = "";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "token expired!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
