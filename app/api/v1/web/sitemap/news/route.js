/**
 * GET /api/v1/web/sitemap/news
 *
 * Returns articles published within the last 48 hours for the Google News sitemap.
 * Max 1 000 results, newest-first.  No pagination needed — Google News only
 * consumes the most recent window.
 */

import { NextResponse } from "next/server";
import connectMongoDB from "../../../../../../libs/mongodb";
import { Story } from "../../../../../../models/storyModel";
export const dynamic = 'force-dynamic';
const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL
  ? process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "")
  : "https://newstamil.tv";

export async function GET() {
  try {
    await connectMongoDB();

    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);

    const articles = await Story.find(
      {
        n_status: 1,
        n_published: 1,
        c_save_type: "published",
        createdAt: { $gte: cutoff },
      },
      {
        story_desk_created_name: 1,
        story_title_name: 1,
        createdAt: 1,
        _id: 0,
      }
    )
      .sort({ createdAt: -1 })
      .limit(1000)
      .lean();

    const payloadJson = articles
      .filter((a) => a.story_desk_created_name)
      .map((a) => ({
        url: `${SITE_URL}/article/${a.story_desk_created_name}`,
        story_title_name: a.story_title_name || "",
        createdAt: a.createdAt,
      }));

    return NextResponse.json(
      { appStatusCode: 0, message: "", payloadJson, error: [] },
      {
        status: 200,
        headers: {
          // Allow CDN to cache for 15 min; serve stale for 30 min while revalidating
          "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
        },
      }
    );
  } catch (err) {
    console.error("[sitemap/news] Error:", err);
    return NextResponse.json(
      { appStatusCode: 4, message: "Error", payloadJson: [], error: String(err) },
      { status: 500 }
    );
  }
}
