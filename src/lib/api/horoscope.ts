import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse, Horoscope } from '@/types';

export async function createHoroscopeProfile(data: {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  gender: string;
  gothram?: string;
}): Promise<ApiResponse<Horoscope>> {
  try {
    const response = await apiClient.post(ENDPOINTS.HOROSCOPE, data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to create horoscope', data: null as unknown as Horoscope }) as any;
  }
}

export async function quickLookup(data: {
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
}): Promise<ApiResponse<{ nakshatra: string; rashi: string; lagna: string }>> {
  try {
    const response = await apiClient.post(ENDPOINTS.HOROSCOPE_QUICK, data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to get horoscope', data: { nakshatra: '', rashi: '', lagna: '' } }) as any;
  }
}

export async function getNakshatras(): Promise<ApiResponse<Array<{ name: string; deity: string; symbol: string }>>> {
  try {
    const response = await apiClient.get(ENDPOINTS.HOROSCOPE_NAKSHATRAS);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to get nakshatras', data: [] }) as any;
  }
}
