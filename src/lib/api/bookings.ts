import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse, BookingCeremony, TimeSlot } from '@/types';

export async function createBookingDraft(data: {
  panthulugaruId: string;
  ritualId: string;
  subRitualId?: string;
  bookingDate: string;
  bookingTime: string;
  address: string;
  city: string;
  state?: string;
  pincode?: string;
  notes?: string;
  specialRequirements?: string;
}): Promise<ApiResponse<BookingCeremony>> {
  try {
    const response = await apiClient.post(ENDPOINTS.CREATE_BOOKING_DRAFT, data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to create booking draft', data: null as unknown as BookingCeremony }) as any;
  }
}

export async function getBookingDraft(bookingId: string): Promise<ApiResponse<BookingCeremony>> {
  try {
    const response = await apiClient.get(`${ENDPOINTS.GET_BOOKING_DRAFT}/${bookingId}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to get booking draft', data: null as unknown as BookingCeremony }) as any;
  }
}

export async function updateBookingDraft(bookingId: string, data: Partial<BookingCeremony>): Promise<ApiResponse<BookingCeremony>> {
  try {
    const response = await apiClient.put(`${ENDPOINTS.GET_BOOKING_DRAFT}/${bookingId}`, data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to update booking', data: null as unknown as BookingCeremony }) as any;
  }
}

export async function getMyBookings(params?: {
  page?: number;
  size?: number;
  status?: string;
}): Promise<ApiResponse<BookingCeremony[]>> {
  try {
    const response = await apiClient.get(ENDPOINTS.MY_BOOKINGS, { params });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to get bookings', data: [] }) as any;
  }
}

export async function getPanthulugaruAvailability(panthulugaruId: string, date: string): Promise<ApiResponse<TimeSlot[]>> {
  try {
    const response = await apiClient.get(`${ENDPOINTS.PANDIT_AVAILABILITY}/${panthulugaruId}`, { params: { date } });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to get availability', data: [] }) as any;
  }
}

export async function confirmBooking(bookingId: string): Promise<ApiResponse<BookingCeremony>> {
  try {
    const response = await apiClient.post(`${ENDPOINTS.CONFIRM_BOOKING}/${bookingId}/confirm`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to confirm booking', data: null as unknown as BookingCeremony }) as any;
  }
}

export async function cancelBooking(bookingId: string, reason?: string): Promise<ApiResponse<BookingCeremony>> {
  try {
    const response = await apiClient.put(`${ENDPOINTS.CANCEL_BOOKING}/${bookingId}/cancel`, { reason });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to cancel booking', data: null as unknown as BookingCeremony }) as any;
  }
}

export async function initiateBookingPayment(bookingId: string): Promise<ApiResponse<{ orderId: string; amount: number; currency: string }>> {
  try {
    const response = await apiClient.post(`${ENDPOINTS.INITIATE_PAYMENT}/${bookingId}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to initiate payment', data: null as unknown as { orderId: string; amount: number; currency: string } }) as any;
  }
}

export async function confirmBookingPayment(bookingId: string, paymentData: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<ApiResponse<BookingCeremony>> {
  try {
    const response = await apiClient.post(`${ENDPOINTS.CONFIRM_PAYMENT}/${bookingId}`, paymentData);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Payment confirmation failed', data: null as unknown as BookingCeremony }) as any;
  }
}

export async function failBookingPayment(bookingId: string, reason?: string): Promise<ApiResponse<null>> {
  try {
    const response = await apiClient.post(`${ENDPOINTS.FAIL_PAYMENT}/${bookingId}`, { reason });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to report payment failure', data: null }) as any;
  }
}

export async function getBookingPaymentStatus(bookingId: string): Promise<ApiResponse<{ status: string; paymentId?: string }>> {
  try {
    const response = await apiClient.get(`${ENDPOINTS.PAYMENT_STATUS}/${bookingId}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to get payment status', data: { status: 'UNKNOWN' } }) as any;
  }
}
