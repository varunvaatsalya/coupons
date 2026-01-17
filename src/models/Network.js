import mongoose from "mongoose";


const NetworkSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    parameters: {
      type: Schema.Types.Mixed, // { subid: "{affiliateId}", clickid: "{clickId}" }
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Network ||
  mongoose.model("Network", NetworkSchema);
