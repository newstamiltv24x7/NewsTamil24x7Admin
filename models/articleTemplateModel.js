const mongoose = require("mongoose");
var Schema = mongoose.Schema;


const ArticleTemplateSchema = new Schema(
  {
   
    art_template_name: {
      type: String,
      required: [true, "Article Template name is required"],
      trim: true
    },
    art_template_id: {
      type: String,
      required: [true, "Article Template Id is required"],
      unique: true,
      trim: true,
    },
    c_createdBy: {
      type: String,
      ref: "User",
    },
    c_updatedBy: {
      type: String,
      ref: "User",
    },
    c_deletedBy: {
      type: String,
      ref: "User",
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
    }
    
  },
  { strict: false, versionKey: false, timestamps: true }
);


const  ArticleTemplate = mongoose.models.ArticleTemplate || mongoose.model("ArticleTemplate", ArticleTemplateSchema);

module.exports = {ArticleTemplate};
