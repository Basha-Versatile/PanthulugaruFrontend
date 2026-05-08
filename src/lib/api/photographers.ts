import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse, Photographer, PagedResponse } from '@/types';

export async function getAllPhotographers(params?: {
  page?: number;
  size?: number;
  city?: string;
  search?: string;
}): Promise<ApiResponse<PagedResponse<Photographer>>> {
  try {
    const response = await apiClient.get(ENDPOINTS.GET_ALL_PHOTOGRAPHERS, { params });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || {
      success: false,
      message: 'Failed to fetch photographers',
      data: { content: [], totalElements: 0, totalPages: 0, size: 0, number: 0, first: true, last: true, empty: true },
    }) as any;
  }
}

export async function getPhotographerBySlug(slug: string): Promise<ApiResponse<Photographer>> {
  try {
    const response = await apiClient.get(`${ENDPOINTS.GET_PHOTOGRAPHER_BY_SLUG}/${slug}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Photographer not found', data: null as unknown as Photographer }) as any;
  }
}

export async function getPhotographerById(id: string): Promise<ApiResponse<Photographer>> {
  try {
    const response = await apiClient.get(`${ENDPOINTS.GET_PHOTOGRAPHER_BY_ID}/${id}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Photographer not found', data: null as unknown as Photographer }) as any;
  }
}
