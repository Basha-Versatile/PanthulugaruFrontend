import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse, Caterer, PagedResponse } from '@/types';

export async function getAllCaterers(params?: {
  page?: number;
  size?: number;
  city?: string;
  search?: string;
  cuisineType?: string;
}): Promise<ApiResponse<PagedResponse<Caterer>>> {
  try {
    const response = await apiClient.get(ENDPOINTS.GET_ALL_CATERERS, { params });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || {
      success: false,
      message: 'Failed to fetch caterers',
      data: { content: [], totalElements: 0, totalPages: 0, size: 0, number: 0, first: true, last: true, empty: true },
    }) as any;
  }
}

export async function getCatererBySlug(slug: string): Promise<ApiResponse<Caterer>> {
  try {
    const response = await apiClient.get(`${ENDPOINTS.GET_CATERER_BY_SLUG}/${slug}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Caterer not found', data: null as unknown as Caterer }) as any;
  }
}

export async function getCatererById(id: string): Promise<ApiResponse<Caterer>> {
  try {
    const response = await apiClient.get(`${ENDPOINTS.GET_CATERER_BY_ID}/${id}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Caterer not found', data: null as unknown as Caterer }) as any;
  }
}
