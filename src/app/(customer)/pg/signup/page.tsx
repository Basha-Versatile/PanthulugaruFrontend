'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { usePGAuth } from '@/contexts/PGAuthContext';
import toast from 'react-hot-toast';

export default function PGSignupPage() {
  const router = useRouter();
  const { signup, isAuthenticated } = usePGAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralSource, setReferralSource] = useState('');

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/pg/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phone || !password) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    try {
      const success = await signup({
        firstName,
        lastName,
        email,
        phone,
        password,
      });
      if (success) {
        router.push('/pg/dashboard');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const REFERRAL_SOURCES = [
    'Google Search',
    'Social Media',
    'Friend/Family',
    'Advertisement',
    'Temple Notice',
    'Other',
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-3xl text-[#E07B39] font-bold">Om</span>
            <span className="text-2xl font-bold text-gray-900 ml-2">Panthulu <span className="text-[#E07B39]">Garu</span></span>
          </Link>
          <p className="text-gray-500 mt-2">Register as a Panthulugaru</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>PG Registration</CardTitle>
            <CardDescription>Create your pandit account to start receiving bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input label="First Name *" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" required />
                <Input label="Last Name *" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" required />
              </div>
              <Input label="Email *" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" required />
              <Input label="Phone Number *" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" required />
              <div className="relative">
                <Input label="Password *" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Input label="Confirm Password *" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" required />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">How did you hear about us?</label>
                <select value={referralSource} onChange={(e) => setReferralSource(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39]">
                  <option value="">Select (optional)</option>
                  {REFERRAL_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <Button type="submit" variant="primary" className="w-full" isLoading={submitting}>
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link href="/pg/login" className="text-[#E07B39] font-medium hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
