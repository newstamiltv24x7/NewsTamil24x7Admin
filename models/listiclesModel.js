const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const ListiclesSchema = new Schema(
  {
    c_category_id: {
      type: String,
      required: [true, "Category Id is required"],
      trim: true,
    },
    c_listicles_short_name: {
      type: String,
      required: [true, "Listicles short name is required"],
      trim: true,
    },
    c_listicles_title: {
      type: String,
      required: [true, "Listicles title is required"],
      trim: true,
    },
    c_listicles_slug_title: {
      type: String,
      required: [true, "Listicles slug title is required"],
      trim: true,
    },
    c_listicles_sub_title: {
      type: String,
      trim: true,
    },
    c_listicles_content: {
      type: String,
      trim: true,
    },
    c_listicles_img: {
      type: String,
    },
    
    c_listicles_id: {
      type: String,
      required: [true, "Listicles id is required"],
      trim: true,
    },
    c_listicles_continue_item: [
      {
        c_listicles_continue_sub_title: {
          type: String,
          required: [true, "Listicles sub title is required"],
          unique: true,
          trim: true,
        },
        c_listicles_continue_content: {
          type: String,
          required: [true, "Listicles sub title is required"],
          unique: true,
          trim: true,
        },
        c_listicles_continue_img: {
          type: String,
        },
        c_listicles_continue_create_date: {
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
    n_verify: {
      type: Number,
      required: true,
      enum: [0, 1],
      default: 1,
    },
    c_verifiedBy: {
      type: String,
      ref: "User",
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

const Listicles =  mongoose.models.Listicles ||  mongoose.model("Listicles", ListiclesSchema);
module.exports = { Listicles };
