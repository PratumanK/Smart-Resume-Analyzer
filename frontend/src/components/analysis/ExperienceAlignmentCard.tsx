import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Briefcase, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import type { ExperienceGapResult } from '../../types';

interface ExperienceAlignmentCardProps {
  experience: ExperienceGapResult;
}

export const ExperienceAlignmentCard: React.FC<ExperienceAlignmentCardProps> = ({ experience }) => {
  const meets = experience?.meets_requirement ?? false;
  const score = Math.round(experience?.experience_score ?? 0);
  const roleSimilarity = Math.round(experience?.role_similarity ?? 0);
  const candidateYears = experience?.candidate_experience ?? 0;
  const requiredYears = experience?.required_experience;

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-brand-600" />
          <span>Professional Experience Alignment</span>
        </div>
      }
      subtitle="Evaluates total years of experience and past job title similarity (20% of ATS score)"
      action={
        <Badge variant={meets ? 'success' : score >= 50 ? 'warning' : 'danger'} size="md">
          {score}% Alignment
        </Badge>
      }
    >
      <div className="space-y-5">
        {/* Years of Experience Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Candidate Experience
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-slate-900">{candidateYears}</span>
              <span className="text-sm text-slate-600 font-medium">years</span>
            </div>
            {experience?.last_role && (
              <p className="mt-2 text-xs text-slate-600 truncate">
                <span className="font-semibold text-slate-700">Recent Role:</span>{' '}
                {experience.last_role}
              </p>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Required by Role
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-slate-900">
                {requiredYears !== null && requiredYears !== undefined ? requiredYears : 'Not Specified'}
              </span>
              {requiredYears !== null && requiredYears !== undefined && (
                <span className="text-sm text-slate-600 font-medium">years min</span>
              )}
            </div>
            {experience?.job_title && (
              <p className="mt-2 text-xs text-slate-600 truncate">
                <span className="font-semibold text-slate-700">Target Role:</span>{' '}
                {experience.job_title}
              </p>
            )}
          </div>
        </div>

        {/* Status & Difference summary */}
        <div className="p-3.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {meets ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            )}
            <div>
              <p className="text-xs font-semibold text-slate-800">
                {meets
                  ? 'Meets or exceeds minimum required experience'
                  : 'Candidate has less total experience than requested'}
              </p>
              {experience?.difference !== null && experience?.difference !== undefined && (
                <p className="text-[11px] text-slate-500">
                  {experience.difference >= 0
                    ? `+${experience.difference} years above minimum`
                    : `${Math.abs(experience.difference)} years short of target specification`}
                </p>
              )}
            </div>
          </div>
          <Badge variant={meets ? 'success' : 'warning'} size="sm">
            {meets ? 'Requirement Met' : 'Experience Gap'}
          </Badge>
        </div>

        {/* Role Title Similarity */}
        <div>
          <ProgressBar
            value={roleSimilarity}
            label="Title & Role Relevance Match"
            sublabel={`${experience?.last_role || 'Candidate'} vs ${experience?.job_title || 'Target Role'}`}
            color="brand"
            size="sm"
          />
        </div>
      </div>
    </Card>
  );
};
