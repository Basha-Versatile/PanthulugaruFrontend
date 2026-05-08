'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Phone, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { usePGAuth } from '@/contexts/PGAuthContext';
import { sendPGOtp } from '@/lib/api/pgAuth';
import toast from 'react-hot-toast';

export default function PGLoginPage() {
  const router = useRouter();
  const { login, otpLogin, isAuthenticated } = usePGAuth();
  const [authMethod, setAuthMethod] = useState<'email' | 'otp'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Email form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // OTP form
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/pg/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    try {
      const success = await login(email, password);
      if (success) {
        router.push('/pg/dashboard');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    setSubmitting(true);
    try {
      const response = await sendPGOtp(phone);
      if (response.success) {
        setOtpSent(true);
        toast.success('OTP sent successfully');
      } else {
        toast.error(response.message || 'Failed to send OTP');
      }
    } catch {
      toast.error('Failed to send OTP');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      toast.error('Please enter a valid OTP');
      return;
    }
    setSubmitting(true);
    try {
      const success = await otpLogin(phone, otp);
      if (success) {
        router.push('/pg/dashboard');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-3xl text-[#E07B39] font-bold">Om</span>
            <span className="text-2xl font-bold text-gray-900 ml-2">Panthulu <span className="text-[#E07B39]">Garu</span></span>
          </Link>
          <p className="text-gray-500 mt-2">PG Portal - Login to your dashboard</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>PG Login</CardTitle>
            <CardDescription>Sign in to manage your pandit profile</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Auth method toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
              <button
                onClick={() => setAuthMethod('email')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                  authMethod === 'email' ? 'bg-white text-[#E07B39] shadow-sm' : 'text-gray-500'
                }`}
              >
                <Mail className="h-3.5 w-3.5" />
                Email
              </button>
              <button
                onClick={() => setAuthMethod('otp')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                  authMethod === 'otp' ? 'bg-white text-[#E07B39] shadow-sm' : 'text-gray-500'
                }`}
              >
                <Phone className="h-3.5 w-3.5" />
                Phone OTP
              </button>
            </div>

            {authMethod === 'email' ? (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
                <div className="relative">
                  <Input label="Password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <Button type="submit" variant="primary" className="w-full" isLoading={submitting}>
                  Sign In
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOtpLogin} className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input label="Phone Number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" disabled={otpSent} required />
                  </div>
                  <div className="pt-[26px]">
                    <Button type="button" variant="outline" onClick={handleSendOtp} disabled={otpSent} isLoading={submitting && !otpSent}>
                      {otpSent ? 'Sent' : 'Send OTP'}
                    </Button>
                  </div>
                </div>
                {otpSent && (
                  <>
                    <Input label="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit OTP" maxLength={6} required />
                    <Button type="submit" variant="primary" className="w-full" isLoading={submitting}>
                      Verify & Login
                    </Button>
                  </>
                )}
              </form>
            )}

            <div className="mt-6 text-center text-sm text-gray-500">
              Don&apos;t have an account?{' '}
              <Link href="/pg/signup" className="text-[#E07B39] font-medium hover:underline">
                Sign up as PG
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
