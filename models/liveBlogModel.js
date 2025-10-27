const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var validator = require("validator");

const LiveBlogSchema = new Schema(
  {
    c_live_blog_id: {
      type: String,
      required: [true, "Live Blog Id is required"],
      unique: true,
      trim: true,
    },
    c_live_blog_title: {
      type: String,
      required: [true, "Live Blog title is required"],
      trim: true,
    },
    c_live_blog_english_title: {
      type: String,
      required: [true, "Live Blog English title is required"],
      trim: true,
    },
    c_live_blog_short_name: {
      type: String,
      required: [true, "Live Blog short name is required"],
      trim: true,
    },
    c_live_blog_slug_title: {
      type: String,
      required: [true, "Live Blog slug title is required"],
      trim: true,
    },
    c_live_blog_content: {
      type: String,
      required: [true, "Live Blog content is required"],
      trim: true,
      unique: true,
    },
    c_live_blog_image_url: {
      type: String,
      trim: true,
    },
    live_status: {
      type: Number,
      trim: true,
    },
    c_live_sub_blog: [
      {
        c_live_sub_blog_title: {
          type: String,
          trim: true,
        },
        c_live_sub_blog_content: {
          type: String,
          trim: true,
          unique: true,
        },
        c_live_sub_blog_image_url: {
          type: String,
          trim: true,
        },
        c_live_sub_blog_create_date: {
          type: Date,
          trim: true,
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
      ref: "User",
    },
    c_updatedBy: {
      type: String,
      ref: "User",
    },
    c_deletedBy: {
      type: String,
      ref: "User",
    },
    n_status: {
      type: Number,
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

const LiveBlog =
  mongoose.models.LiveBlog || mongoose.model("LiveBlog", LiveBlogSchema);

module.exports = { LiveBlog };
