const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
var Schema = mongoose.Schema;



const storySchema = new Schema(
  {
    story_id: {
      type: String,
      required: [true, "story id is required"],
      trim: true,
      unique: true,
    },
    story_subject_name: {
      type: String,
      required: [true, "story subject is required"],
      trim: true,
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
    pair_id: {
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
    n_story_order: {
      type: Number,
      required: [true, "Category order is required"],
      trim: true,
      // unique:true
    },
    twitter_embed_id: {
      type: String,
      trim: true,
    },
    youtube_embed_id: {
      type: String,
      trim: true,
    },
    facebook_embed_id: {
      type: String,
      trim: true,
    },
    instagram_embed_id: {
      type: String,
      trim: true,
    },
    threads_embed_id: {
      type: String,
      trim: true,
    },
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
    story_asked_title: {
      type: String,
      trim: true,
    },
    story_asked_quotes_content: {
      type: String,
      trim: true,
    },
    story_asked_quotes_author: {
      type: String,
      trim: true,
    },
    story_asked_question: {
      type: [
        {
          story_question: {
            type: String,
            trim: true,
          },
          story_answer: {
            type: String,
            trim: true,
          },
        },
      ],
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
    blurb_title:{
      type: String,
    },
    blurb_title:{
      type: String,
    },
    blurb_content: {
      type: String,
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
    view_count: {
      type: Number,
    },
    story_published_options: {
      type: [
        {
          c_opt_id: { type: String },
          opt_check: {
            type: Number,
            enum: [0, 1],
            default: 1,
          },
          opt_title: { type: String },
          opt_sub_title: { type: String },

        },
      ],
    },
    c_save_type: {
      type: String,
      required: [true, "story save type is required"],
      enum: ["save", "scheduleforlater", "submitforreview", "published","submitforedit"],
      default: "save",
    },
    author_desk: {
      type: String,
      trim: true,
    },
    post_status: {
      type: Number,
      trim: true,
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
    replaced_url: {
      type: String,
      trim: true,
    },
    pin_status: {
      type: Number,
      trim: true,
    },
  },
  { strict: false, versionKey: false, timestamps: true }
);

storySchema.plugin(mongoosePaginate);
const Story = mongoose.models.Story || mongoose.model("Story", storySchema);
Story.paginate().then({});
module.exports = { Story };
