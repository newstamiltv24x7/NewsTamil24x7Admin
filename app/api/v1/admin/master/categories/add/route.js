import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import { create_UUID, verifyAccessToken } from "@/helper/helper";
import { Categories } from "@/models/categoriesModel";
import slugify from "slugify";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const {
    c_web_component_category_id,
    c_category_name,
    c_category_english_name,
    c_category_image_url,
    c_category_class,
    c_category_type,
    c_category_meta_title,
    c_category_meta_description,
    c_category_meta_keywords,
    c_parentId,
    Id,
    n_status,
    c_spl_category,
  } = await request.json();

  try {
    await connectMongoDB();
    const verified = verifyAccessToken();

    const checkWebComponentCategory = await Categories.findOne({
      c_web_component_category_id: c_web_component_category_id,
    });
    const lastID = await Categories.findOne().sort({ c_category_order: -1 });
    const lastID1 = await Categories.findOne().sort({ c_spl_category_order: -1 });
    const lastID2 = await Categories.findOne().sort({ c_category_app_menu_sort_order: -1 });





    if (verified.success) {
      if (Id !== undefined) {
        const categoryeId = await Categories.findOne({
          _id: Id,
        });

        if (categoryeId === null) {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Please enter valid id!";
          return NextResponse.json(sendResponse, { status: 200 });
        } else {
          const slugString = c_category_english_name.replace(/[^\w\s]|_/g, "");
          const slug_name = slugify(slugString, 
            {
            replacement: "-",
            remove: undefined,
            lower: true,
            strict: false,
            locale: "vi",
            trim: true,
          })


          const body = {
            c_category_name: c_category_name,
            c_category_english_name,
            c_category_slug_english_name:slug_name,
            c_category_image_url: c_category_image_url,
            c_category_class: c_category_class,
            c_category_type: c_category_type,
            c_category_meta_title: c_category_meta_title,
            c_category_meta_description: c_category_meta_description,
            c_category_meta_keywords: c_category_meta_keywords,
            c_spl_category: c_spl_category,
            n_status: n_status,
          };
          await Categories.findByIdAndUpdate(Id, body)
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
        if (c_category_name === "") {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = "";
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Category name is required";
          return NextResponse.json(sendResponse, { status: 200 });
        } else if (checkWebComponentCategory === "") {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "please add web component Category";
          return NextResponse.json(sendResponse, { status: 200 });
        } else {
          const result = await Categories.find().sort({ _id: -1 }).limit(1);

          const slugString = c_category_english_name.replace(/[^\w\s]|_/g, "");
          const slug_name = slugify(slugString, 
            {
            replacement: "-",
            remove: undefined,
            lower: true,
            strict: false,
            locale: "vi",
            trim: true,
          })


          const categorydata = {
            c_web_component_category_id,
            c_category_id: create_UUID(),
            c_category_name,
            c_parentId,
            c_category_english_name,
            c_category_slug_english_name:slug_name,
            c_category_image_url,
            c_category_class,
            c_category_type,
            c_category_meta_title,
            c_category_meta_description,
            c_category_meta_keywords,
            c_createdBy: verified.data.user_id,
            c_spl_category
          };

          if (c_parentId === undefined) {
            if (result.length === 0) {
              categorydata.c_category_order = 1;
              categorydata.c_spl_category_order = 1;
              categorydata.c_category_app_menu_sort_order = 1;
            } else {
              categorydata.c_category_order = lastID ? parseInt(lastID.c_category_order)+ 1: 1;
              categorydata.c_spl_category_order = lastID1 ? parseInt(lastID1.c_spl_category_order) + 1: 1;
              categorydata.c_category_app_menu_sort_order = lastID2 ? parseInt(lastID2.c_category_app_menu_sort_order) + 1: 1;
            }
          } else {
            if (result[0].c_parentId === undefined) {
              categorydata.c_category_order = 1;
              categorydata.c_spl_category_order = 1;
              categorydata.c_category_app_menu_sort_order = 1;
            } else {
              categorydata.c_category_order = lastID ? parseInt(lastID.c_category_order) + 1: 1;
              categorydata.c_spl_category_order = lastID1 ? parseInt(lastID1.c_spl_category_order) + 1: 1;
              categorydata.c_category_app_menu_sort_order = lastID2 ? parseInt(lastID2.c_category_app_menu_sort_order) + 1: 1;
            }
          }

          if (c_parentId !== "") {
            categorydata.c_parentId = c_parentId;
          }

          const categoriessData = new Categories(categorydata);

          await categoriessData
            .save()
            .then((result) => {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "Category added Successfully";
              sendResponse["payloadJson"] = result;
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
