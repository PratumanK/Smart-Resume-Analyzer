export interface User {
  userId: string;
  userName: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface SkillGapResult {
  matched_skills: string[];
  missing_skills: string[];
  extra_skills?: string[];
  match_percentage: number;
}

export interface ExperienceGapResult {
  required_experience: number | null;
  candidate_experience: number;
  difference: number | null;
  meets_requirement: boolean;
  last_role?: string;
  job_title?: string;
  role_similarity?: number;
  experience_score: number;
}

export interface EducationGapResult {
  matched: boolean;
  score: number;
}

export interface AtsScoreResult {
  ats: number;
  rating: string;
}

export interface AnalysisData {
  ats_score: AtsScoreResult;
  semantic_similarity: number;
  skills: SkillGapResult;
  experience: ExperienceGapResult;
  education: EducationGapResult;
  resume?: {
    skills: string[];
    experience: any;
    education: any;
  };
  job_description?: {
    skills: string[];
    experience: any;
    education: any;
  };
}

export interface ReportStrength {
  title: string;
  description: string;
}

export interface ReportGap {
  title: string;
  description: string;
}

export interface ReportRoadmapItem {
  priority: number;
  title: string;
  reason: string;
  action: string;
  resume_demonstration: string;
}

export interface AnalysisReport {
  overall_analysis: string;
  key_strengths: ReportStrength[];
  key_gaps: ReportGap[];
  career_improvement_roadmap: ReportRoadmapItem[];
}

export interface AnalysisResponse {
  success: boolean;
  historyId: string;
  message: string;
  Analysis: AnalysisData;
  Report: AnalysisReport;
  Data?: Record<string, unknown>;
}

export interface HistoryItem {
  _id: string;
  userId: string;
  jobTitle: string;
  jobDescription?: string;
  analysis: AnalysisData;
  report: AnalysisReport;
  createdAt: string;
}

export interface HistoryListResponse {
  success: boolean;
  count: number;
  history: HistoryItem[];
}

export interface HistoryDetailResponse {
  success: boolean;
  history: HistoryItem;
}
