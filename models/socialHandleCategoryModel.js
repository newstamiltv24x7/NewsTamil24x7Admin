const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const SocialHandleCategorySchema = new Schema(
  {
    c_social_handle_category_id: {
        type: String,
        required: [true, "Social Handle Category Id is required"],
        unique: true,
        trim: true,
      },
      c_social_handle_category_title: {
      type: String,
      required: [true, "Social Handle Category Title is required"],
      trim: true,
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

const SocialHandleCategory =
  mongoose.models.SocialHandleCategory ||
  mongoose.model("SocialHandleCategory", SocialHandleCategorySchema);

module.exports = { SocialHandleCategory };
