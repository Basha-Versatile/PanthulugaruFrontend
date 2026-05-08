'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Briefcase, MapPin, IndianRupee, Clock, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getAllJobs } from '@/lib/api/templeJobs';
import { DUMMY_TEMPLE_JOBS } from '@/lib/dummyData';
import type { TempleJob } from '@/types';

function TempleJobsInner() {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<TempleJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [currentPage, cityFilter, jobTypeFilter]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params: any = { page: currentPage, size: 12 };
      if (searchQuery) params.search = searchQuery;
      if (cityFilter) params.city = cityFilter;
      if (jobTypeFilter) params.jobType = jobTypeFilter;
      const response = await getAllJobs(params);
      if (response.success && response.data && response.data.content?.length > 0) {
        setJobs(response.data.content);
        setTotalPages(response.data.totalPages || 0);
      } else {
        setJobs(DUMMY_TEMPLE_JOBS);
        setTotalPages(1);
      }
    } catch {
      setJobs(DUMMY_TEMPLE_JOBS);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchJobs();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D0907]">
      <div className="bg-white border-b border-gray-200 dark:bg-[#1A1210] dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Temple Jobs</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Find sacred job opportunities at temples across India</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and filters */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] dark:bg-[#241C16] dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>
          <input
            type="text"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            placeholder="Filter by city"
            className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] sm:w-40 dark:bg-[#241C16] dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500"
          />
          <Button type="submit" variant="primary">Search</Button>
        </form>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 dark:bg-[#1A1210] dark:border-gray-700 p-12 text-center">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No jobs found</h3>
            <p className="text-gray-500 dark:text-gray-400">Check back later for new opportunities</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <Link key={job.id} href={`/temple-jobs/${job.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{job.jobTitle}</h3>
                          <p className="text-sm text-[#FF6B00] font-medium mt-0.5">{job.templeName}</p>
                        </div>
                        <Badge variant={job.isActive ? 'green' : 'default'}>
                          {job.isActive ? 'Active' : 'Closed'}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 mt-3 flex-wrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{job.city}, {job.state}</span>
                        </div>
                        {job.jobType && (
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-3.5 w-3.5" />
                            <span>{job.jobType}</span>
                          </div>
                        )}
                        {job.salary && (
                          <div className="flex items-center gap-1">
                            <IndianRupee className="h-3.5 w-3.5" />
                            <span>{job.salary}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 line-clamp-2">{job.description}</p>

                      {job.applicationDeadline && (
                        <div className="flex items-center gap-1 mt-3 text-xs text-gray-400 dark:text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button variant="outline" size="sm" disabled={currentPage === 0} onClick={() => setCurrentPage((p) => p - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-500 dark:text-gray-400">Page {currentPage + 1} of {totalPages}</span>
                <Button variant="outline" size="sm" disabled={currentPage >= totalPages - 1} onClick={() => setCurrentPage((p) => p + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function TempleJobsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-[#0D0907]"><div className="max-w-7xl mx-auto px-4 py-12"><Skeleton className="h-8 w-48 mb-4" /><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}</div></div></div>}>
      <TempleJobsInner />
    </Suspense>
  );
}
