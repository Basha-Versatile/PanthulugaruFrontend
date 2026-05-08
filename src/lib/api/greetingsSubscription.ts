import api from './client';

export const createGreetingsSubscription = (data: any) =>
  api.post('/greetings-subscriptions', data);

export const getMySubscriptions = () =>
  api.get('/greetings-subscriptions/my');

export const updateSubscription = (id: string, data: any) =>
  api.put(`/greetings-subscriptions/${id}`, data);

export const deleteSubscription = (id: string) =>
  api.delete(`/greetings-subscriptions/${id}`);
