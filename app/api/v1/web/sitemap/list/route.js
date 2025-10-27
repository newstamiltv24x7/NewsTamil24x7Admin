import { NextResponse } from "next/server";
import { Categories } from "../../../../../../models/categoriesModel";
import connectMongoDB from "../../../../../../libs/mongodb";
import { converDayDate } from "@/helper/frontend_helper";

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



function getUniqueListBy(arr, key) {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
}

function createStoryData(categorieses) {

  categorieses.sort(function(a, b) {
    var c = new Date(a.updatedAt);
    var d = new Date(b.updatedAt);
    return c-d;
});
 
  const categoryList = [];
  let category;
 
  category = categorieses.filter((cate) => cate.c_save_type == "published");

  



  
  for (let cat of category) {
    categoryList.push({
      monthData: `${process.env.NEXT_PUBLIC_BASE_URL}sitemap/${converDayDate(cat.updatedAt)}/sitemap.xml`,
      updatedAt: cat.updatedAt
    });
  }

  return categoryList;
}



function createStoriesCheck(categorieses) {


  const categoryList = [];
  let category;
 
  category = categorieses.filter((cate) => cate.c_save_type == "published");
  
  for (let cat of category) {
    categoryList.push({
      _id: cat.id.toString(),
      url: `${process.env.NEXT_PUBLIC_BASE_URL}${"article/"}${
        cat.story_desk_created_name
      }`,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt
    });
  }

  return categoryList;
}

function createStories(categorieses) {
 
  const categoryList = [];
  let category;
 
  category = categorieses.filter((cate) => cate.c_save_type == "published");
  
  for (let cat of category) {
    categoryList.push({
      _id: cat.id.toString(),
      url: `${process.env.NEXT_PUBLIC_BASE_URL}${"article/"}${
        cat.story_desk_created_name
      }`,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt
    });
  }

  return categoryList;
}

function createCategories(categorieses) {
  const categoryList = [];

  for (let cat of categorieses) {
    categoryList.push({
      _id: cat._id,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}${
        cat.c_category_english_name === "photos" ? "" : "news/"
      }${cat.c_category_slug_english_name}`,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
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
  const yearMonth = request.nextUrl.searchParams.get("yearMonth");
  
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
              story_desk_created_name:
                "$storycreatedId.story_desk_created_name",
              createdAt: "$storycreatedId.createdAt",
              updatedAt: "$storycreatedId.updatedAt",
            },
          },
          {
            $sort: { c_category_order: -1 },
          },
        ])
          .then((data) => {
            
            const categoryData = createStories(data);
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
  }else if(yearMonth){



    const firstDateOfMonth = (date = new Date()) => new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDateOfMonth = (date = new Date()) => new Date(date.getFullYear(), date.getMonth() + 1, 0);







    let fromDates = ""
    let toDates = ""
    
    const dateArray = yearMonth.split("/");
    const targetYear = parseInt(dateArray[0])
    const targetMonth = parseInt(dateArray[1])


    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth()+1; // Months are 0-indexed

    const isInTargetMonth = (currentYear === targetYear && currentMonth === targetMonth);

    // Output results
if (isInTargetMonth) {
  fromDates = firstDateOfMonth(new Date(`${targetYear}-${targetMonth}`)).toLocaleString("en-US", {timeZone: "Asia/Kolkata"})
  toDates = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
  
} else {
  fromDates = firstDateOfMonth(new Date(`${targetYear}-${targetMonth}`)).toLocaleString("en-US", {timeZone: "Asia/Kolkata"})
  toDates = lastDateOfMonth(new Date(`${targetYear}-${targetMonth}`)).toLocaleString("en-US", {timeZone: "Asia/Kolkata"})
}



const fromDate = new Date(fromDates);
const toDate = new Date(toDates);



    try {
      await connectMongoDB();
      let _search = {};
      _search["$and"] = [
        {
          $and: [{ n_status: 1 }, { n_published: 1 },
          ],
        },
        
      ];
      // await connectMongoDB();
      await Categories.aggregate([
        { $match: _search },
        {
          $group: {
            _id: "$_id",
            c_category_id: { $first: "$c_category_id" },
            c_category_english_name: { $first: "$c_category_english_name" },
            c_category_slug_english_name: { $first: "$c_category_slug_english_name" },            
            createdAt: { $first: "$createdAt" },
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
          $match: {
            'storycreatedId.updatedAt': {  $gte: fromDate, $lte: toDate  },
          },
        },
        {
          $project: {
            _id: 1,
            c_category_english_name: 1,
            c_category_slug_english_name: 1,
            story_desk_created_name: "$storycreatedId.story_desk_created_name",
            id: "$storycreatedId._id",
            createdAt: "$storycreatedId.createdAt",
            updatedAt: "$storycreatedId.updatedAt",
            c_save_type: "$storycreatedId.c_save_type"
          }
        },
        {
          $sort: { updatedAt: -1 },
        },
      ])
        .then((data) => {
          const arr = getUniqueListBy(data, "story_desk_created_name");
          const arr1 = getUniqueListBy(data, "c_category_english_name");

          const searchArr = [
            {
              url: `${process.env.NEXT_PUBLIC_BASE_URL}${"videos"}`,
              createdAt: "2024-07-28T11:25:30.357Z",
              updatedAt: "2024-07-28T11:26:11.229Z",
            },
            {
              url: `${process.env.NEXT_PUBLIC_BASE_URL}${"photos"}`,
              createdAt: "2024-07-28T11:25:30.357Z",
              updatedAt: "2024-07-28T11:26:11.229Z",
            },
            {
              url: "https://www.newstamil.tv/",
              url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
              createdAt: "2024-07-28T11:25:30.357Z",
              updatedAt: "2024-07-28T11:26:11.229Z",
            },
          ];

          const categoryData = createStoriesCheck(arr);

          const categoryData1 = createCategories(arr1);

          const superArray = [...categoryData, ...categoryData1, ...searchArr];
          // const superArray = [...categoryData, ...categoryData1];

          //   const encryptRes = encryptCryptoResponse(categoryData);
          //   const decryptRes = decrypCryptoRequest(encryptRes);

          if (data.length > 0) {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "";
            sendResponse["payloadJson"] = superArray;
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
    try {
      await connectMongoDB();
      let _search = {};
      _search["$and"] = [
        {
          $and: [{ n_status: 1 }, { n_published: 1 }],
        },
      ];
      // await connectMongoDB();
      await Categories.aggregate([
        { $match: _search },
        {
          $group: {
            _id: "$_id",
            c_category_id: { $first: "$c_category_id" },
            c_category_english_name: { $first: "$c_category_english_name" },
            createdAt: { $first: "$createdAt" },
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
            c_category_english_name: 1,
            story_desk_created_name: "$storycreatedId.story_desk_created_name",
            id: "$storycreatedId._id",
            createdAt: "$storycreatedId.createdAt",
            updatedAt: "$storycreatedId.updatedAt",
            c_save_type: "$storycreatedId.c_save_type"
          },
        },
        {
          $sort: { updatedAt: -1 },
        },
      ])
        .then((data) => {


          const arr = getUniqueListBy(data, "story_desk_created_name");
          const arr1 = getUniqueListBy(data, "c_category_english_name");

          const searchArr = [
            {
              url: `${process.env.NEXT_PUBLIC_BASE_URL}${"search"}`,
              createdAt: "2024-07-28T11:25:30.357Z",
              updatedAt: "2024-07-28T11:26:11.229Z",
            },
          ];


          

          const storyData = createStoryData(arr);


          
          const dummyData = getUniqueListBy(storyData, "monthData")


          



          dummyData.sort(function(a, b) {
            var c = new Date(a.updatedAt);
            var d = new Date(b.updatedAt);
            return d-c;
        });

          const categoryData = createStories(arr);
          const categoryData1 = createCategories(arr1);

          const superArray = [...categoryData, ...categoryData1, ...searchArr];

          //   const encryptRes = encryptCryptoResponse(categoryData);
          //   const decryptRes = decrypCryptoRequest(encryptRes);

          if (data.length > 0) {
            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "";
            sendResponse["payloadJson"] = dummyData;
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
