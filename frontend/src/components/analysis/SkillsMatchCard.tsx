import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { CheckCircle2, XCircle, PlusCircle, Wrench } from 'lucide-react';
import type { SkillGapResult } from '../../types';

interface SkillsMatchCardProps {
  skills: SkillGapResult;
}

export const SkillsMatchCard: React.FC<SkillsMatchCardProps> = ({ skills }) => {
  const [filter, setFilter] = useState<'all' | 'matched' | 'missing' | 'extra'>('all');

  const matched = skills?.matched_skills || [];
  const missing = skills?.missing_skills || [];
  const extra = skills?.extra_skills || [];
  const matchPercentage = Math.round(skills?.match_percentage || 0);

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-brand-600" />
          <span>Technical Skills Alignment</span>
        </div>
      }
      subtitle="Extracted skills compared directly against job description requirements (40% of ATS score)"
      action={
        <Badge
          variant={matchPercentage >= 75 ? 'success' : matchPercentage >= 50 ? 'warning' : 'danger'}
          size="md"
        >
          {matchPercentage}% Match
        </Badge>
      }
    >
      <div className="space-y-6">
        {/* Progress summary bar */}
        <div>
          <ProgressBar
            value={matchPercentage}
            label="Skill Keyword Coverage"
            color={matchPercentage >= 75 ? 'emerald' : matchPercentage >= 50 ? 'amber' : 'rose'}
            size="md"
          />
          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {matched.length} Matched Skills
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              {missing.length} Missing Requirements
            </span>
            {extra.length > 0 && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                {extra.length} Additional Candidate Skills
              </span>
            )}
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-slate-800 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Skills ({matched.length + missing.length + extra.length})
          </button>
          <button
            onClick={() => setFilter('matched')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
              filter === 'matched'
                ? 'bg-emerald-600 text-white'
                : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
            }`}
          >
            Matched ({matched.length})
          </button>
          <button
            onClick={() => setFilter('missing')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
              filter === 'missing'
                ? 'bg-rose-600 text-white'
                : 'text-rose-700 bg-rose-50 hover:bg-rose-100'
            }`}
          >
            Missing ({missing.length})
          </button>
          {extra.length > 0 && (
            <button
              onClick={() => setFilter('extra')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                filter === 'extra'
                  ? 'bg-slate-600 text-white'
                  : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              Additional ({extra.length})
            </button>
          )}
        </div>

        {/* Skills Lists */}
        <div className="space-y-4">
          {/* Matched Skills */}
          {(filter === 'all' || filter === 'matched') && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Found in Resume & Job Description ({matched.length})</span>
              </div>
              {matched.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {matched.map((skill, idx) => (
                    <Badge
                      key={idx}
                      variant="success"
                      size="sm"
                      icon={<CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No exact matched skills found.</p>
              )}
            </div>
          )}

          {/* Missing Skills */}
          {(filter === 'all' || filter === 'missing') && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-rose-700 mb-2.5">
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>Required by Job Description but Missing in Resume ({missing.length})</span>
              </div>
              {missing.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {missing.map((skill, idx) => (
                    <Badge
                      key={idx}
                      variant="danger"
                      size="sm"
                      icon={<XCircle className="w-3 h-3 text-rose-500" />}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  No missing skills detected! Complete coverage of JD required skills.
                </p>
              )}
            </div>
          )}

          {/* Additional Skills */}
          {(filter === 'all' || filter === 'extra') && extra.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2.5">
                <PlusCircle className="w-3.5 h-3.5 text-slate-500" />
                <span>Additional Skills on Resume ({extra.length})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {extra.map((skill, idx) => (
                  <Badge key={idx} variant="neutral" size="sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
