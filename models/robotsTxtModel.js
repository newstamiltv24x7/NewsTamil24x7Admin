const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const RobotsTxtSchema = new Schema(
  {
    c_robots_txt: {
      type: String,
      required: [true, "Robots Text is required"],
      trim: true,
    },
    c_robots_txt_id: {
      type: String,
      required: [true, "Robots Id is required"],
      unique: true,
      trim: true,
    },
    c_robots_txt_type: {
      type: String,
      trim: true,
      required: [true, "Robots Type is required"],
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

const RobotsTxt =
  mongoose.models.RobotsTxt ||
  mongoose.model("RobotsTxt", RobotsTxtSchema);

module.exports = { RobotsTxt };
