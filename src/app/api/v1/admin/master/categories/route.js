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
      c_web_component_category_id: cat.c_web_component_category_id,
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
      c_sub_categories: createCategories(categorieses, cat._id),
    });
  }

  return categoryList;
}

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
  } = await request.json();

  try {
    await connectMongoDB();
    const verified = verifyAccessToken();

    const checkCategory = await Categories.findOne({
      c_category_name: c_category_name,
    });


    if(verified.success){

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
          const body = {
            c_category_name: c_category_name,
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
        } else if (checkCategory !== null) {
          sendResponse["appStatusCode"] = 4;
          sendResponse["message"] = [];
          sendResponse["payloadJson"] = [];
          sendResponse["error"] = "Category already exist";
          return NextResponse.json(sendResponse, { status: 200 });
        } else if (checkCategory === null) {
            const result = await Categories.find().sort({ _id: -1 }).limit(1);
  
            const categorydata = {
              c_web_component_category_id,
              c_category_id: create_UUID(),
              c_category_name,
              c_parentId,
              c_category_english_name,
              c_category_image_url,
              c_category_class,
              c_category_type,
              c_category_meta_title,
              c_category_meta_description,
              c_category_meta_keywords,
              c_createdBy: verified.data.user_id,
            };
  
            if (c_parentId === undefined) {
              if (result.length === 0) {
                categorydata.c_category_order = 1;
                categorydata.c_category_app_menu_sort_order = 1;
              } else {
                categorydata.c_category_order = result[0].c_category_order + 1;
                categorydata.c_category_app_menu_sort_order =
                  result[0].c_category_app_menu_sort_order + 1;
              }
            } else {
              
  
              if (result[0].c_parentId === undefined) {
                categorydata.c_category_order = 1;
                categorydata.c_category_app_menu_sort_order = 1;
              } else {
                categorydata.c_category_order =
                  result[0].c_category_order + 1;
                categorydata.c_category_app_menu_sort_order =
                  result[0].c_category_app_menu_sort_order + 1;
              }
            }
  
            if (c_parentId !== "") {
              categorydata.c_parentId = c_parentId;
            }
  
            const categoriessData = new Categories(categorydata);
  
            await categoriessData.save().then((result) => {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "Category added Successfully";
              sendResponse["payloadJson"] = result;
              sendResponse["error"] = [];
            }).catch((err) => {
              sendResponse["appStatusCode"] = 4;
              sendResponse["message"] = "";
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = err;
            });
          
  
          return NextResponse.json(sendResponse, { status: 200 });
        }
      }

    }else{
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

export async function GET() {
  let data = {
    n_status: 1,
    n_published: 1,
  };

  try {


    const verified = verifyAccessToken();

    if(verified.success){
      await connectMongoDB();
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
      
    }else{
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

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await connectMongoDB();

  const body = {
    n_status: 0,
    n_published: 0,
  };

  try {
    await Categories.findByIdAndUpdate(id, body).then((result) => {
      if (result) {
        sendResponse["appStatusCode"] = 0;
        sendResponse["message"] = "Deleted Successfully";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "";
      } else {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = "";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Invalid Id!";
      }
    });
    return NextResponse.json(sendResponse, { status: 200 });
  } catch (error) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = "";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "Something went wrong";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
