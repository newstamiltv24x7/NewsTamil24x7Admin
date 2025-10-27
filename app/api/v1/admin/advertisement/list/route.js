import { NextResponse } from "next/server";
import { Advertisement } from "../../../../../../models/advertisementModel";
import connectMongoDB from "../../../../../../libs/mongodb";
import { verifyAccessToken } from "../../../../../../helper/helper";

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

export async function POST(request) {
  const { n_page, n_limit, c_search_term, c_from_date, c_to_date } =
    await request.json();

  const verified = verifyAccessToken();

  try {
    await connectMongoDB();

    if (verified.success) {
      let fromDate = "";
      let toDate = "";

      if (c_from_date !== "" || c_to_date !== "") {
        // fromDate = new Date(c_from_date).toISOString();
        // toDate = new Date(c_to_date).toISOString();

        fromDate = new Date(c_from_date);
        toDate = new Date(c_to_date);
        // toDate.setDate(toDate.getDate() + 1);
      }

      let _search = {};
      let n_limitTerm = n_limit;
      let n_pageTerm = n_page === 1 ? 0 : (n_page - 1) * n_limit;
      let searchTerm = c_search_term ? c_search_term : "";

      if (fromDate !== "" && toDate !== "") {
        if (searchTerm !== "") {
          _search["$and"] = [
            {
              $and: [{ c_advt_title: { $regex: searchTerm, $options: "i" } }],
              $and: [{ n_status: 1 }, { n_published: 1 }],
              $and: [{ c_banner_start_date: { $gte: fromDate, $lte: toDate } }],
            },
          ];
        } else {
          _search["$and"] = [
            {
              $and: [{ n_status: 1 }, { n_published: 1 }],
              $and: [{ c_banner_start_date: { $gte: fromDate, $lte: toDate } }],
            },
          ];
        }
      } else {
        if (searchTerm !== "") {
          _search["$and"] = [
            {
              $or: [{ c_advt_title: { $regex: searchTerm, $options: "i" } }],
            },
          ];
        } else {
          _search["$and"] = [
            {
              $and: [{ n_status: 1 }, { n_published: 1 }],
            },
          ];
        }
      }

      if (n_limitTerm !== "" && n_pageTerm !== "") {
        await connectMongoDB();

        await Advertisement.aggregate([
          { $match: _search },
          {
            $group: {
              _id: "$_id",
              c_advt_title: { $first: "$c_advt_title" },
              c_advt_id: { $first: "$c_advt_id" },
              c_advt_type: { $first: "$c_advt_type" },
              c_advt_banner_url: { $first: "$c_advt_banner_url" },
              c_advt_banner_redirect_url: {
                $first: "$c_advt_banner_redirect_url",
              },
              c_banner_start_date: { $first: "$c_banner_start_date" },
              c_banner_start_time: { $first: "$c_banner_start_time" },
              c_banner_end_date: { $first: "$c_banner_end_date" },
              c_banner_end_time: { $first: "$c_banner_end_time" },
              c_banner_position: { $first: "$c_banner_position" },
              c_banner_view_pages: { $first: "$c_banner_view_pages" },
              c_target_device: { $first: "$c_target_device" },
              c_banner_width: { $first: "$c_banner_width" },
              c_banner_height: { $first: "$c_banner_height" },
              c_banner_target_country_id: {
                $first: "$c_banner_target_country_id",
              },
              c_banner_target_state_id: { $first: "$c_banner_target_state_id" },
              c_banner_target_city_id: { $first: "$c_banner_target_city_id" },

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
              c_advt_title: 1,
              c_advt_type: 1,
              c_advt_id: 1,
              c_advt_banner_url: 1,
              c_advt_banner_redirect_url: 1,
              c_banner_start_date: 1,
              c_banner_start_time: 1,
              c_banner_end_date: 1,
              c_banner_end_time: 1,
              c_banner_position: 1,
              c_target_device: 1,
              c_banner_width: 1,
              c_banner_height: 1,
              c_banner_view_pages: 1,
              c_banner_target_country_id: 1,
              c_banner_target_state_id: 1,
              c_banner_target_city_id: 1,
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

export async function GET(request) {
  const verified = verifyAccessToken();
  const id = request.nextUrl.searchParams.get("id");

  if (verified.success) {
    if (id) {
      const checkId = await Advertisement.findOne({ c_advt_id: id });
      if (checkId) {
        let _search = {};
        _search["$and"] = [
          {
            $and: [{ n_status: 1 }, { n_published: 1 }, { c_advt_id: id }],
          },
        ];

        try {
          await connectMongoDB();

          await Advertisement.aggregate([
            { $match: _search },
            {
              $group: {
                _id: "$_id",
                c_advt_title: { $first: "$c_advt_title" },
                c_advt_id: { $first: "$c_advt_id" },
                c_advt_type: { $first: "$c_advt_type" },
                c_advt_banner_url: { $first: "$c_advt_banner_url" },
                c_advt_banner_redirect_url: {
                  $first: "$c_advt_banner_redirect_url",
                },
                c_banner_start_date: { $first: "$c_banner_start_date" },
                c_banner_start_time: { $first: "$c_banner_start_time" },
                c_banner_end_date: { $first: "$c_banner_end_date" },
                c_banner_end_time: { $first: "$c_banner_end_time" },
                c_target_device: { $first: "$c_target_device" },
                c_banner_width: { $first: "$c_banner_width" },
                c_banner_height: { $first: "$c_banner_height" },
                c_banner_position: { $first: "$c_banner_position" },
                c_banner_view_pages: { $first: "$c_banner_view_pages" },
                c_banner_target_country_id: {
                  $first: "$c_banner_target_country_id",
                },
                c_banner_target_state_id: {
                  $first: "$c_banner_target_state_id",
                },
                c_banner_target_city_id: { $first: "$c_banner_target_city_id" },
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
              $lookup: {
                from: "categories",
                localField: "c_banner_view_pages",
                foreignField: "c_category_id",
                as: "categories",
              },
            },
            {
              $unwind: "$categories",
            },

            {
              $lookup: {
                from: "countries",
                localField: "c_banner_target_country_id",
                foreignField: "id",
                as: "countriesById",
              },
            },
            {
              $unwind: {
                path: "$countriesById",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "states",
                localField: "c_banner_target_state_id",
                foreignField: "id",
                as: "statesById",
              },
            },
            {
              $unwind: {
                path: "$statesById",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "cities",
                localField: "c_banner_target_city_id",
                foreignField: "id",
                as: "citiesById",
              },
            },
            {
              $unwind: {
                path: "$citiesById",
                preserveNullAndEmptyArrays: true,
              },
            },

            {
              $project: {
                _id: 1,
                c_advt_title: 1,
                c_advt_id: 1,
                c_advt_type: 1,
                c_advt_banner_url: 1,
                c_advt_banner_redirect_url: 1,
                c_banner_start_date: 1,
                c_banner_start_time: 1,
                c_banner_end_date: 1,
                c_banner_end_time: 1,
                c_banner_position: 1,
                c_target_device: 1,
                c_banner_width: 1,
                c_banner_height: 1,
                c_banner_view_pages: 1,
                c_banner_target_country_id: 1,
                c_banner_target_state_id: 1,
                c_banner_target_city_id: 1,
                createdAt: 1,
                c_createdBy: 1,
                c_createdName: "$users.user_name",
                c_banner_view_page_name: "$categories.c_category_name",
                country_name: "$countriesById.name",
                state_name: "$statesById.name",
                city_name: "$citiesById.name",
                n_status: 1,
                n_published: 1,
              },
            },
            {
              $sort: { createdAt: -1 },
            },
          ])
            .then((data) => {
              if (data.length > 0) {
                sendResponse["appStatusCode"] = 0;
                sendResponse["message"] = "";
                sendResponse["payloadJson"] = data[0];
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

        await Advertisement.aggregate([
          { $match: _search },
          {
            $group: {
              _id: "$_id",
              c_advt_title: { $first: "$c_advt_title" },
              c_advt_id: { $first: "$c_advt_id" },
              c_advt_type: { $first: "$c_advt_type" },
              c_advt_banner_url: { $first: "$c_advt_banner_url" },
              c_advt_banner_redirect_url: {
                $first: "$c_advt_banner_redirect_url",
              },
              c_banner_start_date: { $first: "$c_banner_start_date" },
              c_banner_start_time: { $first: "$c_banner_start_time" },
              c_banner_end_date: { $first: "$c_banner_end_date" },
              c_banner_end_time: { $first: "$c_banner_end_time" },
              c_target_device: { $first: "$c_target_device" },
              c_banner_width: { $first: "$c_banner_width" },
              c_banner_height: { $first: "$c_banner_height" },
              c_banner_position: { $first: "$c_banner_position" },
              c_banner_view_pages: { $first: "$c_banner_view_pages" },
              c_banner_target_country_id: {
                $first: "$c_banner_target_country_id",
              },
              c_banner_target_state_id: { $first: "$c_banner_target_state_id" },
              c_banner_target_city_id: { $first: "$c_banner_target_city_id" },
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
            $lookup: {
              from: "categories",
              localField: "c_banner_view_pages",
              foreignField: "c_category_id",
              as: "categories",
            },
          },
          {
            $unwind: "$categories",
          },
          {
            $lookup: {
              from: "countries",
              localField: "c_banner_target_country_id",
              foreignField: "id",
              as: "countriesById",
            },
          },
          {
            $unwind: {
              path: "$countriesById",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "states",
              localField: "c_banner_target_state_id",
              foreignField: "id",
              as: "statesById",
            },
          },
          {
            $unwind: {
              path: "$statesById",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "cities",
              localField: "c_banner_target_city_id",
              foreignField: "id",
              as: "citiesById",
            },
          },
          {
            $unwind: {
              path: "$citiesById",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              c_advt_title: 1,
              c_advt_id: 1,
              c_advt_type: 1,
              c_advt_banner_url: 1,
              c_advt_banner_redirect_url: 1,
              c_banner_start_date: 1,
              c_banner_start_time: 1,
              c_banner_end_date: 1,
              c_banner_end_time: 1,
              c_target_device: 1,
              c_banner_width: 1,
              c_banner_height: 1,
              c_banner_position: 1,
              c_banner_view_pages: 1,
              c_banner_target_country_id: 1,
              c_banner_target_state_id: 1,
              c_banner_target_city_id: 1,
              createdAt: 1,
              c_createdBy: 1,
              c_createdName: "$users.user_name",
              c_banner_view_page_name: "$categories.c_category_name",
              country_name: "$countriesById.name",
              state_name: "$statesById.name",
              city_name: "$citiesById.name",
              n_status: 1,
              n_published: 1,
            },
          },
          {
            $sort: { createdAt: -1 },
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
  } else {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = "";
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "token expired!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
