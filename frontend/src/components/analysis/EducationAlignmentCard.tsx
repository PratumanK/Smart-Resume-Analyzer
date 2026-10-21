import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { GraduationCap, CheckCircle2, XCircle } from 'lucide-react';
import type { EducationGapResult } from '../../types';

interface EducationAlignmentCardProps {
  education: EducationGapResult;
}

export const EducationAlignmentCard: React.FC<EducationAlignmentCardProps> = ({ education }) => {
  const matched = education?.matched ?? false;
  const score = education?.score ?? 0;

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-brand-600" />
          <span>Education Degree Qualification</span>
        </div>
      }
      subtitle="Verifies normalized academic degree level against minimum job criteria (10% of ATS score)"
      action={
        <Badge variant={matched ? 'success' : 'danger'} size="md">
          {score}% Alignment
        </Badge>
      }
    >
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200/80">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              matched
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-rose-100 text-rose-700'
            }`}
          >
            {matched ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <XCircle className="w-6 h-6" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              {matched
                ? 'Academic Qualifications Satisfied'
                : 'Academic Qualification Discrepancy'}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {matched
                ? 'Highest candidate educational level meets or exceeds the requirements of the job description.'
                : 'Candidate education level does not clearly satisfy the minimum degree specified by the recruiter.'}
            </p>
          </div>
        </div>

        <Badge variant={matched ? 'success' : 'danger'} size="sm">
          {matched ? 'Verified' : 'Unmatched'}
        </Badge>
      </div>
    </Card>
  );
};
