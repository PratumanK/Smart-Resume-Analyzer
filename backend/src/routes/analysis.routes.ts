
import { Router } from "express";
import { analyzeResume } from "../controllers/analysis.controller.js";
import {
  getAnalysisHistory,
  getAnalysisById,
} from "../controllers/history.controller.js";
import { uploadAnalysisFiles } from "../middlewares/upload.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/res",
  authMiddleware,
  uploadAnalysisFiles,
  analyzeResume
);

router.get(
  "/history",
  authMiddleware,
  getAnalysisHistory
);

router.get(
  "/history/:id",
  authMiddleware,
  getAnalysisById
);

export default router;
