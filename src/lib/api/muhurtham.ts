import api from './client';

export const createMuhurthamOrder = (data: any) =>
  api.post('/muhurtham', data);

export const getMyMuhurthamOrders = (page = 1, limit = 10) =>
  api.get(`/muhurtham/my?page=${page}&limit=${limit}`);

export const getMuhurthamOrderById = (id: string) =>
  api.get(`/muhurtham/${id}`);
