import { NextResponse } from "next/server";
import { Categories } from "../../../../../../models/categoriesModel";
import connectMongoDB from "../../../../../../libs/mongodb";

import {
  encryptCryptoResponse,
  decrypCryptoRequest,
} from "../../../../../../helper/helper";


let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

function createCategories(categorieses, c_parentId = null) {
  const categoryList = [];
  let category;
  if (c_parentId == null) {
    category = categorieses.filter((cate) => cate.c_parentId == undefined && cate.story_id.length > 0);
  } else {
    category = categorieses.filter((cate) => cate.c_parentId == c_parentId && cate.story_id.length > 0);
  }

  for (let cat of category) {

    categoryList.push({
      _id: cat._id,
      c_category_order: cat.c_category_order,
      c_category_id: cat.c_category_id,
      c_category_name: cat.c_category_name,
      c_category_english_name: cat.c_category_english_name,
      c_category_image_url: cat.c_category_image_url,
      c_category_class: cat.c_category_class,
      c_category_type: cat.c_category_type,
      c_category_meta_title: cat.c_category_meta_title,
      c_category_meta_description: cat.c_category_meta_description,
      c_category_meta_keywords: cat.c_category_meta_keywords,
      c_category_app_menu_sort_order: cat.c_category_app_menu_sort_order,
      c_parentId: cat.c_parentId,
      n_status: cat.n_status,
      n_published: cat.n_published,
      c_sub_categories: createCategories(categorieses, cat.c_category_id),
    });
  }

  return categoryList;
}

export async function POST(request) {
  const { n_page, n_limit, c_search_term } = await request.json();

  try {
    await connectMongoDB();
    let _search = {};
    let n_limitTerm = n_limit;
    let n_pageTerm = n_page === 1 ? 0 : (n_page - 1) * n_limit;
    let searchTerm = c_search_term ? c_search_term : "";

    if (searchTerm !== "") {
      _search["$and"] = [
        {
          $and: [{ c_category_name: { $regex: searchTerm, $options: "i" } }],
          $and: [{ n_status: 1 }, { n_published: 1 }],
        },
      ];
    } else {
      _search["$and"] = [
        {
          $and: [{ n_status: 1 }, { n_published: 1 }],
        },
      ];
    }

    if (n_limitTerm !== "" && n_pageTerm !== "") {
      await connectMongoDB();

      await Categories.aggregate([
        { $match: _search },
        {
          $group: {
            _id: "$_id",
            c_category_name: { $first: "$c_category_name" },
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
            c_category_name: 1,

            createdAt: 1,
            c_createdBy: 1,
            c_createdName: "$users.user_name",
            n_status: 1,
            n_published: 1,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $facet: {
            data: [{ $skip: n_pageTerm }, { $limit: n_limitTerm }],
            total_count: [
              {
                $count: "count",
              },
            ],
          },
        },
      ])
        .then((data) => {
          
          const encryptRes = encryptCryptoResponse(data);
          const decryptRes = decrypCryptoRequest(encryptRes);
          if (data[0].data.length > 0) {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "";
            sendResponse["payloadJson"] = decryptRes;
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
    } else {
      sendResponse["appStatusCode"] = 3;
      sendResponse["message"] = "";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Invalid Payload";
      return NextResponse.json(sendResponse, { status: 200 });
    }
  } catch (err) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = [];
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "Something went wrong!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}

export async function GET(request) {
  const id = request.nextUrl.searchParams.get("id");
  const name = request.nextUrl.searchParams.get("name");
  // const c_cate_type = "main";

  if (id) {
    const checkId = await Categories.findOne({ c_category_id: id });

    if (checkId) {
      try {
        await connectMongoDB();
        let _search = {};
        _search["$and"] = [
          {
            $and: [
              { n_status: 1 },
              { n_published: 1 },
              { c_category_id: id },
              //   {
              //   c_parentId: { $exists: c_cate_type === "main" ? false : true },
              // }
            ],
          },
        ];

        await Categories.aggregate([
          { $match: _search },
          {
            $group: {
              _id: "$_id",
              c_category_name: { $first: "$c_category_name" },
              c_parentId: { $first: "$c_parentId" },
              c_category_id: { $first: "$c_category_id" },
              c_category_english_name: { $first: "$c_category_english_name" },
              c_category_image_url: { $first: "$c_category_image_url" },
              c_category_class: { $first: "$c_category_class" },
              c_category_type: { $first: "$c_category_type" },
              c_category_meta_title: { $first: "$c_category_meta_title" },
              c_category_meta_description: {
                $first: "$c_category_meta_description",
              },
              c_category_meta_keywords: { $first: "$c_category_meta_keywords" },
              c_category_order: { $first: "$c_category_order" },
              c_category_app_menu_sort_order: {
                $first: "$c_category_app_menu_sort_order",
              },
              createdAt: { $first: "$createdAt" },
              c_createdBy: { $first: "$c_createdBy" },
              n_status: { $first: "$n_status" },
              n_published: { $first: "$n_published" },
            },
          },
          {
            $lookup: {
              from: "stories",
              localField: "c_category_id",
              foreignField: "main_category_id",
              as: "storycreatedId",
            },
          },
          // {
          //   $unwind: {
          //     path: "$storycreatedId",
          //     preserveNullAndEmptyArrays: true,
          //   },
          // },

          {
            $lookup: {
              from: "users",
              localField: "c_category_id",
              foreignField: "user_id",
              as: "createdById",
            },
          },
          {
            $unwind: {
              path: "$createdById",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $lookup: {
              from: "categories",
              localField: "c_parentId",
              foreignField: "c_category_id",
              as: "parentById",
            },
          },
          {
            $unwind: {
              path: "$parentById",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $project: {
              _id: 1,
              c_category_name: 1,
              c_parentId: 1,
              c_category_id: 1,
              c_category_english_name: 1,
              c_category_image_url: 1,
              c_category_class: 1,
              c_category_type: 1,
              c_category_meta_title: 1,
              c_category_meta_description: 1,
              c_category_meta_keywords: 1,
              c_category_order: 1,
              c_category_app_menu_sort_order: 1,
              createdAt: 1,
              c_createdBy: 1,
              n_status: 1,
              n_published: 1,
              createdName: "$createdById.user_name",
              c_parentName: "$parentById.c_category_name",
              story_id: "$storycreatedId.story_id",
            },
          },
          {
            $sort: { c_category_order: 1 },
          },
        ])
          .then((data) => {
            const encryptRes = encryptCryptoResponse(data);
            const decryptRes = decrypCryptoRequest(encryptRes);
            if (data.length > 0) {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "";
              sendResponse["payloadJson"] = decryptRes;
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
        sendResponse["message"] = [];
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Something went wrong!";
        return NextResponse.json(sendResponse, { status: 400 });
      }
    } else {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = [];
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Invalid Id";
      return NextResponse.json(sendResponse, { status: 400 });
    }
  } else  if (name) {
    const checkName = await Categories.findOne({ c_category_english_name: name });

    if (checkName) {
      try {
        await connectMongoDB();
        let _search = {};
        _search["$and"] = [
          {
            $and: [
              { n_status: 1 },
              { n_published: 1 },
              { c_category_english_name: name },
              //   {
              //   c_parentId: { $exists: c_cate_type === "main" ? false : true },
              // }
            ],
          },
        ];

        await Categories.aggregate([
          { $match: _search },
          {
            $group: {
              _id: "$_id",
              c_category_name: { $first: "$c_category_name" },
              c_parentId: { $first: "$c_parentId" },
              c_category_id: { $first: "$c_category_id" },
              c_category_english_name: { $first: "$c_category_english_name" },
              c_category_image_url: { $first: "$c_category_image_url" },
              c_category_class: { $first: "$c_category_class" },
              c_category_type: { $first: "$c_category_type" },
              c_category_meta_title: { $first: "$c_category_meta_title" },
              c_category_meta_description: {
                $first: "$c_category_meta_description",
              },
              c_category_meta_keywords: { $first: "$c_category_meta_keywords" },
              c_category_order: { $first: "$c_category_order" },
              c_category_app_menu_sort_order: {
                $first: "$c_category_app_menu_sort_order",
              },
              createdAt: { $first: "$createdAt" },
              c_createdBy: { $first: "$c_createdBy" },
              n_status: { $first: "$n_status" },
              n_published: { $first: "$n_published" },
            },
          },
          {
            $lookup: {
              from: "stories",
              localField: "c_category_id",
              foreignField: "main_category_id",
              as: "storycreatedId",
            },
          },
          // {
          //   $unwind: {
          //     path: "$storycreatedId",
          //     preserveNullAndEmptyArrays: true,
          //   },
          // },

          {
            $lookup: {
              from: "users",
              localField: "c_category_id",
              foreignField: "user_id",
              as: "createdById",
            },
          },
          {
            $unwind: {
              path: "$createdById",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $lookup: {
              from: "categories",
              localField: "c_parentId",
              foreignField: "c_category_id",
              as: "parentById",
            },
          },
          {
            $unwind: {
              path: "$parentById",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $project: {
              _id: 1,
              c_category_name: 1,
              c_parentId: 1,
              c_category_id: 1,
              c_category_english_name: 1,
              c_category_image_url: 1,
              c_category_class: 1,
              c_category_type: 1,
              c_category_meta_title: 1,
              c_category_meta_description: 1,
              c_category_meta_keywords: 1,
              c_category_order: 1,
              c_category_app_menu_sort_order: 1,
              createdAt: 1,
              c_createdBy: 1,
              n_status: 1,
              n_published: 1,
              createdName: "$createdById.user_name",
              c_parentName: "$parentById.c_category_name",
              story_id: "$storycreatedId.story_id",
            },
          },
          {
            $sort: { c_category_order: 1 },
          },
        ])
          .then((data) => {
            const encryptRes = encryptCryptoResponse(data);
            const decryptRes = decrypCryptoRequest(encryptRes);
            if (data.length > 0) {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "";
              sendResponse["payloadJson"] = decryptRes;
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
        sendResponse["message"] = [];
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Something went wrong!";
        return NextResponse.json(sendResponse, { status: 400 });
      }
    } else {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = [];
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Invalid Id";
      return NextResponse.json(sendResponse, { status: 400 });
    }
  }  else {
    try {
      await connectMongoDB();
      let _search = {};
      _search["$or"] = [
        {
          $or: [{ n_status: 1 }, { n_published: 1 }],
        },
      ];
      // await connectMongoDB();
      await Categories.aggregate([
        { $match: _search },
        {
          $group: {
            _id: "$_id",
            c_category_name: { $first: "$c_category_name" },
            c_parentId: { $first: "$c_parentId" },
            c_category_id: { $first: "$c_category_id" },
            c_category_english_name: { $first: "$c_category_english_name" },
            c_category_image_url: { $first: "$c_category_image_url" },
            c_category_class: { $first: "$c_category_class" },
            c_category_type: { $first: "$c_category_type" },
            c_category_meta_title: { $first: "$c_category_meta_title" },
            c_category_meta_description: {
              $first: "$c_category_meta_description",
            },
            c_category_meta_keywords: { $first: "$c_category_meta_keywords" },
            c_category_order: { $first: "$c_category_order" },
            c_category_app_menu_sort_order: {
              $first: "$c_category_app_menu_sort_order",
            },
            createdAt: { $first: "$createdAt" },
            c_createdBy: { $first: "$c_createdBy" },
            n_status: { $first: "$n_status" },
            n_published: { $first: "$n_published" },
          },
        },
        {
          $lookup: {
            from: "stories",
            localField: "c_category_id",
            foreignField: "main_category_id",
            as: "storycreatedId",
          },
        },
        // {
        //   $unwind: {
        //     path: "$storycreatedId",
        //     preserveNullAndEmptyArrays: false,
        //   },
        // },
        {
          $lookup: {
            from: "users",
            localField: "c_createdBy",
            foreignField: "user_id",
            as: "createdById",
          },
        },
        {
          $unwind: {
            path: "$createdById",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: "categories",
            localField: "c_parentId",
            foreignField: "c_category_id",
            as: "parentById",
          },
        },
        {
          $unwind: {
            path: "$parentById",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $project: {
            _id: 1,
            c_category_name: 1,
            c_parentId: 1,
            c_category_id: 1,
            c_category_english_name: 1,
            c_category_image_url: 1,
            c_category_class: 1,
            c_category_type: 1,
            c_category_meta_title: 1,
            c_category_meta_description: 1,
            c_category_meta_keywords: 1,
            c_category_order: 1,
            c_category_app_menu_sort_order: 1,
            createdAt: 1,
            c_createdBy: 1,
            n_status: 1,
            n_published: 1,
            createdName: "$createdById.user_name",
            c_parentName: "$parentById.c_category_name",
            story_id: "$storycreatedId.story_id",
          },
        },
        {
          $sort: { c_category_order: 1 },
        },
      ])
        .then((data) => {
          const categoryData = createCategories(data);

          const encryptRes = encryptCryptoResponse(categoryData);
          const decryptRes = decrypCryptoRequest(encryptRes);
          
          if (data.length > 0) {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "";
            sendResponse["payloadJson"] = decryptRes;
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
      sendResponse["message"] = [];
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Something went wrong!";
      return NextResponse.json(sendResponse, { status: 400 });
    }
  }
}
