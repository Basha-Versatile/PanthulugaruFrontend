import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse, Festival } from '@/types';

export async function getUpcomingFestivals(): Promise<ApiResponse<Festival[]>> {
  try {
    const response = await apiClient.get(ENDPOINTS.GET_FESTIVALS);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to fetch festivals', data: [] }) as any;
  }
}
