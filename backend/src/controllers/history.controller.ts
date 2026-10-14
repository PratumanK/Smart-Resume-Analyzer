
import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import AnalysisHistory from "../models/analysisHistory.js";

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const getAnalysisHistory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const history = await AnalysisHistory.find({
      userId: req.user.id,
    })
      .select("-jobDescription")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    next(error);
  }
};

export const getAnalysisById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.user?.id) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    if (!id || !mongoose.isValidObjectId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid analysis ID.",
      });
      return;
    }

    const history = await AnalysisHistory.findOne({
      _id: id,
      userId: req.user.id,
    }).lean();

    if (!history) {
      res.status(404).json({
        success: false,
        message: "Analysis history not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    next(error);
  }
};
