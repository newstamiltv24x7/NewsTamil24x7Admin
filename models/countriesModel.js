const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const CountriesSchema = new Schema(
  {
    id: {
      type: String,
    },
    name: {
      type: String,
    },
    iso3: {
      type: String,
    },
    numeric_code: {
      type: String,
    },
    iso2: {
      type: String,
    },
    phonecode: {
      type: String,
    },
    capital: {
      type: String,
    },
    currency: {
      type: String,
    },
    currency_name: {
      type: String,
    },
    currency_symbol: {
      type: String,
    },
    tld: {
      type: String,
    },
    native: {
      type: String,
    },
    region: {
      type: String,
    },
    region_id: {
      type: String,
    },
    subregion: {
      type: String,
    },
    subregion_id: {
      type: String,
    },
    nationality: {
      type: String,
    },
    timezones: {
      type: String,
    },
    translations: {
      type: String,
    },
    latitude: {
      type: String,
    },
    longitude: {
      type: String,
    },
    emoji: {
      type: String,
    },
    emojiU: {
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

const Countries = mongoose.models.Countries || mongoose.model("Countries", CountriesSchema);

module.exports = { Countries };
