import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import { verifyAccessToken } from "@/helper/helper";
import { Menus } from "../../../../../../models/menuModel";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

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
      c_menu_name: cat.c_menu_name,
      c_menu_url_link: cat.c_menu_url_link,
      c_menu_id: cat.c_menu_id,      
      c_parentId: cat.c_parentId,
      createdAt: cat.createdAt,
      c_createdName:cat.c_createdName,
      n_status: cat.n_status,
      n_published: cat.n_published,
      c_sub_menus: createMenus(menus, cat.c_menu_id),
    });
  }

  return menusList;
}


export async function POST(request){
  const { c_search_term } = await request.json();

  let searchTerm = c_search_term ? c_search_term : "";

  if(searchTerm !== ""){
    let _search = {};
    
    _search["$and"] = [
      {
        $and: [{ n_status: 1 }, { n_published: 1 }, { c_menu_name: { $regex: searchTerm, $options: "i" } },],
      },
    ];

    try {
      await connectMongoDB();

      await Menus.aggregate([
        { $match: _search },
        {
          $group: {
            _id: "$_id",
            c_menu_name: { $first: "$c_menu_name" },
            c_menu_id: { $first: "$c_menu_id" },
            c_menu_url_link: { $first: "$c_menu_url_link" },
            
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
            c_menu_name: 1,
            c_menu_id: 1,
            c_menu_url_link: 1,
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
  }else{
    let _search = {};

    _search["$and"] = [
      {
        $and: [{ n_status: 1 }, { n_published: 1 }],
      },
    ];

    try {
      await connectMongoDB();

      await Menus.aggregate([
        { $match: _search },
        {
          $group: {
            _id: "$_id",
            c_menu_name: { $first: "$c_menu_name" },
            c_menu_id: { $first: "$c_menu_id" },
            c_menu_url_link: { $first: "$c_menu_url_link" },
            
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
            c_menu_name: 1,
            c_menu_id: 1,
            c_menu_url_link: 1,
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
      const checkId = await Menus.findOne({ c_menu_id: id });
      if (checkId) {
        let _search = {};
        _search["$and"] = [
          {
            $and: [{ n_status: 1 }, { n_published: 1 }, { c_menu_id: id }],
          },
        ];

        try {
          await connectMongoDB();

          await Menus.aggregate([
            { $match: _search },
            {
              $group: {
                _id: "$_id",
                c_menu_name: { $first: "$c_menu_name" },
                c_menu_id: { $first: "$c_menu_id" },
                c_menu_url_link: { $first: "$c_menu_url_link" },                
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
                c_menu_name: 1,
                c_menu_id: 1,
                c_menu_url_link: 1,
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
      _search["$and"] = [
        {
          $and: [{ n_status: 1 }, { n_published: 1 }],
        },
      ];

      try {
        await connectMongoDB();

        await Menus.aggregate([
          { $match: _search },
          {
            $group: {
              _id: "$_id",
              c_menu_name: { $first: "$c_menu_name" },
              c_menu_id: { $first: "$c_menu_id" },
              c_menu_url_link: { $first: "$c_menu_url_link" },
              
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
              c_menu_name: 1,
              c_menu_id: 1,
              c_menu_url_link: 1,
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
