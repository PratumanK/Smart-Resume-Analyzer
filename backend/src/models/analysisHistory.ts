import mongoose, { Schema } from "mongoose";
import type { IAnalysisHistory } from "../types/historyTypes.js";

const analysisHistorySchema = new Schema<IAnalysisHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    jobDescription: {
  type: String,
  required: false,
  default: "",
},
    analysis: {
      type: Schema.Types.Mixed,
      required: true,
    },
    report: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const AnalysisHistory = mongoose.model<IAnalysisHistory>(
  "AnalysisHistory",
  analysisHistorySchema
);

export default AnalysisHistory;
