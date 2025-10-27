const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const YouTubeURLSchema = new Schema(
  {
    c_live_stream_category_id:{
      type: String,
      required: [true, "Live Stream Category is required"],
      trim: true,
    },
    c_url_subject: {
      type: String,
      required: [true, "Youtube Subject is required"],
      trim: true,
      unique: true,
    },
    c_url_title: {
      type: String,
      required: [true, "URL Title is required"],
      trim: true,
      unique: true,
    },
    c_url_content: {
      type: String,
      required: [true, "URL Content is required"],
      trim: true,
    },
    c_url_id: {
      type: String,
      required: [true, "URL id is required"],
      trim: true,
      unique: true,
    },
    c_url_link: {
      type: String,
      required: [true, "URL Link is required"],
      trim: true,
    },
    c_url_web_link: {
      type: String,
      required: [true, "URL WEB Link is required"],
      trim: true,
    },
    c_thumbanail_image: {
      type: String,
      required: [true, "URL Link is required"],
      trim: true,
    },
    c_url_order_id :{
      type: Number,
      required: [true, "URL order id is required"],
      trim: true,
    },
    c_video_type: {
      type: String,
      required: true,
      enum: ["live", "posted"],
      default: "live",
    },
    c_youtube_type: {
      type: String,
      required: true,
      enum: ["video", "shorts"],
      default: "video",
    },
    c_slug_url :{
      type: String,
      required: [true, "Slug URL is required"],
      trim: true,
    },
    c_createdBy: {
      type: String,
    },
    c_updatedBy: {
      type: String,
    },
    c_deletedBy: {
      type: String,
    },
    n_status: {
      type: Number,
      required: true,
      enum: [0, 1],
      default: 1,
    },
    n_published: {
      type: Number,
      required: true,
      enum: [0, 1],
      default: 1,
    },
  },
  { strict: false, versionKey: false, timestamps: true }
);

const YouTubeURL =
  mongoose.models.YouTubeURL || mongoose.model("YouTubeURL", YouTubeURLSchema);

module.exports = { YouTubeURL };
