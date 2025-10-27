const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var validator = require("validator");

const LiveStreamCategorySchema = new Schema(
  {
    c_live_stream_category_id: {
      type: String,
      required: [true, "Live_stream Category Id is required"],
      unique: true,
      trim: true,
    },
    c_live_stream_category_name: {
      type: String,
      required: [true, "Live_stream Category name is required"],
      trim: true,
      unique: true,
      validate(value) {
        if (!validator.isLength(value, { min: 2, max: 150 })) {
          throw Error(
            "Length of the Live_stream category name should be between 2-150"
          );
        }
      },
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




const LiveStreamCategory = mongoose.models.LiveStreamCategory || mongoose.model("LiveStreamCategory", LiveStreamCategorySchema);

module.exports = { LiveStreamCategory };
