const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const MemesSchema = new Schema(
  {
    c_memes_title: {
      type: String,
      required: [true, "Memes Title is required"],
      trim: true,
      unique: true,
    },
    c_memes_id: {
      type: String,
      required: [true, "Memes id is required"],
      trim: true,
      unique: true,
    },
    c_memes_img_link: {
      type: String,
      required: [true, "Memes Link is required"],
      trim: true,
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

const Memes =
  mongoose.models.Memes || mongoose.model("Memes", MemesSchema);

module.exports = { Memes };
