'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Briefcase, IndianRupee, Clock, Building, CheckCircle, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getJobById, applyForJob } from '@/lib/api/templeJobs';
import type { TempleJob } from '@/types';
import toast from 'react-hot-toast';

type Props = {
  params: Promise<{ id: string }>;
};

export default function TempleJobDetailPage({ params }: Props) {
  const { id } = use(params);
  const [job, setJob] = useState<TempleJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Application form
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [experience, setExperience] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await getJobById(id);
      if (response.success && response.data) {
        setJob(response.data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail || !applicantPhone) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      const response = await applyForJob(id, {
        applicantName,
        applicantEmail,
        applicantPhone,
        experience: parseInt(experience) || 0,
        qualifications: qualifications.split(',').map((q) => q.trim()).filter(Boolean),
        coverLetter: coverLetter || undefined,
      });
      if (response.success) {
        toast.success('Application submitted successfully!');
        setShowApplyForm(false);
      } else {
        toast.error(response.message || 'Failed to submit application');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-gray-900">Job not found</h2>
          <Link href="/temple-jobs"><Button variant="outline" className="mt-4">Back to Jobs</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link href="/temple-jobs" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#FF6B00]">
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{job.jobTitle}</h1>
                    <p className="text-lg text-[#FF6B00] font-medium mt-1">{job.templeName}</p>
                  </div>
                  <Badge variant={job.isActive ? 'green' : 'red'} className="flex-shrink-0">
                    {job.isActive ? 'Active' : 'Closed'}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 mt-4 flex-wrap text-sm text-gray-600">
                  <div className="flex items-center gap-1"><MapPin className="h-4 w-4 text-gray-400" /><span>{job.templeLocation}</span></div>
                  <div className="flex items-center gap-1"><Building className="h-4 w-4 text-gray-400" /><span>{job.city}, {job.state}</span></div>
                  {job.jobType && <div className="flex items-center gap-1"><Briefcase className="h-4 w-4 text-gray-400" /><span>{job.jobType}</span></div>}
                </div>

                <div className="mt-6">
                  <h2 className="font-semibold text-gray-900 mb-2">Description</h2>
                  <p className="text-gray-600 leading-relaxed">{job.description}</p>
                </div>

                {job.requirements?.length > 0 && (
                  <div className="mt-6">
                    <h2 className="font-semibold text-gray-900 mb-2">Requirements</h2>
                    <ul className="space-y-1.5">
                      {job.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {job.qualifications?.length > 0 && (
                  <div className="mt-6">
                    <h2 className="font-semibold text-gray-900 mb-2">Qualifications</h2>
                    <div className="flex flex-wrap gap-2">
                      {job.qualifications.map((q, i) => <Badge key={i} variant="outline">{q}</Badge>)}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Application form */}
            {showApplyForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Apply for this Job</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleApply} className="space-y-4">
                    <Input label="Full Name *" value={applicantName} onChange={(e) => setApplicantName(e.target.value)} placeholder="Your full name" required />
                    <div className="grid grid-cols-2 gap-3">
                      <Input label="Email *" type="email" value={applicantEmail} onChange={(e) => setApplicantEmail(e.target.value)} placeholder="Email address" required />
                      <Input label="Phone *" type="tel" value={applicantPhone} onChange={(e) => setApplicantPhone(e.target.value)} placeholder="Phone number" required />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input label="Experience (years)" type="number" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="0" min="0" />
                      <Input label="Qualifications" value={qualifications} onChange={(e) => setQualifications(e.target.value)} placeholder="Comma separated" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover Letter</label>
                      <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} placeholder="Why are you suitable for this role?" rows={4} className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00]" />
                    </div>
                    <div className="flex gap-3">
                      <Button type="submit" variant="primary" isLoading={submitting}><Send className="h-4 w-4 mr-1.5" />Submit Application</Button>
                      <Button type="button" variant="ghost" onClick={() => setShowApplyForm(false)}>Cancel</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                {job.salary && (
                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-5 w-5 text-[#FF6B00]" />
                    <div>
                      <p className="text-xs text-gray-500">Salary</p>
                      <p className="font-semibold text-gray-900">{job.salary}</p>
                    </div>
                  </div>
                )}
                {job.salaryRange && (
                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-5 w-5 text-[#FF6B00]" />
                    <div>
                      <p className="text-xs text-gray-500">Salary Range</p>
                      <p className="font-semibold text-gray-900">&#8377;{job.salaryRange.min.toLocaleString()} - &#8377;{job.salaryRange.max.toLocaleString()}</p>
                    </div>
                  </div>
                )}
                {job.applicationDeadline && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Application Deadline</p>
                      <p className="font-semibold text-gray-900">{new Date(job.applicationDeadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
                <div className="text-xs text-gray-400">{job.applicationsCount} applications received</div>

                {job.isActive && !showApplyForm && (
                  <Button variant="primary" className="w-full" onClick={() => setShowApplyForm(true)}>
                    Apply Now
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
