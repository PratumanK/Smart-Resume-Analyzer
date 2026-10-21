import React from 'react';
import { Card } from '../ui/Card';
import { CheckCircle2, ThumbsUp } from 'lucide-react';
import type { ReportStrength } from '../../types';

interface KeyStrengthsCardProps {
  strengths: ReportStrength[];
}

export const KeyStrengthsCard: React.FC<KeyStrengthsCardProps> = ({ strengths }) => {
  if (!strengths || strengths.length === 0) {
    return null;
  }

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <ThumbsUp className="w-5 h-5 text-emerald-600" />
          <span>Key Candidate Strengths</span>
        </div>
      }
      subtitle="AI-identified strong alignments between candidate profile and job requirements"
    >
      <div className="space-y-3">
        {strengths.map((item, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-100 flex items-start gap-3.5 transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-100/80 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
