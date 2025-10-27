const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const HRulesSchema = new Schema(
  {
    c_h_rules_id: {
      type: String,
      required: [true, "H Rules Id is required"],
      unique: true,
      trim: true,
    },
    c_h_rules_name: {
      type: String,
      required: [true, "H Rules Name is required"],
      trim: true,
    },
    c_h_rules_description: {
      type: String,
      required: [true, "H Rules description is required"],
      trim: true,
    },
    c_h_rules_tags: [{
        type: String,
        trim: true,
      }],
    c_h_rules_location: [
      {
        c_city_name: {
          type: String,
          trim: true,
        },
        c_city_id: {
          type: String,
          trim: true,
        },
      },
    ],
    c_h_rules_other_category: [
      {
        c_category_name: {
          type: String,
          trim: true,
        },
        c_category_id: {
          type: String,
          trim: true,
        },
      },
    ],
    c_h_rules_autor: [
      {
        c_author_name: {
          type: String,
          trim: true,
        },
        c_author_id: {
          type: String,
          trim: true,
        },
      },
    ],
    c_h_rules_handle_page: [
      {
        c_handle_page_id: {
          type: String,
          trim: true,
        },
        c_social_handle_page_flag:{
          type: String,
          trim: true,
        }
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

const HRules = mongoose.models.HRules || mongoose.model("HRules", HRulesSchema);

module.exports = { HRules };
