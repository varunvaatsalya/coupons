import mongoose from "mongoose";

const { Schema } = mongoose;

const ImageAssetSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
      unique: true,
    },

    tag: {
      type: String,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ImageAsset ||
  mongoose.model("ImageAsset", ImageAssetSchema);
