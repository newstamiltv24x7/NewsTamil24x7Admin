const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {

    story_id: {
      type: String,
      required: [true, "story id is required"],
      trim: true,
    },
    c_comment_id: {
      type: String,
      required: [true, "Comments id is required"],
      unique: true,
      trim: true,
    },
    user_id: {
      type: String,
      required: [true, "User is required"],
      trim: true,
    },
    c_user_comment: {
      type: String,
      // required: [true, "Comments is required"],
      trim: true,
    },
    c_comment_like: [
      {
        like_status: {
          type: Number,
          required:true,
          enum: [-1,0,1],
          default: 0,
        },
        user_id: {
          type: String,
          required: [true, "User is required"],
          trim: true,
        },
      },
    ],



    c_parent_comments_id: {
      type: String,
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

const Comment = mongoose.models.Comment || mongoose.model("Comment",CommentSchema);

module.exports = { Comment };
