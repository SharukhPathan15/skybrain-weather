import mongoose from "mongoose";

const citySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  country: { type: String },
  lat: { type: Number },
  lon: { type: Number },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isFavorite: { type: Boolean, default: false },
  
}, { timestamps: true });

// Index for faster user-specific queries
citySchema.index({ userId: 1 });

export const City = mongoose.model("City", citySchema);