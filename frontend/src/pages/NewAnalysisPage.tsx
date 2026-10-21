import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileDropzone } from '../components/upload/FileDropzone';
import { AnalysisProcessingState } from '../components/upload/AnalysisProcessingState';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Card } from '../components/ui/Card';
import { analysisService } from '../services/analysisService';
import { Play, Sparkles, FileText, Briefcase, Info } from 'lucide-react';

export const NewAnalysisPage: React.FC = () => {
  const navigate = useNavigate();

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jdFile, setJdFile] = useState<File | null>(null);

  const [resumeError, setResumeError] = useState<string | null>(null);
  const [jdError, setJdError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleStartAnalysis = async () => {
    setGeneralError(null);
    setResumeError(null);
    setJdError(null);

    let hasError = false;

    if (!resumeFile) {
      setResumeError('Please upload your resume in PDF format.');
      hasError = true;
    }

    if (!jdFile) {
      setJdError('Please upload the target job description PDF.');
      hasError = true;
    }

    if (hasError) return;

    setIsAnalyzing(true);
    try {
      const response = await analysisService.analyze(resumeFile!, jdFile!);

      if (response && response.success) {
        // Navigate to result page with the data and historyId
        navigate(`/analysis/result/${response.historyId}`, {
          state: {
            analysisData: response,
          },
        });
      } else {
        setGeneralError(response?.message || 'Analysis could not be completed.');
      }
    } catch (err: any) {
      setGeneralError(
        err.message || 'An error occurred while communicating with the analysis pipeline.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) {
    return <AnalysisProcessingState />;
  }

  const isReady = !!resumeFile && !!jdFile;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-600 mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Intelligent Resume Matching</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          New Resume & Job Description Analysis
        </h1>
        <p className="mt-1 text-sm text-slate-500 max-w-2xl leading-relaxed">
          Upload both your candidate resume and the target job description in PDF format. Our NLP pipeline will extract technical skills, calculate semantic similarity, evaluate alignment, and produce actionable recommendations.
        </p>
      </div>

      {generalError && (
        <Alert
          type="error"
          title="Analysis Request Failed"
          message={generalError}
          onClose={() => setGeneralError(null)}
        />
      )}

      {/* Two Upload Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Resume */}
        <Card
          className="flex flex-col"
          title={
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-600" />
              <span>Card 1: Upload Candidate Resume</span>
            </div>
          }
          subtitle="The candidate's current CV or resume document"
        >
          <FileDropzone
            id="resume-upload"
            title="Candidate Resume"
            description="Drag and drop your candidate PDF here, or click to choose from disk"
            selectedFile={resumeFile}
            onFileSelect={(file) => {
              setResumeFile(file);
              setResumeError(null);
            }}
            onFileRemove={() => setResumeFile(null)}
            error={resumeError}
          />
        </Card>

        {/* Card 2: Job Description */}
        <Card
          className="flex flex-col"
          title={
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              <span>Card 2: Upload Target Job Description</span>
            </div>
          }
          subtitle="The job posting, specification, or role criteria"
        >
          <FileDropzone
            id="jd-upload"
            title="Job Description Document"
            description="Drag and drop the job posting PDF here, or click to choose from disk"
            selectedFile={jdFile}
            onFileSelect={(file) => {
              setJdFile(file);
              setJdError(null);
            }}
            onFileRemove={() => setJdFile(null)}
            error={jdError}
          />
        </Card>
      </div>

      {/* Action / Information Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600">
            <p className="font-semibold text-slate-800">
              Pipeline Processing Note
            </p>
            <p className="mt-0.5">
              Both documents must be valid PDFs under 5MB each. Analysis takes approximately 15–30 seconds to parse and generate embeddings.
            </p>
          </div>
        </div>

        <Button
          onClick={handleStartAnalysis}
          disabled={!isReady || isAnalyzing}
          size="lg"
          variant="primary"
          className="w-full sm:w-auto flex-shrink-0"
          rightIcon={<Play className="w-4 h-4 fill-current" />}
        >
          Run Full Analysis
        </Button>
      </div>
    </div>
  );
};
