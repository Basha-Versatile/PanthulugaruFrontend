import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse, DashboardStats, Panthulugaru, Customer, Lead, Payment, Article, Ritual, PagedResponse, ServiceAreaEntry } from '@/types';

/**
 * Convert frontend pagination params (page 0-based, size) to backend params (page 1-based, limit),
 * and convert backend PagedResponse ({data, total, totalPages, page, limit}) to frontend format
 * ({content, totalElements, totalPages, size, number, first, last, empty}).
 */
function toBackendParams(params?: Record<string, any>): Record<string, any> {
  if (!params) return {};
  const mapped: Record<string, any> = { ...params };
  // page: frontend 0-based → backend 1-based
  if ('page' in mapped) mapped.page = (mapped.page ?? 0) + 1;
  // size → limit
  if ('size' in mapped) { mapped.limit = mapped.size; delete mapped.size; }
  return mapped;
}

function toFrontendPaged<T>(backendData: any): PagedResponse<T> {
  return {
    content: backendData.data || [],
    totalElements: backendData.total ?? 0,
    totalPages: backendData.totalPages ?? 0,
    size: backendData.limit ?? 10,
    number: (backendData.page ?? 1) - 1, // backend 1-based → frontend 0-based
    first: (backendData.page ?? 1) <= 1,
    last: (backendData.page ?? 1) >= (backendData.totalPages ?? 1),
    empty: !backendData.data || backendData.data.length === 0,
  };
}

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
    const response = await apiClient.get(ENDPOINTS.ADMIN_PGS, { params: toBackendParams(params) });
    const res = response.data;
    if (res.success && res.data) {
      return { ...res, data: toFrontendPaged<Panthulugaru>(res.data) };
    }
    return res;
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
    const response = await apiClient.get(ENDPOINTS.ADMIN_CUSTOMERS, { params: toBackendParams(params) });
    const res = response.data;
    if (res.success && res.data) {
      return { ...res, data: toFrontendPaged<Customer>(res.data) };
    }
    return res;
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
    const response = await apiClient.get(ENDPOINTS.ADMIN_GET_LEADS, { params: toBackendParams(params) });
    const res = response.data;
    if (res.success && res.data) {
      return { ...res, data: toFrontendPaged<Lead>(res.data) };
    }
    return res;
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
    const response = await apiClient.get(ENDPOINTS.ADMIN_GET_PAYMENTS, { params: toBackendParams(params) });
    const res = response.data;
    if (res.success && res.data) {
      return { ...res, data: toFrontendPaged<Payment>(res.data) };
    }
    return res;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to get payments', data: { content: [], totalElements: 0, totalPages: 0, size: 0, number: 0, first: true, last: true, empty: true } }) as any;
  }
}

export async function getArticles(params?: { page?: number; size?: number; status?: string }): Promise<ApiResponse<PagedResponse<Article>>> {
  try {
    const response = await apiClient.get(ENDPOINTS.ADMIN_ARTICLES, { params: toBackendParams(params) });
    const res = response.data;
    if (res.success && res.data) {
      return { ...res, data: toFrontendPaged<Article>(res.data) };
    }
    return res;
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
    const res = response.data;

    // Backend returns Map<String, List<Ritual>> grouped by categoryName.
    // Flatten into a single Ritual[] with mapped field names.
    if (res.success && res.data && typeof res.data === 'object' && !Array.isArray(res.data)) {
      const grouped = res.data as Record<string, any[]>;
      const flat: Ritual[] = [];
      for (const [categoryName, rituals] of Object.entries(grouped)) {
        if (!Array.isArray(rituals)) continue;
        for (const r of rituals) {
          flat.push({
            id: r.id,
            name: r.ritualName || r.name || '',
            description: r.description,
            image: r.image || r.ritualImage,
            bannerImage: r.bannerImage,
            category: r.categoryName || categoryName,
            isActive: r.isBanner ?? true,
            subRituals: [],
          });
        }
      }
      return { success: true, message: res.message, data: flat };
    }

    return res;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to get rituals', data: [] }) as any;
  }
}

export async function createRitual(data: Partial<Ritual>): Promise<ApiResponse<Ritual>> {
  try {
    const response = await apiClient.post('/admin/rituals', data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to create ritual', data: null as unknown as Ritual }) as any;
  }
}

export async function updateRitual(id: string, data: Partial<Ritual>): Promise<ApiResponse<Ritual>> {
  try {
    const response = await apiClient.put(`/admin/rituals/${id}`, data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to update ritual', data: null as unknown as Ritual }) as any;
  }
}

export async function deleteRitual(id: string): Promise<ApiResponse<null>> {
  try {
    const response = await apiClient.delete(`/admin/rituals/${id}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to delete ritual', data: null }) as any;
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
