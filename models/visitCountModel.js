const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const VisitCountSchema = new Schema(
  {
    c_visit_id: {
      type: String,
      required: [true, "Poll id required"],
      trim: true,
    },
    c_story_id: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
      },
    c_visit_url: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    c_visit_all_count: [
      {
        c_visit_device_id: {
          type: String,
          trim: true,
        },
        c_visit_device_type: {
          type: String,
          trim: true,
        },
        c_visit_count: {
          type: Number,
          trim: true,
        },
      },
    ],
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

const VisitCountToken =mongoose.models.VisitCountToken || mongoose.model("VisitCountToken", VisitCountSchema);

module.exports = { VisitCountToken };
