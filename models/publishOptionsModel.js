const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var validator = require("validator");


const PublishOptionsSchema = new Schema(
  {
    c_opt_id: {
      type: String,
      required: [true, "Options id required"],
      trim: true,
    },
    opt_title: {
      type: String,
      required: [true, "Title is required"],
      trim: true
    },
    opt_sub_title: {
      type: String,
      required: [true, "Sub Title is required"],
      trim: true
    },
    opt_check: {
        type: Number,
        required: true,
        enum: [0, 1],
        default: 0,
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


const PublishOptions = mongoose.models.PublishOptions || mongoose.model("PublishOptions", PublishOptionsSchema);

module.exports = { PublishOptions };
