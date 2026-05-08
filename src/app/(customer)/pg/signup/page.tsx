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
    <div className="min-h-screen bg-[#FDF8F0] dark:bg-[#0D0907] flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Sacred decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 dark:bg-[#D4AF37]/3 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FF6B00]/5 dark:bg-[#FF6B00]/3 rounded-full -translate-x-1/3 translate-y-1/3 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.02] dark:opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='100' cy='100' r='80' fill='none' stroke='%23D4AF37' stroke-width='0.5'/%3E%3Ccircle cx='100' cy='100' r='60' fill='none' stroke='%23D4AF37' stroke-width='0.5'/%3E%3Ccircle cx='100' cy='100' r='40' fill='none' stroke='%23D4AF37' stroke-width='0.5'/%3E%3Ccircle cx='100' cy='100' r='20' fill='none' stroke='%23D4AF37' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'contain',
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <img src="/logo.png" alt="Panthulu Garu" className="h-12 w-auto object-contain mx-auto" />
          </Link>
          <p className="text-[#8B4513]/70 dark:text-[#E8DDD0]/60 mt-2 text-sm">Register as a Panthulugaru</p>
        </div>

        <Card className="border-[#D4AF37]/15 dark:border-[#D4AF37]/10 shadow-lg shadow-[#361E1E]/5 dark:shadow-black/20">
          {/* Sacred top accent */}
          <div className="h-1 w-full bg-gradient-to-r from-[#D4AF37] via-[#FF6B00] to-[#D4AF37] rounded-t-2xl" />
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
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[38px] text-[#8B4513]/40 hover:text-[#361E1E] dark:text-[#E8DDD0]/40 dark:hover:text-[#E8DDD0] transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Input label="Confirm Password *" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" required />
              <div>
                <label className="block text-sm font-medium text-[#361E1E] dark:text-[#E8DDD0]/80 mb-1.5">How did you hear about us?</label>
                <select
                  value={referralSource}
                  onChange={(e) => setReferralSource(e.target.value)}
                  className="w-full rounded-lg border border-[#D4AF37]/20 dark:border-[#D4AF37]/10 bg-white dark:bg-[#241C16] px-3.5 py-2.5 text-sm text-[#361E1E] dark:text-[#E8DDD0] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] transition-colors"
                >
                  <option value="">Select (optional)</option>
                  {REFERRAL_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <Button type="submit" variant="sacred" className="w-full" isLoading={submitting}>
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-[#8B4513]/70 dark:text-[#E8DDD0]/60">
              Already have an account?{' '}
              <Link href="/pg/login" className="text-[#FF6B00] font-medium hover:text-[#E05E00] hover:underline transition-colors">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-[#8B4513]/40 dark:text-[#E8DDD0]/30 mt-6">
          Panthulu Garu &copy; {new Date().getFullYear()} &middot; All rights reserved
        </p>
      </div>
    </div>
  );
}
