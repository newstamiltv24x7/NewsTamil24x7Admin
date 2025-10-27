const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const CardsSchema = new Schema(
  {
    c_cards_id: {
      type: String,
      required: [true, "Cards id is required"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    c_cards_title: {
      type: String,
      required: [true, "Cards title is required"],
      trim: true,
    },
    c_cards_embed_code: {
      type: String,
      trim: true,
    },
    c_cards_img_url: {
      type: String,
      trim: true,
    },
    c_cards_share_url: {
      type: String,
      trim: true,
    },
    c_cards_comments: {
      type: String,
      trim: true,
    },
    c_cards_parentId: {
      type: String,
      trim: true,
    },
    c_cards_type: {
        type: String,
        enum: ["youtube", "facebook","twitter"],
        default: "twitter",
      },
    c_cards_likes: [
      {
        user_id: {
          type: String,
          trim: true,
        },
        like_status: {
          type: Number,
          enum: [0, 1],
          default: 0,
        },
      },
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

const Cards = mongoose.models.Cards || mongoose.model("Cards", CardsSchema);
module.exports = { Cards };
