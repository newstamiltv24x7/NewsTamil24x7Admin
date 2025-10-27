const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const FormSchema = new Schema(
  {
    c_form_id: {
      type: String,
      required: [true, "Form id is required"],
      trim: true,
      lowercase: true,
    },
    c_display_name: {
        type: String,
        required: [true, "Display name is required"],
      },
    c_from_name: {
      type: String,
      required: [true, "From Name is required"],
      trim: true,
      lowercase: true,
      
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

const Form =
  mongoose.models.Form ||
  mongoose.model("Form", FormSchema);
module.exports = { Form };
