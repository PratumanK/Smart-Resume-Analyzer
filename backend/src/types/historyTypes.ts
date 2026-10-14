
import type mongoose from "mongoose";

export interface IAnalysisHistory {
  userId: mongoose.Types.ObjectId;
  jobTitle: string;
  jobDescription: string;
  analysis: Record<string, unknown>;
  report: Record<string, unknown>;
  createdAt: Date;
}
