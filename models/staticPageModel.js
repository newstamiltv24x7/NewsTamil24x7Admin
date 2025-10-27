const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const StaticPageSchema = new Schema(
  {
    c_static_page_id: {
      type: String,
      required: [true, "Static Page id is required"],
      trim: true,
      lowercase: true,
      unique: true
    },
    c_static_menu_page_id: {
      type: String,
      required: [true, "Static Menu Page id is required"],
      trim: true,
      lowercase: true,
      unique: true
    },
    
    c_static_page_title: {
      type: String,
      trim: true,
    },
    c_static_page_description: {
      type: String,
      trim: true,
    },
    c_static_page_keywords: {
      type: String,
      trim: true,
    },
    c_static_page_content: {
      type: String,
      required: true,
      trim: true
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

const StaticPage =
  mongoose.models.StaticPage || mongoose.model("StaticPage", StaticPageSchema);
module.exports = { StaticPage };
