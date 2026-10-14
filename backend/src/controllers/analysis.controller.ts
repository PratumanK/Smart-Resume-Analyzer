
import type { Request, Response, NextFunction } from "express";
import axios from "axios";
import FormData from "form-data";
import mongoose from "mongoose";
import AnalysisHistory from "../models/analysisHistory.js";

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

interface FastAPIResponse {
  Analysis: Record<string, unknown> & {
    experience?: {
      job_title?: string;
    };
  };
  Report: string | Record<string, unknown>;
  Data: {
    job_description?: string;
  };
}

export const analyzeResume = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    const resume = files?.["resume"]?.[0];
    const jobDescription = files?.["jobDescription"]?.[0];

    if (!resume || !jobDescription) {
      res.status(400).json({
        message: "Both resume and job description PDFs are required.",
      });
      return;
    }

    if (!req.user?.id || !mongoose.isValidObjectId(req.user.id)) {
      res.status(401).json({
        message: "Valid authentication is required.",
      });
      return;
    }

    const formData = new FormData();

    formData.append("resume", resume.buffer, {
      filename: resume.originalname,
      contentType: resume.mimetype,
    });

    formData.append("jobDescription", jobDescription.buffer, {
      filename: jobDescription.originalname,
      contentType: jobDescription.mimetype,
    });

    const response = await axios.post<FastAPIResponse>(
      "http://127.0.0.1:8000/api/analyze",
      formData,
      {
        headers: formData.getHeaders(),
        timeout: 120000,
      }
    );

    const result = response.data;

    if (
      !result?.Analysis ||
      result.Report === undefined ||
      result.Report === null ||
      !result?.Data
    ) {
      res.status(502).json({
        message: "The AI service returned an unexpected response.",
      });
      return;
    }

    let report: Record<string, unknown>;

    if (typeof result.Report === "string") {
      try {
        const parsed: unknown = JSON.parse(result.Report);

        if (
          typeof parsed !== "object" ||
          parsed === null ||
          Array.isArray(parsed)
        ) {
          throw new Error("Report must be a JSON object.");
        }

        report = parsed as Record<string, unknown>;
      } catch {
        res.status(502).json({
          message: "The AI service returned an invalid report.",
        });
        return;
      }
    } else {
      report = result.Report;
    }

    const jobTitle =
      result.Analysis.experience?.job_title ?? "Untitled analysis";

    // Extract the JD text from the Data object if the pipeline provides it.
    // Otherwise, save an empty string for now.
    const jobDescriptionText =
      typeof result.Data.job_description === "string"
        ? result.Data.job_description
        : "";

    const history = await AnalysisHistory.create({
      userId: new mongoose.Types.ObjectId(req.user.id),
      jobTitle,
      jobDescription: jobDescriptionText,
      analysis: result.Analysis,
      report,
    });

    res.status(200).json({
      success: true,
      historyId: history._id,
      message: "Resume analysis completed and saved.",
      Analysis: result.Analysis,
      Report: report,
      Data: result.Data,
    });
  } catch (error) {
    next(error);
  }
};
