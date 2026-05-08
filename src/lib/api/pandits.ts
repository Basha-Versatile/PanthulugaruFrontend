import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse, Panthulugaru, PagedResponse } from '@/types';

export async function getAllPandits(params?: {
  page?: number;
  size?: number;
  city?: string;
  ritual?: string;
  search?: string;
  sortBy?: string;
}): Promise<ApiResponse<PagedResponse<Panthulugaru>>> {
  try {
    const response = await apiClient.get(ENDPOINTS.GET_ALL_PANDITS, { params });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || {
      success: false,
      message: 'Failed to fetch pandits',
      data: { content: [], totalElements: 0, totalPages: 0, size: 0, number: 0, first: true, last: true, empty: true },
    }) as any;
  }
}

export async function getPanditBySlug(slug: string): Promise<ApiResponse<Panthulugaru>> {
  try {
    const response = await apiClient.get(`${ENDPOINTS.GET_PANDIT_BY_SLUG}/${slug}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Pandit not found', data: null as unknown as Panthulugaru }) as any;
  }
}

export async function getPanditById(id: string): Promise<ApiResponse<Panthulugaru>> {
  try {
    const response = await apiClient.get(`${ENDPOINTS.GET_PANDIT_BY_ID}/${id}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Pandit not found', data: null as unknown as Panthulugaru }) as any;
  }
}

export async function getPanditByPhone(phone: string): Promise<ApiResponse<Panthulugaru>> {
  try {
    const response = await apiClient.get(`${ENDPOINTS.GET_PANDIT_BY_PHONE}/${phone}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Pandit not found', data: null as unknown as Panthulugaru }) as any;
  }
}
