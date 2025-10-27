const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const SeoContentSchema = new Schema(
  {
    c_seo_category_id: {
      type: String,
      required: [true, "Seo Category Id is required"],
      unique: true,
      trim: true,
    },
    c_seo_content_id: {
      type: String,
      required: [true, "Seo Category Title is required"],
      trim: true,
    },
    c_seo_page_title: {
      type: String,
      trim: true,
    },
    c_seo_page_description: {
      type: String,
      trim: true,
    },
    c_seo_page_keywords: {
      type: String,
      trim: true,
    },
    c_seo_social_image_sharing: [
      {
        c_img_url: {
          type: String,
          trim: true,
        },
        c_youtube_url: {
          type: String,
          trim: true,
        },
      },
    ],
    c_seo_scripts: [
      {
        c_header_tag: {
          type: String,
          trim: true,
        },
        c_body_tag: {
          type: String,
          trim: true,
        },
        c_amp_header_tag: {
          type: String,
          trim: true,
        },
        c_amp_body_tag: {
          type: String,
          trim: true,
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

const SeoContent =
  mongoose.models.SeoContent ||
  mongoose.model("SeoContent", SeoContentSchema);

module.exports = { SeoContent };
