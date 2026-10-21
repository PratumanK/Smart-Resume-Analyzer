import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { historyService } from '../services/historyService';
import { OverallScoreCard } from '../components/analysis/OverallScoreCard';
import { SkillsMatchCard } from '../components/analysis/SkillsMatchCard';
import { ExperienceAlignmentCard } from '../components/analysis/ExperienceAlignmentCard';
import { EducationAlignmentCard } from '../components/analysis/EducationAlignmentCard';
import { KeyStrengthsCard } from '../components/analysis/KeyStrengthsCard';
import { KeyGapsCard } from '../components/analysis/KeyGapsCard';
import { RoadmapSection } from '../components/analysis/RoadmapSection';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import {
  ArrowLeft,
  RotateCcw,
  History,
  FileSearch,
  Printer,
  Sparkles,
  Loader2,
  Calendar,
} from 'lucide-react';
import type { AnalysisData, AnalysisReport } from '../types';

export const AnalysisResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [jobTitle, setJobTitle] = useState<string>('Untitled Analysis');
  const [createdAt, setCreatedAt] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check if data was passed directly via navigation state
    const stateData = location.state?.analysisData;

    if (stateData && stateData.Analysis && stateData.Report) {
      setAnalysis(stateData.Analysis);
      setReport(stateData.Report);
      setJobTitle(stateData.Analysis.experience?.job_title || 'Target Role Analysis');
      setCreatedAt(new Date().toISOString());
      setIsLoading(false);
      return;
    }

    // Otherwise, fetch by id from history
    if (id) {
      fetchAnalysisHistory(id);
    } else {
      setErrorMessage('No analysis identifier provided.');
      setIsLoading(false);
    }
  }, [id, location.state]);

  const fetchAnalysisHistory = async (analysisId: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await historyService.getHistoryById(analysisId);
      if (response.success && response.history) {
        setAnalysis(response.history.analysis);
        setReport(response.history.report);
        setJobTitle(response.history.jobTitle || 'Target Role Analysis');
        setCreatedAt(response.history.createdAt);
      } else {
        setErrorMessage('Failed to load analysis report.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not retrieve this saved analysis report.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center p-8 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-brand-600 mb-4" />
        <h3 className="text-lg font-bold text-slate-800">Loading Analysis Report...</h3>
        <p className="text-sm text-slate-500 mt-1">Retrieving parsed scores, alignment, and recommendations</p>
      </div>
    );
  }

  if (errorMessage || !analysis || !report) {
    return (
      <div className="max-w-2xl mx-auto my-12 space-y-4">
        <Alert
          type="error"
          title="Unable to Load Report"
          message={errorMessage || 'The requested analysis record is missing or corrupt.'}
        />
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Dashboard
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/analysis/new')}
            leftIcon={<FileSearch className="w-4 h-4" />}
          >
            Start New Analysis
          </Button>
        </div>
      </div>
    );
  }

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            <Link to="/" className="hover:text-brand-600 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <Link to="/history" className="hover:text-brand-600 transition-colors">
              History
            </Link>
            <span>/</span>
            <span className="text-brand-600 font-bold">Analysis Report</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {jobTitle}
          </h1>

          {formattedDate && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Analyzed on {formattedDate}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
            className="print:hidden"
          >
            Print Report
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/history')}
            leftIcon={<History className="w-4 h-4" />}
            className="print:hidden"
          >
            History
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/analysis/new')}
            leftIcon={<RotateCcw className="w-4 h-4" />}
            className="print:hidden"
          >
            New Analysis
          </Button>
        </div>
      </div>

      {/* 1. Overall Score & Assessment */}
      <section aria-label="Overall Assessment">
        <OverallScoreCard
          atsScore={analysis.ats_score}
          semanticSimilarity={analysis.semantic_similarity}
          report={report}
          jobTitle={jobTitle}
        />
      </section>

      {/* 2. Resume-Job Match Breakdown (Skills, Experience, Education) */}
      <section aria-label="Resume-Job Match Breakdown" className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Resume–Job Match Breakdown
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Detailed evaluation of skills coverage, professional experience, and academic requirements
          </p>
        </div>

        {/* Skills Alignment */}
        {analysis.skills && <SkillsMatchCard skills={analysis.skills} />}

        {/* Experience & Education Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {analysis.experience && (
            <ExperienceAlignmentCard experience={analysis.experience} />
          )}
          {analysis.education && (
            <EducationAlignmentCard education={analysis.education} />
          )}
        </div>
      </section>

      {/* 3 & 4. Key Strengths & Gaps */}
      <section aria-label="Strengths and Gaps" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {report.key_strengths && report.key_strengths.length > 0 && (
          <KeyStrengthsCard strengths={report.key_strengths} />
        )}
        {report.key_gaps && report.key_gaps.length > 0 && (
          <KeyGapsCard gaps={report.key_gaps} />
        )}
      </section>

      {/* 5. Career Improvement Roadmap (Exactly 3 Priorities) */}
      {report.career_improvement_roadmap && report.career_improvement_roadmap.length > 0 && (
        <section aria-label="Career Improvement Roadmap">
          <RoadmapSection roadmap={report.career_improvement_roadmap} />
        </section>
      )}

      {/* Footer Navigation Bar */}
      <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/history')}
            leftIcon={<History className="w-4 h-4" />}
          >
            View All Saved Analyses
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/analysis/new')}
            leftIcon={<FileSearch className="w-4 h-4" />}
          >
            Start Another Analysis
          </Button>
        </div>
      </div>
    </div>
  );
};
