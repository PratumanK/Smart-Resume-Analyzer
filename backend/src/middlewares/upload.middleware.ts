import multer from "multer";
import path from "node:path";

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (
  req,
  file,
  callback
) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (file.mimetype !== "application/pdf" || extension !== ".pdf") {
    callback(new Error("Only PDF files are allowed."));
    return;
  }

  callback(null, true);
};

export const uploadAnalysisFiles = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB per file
    files: 2,
  },
}).fields([
  { name: "resume", maxCount: 1 },
  { name: "jobDescription", maxCount: 1 },
]);