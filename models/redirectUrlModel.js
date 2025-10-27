const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const RedirectUrlSchema = new Schema(
  {
    c_redirect_url_id: {
      type: String,
      required: [true, "Redirect URL Id is required"],
      trim: true,
    },
    c_redirect_from_url: {
      type: String,
      required: [true, "Redirect From URL is required"],
      unique: true,
      trim: true,
    },
    c_redirect_to_url: {
      type: String,
      trim: true,
      required: [true, "Redirect To URL is required"],
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

const RedirectUrl =
  mongoose.models.RedirectUrl ||
  mongoose.model("RedirectUrl", RedirectUrlSchema);

module.exports = { RedirectUrl };
