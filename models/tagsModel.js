const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const TagsSchema = new Schema(
  {
    c_tag_id: {
      type: String,
      required: [true, "Tag id is required"],
      trim: true,
      lowercase: true,
    },
    c_tag_name: {
        type: String,
        required: [true, "Tag name is required"],
      },
    c_tag_state: {
      type: String,
      required: [true, "Tag state is required"],
      trim: true,
      
    },
    c_redirect_url: {
      type: String,
      trim: true,
      lowercase: true,
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

const Tags =
  mongoose.models.Tags ||
  mongoose.model("Tags", TagsSchema);
module.exports = { Tags };
