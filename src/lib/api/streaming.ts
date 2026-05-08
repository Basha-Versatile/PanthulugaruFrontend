import api from './client';

export const createStreamingRoom = (bookingId: string, pgId: string, customerId: string) =>
  api.post('/streaming/create', { bookingId, pgId, customerId });

export const getStreamingByBooking = (bookingId: string) =>
  api.get(`/streaming/${bookingId}`);

export const joinStreamingRoom = (bookingId: string, role: string) =>
  api.post(`/streaming/${bookingId}/join`, { role });

export const leaveStreamingRoom = (bookingId: string) =>
  api.post(`/streaming/${bookingId}/leave`);

export const endStreaming = (bookingId: string) =>
  api.post(`/streaming/${bookingId}/end`);
