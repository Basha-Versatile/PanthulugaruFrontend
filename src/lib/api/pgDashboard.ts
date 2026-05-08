import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse, Panthulugaru, PGDashboardStats, BookingCeremony, TimeSlot } from '@/types';

export async function getMyProfile(): Promise<ApiResponse<Panthulugaru>> {
  try {
    const response = await apiClient.get(ENDPOINTS.PG_PROFILE);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to get profile', data: null as unknown as Panthulugaru }) as any;
  }
}

export async function getFullProfile(): Promise<ApiResponse<Panthulugaru>> {
  try {
    const response = await apiClient.get(ENDPOINTS.PG_FULL_PROFILE);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to get full profile', data: null as unknown as Panthulugaru }) as any;
  }
}

export async function updateProfile(data: Partial<Panthulugaru>): Promise<ApiResponse<Panthulugaru>> {
  try {
    const response = await apiClient.put(ENDPOINTS.PG_UPDATE_PROFILE, data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to update profile', data: null as unknown as Panthulugaru }) as any;
  }
}

export async function getDashboardStats(): Promise<ApiResponse<PGDashboardStats>> {
  try {
    const response = await apiClient.get(ENDPOINTS.PG_STATS);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || {
      success: false, message: 'Failed to get stats',
      data: { totalBookings: 0, completedBookings: 0, upcomingBookings: 0, totalEarnings: 0, thisMonthEarnings: 0, rating: 0, reviewCount: 0, profileViews: 0, leadsReceived: 0 },
    }) as any;
  }
}

export async function getMyBookings(params?: { status?: string; page?: number; size?: number }): Promise<ApiResponse<BookingCeremony[]>> {
  try {
    const response = await apiClient.get(ENDPOINTS.PG_BOOKINGS, { params });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to get bookings', data: [] }) as any;
  }
}

export async function acceptBooking(bookingId: string): Promise<ApiResponse<BookingCeremony>> {
  try {
    const response = await apiClient.put(`${ENDPOINTS.PG_BOOKINGS}/${bookingId}/accept`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to accept booking', data: null as unknown as BookingCeremony }) as any;
  }
}

export async function rejectBooking(bookingId: string, reason?: string): Promise<ApiResponse<BookingCeremony>> {
  try {
    const response = await apiClient.put(`${ENDPOINTS.PG_BOOKINGS}/${bookingId}/reject`, { reason });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to reject booking', data: null as unknown as BookingCeremony }) as any;
  }
}

export async function completeBooking(bookingId: string): Promise<ApiResponse<BookingCeremony>> {
  try {
    const response = await apiClient.put(`${ENDPOINTS.PG_BOOKINGS}/${bookingId}/complete`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to complete booking', data: null as unknown as BookingCeremony }) as any;
  }
}

export async function getMyAvailability(date?: string): Promise<ApiResponse<TimeSlot[]>> {
  try {
    const response = await apiClient.get(ENDPOINTS.PG_AVAILABILITY, { params: { date } });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to get availability', data: [] }) as any;
  }
}

export async function setAvailability(slots: TimeSlot[]): Promise<ApiResponse<TimeSlot[]>> {
  try {
    const response = await apiClient.post(ENDPOINTS.PG_AVAILABILITY, { slots });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to set availability', data: [] }) as any;
  }
}
