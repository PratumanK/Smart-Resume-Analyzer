import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Compass, Lightbulb, CheckSquare, FileEdit, ArrowUpRight } from 'lucide-react';
import type { ReportRoadmapItem } from '../../types';

interface RoadmapSectionProps {
  roadmap: ReportRoadmapItem[];
}

export const RoadmapSection: React.FC<RoadmapSectionProps> = ({ roadmap }) => {
  if (!roadmap || roadmap.length === 0) {
    return null;
  }

  // Preserve the exact 3 priorities from the report
  const priorities = roadmap.slice(0, 3);

  const getPriorityStyle = (num: number) => {
    switch (num) {
      case 1:
        return {
          badge: 'bg-rose-100 text-rose-800 border-rose-200',
          numberBg: 'bg-rose-600 text-white',
          cardBorder: 'border-slate-200 hover:border-rose-300',
          indicator: 'High Impact / Immediate Priority',
        };
      case 2:
        return {
          badge: 'bg-amber-100 text-amber-800 border-amber-200',
          numberBg: 'bg-amber-600 text-white',
          cardBorder: 'border-slate-200 hover:border-amber-300',
          indicator: 'Secondary Priority',
        };
      default:
        return {
          badge: 'bg-brand-100 text-brand-800 border-brand-200',
          numberBg: 'bg-brand-600 text-white',
          cardBorder: 'border-slate-200 hover:border-brand-300',
          indicator: 'Refinement Priority',
        };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-brand-600" />
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Career Improvement Roadmap
          </h3>
        </div>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          3 Actionable Priorities
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {priorities.map((item, index) => {
          const priorityNumber = item.priority || index + 1;
          const style = getPriorityStyle(priorityNumber);

          return (
            <Card
              key={index}
              padding="none"
              className={`flex flex-col justify-between transition-all duration-200 hover:shadow-md ${style.cardBorder}`}
            >
              {/* Card Header with Priority Number & Title */}
              <div className="p-5 border-b border-slate-100">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-7 h-7 rounded-lg font-extrabold text-xs flex items-center justify-center shadow-xs ${style.numberBg}`}
                    >
                      {priorityNumber}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Priority {priorityNumber}
                    </span>
                  </div>
                </div>

                <h4 className="text-base font-bold text-slate-900 leading-snug">
                  {item.title}
                </h4>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 flex-1">
                {/* Why it is important */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>Why it matters</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {item.reason}
                  </p>
                </div>

                {/* Recommended Action */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    <CheckSquare className="w-3.5 h-3.5 text-brand-600" />
                    <span>Recommended Action</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed bg-brand-50/50 p-3 rounded-lg border border-brand-100">
                    {item.action}
                  </p>
                </div>

                {/* How to Demonstrate on Resume */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    <FileEdit className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Resume Demonstration</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed bg-emerald-50/40 p-3 rounded-lg border border-emerald-100">
                    {item.resume_demonstration}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
