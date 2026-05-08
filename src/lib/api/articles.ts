import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse, Article, PagedResponse } from '@/types';

export async function getArticles(params?: {
  page?: number;
  size?: number;
  category?: string;
  tag?: string;
  status?: string;
}): Promise<ApiResponse<PagedResponse<Article>>> {
  try {
    const response = await apiClient.get(ENDPOINTS.GET_ARTICLES, { params });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || {
      success: false,
      message: 'Failed to fetch articles',
      data: { content: [], totalElements: 0, totalPages: 0, size: 0, number: 0, first: true, last: true, empty: true },
    }) as any;
  }
}

export async function getArticleBySlug(slug: string): Promise<ApiResponse<Article>> {
  try {
    const response = await apiClient.get(`${ENDPOINTS.GET_ARTICLES}/slug/${slug}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Article not found', data: null as unknown as Article }) as any;
  }
}
