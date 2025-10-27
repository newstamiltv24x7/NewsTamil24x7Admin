const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const SubscriberSchema = new Schema(
  {
    c_subscriber_id: {
      type: String,
      required: [true, "Subscriber id is required"],
      trim: true,
      lowercase: true,
    },
    c_subscriber_email: {
      type: String,
      required: [true, "Subscriber email is required"],
      unique: true,
      lowercase:true
    },
    c_subscriber_activate: {
      type: Number,
      enum: [0, 1],
      default: 0,
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

const Subscriber =
  mongoose.models.Subscriber || mongoose.model("Subscriber", SubscriberSchema);
module.exports = { Subscriber };
