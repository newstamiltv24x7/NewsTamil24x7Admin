const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const AdvertisementSchema = new Schema(
  {
    c_advt_title: {
      type: String,
      required: [true, "Advertisement Title is required"],
      trim: true,
    },
    c_advt_id: {
      type: String,
      required: [true, "Advertisement Id is required"],
      unique: true,
      trim: true,
    },
    c_advt_type: {
      type: String,
      trim: true,
      required: [true, "Advertisement Type is required"],
      enum: ["own_add", "google_add"],
      default: "own_add",
    },
    c_advt_banner_url: {
      type: String,
      // required: [true, "Advertisement Banner is required"],
      trim: true,
    },
    c_advt_google_script: {
      type: String,
      trim: true,
    },
    c_advt_banner_redirect_url: {
      type: String,
    },
    c_banner_start_date: {
      type: Date,
      trim: true,
    },
    c_banner_start_time: {
      type: String,
      trim: true,
    },
    c_banner_end_date: {
      type: Date,
      trim: true,
    },
    c_banner_end_time: {
      type: String,
      trim: true,
    },
    c_target_device: {
      type: String,
      trim: true,
      required: [true, "Target Device is required"],
      enum: ["all","web", "mobile"],
      default: "all",
    },
    c_banner_position: {
      type: String,
      trim: true,
      required: [true, "Advertisement Banner Position is required"],
      enum: ["top","right_square", "right_rectangle", "bottom", "left_square", "left_rectangle", "center"],
      default: "top",
    },
    c_banner_width: {
      type: String,
      trim: true,
    },
    c_banner_height: {
      type: String,
      trim: true,
    },
    c_banner_view_pages: {
      type: String,
      trim: true,
    },
    c_banner_target_country_id: {
      type: String,
      trim: true,
    },
    c_banner_target_state_id: {
      type: String,
      trim: true,
    },
    c_banner_target_city_id: {
      type: String,
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

const Advertisement =
  mongoose.models.Advertisement ||
  mongoose.model("Advertisement", AdvertisementSchema);

module.exports = { Advertisement };
