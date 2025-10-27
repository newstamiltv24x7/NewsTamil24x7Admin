import { NextResponse } from "next/server";
// import connectMongoDB from "../../../../../../libs/mongodb";
import { Categories } from "../../../../../../models/categoriesModel";
import connectMongoDB from "@/libs/mongodb";
import { verifyAccessToken } from "@/helper/helper";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};



export async function POST(request) {
  const { n_page, n_limit, c_search_term, c_type, c_cate_type } =
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
        typeView = { c_category_order: 1 };
      }

      if (searchTerm !== "") {
        _search["$or"] = [
          {
            $or: [
              { c_category_name: { $regex: searchTerm, $options: "i" } },
              {
                c_category_english_name: { $regex: searchTerm, $options: "i" },
              }
            ],
             $and: [{c_parentId: { $exists: c_cate_type === "main" ? false : true }}],
          },
         
          // { createdAt: { $gte: fromDate, $lte: toDate } },
        ];
      } else {
        _search["$or"] = [
          {
            $or: [
              { n_status: 1 }, { n_published: 1 },
             
            ],
            $and: [{c_parentId: { $exists: c_cate_type === "main" ? false : true }}],
          },
          
        ];
      }

      if (n_limitTerm !== "" && n_pageTerm !== "") {
        await connectMongoDB();

        await Categories.aggregate([
          {$match: _search},
          {
            $group: {
              _id: "$_id",
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
              c_category_order: { $first: "$c_category_order" },
              c_category_app_menu_sort_order: {
                $first: "$c_category_app_menu_sort_order",
              },
              createdAt: { $first: "$createdAt" },
              createdBy: { $first: "$createdBy" },
              n_status: { $first: "$n_status" },
              n_published: { $first: "$n_published" },
            },
          },
          // {
          //   $lookup: {
          //     from: 'users',
          //     let: {searchId: {$toObjectId: "$createdBy"}}, 
          //     pipeline:[
          //       {$match: {$expr:[ {_id: "$$searchId"}]}},
          //       {$project:{user_name: 1}}
          //     ],
          //     as: 'users'
          //   }
          // },

          {
            $lookup: {
                    from: "branch",
                    localField: "c_item_code",
                    foreignField: "c_item_code",
                    as: "branch"
                }
         },
         {
            $unwind: "$branch"
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
          .then((data) => {
            if (data[0].data.length > 0) {
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
