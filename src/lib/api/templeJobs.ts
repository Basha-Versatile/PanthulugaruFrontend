import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse, TempleJob, JobApplication, PagedResponse } from '@/types';

export async function getAllJobs(params?: {
  page?: number;
  size?: number;
  city?: string;
  jobType?: string;
  search?: string;
}): Promise<ApiResponse<PagedResponse<TempleJob>>> {
  try {
    const response = await apiClient.get(ENDPOINTS.TEMPLE_JOBS, { params });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || {
      success: false,
      message: 'Failed to fetch jobs',
      data: { content: [], totalElements: 0, totalPages: 0, size: 0, number: 0, first: true, last: true, empty: true },
    }) as any;
  }
}

export async function getJobById(id: string): Promise<ApiResponse<TempleJob>> {
  try {
    const response = await apiClient.get(`${ENDPOINTS.TEMPLE_JOBS}/${id}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Job not found', data: null as unknown as TempleJob }) as any;
  }
}

export async function applyForJob(jobId: string, data: {
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  experience: number;
  qualifications: string[];
  coverLetter?: string;
}): Promise<ApiResponse<JobApplication>> {
  try {
    const response = await apiClient.post(`${ENDPOINTS.TEMPLE_JOBS}/${jobId}/apply`, data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to apply for job', data: null as unknown as JobApplication }) as any;
  }
}
