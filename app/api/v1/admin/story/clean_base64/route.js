import { NextResponse } from "next/server";
import { Story } from "../../../../../../models/storyModel";
import connectMongoDB from "../../../../../../libs/mongodb";
import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});
const s3 = new AWS.S3();

async function replaceBase64ImagesWithS3(htmlContent) {
  if (!htmlContent) return htmlContent;
  
  const base64Regex = /<img[^>]+src="(data:image\/([^;]+);base64,([^"]+))"[^>]*>/g;
  const matches = [...htmlContent.matchAll(base64Regex)];
  if (matches.length === 0) return htmlContent;
  
  let cleanedHtml = htmlContent;
  for (const match of matches) {
    try {
      const [, dataUrl, imageType, base64Data] = match;
      const buffer = Buffer.from(base64Data, "base64");
      const fileName = `cleanup-${Date.now()}-${Math.random().toString(36).slice(2)}.${imageType}`;
      const result = await s3.upload({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: `image/${imageType}`,
      }).promise();
      cleanedHtml = cleanedHtml.replace(dataUrl, result.Location);
    } catch (err) {
      console.error("Failed to upload image:", err);
    }
  }
  return cleanedHtml;
}

export async function GET(request) {
  try {
    await connectMongoDB();
    
    const { searchParams } = new URL(request.url);
    const batchSize = parseInt(searchParams.get("batch") || "5");
    
    // Find stories with base64 images
    const stories = await Story.find(
      { story_details: { $regex: "data:image" } },
      { _id: 1, story_details: 1, story_title_name: 1 }
    ).limit(batchSize);
    
    if (stories.length === 0) {
      return NextResponse.json({ 
        message: "All stories cleaned!", 
        remaining: 0 
      });
    }
    
    const results = [];
    for (const story of stories) {
      const cleanedDetails = await replaceBase64ImagesWithS3(story.story_details);
      await Story.findByIdAndUpdate(story._id, { 
        story_details: cleanedDetails 
      });
      results.push({
        id: story._id,
        title: story.story_title_name,
        status: "cleaned"
      });
    }
    
    // Count remaining
    const remaining = await Story.countDocuments({ 
      story_details: { $regex: "data:image" } 
    });
    
    return NextResponse.json({ 
      cleaned: results.length,
      remaining,
      stories: results
    });
    
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}