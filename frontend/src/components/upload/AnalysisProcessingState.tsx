import React from 'react';
import { Loader2, Sparkles, FileText, Cpu, Target, FileCheck } from 'lucide-react';

export const AnalysisProcessingState: React.FC = () => {
  const informationalStages = [
    {
      title: 'Processing documents',
      desc: 'Parsing text and structure from your resume and job description PDFs',
      icon: FileText,
    },
    {
      title: 'Extracting skills and relevant information',
      desc: 'Identifying technical competencies, experience timeline, and education',
      icon: Cpu,
    },
    {
      title: 'Calculating resume–job alignment',
      desc: 'Evaluating cosine similarity via all-MiniLM-L6-v2 embeddings & weighted ATS metrics',
      icon: Target,
    },
    {
      title: 'Preparing the career improvement report',
      desc: 'Generating tailored strengths, identified gaps, and 3 actionable priorities',
      icon: FileCheck,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 sm:p-12 text-center max-w-2xl mx-auto my-8">
      {/* Animated Spinner Icon */}
      <div className="relative inline-flex items-center justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
        </div>
        <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-brand-300" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 tracking-tight">
        Analyzing Your Resume & Job Description
      </h3>
      <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
        Our AI pipeline is parsing your documents, calculating semantic similarity, and drafting your personalized optimization report. This typically takes 15–45 seconds.
      </p>

      {/* Indeterminate Animated Progress Bar */}
      <div className="w-full max-w-md mx-auto mt-6 bg-slate-100 rounded-full h-2 overflow-hidden">
        <div className="h-full bg-brand-600 rounded-full w-2/3 animate-pulse" />
      </div>

      {/* Informational Stage Cards */}
      <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        {informationalStages.map((stage, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3"
          >
            <div className="w-7 h-7 rounded-lg bg-white border border-slate-200/70 flex items-center justify-center text-brand-600 flex-shrink-0 mt-0.5 shadow-2xs">
              <stage.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800">{stage.title}</p>
              <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{stage.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-[11px] text-slate-400">
        Please keep this window open while the analysis runs.
      </p>
    </div>
  );
};
