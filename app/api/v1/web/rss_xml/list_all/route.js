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
    category = categorieses.filter(
      (cate) => cate.c_parentId == undefined && cate.story_id.length > 0
    );
  } else {
    category = categorieses.filter(
      (cate) => cate.c_parentId == c_parentId && cate.story_id.length > 0
    );
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
      story_id: cat.story_id,
      story_title_name: cat.story_title_name,
      story_sub_title_name: cat.story_sub_title_name,
      story_english_name: cat.story_english_name,
      story_desk_created_name: cat.story_desk_created_name,
      story_sub_english_name: cat.story_sub_english_name,
      story_cover_image_url: cat.story_cover_image_url,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,

      //   story_published_options: cat.story_published_options
      //   c_sub_categories: createCategories(categorieses, cat.c_category_id),
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
  const url = request.nextUrl.searchParams.get("url");
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
              c_category_id: { $first: "$c_category_id" },
              c_category_english_name: { $first: "$c_category_english_name" },
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
            $lookup: {
              from: "stories",
              localField: "c_category_id",
              foreignField: "main_category_id",
              as: "storycreatedId",
            },
          },
          {
            $unwind: {
              path: "$storycreatedId",
              preserveNullAndEmptyArrays: false,
            },
          },

          {
            $project: {
              _id: 1,
              c_category_name: 1,
              c_category_id: 1,
              c_category_english_name: 1,
              createdAt: 1,
              c_createdBy: 1,
              n_status: 1,
              n_published: 1,
              createdName: "$createdById.user_name",
              c_parentName: "$parentById.c_category_name",
              story_id: "$storycreatedId.story_id",
              story_title_name: "$storycreatedId.story_title_name",
              story_sub_title_name: "$storycreatedId.story_sub_title_name",
              story_english_name: "$storycreatedId.story_english_name",
              story_sub_english_name: "$storycreatedId.story_sub_english_name",
              story_cover_image_url: "$storycreatedId.story_cover_image_url",
              story_desk_created_name: "$storycreatedId.story_desk_created_name",
              createdAt: "$storycreatedId.createdAt",
              updatedAt: "$storycreatedId.updatedAt",
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
    } else {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = [];
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Invalid Id";
      return NextResponse.json(sendResponse, { status: 400 });
    }
  }
  else if (url) {
    const checkUrl = await Categories.findOne({ c_category_english_name: url });

    if (checkUrl) {
      try {
        await connectMongoDB();
        let _search = {};
        _search["$and"] = [
          {
            $and: [
              { n_status: 1 },
              { n_published: 1 },
              { c_category_english_name: url },
            ],
          },
        ];

        await Categories.aggregate([
          { $match: _search },
          {
            $group: {
              _id: "$_id",
              c_category_name: { $first: "$c_category_name" },
              c_category_id: { $first: "$c_category_id" },
              c_category_english_name: { $first: "$c_category_english_name" },
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
            $lookup: {
              from: "stories",
              localField: "c_category_id",
              foreignField: "main_category_id",
              as: "storycreatedId",
            },
          },
          {
            $unwind: {
              path: "$storycreatedId",
              preserveNullAndEmptyArrays: false,
            },
          },

          {
            $project: {
              _id: 1,
              c_category_name: 1,
              c_category_id: 1,
              c_category_english_name: 1,
              createdAt: 1,
              c_createdBy: 1,
              n_status: 1,
              n_published: 1,
              createdName: "$createdById.user_name",
              c_parentName: "$parentById.c_category_name",
              story_id: "$storycreatedId.story_id",
              story_title_name: "$storycreatedId.story_title_name",
              story_sub_title_name: "$storycreatedId.story_sub_title_name",
              story_english_name: "$storycreatedId.story_english_name",
              story_sub_english_name: "$storycreatedId.story_sub_english_name",
              story_cover_image_url: "$storycreatedId.story_cover_image_url",
              story_desk_created_name: "$storycreatedId.story_desk_created_name",
              createdAt: "$storycreatedId.createdAt",
              updatedAt: "$storycreatedId.updatedAt",
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
            c_category_id: { $first: "$c_category_id" },
            c_category_english_name: { $first: "$c_category_english_name" },
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
          $lookup: {
            from: "stories",
            localField: "c_category_id",
            foreignField: "main_category_id",
            as: "storycreatedId",
          },
        },
        {
          $unwind: {
            path: "$storycreatedId",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $project: {
            _id: 1,
            c_category_name: 1,
            c_category_id: 1,
            c_category_english_name: 1,

            createdAt: 1,
            c_createdBy: 1,
            n_status: 1,
            n_published: 1,
            createdName: "$createdById.user_name",
            c_parentName: "$parentById.c_category_name",
            story_id: "$storycreatedId.story_id",
            story_title_name: "$storycreatedId.story_title_name",
            story_sub_title_name: "$storycreatedId.story_sub_title_name",
            story_english_name: "$storycreatedId.story_english_name",
            story_sub_english_name: "$storycreatedId.story_sub_english_name",
            story_cover_image_url: "$storycreatedId.story_cover_image_url",
            story_desk_created_name: "$storycreatedId.story_desk_created_name",
            createdAt: "$storycreatedId.createdAt",
            updatedAt: "$storycreatedId.updatedAt",
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
