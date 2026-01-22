import { NextResponse } from "next/server";
import { Story } from "@/models/storyModel";
import connectMongoDB from "@/libs/mongodb";

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    await connectMongoDB();

    let potentialSlugs = [];

    try {
      const urlObj = new URL(url);
      const pathname = decodeURIComponent(urlObj.pathname); // e.g. /article/category/slug
      
      // Remove leading slash
      const cleanPath = pathname.startsWith('/') ? pathname.slice(1) : pathname; 
      
      // 1. Try full path (e.g. article/category/slug)
      potentialSlugs.push(cleanPath);

      // 2. Try removing 'article/' prefix
      if (cleanPath.startsWith('article/')) {
        potentialSlugs.push(cleanPath.replace('article/', ''));
      }

      // 3. Try removing 'news/' prefix (if exists)
      if (cleanPath.startsWith('news/')) {
        potentialSlugs.push(cleanPath.replace('news/', ''));
      }

      // 4. Try just the last segment (slug)
      const segments = cleanPath.split('/').filter(Boolean);
      if (segments.length > 0) {
        potentialSlugs.push(segments[segments.length - 1]);
      }

    } catch (e) {
      // If not a valid URL, treat the whole string as a potential slug/id
      potentialSlugs.push(url);
    }

    // Filter out duplicates and empty strings
    potentialSlugs = [...new Set(potentialSlugs)].filter(Boolean);

    // Search in multiple fields
    // story_desk_created_name often holds "category/slug"
    // story_english_name often holds "slug"
    // story_id holds ID
    let story = await Story.findOne({
      $or: [
        { story_desk_created_name: { $in: potentialSlugs } },
        { story_english_name: { $in: potentialSlugs } },
        { story_id: { $in: potentialSlugs } }
      ]
    }).select(
      "story_title_name story_thumb_image_url story_cover_image_url story_english_name story_desk_created_name story_id"
    );

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    const payload = {
      title: story.story_title_name,
      image: story.story_thumb_image_url || story.story_cover_image_url,
      url: url,
    };

    return NextResponse.json({ payload }, { status: 200 });
  } catch (error) {
    console.error("Error fetching article meta:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
