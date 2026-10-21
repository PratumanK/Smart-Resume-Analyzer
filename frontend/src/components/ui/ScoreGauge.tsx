import React from 'react';
import { Badge } from './Badge';

interface ScoreGaugeProps {
  score: number;
  label?: string;
  rating?: string;
  size?: number;
  strokeWidth?: number;
  showRatingBadge?: boolean;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  label = 'ATS Score',
  rating,
  size = 160,
  strokeWidth = 12,
  showRatingBadge = true,
}) => {
  const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return { stroke: '#10b981', badge: 'success' as const, text: 'text-emerald-600' };
    if (s >= 70) return { stroke: '#3b82f6', badge: 'brand' as const, text: 'text-brand-600' };
    if (s >= 60) return { stroke: '#f59e0b', badge: 'warning' as const, text: 'text-amber-600' };
    return { stroke: '#ef4444', badge: 'danger' as const, text: 'text-rose-600' };
  };

  const style = getColor(normalizedScore);

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90 origin-center"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={style.stroke}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {normalizedScore}
            <span className="text-lg font-medium text-slate-400 ml-0.5">%</span>
          </span>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-0.5">
            {label}
          </span>
        </div>
      </div>

      {showRatingBadge && rating && (
        <div className="mt-3">
          <Badge variant={style.badge} size="md">
            {rating}
          </Badge>
        </div>
      )}
    </div>
  );
};
