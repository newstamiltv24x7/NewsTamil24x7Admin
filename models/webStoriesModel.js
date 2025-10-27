const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const WebStoriesSchema = new Schema(
  {
    c_web_story_title: {
      type: String,
      required: [true, "web story title is required"],
      trim: true,
      unique: true,
    },
    c_web_story_slug_name: {
      type: String,
      trim: true,
    },
    c_web_story_cover_img: {
      type: String,
      // required: [true, "web story cover image is required"],
      // trim: true,
      // unique: true,
    },
    c_web_story_id: {
      type: String,
      trim: true,
      unique: true,
    },
    c_web_story_images: [
      {
        image_url: {
          type: String,
          required: [true, "web story image is required"],
          unique: true,
          trim: true,
        },
        c_web_story_content: {
            type: String,
            trim: true,
          },
          web_story_redirect_url: {
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
    ],
   
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

const WebStories =
  mongoose.models.WebStories || mongoose.model("WebStories", WebStoriesSchema);

module.exports = { WebStories };
