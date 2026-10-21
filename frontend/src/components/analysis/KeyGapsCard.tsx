import React from 'react';
import { Card } from '../ui/Card';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import type { ReportGap } from '../../types';

interface KeyGapsCardProps {
  gaps: ReportGap[];
}

export const KeyGapsCard: React.FC<KeyGapsCardProps> = ({ gaps }) => {
  if (!gaps || gaps.length === 0) {
    return (
      <Card
        title={
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <span>Identified Gaps & Weaknesses</span>
          </div>
        }
        subtitle="Critical discrepancies between resume claims and job criteria"
      >
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 italic">
          No critical candidate gaps detected.
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <span>Identified Gaps & Weaknesses</span>
        </div>
      }
      subtitle="Critical discrepancies or omissions between resume claims and job criteria"
    >
      <div className="space-y-3">
        {gaps.map((item, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-amber-50/40 border border-amber-200/80 flex items-start gap-3.5 transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
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
