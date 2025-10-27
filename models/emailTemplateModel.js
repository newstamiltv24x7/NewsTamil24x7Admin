const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const EmailTemplateSchema = new Schema(
  {
    c_email_template_id: {
      type: String,
      required: [true, "Email Template id is required"],
      trim: true,
      lowercase: true,
    },
    c_email_template_name: {
      type: String,
      required: [true, "Email Template name is required"],
      trim: true,
      unique: true
    },
    c_email_template_subject: {
      type: String,
      required: [true, "Email Template Subject is required"],
      trim: true,
    },

    c_email_template_type: {
      type: String,
      required: [true, "Email Template type is required"],
      trim: true,
    },
    c_email_template_content: {
      type: String,
      required: [true, "Email Template Content is required"],
      trim: true,
    },
    c_add_block: {
      type: String,
      trim: true,
    },
    c_min_news_count: {
      type: Number,
      trim: true,
    },
    c_max_news_count: {
      type: Number,
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

const EmailTemplate =
  mongoose.models.EmailTemplate || mongoose.model("EmailTemplate", EmailTemplateSchema);
module.exports = { EmailTemplate };
