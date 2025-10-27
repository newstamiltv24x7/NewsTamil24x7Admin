const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const PhotosSchema = new Schema(
  {
    c_photos_id: {
        type: String,
        required: [true, "Photos id is required"],
        trim: true,
      },
    c_photos_title: {
      type: String,
      required: [true, "Photos title is required"],
      trim: true,
    },
    c_photos_short_name: {
        type: String,
        required: [true, "Photos short name is required"],
        trim: true,
      },
    c_photos_slug_title: {
      type: String,
      required: [true, "Photos slug title is required"],
      trim: true,
    },
    c_photos_sub_title: {
      type: String,
      trim: true,
    },
    c_photos_content: {
      type: String,
      trim: true,
    },
    c_photos_img: {
      type: String,
    }, 
    c_photos_continue_item: [
      {
        c_photos_continue_sub_title: {
          type: String,
          required: [true, "Photos sub title is required"],
          unique: true,
          trim: true,
        },
        c_photos_continue_img: {
          type: String,
        },
        c_photos_continue_create_date: {
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

const Photos =  mongoose.models.Photos ||  mongoose.model("Photos", PhotosSchema);
module.exports = { Photos };
