const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const AdsTxtSchema = new Schema(
  {
    c_ads_txt: {
      type: String,
      required: [true, "Ads Text is required"],
      trim: true,
    },
    c_ads_txt_id: {
      type: String,
      required: [true, "Ads Id is required"],
      unique: true,
      trim: true,
    },
    c_ads_txt_type: {
      type: String,
      trim: true,
      required: [true, "Ads Type is required"],
      enum: ["web", "mobile"],
      default: "web",
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

const AdsTxt =
  mongoose.models.AdsTxt ||
  mongoose.model("AdsTxt", AdsTxtSchema);

module.exports = { AdsTxt };
