import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse, DeathAnniversary, TithiInfo } from '@/types';

export async function createDeathAnniversary(data: {
  deceasedName: string;
  relationship: string;
  deathDate: string;
  gothram?: string;
  nakshatra?: string;
  notes?: string;
  reminderEnabled?: boolean;
  reminderDaysBefore?: number;
}): Promise<ApiResponse<DeathAnniversary>> {
  try {
    const response = await apiClient.post(ENDPOINTS.DEATH_ANNIVERSARY, data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to create death anniversary', data: null as unknown as DeathAnniversary }) as any;
  }
}

export async function getByCustomer(): Promise<ApiResponse<DeathAnniversary[]>> {
  try {
    const response = await apiClient.get(ENDPOINTS.DEATH_ANNIVERSARY);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to fetch death anniversaries', data: [] }) as any;
  }
}

export async function calculateTithi(data: {
  deathDate: string;
  yearsAhead?: number;
}): Promise<ApiResponse<TithiInfo & { upcomingDates: Array<{ year: number; gregorianDate: string; dayOfWeek: string }> }>> {
  try {
    const response = await apiClient.post(ENDPOINTS.CALCULATE_TITHI, data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to calculate tithi', data: null as unknown as TithiInfo & { upcomingDates: Array<{ year: number; gregorianDate: string; dayOfWeek: string }> } }) as any;
  }
}
