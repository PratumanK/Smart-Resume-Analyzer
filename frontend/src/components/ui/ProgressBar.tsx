import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  sublabel?: string;
  showValue?: boolean;
  color?: 'brand' | 'emerald' | 'amber' | 'rose' | 'slate';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  sublabel,
  showValue = true,
  color = 'brand',
  size = 'md',
  className = '',
}) => {
  const percentage = Math.max(0, Math.min(100, Math.round((value / max) * 100)));

  const colorStyles = {
    brand: 'bg-brand-600',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    slate: 'bg-slate-700',
  };

  const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1.5">
          <div>
            {label && <span>{label}</span>}
            {sublabel && <span className="text-slate-400 font-normal ml-1.5">({sublabel})</span>}
          </div>
          {showValue && <span className="font-semibold text-slate-900">{percentage}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heightStyles[size]}`}>
        <div
          className={`${heightStyles[size]} ${colorStyles[color]} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
