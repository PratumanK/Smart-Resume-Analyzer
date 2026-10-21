import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { historyService } from '../services/historyService';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import {
  History,
  FileSearch,
  Calendar,
  ExternalLink,
  Loader2,
  FolderOpen,
  Search,
  Filter,
} from 'lucide-react';
import type { HistoryItem } from '../types';

export const AnalysisHistoryPage: React.FC = () => {
  const navigate = useNavigate();

  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

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
      } else {
        setErrorMessage('Failed to load history list.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not fetch your analysis history from the server.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredHistory = historyList.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const title = (item.jobTitle || '').toLowerCase();
    const rating = (item.analysis?.ats_score?.rating || '').toLowerCase();
    return title.includes(query) || rating.includes(query);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-600 mb-1">
            <History className="w-4 h-4" />
            <span>Saved Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Analysis History
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View all previous resume analyses, ATS ratings, and improvement reports
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate('/analysis/new')}
          leftIcon={<FileSearch className="w-4 h-4" />}
        >
          New Analysis
        </Button>
      </div>

      {errorMessage && (
        <Alert
          type="error"
          title="Error Loading History"
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}

      {/* Search Bar */}
      {historyList.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by job title or rating..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredHistory.length} of {historyList.length}
          </span>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-slate-200">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600 mb-3" />
          <p className="text-sm font-semibold text-slate-800">Fetching analysis history...</p>
        </div>
      ) : historyList.length === 0 ? (
        /* Empty State */
        <Card className="text-center py-12 px-6">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No analyses saved yet</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            You haven't run any resume analyses yet. Upload your first resume and job description to see detailed ATS breakdown reports here.
          </p>
          <div className="mt-6">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/analysis/new')}
              leftIcon={<FileSearch className="w-4 h-4" />}
            >
              Start First Analysis
            </Button>
          </div>
        </Card>
      ) : filteredHistory.length === 0 ? (
        <Card className="text-center py-8">
          <p className="text-xs text-slate-500">
            No analyses match your search query "{searchQuery}".
          </p>
        </Card>
      ) : (
        /* History Records Table / Cards */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">Target Role / Title</th>
                  <th className="py-3.5 px-6">ATS Score</th>
                  <th className="py-3.5 px-6">Rating</th>
                  <th className="py-3.5 px-6">Skills Match</th>
                  <th className="py-3.5 px-6">Date Analyzed</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredHistory.map((item) => {
                  const ats = item.analysis?.ats_score?.ats ?? 0;
                  const rating = item.analysis?.ats_score?.rating || 'Evaluated';
                  const skillsMatch = Math.round(item.analysis?.skills?.match_percentage ?? 0);
                  const dateStr = item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'N/A';

                  const getScoreBadgeVariant = (score: number) => {
                    if (score >= 80) return 'success';
                    if (score >= 70) return 'brand';
                    if (score >= 60) return 'warning';
                    return 'danger';
                  };

                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/analysis/result/${item._id}`)}
                    >
                      <td className="py-4 px-6 font-semibold text-slate-900">
                        <div className="truncate max-w-xs">{item.jobTitle || 'Untitled Analysis'}</div>
                        <span className="text-[11px] text-slate-400 font-normal">ID: {item._id.slice(-6)}</span>
                      </td>

                      <td className="py-4 px-6">
                        <span className="text-base font-extrabold text-slate-900">{ats}</span>
                        <span className="text-xs text-slate-400 ml-0.5">%</span>
                      </td>

                      <td className="py-4 px-6">
                        <Badge variant={getScoreBadgeVariant(ats)} size="sm">
                          {rating}
                        </Badge>
                      </td>

                      <td className="py-4 px-6">
                        <span className="font-semibold text-slate-700">{skillsMatch}%</span>
                      </td>

                      <td className="py-4 px-6 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{dateStr}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <Link
                          to={`/analysis/result/${item._id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 p-1.5 rounded hover:bg-brand-50 transition-colors"
                        >
                          <span>View Report</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
