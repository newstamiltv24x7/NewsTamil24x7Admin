const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const StaticMenuPageSchema = new Schema(
  {
    c_static_menu_page_id: {
      type: String,
      required: [true, "Static Page id is required"],
      trim: true,
      lowercase: true,
      unique: true
    },
    c_static_menu_page_name: {
      type: String,
      required: [true, "Static Page is required"],
      unique: true
    },
    c_static_menu_page_eng__name: {
      type: String,
      required: [true, "Static Page url is required"],
      unique: true
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

const StaticMenuPage =
  mongoose.models.StaticMenuPage || mongoose.model("StaticMenuPage", StaticMenuPageSchema);
module.exports = { StaticMenuPage };
