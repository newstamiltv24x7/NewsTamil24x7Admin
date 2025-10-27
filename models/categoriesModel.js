const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var validator = require("validator");

const CategoriesSchema = new Schema(
  {
    c_category_id: {
      type: String,
      required: [true, "Category Id is required"],
      unique: true,
      trim: true,
    },
    c_web_component_category_id: {
      type: String,
      required: [true, "Web Component Category  id is required"],
      trim: true,
    },
    c_category_order: {
      type: Number,
      required: [true, "Category order is required"],
      trim: true,

    },
    c_category_name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      validate(value) {
        if (!validator.isLength(value, { min: 2, max: 150 })) {
          throw Error("Length of the category name should be between 2-150");
        }
      },
    },
    c_category_english_name: {
      type: String,
      required: [true, "Category English name is required"],
      trim: true,
      unique: true,
      validate(value) {
        if (!validator.isLength(value, { min: 2, max: 150 })) {
          throw Error("Length of the category name should be between 2-150");
        }
      },
    },
    c_category_slug_english_name: {
      type: String,
      trim: true,
    },
    c_parentId: {
      type: String,
      trim: true,
    },
    c_category_image_url: {
      type: String,
      trim: true,
    },
    c_category_class: {
      type: String,
      trim: true,
    },
    c_category_type: {
      type: String,
      trim: true,
    },
    c_category_meta_title: {
      type: String,
      trim: true,
    },
    c_category_meta_description: {
      type: String,
      trim: true,
    },
    c_category_meta_keywords: {
      type: String,
      trim: true,
    },
    c_category_app_menu_sort_order: {
      type: Number,
      required: [true, "Category app order is required"],
      trim: true,
    },

    c_spl_category: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
    c_spl_category_order: {
      type: Number,
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

const Categories = mongoose.models.Categories || mongoose.model("Categories", CategoriesSchema);

module.exports = { Categories };

