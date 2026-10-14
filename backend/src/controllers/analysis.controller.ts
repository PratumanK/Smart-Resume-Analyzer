import type { Request, Response, NextFunction } from "express";

export const analyzeResume = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

    res.status(200).json({
      message: "Both PDFs uploaded successfully.",
      files: {
        resume: {
          originalName: resume.originalname,
          size: resume.size,
          mimetype: resume.mimetype,
        },
        jobDescription: {
          originalName: jobDescription.originalname,
          size: jobDescription.size,
          mimetype: jobDescription.mimetype,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};