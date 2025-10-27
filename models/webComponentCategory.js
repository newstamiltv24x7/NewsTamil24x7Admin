const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const WebComponentCategorySchema = new Schema(
  {
    c_web_component_category_id: {
      type: String,
      required: [true, "Web Component Category id is required"],
      unique:true,
      trim: true,
      lowercase: true,
    },
    c_web_component_category_name: {
        type: String,
        required: [true, "Web Component Category name is required"],
        unique:true
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

const WebComponentCategory =
  mongoose.models.WebComponentCategory ||
  mongoose.model("WebComponentCategory", WebComponentCategorySchema);
module.exports = { WebComponentCategory };
