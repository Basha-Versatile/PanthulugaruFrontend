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
    <div className="min-h-screen bg-[#FDF8F0] dark:bg-[#0D0907] flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Sacred decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#D4AF37]/5 dark:bg-[#D4AF37]/3 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#FF6B00]/5 dark:bg-[#FF6B00]/3 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
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
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <img src="/logo.png" alt="Panthulu Garu" className="h-12 w-auto object-contain mx-auto" />
          </Link>
          <p className="text-[#8B4513]/70 dark:text-[#E8DDD0]/60 mt-2 text-sm">PG Portal - Login to your dashboard</p>
        </div>

        <Card className="border-[#D4AF37]/15 dark:border-[#D4AF37]/10 shadow-lg shadow-[#361E1E]/5 dark:shadow-black/20">
          {/* Sacred top accent */}
          <div className="h-1 w-full bg-gradient-to-r from-[#D4AF37] via-[#FF6B00] to-[#D4AF37] rounded-t-2xl" />
          <CardHeader>
            <CardTitle>PG Login</CardTitle>
            <CardDescription>Sign in to manage your pandit profile</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Auth method toggle */}
            <div className="flex bg-[#FDF8F0] dark:bg-[#241C16] rounded-xl p-1 mb-6 border border-[#D4AF37]/10 dark:border-[#D4AF37]/5">
              <button
                onClick={() => setAuthMethod('email')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 ${
                  authMethod === 'email'
                    ? 'bg-white dark:bg-[#1A1210] text-[#FF6B00] shadow-sm shadow-[#D4AF37]/10 border border-[#D4AF37]/10 dark:border-[#D4AF37]/10'
                    : 'text-[#8B4513]/60 dark:text-[#E8DDD0]/50 hover:text-[#8B4513] dark:hover:text-[#E8DDD0]/80'
                }`}
              >
                <Mail className="h-3.5 w-3.5" />
                Email
              </button>
              <button
                onClick={() => setAuthMethod('otp')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 ${
                  authMethod === 'otp'
                    ? 'bg-white dark:bg-[#1A1210] text-[#FF6B00] shadow-sm shadow-[#D4AF37]/10 border border-[#D4AF37]/10 dark:border-[#D4AF37]/10'
                    : 'text-[#8B4513]/60 dark:text-[#E8DDD0]/50 hover:text-[#8B4513] dark:hover:text-[#E8DDD0]/80'
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
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[38px] text-[#8B4513]/40 hover:text-[#361E1E] dark:text-[#E8DDD0]/40 dark:hover:text-[#E8DDD0] transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <Button type="submit" variant="sacred" className="w-full" isLoading={submitting}>
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
                    <Button type="submit" variant="sacred" className="w-full" isLoading={submitting}>
                      Verify & Login
                    </Button>
                  </>
                )}
              </form>
            )}

            <div className="mt-6 text-center text-sm text-[#8B4513]/70 dark:text-[#E8DDD0]/60">
              Don&apos;t have an account?{' '}
              <Link href="/pg/signup" className="text-[#FF6B00] font-medium hover:text-[#E05E00] hover:underline transition-colors">
                Sign up as PG
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
