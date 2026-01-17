import mongoose from "mongoose";

const { Schema } = mongoose;

const HowToStepSchema = new Schema(
  {
    merchantId: {
      type: Schema.Types.ObjectId,
      ref: "Merchant",
      required: true,
      index: true,
    },

    stepNumber: {
      type: Number,
      required: true,
    },

    title: String,
    description: String,
    imageUrl: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.HowToStep ||
  mongoose.model("HowToStep", HowToStepSchema);
