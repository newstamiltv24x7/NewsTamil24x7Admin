const mongoose = require("mongoose");
var Schema = mongoose.Schema;


const StateSchema = new Schema(
  {
   
    id: {
        type:String
    },
    name: {
        type:String
    },
    country_id: {
        type:String
    },
    country_code: {
        type:String
    },
    fips_code: {
        type:String
    },
    iso2: {
        type:String
    },
    type: {
        type:String
    },
    latitude: {
        type:String
    },
    longitude: {
        type:String
    },
    created_at: {
        type:String
    },
    updated_at: {
        type:String
    },
    flag: {
        type:String
    },
    wikiDataId: {
        type:String
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


const  State = mongoose.models.State || mongoose.model("State", StateSchema);

module.exports = {State};
