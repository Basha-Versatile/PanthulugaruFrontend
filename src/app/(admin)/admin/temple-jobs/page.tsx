'use client';

import React, { useEffect, useState, useCallback } from 'react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { getAllJobs } from '@/lib/api/templeJobs';
import type { TempleJob, PagedResponse } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search, ChevronLeft, ChevronRight, X, Plus, Eye, XCircle,
  Briefcase, MapPin, Calendar, Users, IndianRupee
} from 'lucide-react';

export default function TempleJobsPage() {
  const [jobs, setJobs] = useState<TempleJob[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');

  const [selectedJob, setSelectedJob] = useState<TempleJob | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Create form state
  const [newJob, setNewJob] = useState({
    jobTitle: '', templeName: '', templeLocation: '', city: '', state: '',
    jobType: '', description: '', salary: '', contactEmail: '', contactPhone: '',
    applicationDeadline: '',
  });

  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounced(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, size: 15 };
      if (searchDebounced) params.search = searchDebounced;
      if (categoryFilter) params.jobType = categoryFilter;

      const res = await getAllJobs(params as any);
      if (res.success && res.data) {
        const data = res.data as PagedResponse<TempleJob>;
        let filtered = data.content;
        if (statusFilter === 'active') filtered = filtered.filter((j) => j.isActive);
        if (statusFilter === 'inactive') filtered = filtered.filter((j) => !j.isActive);
        setJobs(filtered);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      } else {
        toast.error(res.message || 'Failed to load jobs');
      }
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, [page, searchDebounced, statusFilter, categoryFilter]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    setPage(0);
  }, [statusFilter, categoryFilter, searchDebounced]);

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setCategoryFilter('');
    setPage(0);
  };

  const hasFilters = search || statusFilter || categoryFilter;

  const handleCreateJob = async () => {
    if (!newJob.jobTitle || !newJob.templeName) {
      toast.error('Job title and temple name are required');
      return;
    }
    toast.success('Job creation API integration pending');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Temple Jobs</h1>
          <p className="text-sm text-gray-500">{totalElements} job postings</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4" /> Create Job
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, temple, city..."
                className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39]"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39]"
            >
              <option value="">All Categories</option>
              <option value="PRIEST">Priest</option>
              <option value="PUJARI">Pujari</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="ADMIN">Admin</option>
              <option value="OTHER">Other</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39]"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4" /> Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                <tr>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Title</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Temple</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Location</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Salary</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Applications</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Status</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Deadline</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                      ))}
                    </tr>
                  ))
                ) : jobs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-400">
                      <Briefcase className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      No temple jobs found.
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{job.jobTitle}</p>
                          <p className="text-xs text-gray-400">{job.jobType}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{job.templeName}</td>
                      <td className="px-4 py-3 text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          {job.city}, {job.state}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {job.salaryRange
                          ? `₹${job.salaryRange.min.toLocaleString('en-IN')} - ₹${job.salaryRange.max.toLocaleString('en-IN')}`
                          : job.salary || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-gray-900 font-medium">{job.applicationsCount}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {job.isActive ? <Badge variant="green">Active</Badge> : <Badge variant="red">Inactive</Badge>}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {job.applicationDeadline ? dayjs(job.applicationDeadline).format('DD MMM YYYY') : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedJob(job)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Page {page + 1} of {totalPages}</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedJob(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">{selectedJob.jobTitle}</h2>
              <button onClick={() => setSelectedJob(null)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <DetailRow label="Temple" value={selectedJob.templeName} />
                <DetailRow label="Location" value={`${selectedJob.city}, ${selectedJob.state}`} />
                <DetailRow label="Job Type" value={selectedJob.jobType} />
                <DetailRow label="Applications" value={selectedJob.applicationsCount.toString()} />
                <DetailRow label="Status" value={selectedJob.isActive ? 'Active' : 'Inactive'} />
                <DetailRow label="Deadline" value={selectedJob.applicationDeadline ? dayjs(selectedJob.applicationDeadline).format('DD MMM YYYY') : '-'} />
              </div>
              <div className="pt-3 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
                <p className="text-sm text-gray-700">{selectedJob.description}</p>
              </div>
              {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Requirements</p>
                  <ul className="list-disc pl-5 text-sm text-gray-700 space-y-0.5">
                    {selectedJob.requirements.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}
              {selectedJob.qualifications && selectedJob.qualifications.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Qualifications</p>
                  <ul className="list-disc pl-5 text-sm text-gray-700 space-y-0.5">
                    {selectedJob.qualifications.map((q, i) => <li key={i}>{q}</li>)}
                  </ul>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                <DetailRow label="Contact Email" value={selectedJob.contactEmail || '-'} />
                <DetailRow label="Contact Phone" value={selectedJob.contactPhone || '-'} />
                <DetailRow label="Created" value={dayjs(selectedJob.createdAt).format('DD MMM YYYY')} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Job Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Create New Job</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Input label="Job Title" value={newJob.jobTitle} onChange={(e) => setNewJob({ ...newJob, jobTitle: e.target.value })} placeholder="e.g., Head Priest" />
              <Input label="Temple Name" value={newJob.templeName} onChange={(e) => setNewJob({ ...newJob, templeName: e.target.value })} placeholder="e.g., Sri Venkateswara Temple" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="City" value={newJob.city} onChange={(e) => setNewJob({ ...newJob, city: e.target.value })} />
                <Input label="State" value={newJob.state} onChange={(e) => setNewJob({ ...newJob, state: e.target.value })} />
              </div>
              <Input label="Job Type" value={newJob.jobType} onChange={(e) => setNewJob({ ...newJob, jobType: e.target.value })} placeholder="e.g., PRIEST" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39]"
                  placeholder="Job description..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Salary" value={newJob.salary} onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })} placeholder="e.g., 25000-40000" />
                <Input label="Deadline" type="date" value={newJob.applicationDeadline} onChange={(e) => setNewJob({ ...newJob, applicationDeadline: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Contact Email" type="email" value={newJob.contactEmail} onChange={(e) => setNewJob({ ...newJob, contactEmail: e.target.value })} />
                <Input label="Contact Phone" value={newJob.contactPhone} onChange={(e) => setNewJob({ ...newJob, contactPhone: e.target.value })} />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button onClick={handleCreateJob}><Plus className="h-4 w-4" /> Create Job</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm text-gray-900">{value}</p>
    </div>
  );
}
