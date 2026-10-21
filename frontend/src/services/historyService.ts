import { api } from '../lib/api';
import type { HistoryListResponse, HistoryDetailResponse } from '../types';

export const historyService = {
  async getHistory(): Promise<HistoryListResponse> {
    return api.get<HistoryListResponse>('/analysis/history');
  },

  async getHistoryById(id: string): Promise<HistoryDetailResponse> {
    return api.get<HistoryDetailResponse>(`/analysis/history/${id}`);
  },
};
