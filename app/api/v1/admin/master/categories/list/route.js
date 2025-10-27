import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import { create_UUID, verifyAccessToken } from "@/helper/helper";
import { Categories } from "@/models/categoriesModel";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};


function createCategoriesList(categorieses, c_parentId = null) {
  
  const categoryList = [];
  let category;
  if (c_parentId == null) {
    // category = categorieses.filter((cate) => cate.c_parentId == null  && cate.story_id.length > 0);
    category = categorieses.filter((cate) => cate.c_parentId == null);
  } else {
    category = categorieses.filter((cate) => cate.c_parentId == c_parentId);
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
      c_web_component_category_id: cat.c_web_component_category_id,
      c_spl_category:cat.c_spl_category,
      c_spl_category_order: cat.c_spl_category_order,
      c_parentId: cat.c_parentId,
      n_status: cat.n_status,
      n_published: cat.n_published,
      c_category_slug_english_name:cat.c_category_slug_english_name,
      c_sub_categories: createCategories(categorieses, cat.c_category_id),
    });
  }

  return categoryList;
}

function createCategories(categorieses, c_parentId = null) {
  const categoryList = [];
  let category;
  if (c_parentId == null) {
    category = categorieses.filter((cate) => cate.c_parentId == undefined);
  } else {
    category = categorieses.filter((cate) => cate.c_parentId == c_parentId);
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
      c_web_component_category_id: cat.c_web_component_category_id,
      c_parentId: cat.c_parentId,
      n_status: cat.n_status,
      n_published: cat.n_published,
      c_category_slug_english_name:cat.c_category_slug_english_name,
      c_sub_categories: createCategories(categorieses, cat.c_category_id),
    });
  }

  return categoryList;
}

export async function POST(request) {
  const { n_page, n_limit, c_search_term, c_type, c_cate_type,spl_cate } =
    await request.json();

  const verified = verifyAccessToken();

  try {
    await connectMongoDB();

    if (verified.success) {
      let _search = {};
      let n_limitTerm = n_limit;
      let n_pageTerm = n_page === 1 ? 0 : (n_page - 1) * n_limit;
      let searchTerm = c_search_term ? c_search_term : "";

      let typeView = {};

      if (c_type === "mobile") {
        typeView = { c_category_app_menu_sort_order: 1 };
      } else {
        if(spl_cate){
          typeView = { c_spl_category_order: 1 };
        }else{
          typeView = { c_category_order: 1 };
        }
        
      }

      if (searchTerm !== "" && spl_cate) {
        
        _search["$or"] = [
          {
            $or: [
              { c_category_name: { $regex: searchTerm, $options: "i" } },
              {
                c_category_english_name: { $regex: searchTerm, $options: "i" },
                c_spl_category:spl_cate
              },
            ],
            $and: [
              {
                c_parentId: { $exists: c_cate_type === "main" ? false : true },
                c_spl_category:spl_cate
              },
            ],
          },

          // { createdAt: { $gte: fromDate, $lte: toDate } },
        ];
      }else if (searchTerm === "" && spl_cate) {
        
        _search["$or"] = [
          {
            $and: [
              {
                c_parentId: { $exists: c_cate_type === "main" ? false : true },
                c_spl_category:spl_cate
              },
            ],
          },
        ];
      } else {
        
        _search["$or"] = [
          {
            $or: [{ n_status: 1 }, { n_published: 1 }],
            $and: [
              {
                c_parentId: { $exists: c_cate_type === "main" ? false : true },
              },
            ],
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
              c_category_id: { $first: "$c_category_id" },
              c_category_name: { $first: "$c_category_name" },
              c_parentId: { $first: "$c_parentId" },
              c_category_english_name: { $first: "$c_category_english_name" },
              c_category_image_url: { $first: "$c_category_image_url" },
              c_category_class: { $first: "$c_category_class" },
              c_category_type: { $first: "$c_category_type" },
              c_category_meta_title: { $first: "$c_category_meta_title" },
              c_category_meta_description: {
                $first: "$c_category_meta_description",
              },
              c_category_meta_keywords: { $first: "$c_category_meta_keywords" },
              c_web_component_category_id: { $first: "$c_web_component_category_id" },
              c_category_order: { $first: "$c_category_order" },
              c_spl_category_order: { $first: "$c_spl_category_order" },
              c_spl_category: { $first: "$c_spl_category" },
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
              from: "webcomponentcategories",
              localField: "c_web_component_category_id",
              foreignField: "c_web_component_category_id",
              as: "webcomponentcategories",
            },
          },
          {
            $unwind: {
              path: "$webcomponentcategories",
              preserveNullAndEmptyArrays: true,
            },
          },
          // {
          //   $lookup: {
          //     from: "stories",
          //     localField: "c_category_id",
          //     foreignField: "main_category_id",
          //     as: "storycreatedId",
          //   },
          // },
          {
            $project: {
              _id: 1,
              c_category_id: 1,
              c_category_name: 1,
              c_parentId: 1,
              c_category_english_name: 1,
              c_category_image_url: 1,
              c_category_class: 1,
              c_category_type: 1,
              c_category_meta_title: 1,
              c_category_meta_description: 1,
              c_category_meta_keywords: 1,
              c_web_component_category_id: 1,
              c_category_order: 1,
              c_spl_category_order :1,
              c_spl_category_order :1,
              c_spl_category: 1,
              c_category_app_menu_sort_order: 1,
              createdAt: 1,
              c_createdBy: 1,
              n_status: 1,
              n_published: 1,
              createdName: "$createdById.user_name",
              c_parentName: "$parentById.c_category_name",
              c_web_component_category_name: "$webcomponentcategories.c_web_component_category_name",
              // story_id: "$storycreatedId.story_id",
              // sub_category_id: "$storycreatedId.sub_category_id",
            },
          },
          {
            $sort: typeView,
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
          .then((result) => {

           const data =[]
            
            const categoryData = createCategoriesList(result[0].data);
            data.push({
              data: categoryData,
              total_count: result[0].total_count
            })

            if (result[0].data.length > 0) {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "";
              sendResponse["payloadJson"] = c_cate_type === "main" ? data : result;
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
    } else {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = [];
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = verified.error;
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
  const c_category_id = request.nextUrl.searchParams.get("c_category_id");

  try {
    const verified = verifyAccessToken();

    if (verified.success) {
      await connectMongoDB();
      if (id) {
        let data = {
          n_status: 1,
          n_published: 1,
          _id: id,
        };

        await Categories.findOne(data)
          .sort({ c_category_order: 1 })
          .then((data) => {
           
            const categoriesList = data;

            if (categoriesList) {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "";
              sendResponse["data"] = [];
              sendResponse["payloadJson"] = categoriesList;
              sendResponse["error"] = "";
              return NextResponse.json(sendResponse, { status: 200 });
            } else {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "Record not found !";
              sendResponse["data"] = [];
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = "";
              return NextResponse.json(sendResponse, { status: 200 });
            }
          })
          .catch((err) => {
            sendResponse["appStatusCode"] = 4;
            sendResponse["message"] = "";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = err;
            return NextResponse.json(sendResponse, { status: 200 });
          });
      }else if(c_category_id) {
        let data = {
          n_status: 1,
          n_published: 1,
        };
        await Categories.find(data)
          .sort({ c_category_order: 1 })
          .then((data) => {
           
            const categoriesList = createCategories(data,c_category_id);

            if (categoriesList.length > 0) {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "";
              sendResponse["data"] = [];
              sendResponse["payloadJson"] = categoriesList;
              sendResponse["error"] = "";
              return NextResponse.json(sendResponse, { status: 200 });
            } else {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "Record not found !";
              sendResponse["data"] = [];
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = "";
              return NextResponse.json(sendResponse, { status: 200 });
            }
          })
          .catch((err) => {
            sendResponse["appStatusCode"] = 4;
            sendResponse["message"] = "";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = err;
            return NextResponse.json(sendResponse, { status: 200 });
          });
      } else {
        let data = {
          n_status: 1,
          n_published: 1,
        };
        await Categories.find(data)
          .sort({ c_category_order: 1 })
          .then((data) => {
           
            const categoriesList = createCategories(data);

            if (categoriesList.length > 0) {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "";
              sendResponse["data"] = [];
              sendResponse["payloadJson"] = categoriesList;
              sendResponse["error"] = "";
              return NextResponse.json(sendResponse, { status: 200 });
            } else {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "Record not found !";
              sendResponse["data"] = [];
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = "";
              return NextResponse.json(sendResponse, { status: 200 });
            }
          })
          .catch((err) => {
            sendResponse["appStatusCode"] = 4;
            sendResponse["message"] = "";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = err;
            return NextResponse.json(sendResponse, { status: 200 });
          });
      }
    } else {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = verified.error;
    }
    return NextResponse.json(sendResponse, { status: 200 });
  } catch (err) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = "";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "Something went wrong!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
