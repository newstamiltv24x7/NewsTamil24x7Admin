const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const FileSchema = new Schema(
  {
    c_file_id: {
      type: String,
      required: [true, "File name is required"],
      trim: true,
    },
    c_file_name: {
      type: String,
      trim: true,
    },
    c_image_caption_name: {
      type: String,
      trim: true,
    },
    c_file_url: {
      type: String,
      trim: true,
    },
    c_file_type: {
      type: String,
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

const File = mongoose.models.File || mongoose.model("File", FileSchema);


module.exports = { File };
