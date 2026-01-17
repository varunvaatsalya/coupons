import mongoose from "mongoose";

const { Schema } = mongoose;

const MerchantLocalizationSchema = new Schema({
  country: {
    type: Schema.Types.ObjectId,
    ref: "Country",
    required: true,
  },

  seo: {
    slug: { type: String },
    pageTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: [{ type: String }],
    pageHeading: { type: String },
  },

  content: {
    description: { type: String },
    translatedDescription: { type: String },
  },

  merchantAffiliateUrl: { type: String },

  flags: {
    featured: { type: Boolean, default: false },
    premium: { type: Boolean, default: false },
  },
});

const MerchantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    type: { type: String },

    status: {
      type: String,
      // enum: ["draft", "published"],
      default: "draft",
    },

    visibility: {
      type: String,
      // enum: ["public", "private"],
      // default: "public",
    },

    logo: {
      url: String,
      publicId: String,
    },

    network: {
      type: Schema.Types.ObjectId,
      ref: "Network",
    },

    websiteUrl: { type: String },

    localizations: [MerchantLocalizationSchema],

    apps: {
      android: String,
      ios: String,
      windows: String,
    },

    isCPTAvailable: {
      type: Boolean,
      default: false,
    },

    formState: {
      type: String,
      enum: ["draft", "submitted"],
      default: "draft",
    },

    createdBy: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      role: String,
    },
  },
  {
    timestamps: true,
  }
);

MerchantSchema.index({ status: 1 });
MerchantSchema.index({ "localizations.country": 1 });

const MerchantTypeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const MerchantType =
  mongoose.models.MerchantType ||
  mongoose.model("MerchantType", MerchantTypeSchema);

export default mongoose.models.Merchant ||
  mongoose.model("Merchant", MerchantSchema);
