const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const StoriesSchema = new Schema(
  {
    story_id: {
      type: String,
      required: [true, "story id is required"],
      trim: true,
      unique: true,
    },
    story_title_name: {
      type: String,
      required: [true, "story title  name is required"],
      trim: true,
    },
    story_sub_title_name: {
      type: String,
      trim: true,
    },
    story_english_name: {
      type: String,
      trim: true,
    },
    story_sub_english_name: {
      type: String,
      trim: true,
    },
    story_desk_created_name: {
      type: String,
      trim: true,
    },
    article_template_id: {
      type: String,
      trim: true,
    },
    story_summary_snippet: {
      type: String,
      trim: true,
    },
    main_category_id: [
      {
        type: String,
        required: [true, "main category name is required"],
        trim: true,
      }
    ],
    sub_category_id: {
      type: String,
      trim: true,
    },
    country_id: {
      type: String,
      trim: true,
    },
    state_id: {
      type: String,
      trim: true,
    },
    city_id: {
      type: String,
      trim: true,
    },
    reviwer_id: {
      type: String,
      trim: true,
    },
    story_cover_image_url: {
      type: String,
      trim: true,
    },
    story_thumb_image_url: {
      type: String,
      trim: true,
    },
    story_video_type: {
      type: String,
      trim: true,
    },
    story_video_url: {
      type: String,
      trim: true,
    },
    news_image_caption: {
      type: String,
      trim: true,
    },
    seo_tag: [
      {
        type: String,
        required: [true, "seo tag is required"],
        trim: true,
      },
    ],
    seo_keywords: [
      {
        type: String,
        trim: true,
      },
    ],

    story_author_block: {
      type: Number,
      enum: [0, 1],
      default: 1,
    },
    story_credit_name: {
      type: [
        {
          story_credit: { type: String },
          story_name: { type: String },
        },
      ],
    },
    story_details: {
      type: String,
      required: [true, "story details is required"],
      // trim: true,
    },
    min_read_display: {
      type: Number,
    },
    story_paid_content: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
    story_live_article: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
    trending_news: {
      type: Number,
      enum: [0, 1],
      default: 1,
    },
    flash_news: {
      type: Number,
      enum: [0, 1],
      default: 1,
    },
    story_published_options: {
      type: [
        {
          story_published_id: { type: String },
          story_published_status: {
            type: Number,
            enum: [0, 1],
            default: 1,
          },
        },
      ],
    },
    c_save_type: {
      type: String,
      required: [true, "story save type is required"],
      enum: ["save", "scheduleforlater", "submitforreview", "published","submitforedit"],
      default: "save",
    },
    c_schedule_date: {
      type: Date,
      trim: true,
    },
    c_schedule_Time: {
      type: Date,
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
    },
    live_id: {
      type: Number,
      trim: true,
      unique: true,
    },
    live_lang_id: {
      type: Number,
      trim: true,
    },
    live_title_slug: {
      type: String,
      trim: true,
    },
    live_category_id: {
      type: Number,
      trim: true,
    },
    live_image_default: {
      type: String,
      trim: true,
    },
    live_image_slider: {
      type: String,
      trim: true,
    },
    live_image_auto_crop: {
      type: String,
      trim: true,
    },
    live_image_mid: {
      type: String,
      trim: true,
    },
    live_image_mime: {
      type: String,
      trim: true,
    },
    live_image_storage: {
      type: String,
      trim: true,
    },
    live_pageviews: {
      type: Number,
      trim: true,
    },
    live_need_auth: {
      type: Number,
      trim: true,
    },
    live_is_slider: {
      type: Number,
      trim: true,
    },
    live_slider_order: {
      type: Number,
      trim: true,
    },
    live_is_featured: {
      type: Number,
      trim: true,
    },
    live_featured_order: {
      type: Number,
      trim: true,
    },
    live_is_recommended: {
      type: Number,
      trim: true,
    },
    live_is_breaking: {
      type: Number,
      trim: true,
    },
    live_is_scheduled: {
      type: Number,
      trim: true,
    },
    live_visibility: {
      type: Number,
      trim: true,
    },
    live_show_right_column: {
      type: Number,
      trim: true,
    },
    live_post_type: {
      type: String,
      trim: true,
    },
    live_video_storage: {
      type: String,
      trim: true,
    },
    live_user_id: {
      type: Number,
      trim: true,
    },
    live_status: {
      type: Number,
      trim: true,
    },
    live_show_post_url: {
      type: Number,
      trim: true,
    },
    live_show_item_numbers: {
      type: Number,
      trim: true,
    },
    live_is_poll_public: {
      type: Number,
      trim: true,
    },
    created_at: {
      type: Date,
      trim: true,
    },
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
  },
  { strict: false, versionKey: false, timestamps: false }
);

const Stories = mongoose.models.Story || mongoose.model("Story", StoriesSchema);

module.exports = { Stories };
