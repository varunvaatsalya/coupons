import mongoose from "mongoose";

const { Schema } = mongoose;

const CategoryLocalizationSchema = new Schema({
  country: {
    type: Schema.Types.ObjectId,
    ref: "Country",
    required: true,
  },

  translatedName: String,
  description: String,

  seo: {
    pageTitle: String,
    metaDescription: String,
    metaKeywords: [String],
  },
});

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: { type: String, unique: true },

    icon: {
      type: String,
      trim: true,
    },

    parents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    path: {
      type: String,
      index: true,
      unique: true,
    },

    level: {
      type: Number,
      default: 0,
    },

    navbarOrder: Number,

    isActive: {
      type: Boolean,
      default: true,
    },

    localizations: {
      type: [CategoryLocalizationSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

CategorySchema.index(
  { name: 1, parents: 1 },
  { unique: true }
);
CategorySchema.index({ "localizations.country": 1 });

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);
