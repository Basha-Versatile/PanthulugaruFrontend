import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse, DashboardStats, Panthulugaru, Customer, Lead, Payment, Article, Ritual, PagedResponse, ServiceAreaEntry } from '@/types';

export async function adminLogin(data: { email: string; password: string }): Promise<ApiResponse<{ token: string; user: { id: string; name: string; email: string; role: string } }>> {
  try {
    const response = await apiClient.post(ENDPOINTS.ADMIN_LOGIN, data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Login failed', data: null as unknown as { token: string; user: { id: string; name: string; email: string; role: string } } }) as any;
  }
}

export async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  try {
    const response = await apiClient.get(ENDPOINTS.ADMIN_DASHBOARD_STATS);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to get stats', data: null as unknown as DashboardStats }) as any;
  }
}

export async function getAllPGs(params?: { page?: number; size?: number; status?: string; search?: string }): Promise<ApiResponse<PagedResponse<Panthulugaru>>> {
  try {
    const response = await apiClient.get(ENDPOINTS.ADMIN_PGS, { params });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to get PGs', data: { content: [], totalElements: 0, totalPages: 0, size: 0, number: 0, first: true, last: true, empty: true } }) as any;
  }
}

export async function getPGById(id: string): Promise<ApiResponse<Panthulugaru>> {
  try {
    const response = await apiClient.get(`${ENDPOINTS.ADMIN_PGS}/${id}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'PG not found', data: null as unknown as Panthulugaru }) as any;
  }
}

export async function updatePG(id: string, data: Partial<Panthulugaru>): Promise<ApiResponse<Panthulugaru>> {
  try {
    const response = await apiClient.put(`${ENDPOINTS.ADMIN_PGS}/${id}`, data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to update PG', data: null as unknown as Panthulugaru }) as any;
  }
}

export async function updatePGStatus(id: string, status: string, reason?: string): Promise<ApiResponse<Panthulugaru>> {
  try {
    const response = await apiClient.put(`${ENDPOINTS.ADMIN_PGS}/${id}/status`, { status, reason });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to update PG status', data: null as unknown as Panthulugaru }) as any;
  }
}

export async function getCustomers(params?: { page?: number; size?: number; search?: string }): Promise<ApiResponse<PagedResponse<Customer>>> {
  try {
    const response = await apiClient.get(ENDPOINTS.ADMIN_CUSTOMERS, { params });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to get customers', data: { content: [], totalElements: 0, totalPages: 0, size: 0, number: 0, first: true, last: true, empty: true } }) as any;
  }
}

export async function getCustomerById(id: string): Promise<ApiResponse<Customer>> {
  try {
    const response = await apiClient.get(`${ENDPOINTS.ADMIN_CUSTOMERS}/${id}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Customer not found', data: null as unknown as Customer }) as any;
  }
}

export async function updateCustomer(id: string, data: Partial<Customer>): Promise<ApiResponse<Customer>> {
  try {
    const response = await apiClient.put(`${ENDPOINTS.ADMIN_CUSTOMERS}/${id}`, data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to update customer', data: null as unknown as Customer }) as any;
  }
}

export async function getLeads(params?: { page?: number; size?: number; status?: string }): Promise<ApiResponse<PagedResponse<Lead>>> {
  try {
    const response = await apiClient.get(ENDPOINTS.ADMIN_GET_LEADS, { params });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to get leads', data: { content: [], totalElements: 0, totalPages: 0, size: 0, number: 0, first: true, last: true, empty: true } }) as any;
  }
}

export async function updateLeadStatus(id: string, status: string): Promise<ApiResponse<Lead>> {
  try {
    const response = await apiClient.put(`${ENDPOINTS.ADMIN_GET_LEADS}/${id}/status`, { status });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to update lead status', data: null as unknown as Lead }) as any;
  }
}

export async function getPayments(params?: { page?: number; size?: number; status?: string; paymentType?: string }): Promise<ApiResponse<PagedResponse<Payment>>> {
  try {
    const response = await apiClient.get(ENDPOINTS.ADMIN_GET_PAYMENTS, { params });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to get payments', data: { content: [], totalElements: 0, totalPages: 0, size: 0, number: 0, first: true, last: true, empty: true } }) as any;
  }
}

export async function getArticles(params?: { page?: number; size?: number; status?: string }): Promise<ApiResponse<PagedResponse<Article>>> {
  try {
    const response = await apiClient.get(ENDPOINTS.ADMIN_ARTICLES, { params });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to get articles', data: { content: [], totalElements: 0, totalPages: 0, size: 0, number: 0, first: true, last: true, empty: true } }) as any;
  }
}

export async function createArticle(data: Partial<Article>): Promise<ApiResponse<Article>> {
  try {
    const response = await apiClient.post(ENDPOINTS.ADMIN_ARTICLES, data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to create article', data: null as unknown as Article }) as any;
  }
}

export async function updateArticle(id: string, data: Partial<Article>): Promise<ApiResponse<Article>> {
  try {
    const response = await apiClient.put(`${ENDPOINTS.ADMIN_ARTICLES}/${id}`, data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to update article', data: null as unknown as Article }) as any;
  }
}

export async function deleteArticle(id: string): Promise<ApiResponse<null>> {
  try {
    const response = await apiClient.delete(`${ENDPOINTS.ADMIN_ARTICLES}/${id}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to delete article', data: null }) as any;
  }
}

export async function updateArticleStatus(id: string, status: string): Promise<ApiResponse<Article>> {
  try {
    const response = await apiClient.put(`${ENDPOINTS.ADMIN_ARTICLES}/${id}/status`, { status });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to update article status', data: null as unknown as Article }) as any;
  }
}

export async function getMasterRituals(): Promise<ApiResponse<Ritual[]>> {
  try {
    const response = await apiClient.get(ENDPOINTS.ADMIN_MASTER_RITUALS);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to get rituals', data: [] }) as any;
  }
}

export async function getMasterLocations(): Promise<ApiResponse<ServiceAreaEntry[]>> {
  try {
    const response = await apiClient.get(ENDPOINTS.ADMIN_MASTER_LOCATIONS);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to get locations', data: [] }) as any;
  }
}
