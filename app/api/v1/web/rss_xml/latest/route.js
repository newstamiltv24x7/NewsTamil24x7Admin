import { NextResponse } from "next/server";
import { Story } from "../../../../../../models/storyModel";
import connectMongoDB from "../../../../../../libs/mongodb";

export async function GET(request) {
  try {
    await connectMongoDB();

    const articles = await Story.aggregate([
      {
        $match: {
          n_status: 1,
          n_published: 1,
          story_published_options: {
            $elemMatch: { c_opt_id: "0d5b395001b7", opt_check: 1 }
          }
        }
      },
      { $sort: { createdAt: -1 } },
      { $limit: 50 },
      {
        $lookup: {
          from: "categories",
          localField: "main_category_id",
          foreignField: "c_category_id",
          as: "categories",
        },
      },
      { $unwind: { path: "$categories", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "c_createdBy",
          foreignField: "user_id",
          as: "users",
        },
      },
      { $unwind: { path: "$users", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          story_title_name: 1,
          story_sub_title_name: 1,
          story_desk_created_name: 1,
          story_cover_image_url: 1,
          createdAt: 1,
          c_category_name: "$categories.c_category_name",
          c_createdName: "$users.user_name",
        },
      },
    ])

    return NextResponse.json({ appStatusCode: 0, payloadJson: articles }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ appStatusCode: 4, payloadJson: [], error: "Something went wrong" }, { status: 500 });
  }
}