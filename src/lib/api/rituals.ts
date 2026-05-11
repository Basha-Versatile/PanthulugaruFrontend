import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse, Ritual } from '@/types';

/** Map a backend ritual object to the frontend Ritual type. */
function mapRitual(r: any, fallbackCategory?: string): Ritual {
  return {
    id: r.id,
    name: r.ritualName || r.name || '',
    description: r.description,
    image: r.image || r.ritualImage,
    bannerImage: r.bannerImage,
    category: r.categoryName || fallbackCategory || '',
    isActive: r.isBanner ?? true,
    sortOrder: r.priority,
    subRituals: [],
  };
}

export async function getRitualsWithSublist(): Promise<ApiResponse<Ritual[]>> {
  try {
    const response = await apiClient.get(ENDPOINTS.RITUALS_WITH_SUBLIST);
    const res = response.data;

    // Backend returns Map<String, List<Ritual>> grouped by categoryName.
    // Flatten into a single Ritual[] and map backend field names to frontend names.
    if (res.success && res.data && typeof res.data === 'object' && !Array.isArray(res.data)) {
      const grouped = res.data as Record<string, any[]>;
      const flat: Ritual[] = [];
      for (const [categoryName, rituals] of Object.entries(grouped)) {
        if (!Array.isArray(rituals)) continue;
        for (const r of rituals) {
          flat.push(mapRitual(r, categoryName));
        }
      }
      return { success: true, message: res.message, data: flat };
    }

    // If data is already an array, map field names
    if (res.success && Array.isArray(res.data)) {
      return { ...res, data: res.data.map((r: any) => mapRitual(r)) };
    }

    return res;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to fetch rituals', data: [] }) as any;
  }
}

export async function getRitualById(id: string): Promise<ApiResponse<Ritual>> {
  try {
    const response = await apiClient.get(`${ENDPOINTS.RITUAL_BY_ID}/${id}`);
    const res = response.data;
    if (res.success && res.data) {
      return { ...res, data: mapRitual(res.data) };
    }
    return res;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Ritual not found', data: null as unknown as Ritual }) as any;
  }
}

export async function getMostBookedCeremonies(): Promise<ApiResponse<Ritual[]>> {
  try {
    const response = await apiClient.get(ENDPOINTS.MOST_BOOKED);
    const res = response.data;
    if (res.success && Array.isArray(res.data)) {
      return { ...res, data: res.data.map((r: any) => mapRitual(r)) };
    }
    return res;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to fetch ceremonies', data: [] }) as any;
  }
}

export async function getBannerRituals(): Promise<ApiResponse<Ritual[]>> {
  try {
    const response = await apiClient.get(ENDPOINTS.BANNER_RITUALS);
    const res = response.data;
    if (res.success && Array.isArray(res.data)) {
      return { ...res, data: res.data.map((r: any) => mapRitual(r)) };
    }
    return res;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to fetch banner rituals', data: [] }) as any;
  }
}
