import { api } from '../lib/api';
import type { AnalysisResponse } from '../types';

export const analysisService = {
  async analyze(resumeFile: File, jdFile: File): Promise<AnalysisResponse> {
    const formData = new FormData();
    // The backend multer middleware expects 'resume' and 'jobDescription'
    formData.append('resume', resumeFile);
    formData.append('jobDescription', jdFile);

    return api.postFormData<AnalysisResponse>('/analysis/res', formData);
  },
};
