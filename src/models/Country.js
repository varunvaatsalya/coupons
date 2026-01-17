import mongoose from "mongoose";

const { Schema } = mongoose;

const countrySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    currencyCode: {
      type: String,
      required: true,
      unique: true, // INR, USD
      uppercase: true,
    },

    currencySymbol: {
      type: String, // ₹, $
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Country ||
  mongoose.model("Country", countrySchema);
