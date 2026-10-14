import { Router } from "express";
import { analyzeResume } from "../controllers/analysis.controller.js";
import { uploadAnalysisFiles } from "../middlewares/upload.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/res",
  authMiddleware,
  uploadAnalysisFiles,
  analyzeResume
);

export default router;