const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const SocialHandlePageSchema = new Schema(
  {
    c_social_handle_category_id: {
      type: String,
      required: [true, "Social Handle Category Id is required"],
      trim: true,
    },
    c_social_handle_page_id: {
      type: String,
      required: [true, "Social Handle Page Id is required"],
      unique: true,
      trim: true,
    },
    c_social_handle_page_title: {
      type: String,
      required: [true, "Social Handle Page Title is required"],
      trim: true,
    },
    c_social_handle_page_name: {
      type: String,
      trim: true,
    },
    c_social_handle_page_h_rules_name: {
      type: String,
      trim: true,
    },
    c_social_handle_page_status: {
      type: String,
      required: true,
      enum: ["Live", "Expired", "Deleted", "Stopautoposting"],
      default: "Live",
    },
    c_social_handle_page_type: {
      type: String,
      required: true,
      enum: ["Timeline", "Page", "Channel"],
      default: "Timeline",
    },
    c_social_handle_page_flag: {
      type: Number,
      required: true,
      enum: [0, 1],
      default: 0,
    },
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

const SocialHandlePage =
  mongoose.models.SocialHandlePage ||
  mongoose.model("SocialHandlePage", SocialHandlePageSchema);

module.exports = { SocialHandlePage };
