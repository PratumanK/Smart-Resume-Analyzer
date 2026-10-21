import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { historyService } from '../services/historyService';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import {
  FileSearch,
  History,
  TrendingUp,
  FileCheck2,
  Calendar,
  ExternalLink,
  Loader2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import type { HistoryItem } from '../types';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await historyService.getHistory();
      if (response && response.success && Array.isArray(response.history)) {
        setHistoryList(response.history);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not fetch analysis history.');
    } finally {
      setIsLoading(false);
    }
  };

  // Derive genuine statistics from real backend history data
  const totalAnalyses = historyList.length;
  const validScores = historyList
    .map((item) => item.analysis?.ats_score?.ats)
    .filter((s): s is number => typeof s === 'number' && !isNaN(s));

  const averageAts =
    validScores.length > 0
      ? Math.round(validScores.reduce((acc, curr) => acc + curr, 0) / validScores.length)
      : null;

  const highestAts =
    validScores.length > 0 ? Math.max(...validScores) : null;

  const latestAnalysis = historyList.length > 0 ? historyList[0] : null;

  const getBadgeVariant = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 70) return 'brand';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-brand-950 p-6 sm:p-8 text-white shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-brand-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Career Optimization</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome back, {user?.userName || 'Candidate'}
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Compare your resume against any target job description. Identify missing skills, calculate semantic similarity, and receive exactly 3 targeted career improvement recommendations.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/analysis/new')}
              leftIcon={<FileSearch className="w-4 h-4" />}
            >
              Start New Analysis
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/history')}
              leftIcon={<History className="w-4 h-4" />}
              className="bg-transparent text-white border-slate-700 hover:bg-slate-800 hover:text-white"
            >
              View History
            </Button>
          </div>
        </div>
      </div>

      {errorMessage && (
        <Alert
          type="error"
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}

      {/* Genuine Real Metrics Derived from Backend Data */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card padding="sm" className="border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Analyses
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {isLoading ? '...' : totalAnalyses}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="sm" className="border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Average ATS Score
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {isLoading ? '...' : averageAts !== null ? `${averageAts}%` : 'N/A'}
              </p>
            </div>
          </div>
        </Card>

        <Card padding="sm" className="border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Highest Match Score
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {isLoading ? '...' : highestAts !== null ? `${highestAts}%` : 'N/A'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Section: Recent Analyses or Empty State */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Recent Analyses
          </h2>
          {historyList.length > 0 && (
            <Link
              to="/history"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>View all ({historyList.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="min-h-[200px] flex items-center justify-center bg-white rounded-xl border border-slate-200">
            <Loader2 className="w-6 h-6 animate-spin text-brand-600 mr-2" />
            <span className="text-xs font-medium text-slate-500">Loading your analyses...</span>
          </div>
        ) : historyList.length === 0 ? (
          /* Empty State */
          <Card className="text-center py-10 px-6">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
              <FileSearch className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              No Resume Analyses Yet
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Upload your resume and a job description PDF to evaluate your match rate, view extracted skills, and get personalized recommendations.
            </p>
            <div className="mt-5">
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/analysis/new')}
                leftIcon={<FileSearch className="w-4 h-4" />}
              >
                Create Your First Analysis
              </Button>
            </div>
          </Card>
        ) : (
          /* Recent Analyses List */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {historyList.slice(0, 6).map((item) => {
              const ats = item.analysis?.ats_score?.ats ?? 0;
              const rating = item.analysis?.ats_score?.rating || 'Evaluated';
              const skillsMatch = Math.round(item.analysis?.skills?.match_percentage ?? 0);
              const dateStr = item.createdAt
                ? new Date(item.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Recent';

              return (
                <Card
                  key={item._id}
                  padding="none"
                  className="flex flex-col justify-between hover:shadow-md transition-shadow duration-150 border-slate-200"
                >
                  <div className="p-5 border-b border-slate-100">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {dateStr}
                      </span>
                      <Badge variant={getBadgeVariant(ats)} size="sm">
                        {rating}
                      </Badge>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 truncate" title={item.jobTitle}>
                      {item.jobTitle || 'Target Role Analysis'}
                    </h3>
                  </div>

                  <div className="p-5 space-y-3 bg-slate-50/50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">ATS Score:</span>
                      <span className="font-bold text-slate-900 text-sm">{ats}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Skills Match:</span>
                      <span className="font-semibold text-slate-700">{skillsMatch}%</span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/analysis/result/${item._id}`)}
                      className="w-full mt-2"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      View Report
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* How the Evaluation Engine Works */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-brand-600" />
            <span>How the Smart Analysis Engine Evaluates Your Profile</span>
          </div>
        }
        subtitle="Transparent weighting aligned with enterprise Applicant Tracking Systems (ATS)"
      >
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
            <span className="font-bold text-slate-900 block text-sm">40% Skills Match</span>
            <p className="text-slate-500 mt-1">
              Direct and alias comparison of technical and domain skills between documents.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
            <span className="font-bold text-slate-900 block text-sm">30% Semantic Embeddings</span>
            <p className="text-slate-500 mt-1">
              Sentence Transformer (all-MiniLM-L6-v2) cosine similarity of descriptive context.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
            <span className="font-bold text-slate-900 block text-sm">20% Experience</span>
            <p className="text-slate-500 mt-1">
              Total career years versus minimum requirement and role seniority relevance.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
            <span className="font-bold text-slate-900 block text-sm">10% Education</span>
            <p className="text-slate-500 mt-1">
              Degree qualification matching against minimum criteria specified by the employer.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
