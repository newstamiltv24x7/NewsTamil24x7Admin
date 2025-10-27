const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const TrendingTagsSchema = new Schema(
  {
    c_trending_tag_id: {
      type: String,
      required: [true, "Tag id is required"],
      trim: true,
      lowercase: true,
    },
    c_trending_tag_name: [
        {
            type: String,
            required: [true, "Tag name is required"],
          }
    ],
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

const TrendingTags =
  mongoose.models.TrendingTags ||
  mongoose.model("TrendingTags", TrendingTagsSchema);
module.exports = { TrendingTags };
