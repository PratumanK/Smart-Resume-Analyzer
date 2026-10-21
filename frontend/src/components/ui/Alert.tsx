import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

interface AlertProps {
  type?: 'error' | 'success' | 'warning' | 'info';
  title?: string;
  message: string | React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'error',
  title,
  message,
  onClose,
  className = '',
}) => {
  const typeConfig = {
    error: {
      container: 'bg-rose-50 border-rose-200 text-rose-800',
      icon: <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />,
      closeHover: 'hover:bg-rose-100 text-rose-500',
    },
    success: {
      container: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
      closeHover: 'hover:bg-emerald-100 text-emerald-500',
    },
    warning: {
      container: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />,
      closeHover: 'hover:bg-amber-100 text-amber-500',
    },
    info: {
      container: 'bg-brand-50 border-brand-200 text-brand-800',
      icon: <Info className="w-5 h-5 text-brand-500 flex-shrink-0" />,
      closeHover: 'hover:bg-brand-100 text-brand-500',
    },
  };

  const config = typeConfig[type];

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 rounded-lg border text-sm transition-all ${config.container} ${className}`}
    >
      <div className="mt-0.5">{config.icon}</div>
      <div className="flex-1">
        {title && <h4 className="font-semibold mb-0.5">{title}</h4>}
        <div className="leading-relaxed">{message}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          aria-label="Dismiss alert"
          className={`p-1 rounded-md transition-colors ${config.closeHover}`}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
