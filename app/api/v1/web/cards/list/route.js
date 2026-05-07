import { NextResponse } from "next/server";
import connectMongoDB from "../../../../../../libs/mongodb";
import { Cards } from "../../../../../../models/cardsModel";
import {
  encryptCryptoResponse,
  decrypCryptoRequest,
} from "../../../../../../helper/helper";

export async function POST(request) {
  // ✅ Fix 1: wrap request.json() in try/catch — this was the crash cause
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json(
      { appStatusCode: 3, message: "", payloadJson: [], error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { n_page, n_limit, c_search_term } = body;

  // ✅ Fix 2: local response object per request — no more shared state
  const sendResponse = { appStatusCode: "", message: "", payloadJson: [], error: "" };

  try {
    await connectMongoDB();

    let _search = {};
    const n_limitTerm = n_limit;
    const n_pageTerm = n_page === 1 ? 0 : (n_page - 1) * n_limit;
    const searchTerm = c_search_term ? c_search_term : "";

    if (searchTerm !== "") {
      _search["$and"] = [{ $or: [{ c_cards_title: { $regex: searchTerm, $options: "i" } }] }];
    } else {
      _search["$and"] = [{ $and: [{ n_status: 1 }, { n_published: 1 }] }];
    }

    if (n_limitTerm !== "" && n_pageTerm !== "") {
      const data = await Cards.aggregate([
        { $match: _search },
        { $group: {
            _id: "$_id",
            c_cards_id: { $first: "$c_cards_id" },
            c_cards_title: { $first: "$c_cards_title" },
            c_cards_embed_code: { $first: "$c_cards_embed_code" },
            c_cards_parentId: { $first: "$c_cards_parentId" },
            c_cards_share_url: { $first: "$c_cards_share_url" },
            c_cards_img_url: { $first: "$c_cards_img_url" },
            c_cards_comments: { $first: "$c_cards_comments" },
            c_cards_type: { $first: "$c_cards_type" },
            c_cards_likes: { $first: "$c_cards_likes" },
            createdAt: { $first: "$createdAt" },
            c_createdBy: { $first: "$c_createdBy" },
            n_status: { $first: "$n_status" },
            n_published: { $first: "$n_published" },
        }},
        { $lookup: { from: "users", localField: "c_createdBy", foreignField: "user_id", as: "users" }},
        { $unwind: "$users" },
        { $project: {
            _id: 1, c_cards_id: 1, c_cards_title: 1, c_cards_parentId: 1,
            c_cards_share_url: 1, c_cards_img_url: 1, c_cards_comments: 1,
            c_cards_type: 1, c_cards_likes: 1, createdAt: 1, c_createdBy: 1,
            c_createdName: "$users.user_name", n_status: 1, n_published: 1, c_cards_embed_code: 1,
        }},
        { $sort: { createdAt: -1 }},
        { $facet: {
            data: [{ $skip: n_pageTerm }, { $limit: n_limitTerm }],
            total_count: [{ $count: "count" }],
        }},
      ]);

      const encryptRes = encryptCryptoResponse(data[0]);
      sendResponse.appStatusCode = 0;
      sendResponse.message = data[0].data.length > 0 ? "" : "Record not found!";
      sendResponse.payloadJson = data[0].data.length > 0 ? encryptRes : [];
      sendResponse.error = [];
    } else {
      sendResponse.appStatusCode = 3;
      sendResponse.error = "Invalid Payload";
    }

    return NextResponse.json(sendResponse, { status: 200 });
  } catch (err) {
    console.error("[cards/list POST] error:", err.message);
    return NextResponse.json(
      { appStatusCode: 4, message: [], payloadJson: [], error: "Something went wrong!" },
      { status: 400 }
    );
  }
}