import api from './client';

export const getNotifications = (page = 1, limit = 10) =>
  api.get(`/notifications?page=${page}&limit=${limit}`);

export const getUnreadCount = () =>
  api.get('/notifications/unread-count');

export const markAsRead = (id: string) =>
  api.put(`/notifications/${id}/read`);

export const markAllAsRead = () =>
  api.put('/notifications/read-all');

export const deleteNotification = (id: string) =>
  api.delete(`/notifications/${id}`);
