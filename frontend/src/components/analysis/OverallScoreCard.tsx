import React from 'react';
import { ScoreGauge } from '../ui/ScoreGauge';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Sparkles, BrainCircuit, Target, CheckCircle2 } from 'lucide-react';
import type { AtsScoreResult, AnalysisReport } from '../../types';

interface OverallScoreCardProps {
  atsScore: AtsScoreResult;
  semanticSimilarity: number;
  report: AnalysisReport;
  jobTitle?: string;
  createdAt?: string;
}

export const OverallScoreCard: React.FC<OverallScoreCardProps> = ({
  atsScore,
  semanticSimilarity,
  report,
  jobTitle,
  createdAt,
}) => {
  // Semantic similarity is 0-100 or 0-1?
  // In ml/nlp/similarity.py and ats_score.py:
  // similarity_score is calculated via cosine similarity (-1 to 1 or 0 to 1) or percentage (0 to 100).
  // In ats_score.py: ats = round(similarity_score * 0.30 + skill_score * 0.40 + experience_score * 0.20 + education_score * 0.10, 2)
  // Since skill_score is 0-100, experience_score is 0-100, education_score is 0-100, similarity_score is also scaled 0-100!
  // If similarity_score <= 1, it might be 0-1, so let's normalize safely.
  const simValue = semanticSimilarity > 1 ? semanticSimilarity : semanticSimilarity * 100;
  const normalizedSim = Math.min(100, Math.max(0, Math.round(simValue * 10) / 10));

  return (
    <Card className="overflow-hidden border-slate-200">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: ATS Score Gauge */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50/60 rounded-xl border border-slate-100">
          <ScoreGauge
            score={atsScore.ats}
            label="Weighted ATS Score"
            rating={atsScore.rating}
            size={180}
            strokeWidth={14}
          />
          <p className="mt-4 text-center text-xs text-slate-500 max-w-xs leading-relaxed">
            Composite ATS calculation based on semantic similarity (30%), skills match (40%), experience (20%), and education (10%).
          </p>
        </div>

        {/* Right: Overall Assessment & Metric Cards */}
        <div className="lg:col-span-8 space-y-5">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Overall Analysis Assessment
                </h3>
              </div>
              {jobTitle && (
                <Badge variant="brand" size="sm">
                  {jobTitle}
                </Badge>
              )}
            </div>

            <p className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-lg border border-slate-200/80">
              {report?.overall_analysis ||
                'The analysis assessment evaluates your resume keywords, skills, and experience against the target role.'}
            </p>
          </div>

          {/* Metric Comparison Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/70">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                  <BrainCircuit className="w-4 h-4 text-brand-600" />
                  <span>Semantic Similarity</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{normalizedSim}%</span>
              </div>
              <ProgressBar value={normalizedSim} color="brand" size="sm" showValue={false} />
              <p className="mt-2 text-[11px] text-slate-500">
                Measures conceptual alignment between resume sentences and job description using sentence transformers.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/70">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                  <Target className="w-4 h-4 text-emerald-600" />
                  <span>ATS Rating Benchmark</span>
                </div>
                <Badge variant={atsScore.ats >= 70 ? 'success' : 'warning'} size="sm">
                  {atsScore.rating || 'Evaluated'}
                </Badge>
              </div>
              <ProgressBar value={atsScore.ats} color={atsScore.ats >= 70 ? 'emerald' : 'amber'} size="sm" showValue={false} />
              <p className="mt-2 text-[11px] text-slate-500">
                Target 80%+ for optimal ATS screening passing rates across corporate recruiting filters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
