import React from 'react';

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  headerClassName = '',
  title,
  subtitle,
  action,
  padding = 'md',
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hasHeader = title || subtitle || action;

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/80 shadow-sm ${className}`}
      {...props}
    >
      {hasHeader && (
        <div className={`flex items-start justify-between border-b border-slate-100 p-6 ${headerClassName}`}>
          <div>
            {typeof title === 'string' ? (
              <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            ) : (
              title
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            )}
          </div>
          {action && <div className="ml-4 flex-shrink-0">{action}</div>}
        </div>
      )}
      <div className={paddingStyles[padding]}>{children}</div>
    </div>
  );
};
