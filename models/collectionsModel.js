const mongoose = require("mongoose");
var Schema = mongoose.Schema;


const CollectionsSchema = new Schema(
  {
    c_collection_id: {
      type: String,
      required: [true, "Collection id is required"],
      trim: true,
      unique:true,
      lowercase: true,
    },
    c_collection_name: {
      type: String,
      required: [true, "Collection name is required"],
      trim: true,
    },
    c_collection_url: {
      type: String,
      required: [true, "Collection url is required"],
      trim: true,
    },
    c_parent_id: {
      type: String,
      trim: true,
    },
    c_collection_description: {
      type: String,
      trim: true,
    },
    c_collection_social_img_url: {
      type: String,
      trim: true,
    },
    c_collection_type: {
      type: String,
      enum: ["manual", "logical"],
      default: "manual",
    },
    c_collection_state: {
        type: String,
        enum: ["save", "live"],
        default: "save",
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

const Collections =
  mongoose.models.Collections ||
  mongoose.model("Collections", CollectionsSchema);
module.exports = { Collections };
