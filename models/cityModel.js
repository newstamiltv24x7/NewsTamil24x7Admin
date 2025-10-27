const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const CitySchema = new Schema(
  {
    id: {
      type: String,
    },
    name: {
      type: String,
    },
    state_id: {
      type: String,
    },
    state_code: {
      type: String,
    },
    country_id: {
      type: String,
    },
    country_code: {
      type: String,
    },
    latitude: {
      type: String,
    },
    longitude: {
      type: String,
    },
    created_at: {
      type: String,
    },
    updated_at: {
      type: String,
    },
    flag: {
      type: String,
    },
    wikiDataId: {
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

const City = mongoose.models.City || mongoose.model("City", CitySchema);

module.exports = { City };
