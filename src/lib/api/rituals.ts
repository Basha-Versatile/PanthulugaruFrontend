import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse, Ritual } from '@/types';

export async function getRitualsWithSublist(): Promise<ApiResponse<Ritual[]>> {
  try {
    const response = await apiClient.get(ENDPOINTS.RITUALS_WITH_SUBLIST);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to fetch rituals', data: [] }) as any;
  }
}

export async function getRitualById(id: string): Promise<ApiResponse<Ritual>> {
  try {
    const response = await apiClient.get(`${ENDPOINTS.RITUAL_BY_ID}/${id}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Ritual not found', data: null as unknown as Ritual }) as any;
  }
}

export async function getMostBookedCeremonies(): Promise<ApiResponse<Ritual[]>> {
  try {
    const response = await apiClient.get(ENDPOINTS.MOST_BOOKED);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to fetch ceremonies', data: [] }) as any;
  }
}

export async function getBannerRituals(): Promise<ApiResponse<Ritual[]>> {
  try {
    const response = await apiClient.get(ENDPOINTS.BANNER_RITUALS);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to fetch banner rituals', data: [] }) as any;
  }
}
