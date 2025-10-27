const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const PollSchema = new Schema(
  {
    c_poll_id: {
      type: String,
      required: [true, "Poll id required"],
      trim: true,
    },
    c_poll_question: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    c_poll_answer: [
      {
        poll_answer_id: {
          type: String,
          trim: true,
        },
        poll_answer: {
          type: String,
          trim: true,
        },
        poll_count: {
          type: Number,
          trim: true,
        },
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

const PollOptions =
  mongoose.models.PollOptions ||
  mongoose.model("PollOptions", PollSchema);

module.exports = { PollOptions };
