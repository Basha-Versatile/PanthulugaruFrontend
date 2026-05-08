'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, User } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAdmin();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await login(email, password);
      if (success) {
        router.replace('/admin');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF8F0] dark:bg-[#0D0907] px-4 relative overflow-hidden">
      {/* Sacred decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#D4AF37]/8 to-transparent dark:from-[#D4AF37]/4 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#FF6B00]/5 dark:bg-[#FF6B00]/3 rounded-full -translate-x-1/3 translate-y-1/3 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#D4AF37]/5 dark:bg-[#D4AF37]/3 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <img src="/logo-full.png" alt="Panthulu Garu" className="h-16 w-16 rounded-full object-cover mb-4 mx-auto" />
          <h1 className="text-2xl font-heading font-bold text-[#361E1E] dark:text-[#E8DDD0]">
            Panthulu Garu <span className="text-[#FF6B00]">Admin</span>
          </h1>
          <p className="text-sm text-[#8B4513]/70 dark:text-[#E8DDD0]/60 mt-1">Sign in to manage the platform</p>
        </div>

        <Card className="border-[#D4AF37]/15 dark:border-[#D4AF37]/10 shadow-lg shadow-[#361E1E]/5 dark:shadow-black/20">
          {/* Sacred top accent */}
          <div className="h-1 w-full bg-gradient-to-r from-[#D4AF37] via-[#FF6B00] to-[#D4AF37] rounded-t-2xl" />
          <CardContent className="p-6 pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-sm text-red-700 dark:text-red-400">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#361E1E] dark:text-[#E8DDD0]/80 mb-1.5">Email</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B4513]/40 dark:text-[#E8DDD0]/30" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-[#D4AF37]/20 dark:border-[#D4AF37]/10 bg-white dark:bg-[#241C16] pl-10 pr-4 py-2.5 text-sm text-[#361E1E] dark:text-[#E8DDD0] placeholder:text-[#8B4513]/40 dark:placeholder:text-[#E8DDD0]/30 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] transition-colors"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#361E1E] dark:text-[#E8DDD0]/80 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B4513]/40 dark:text-[#E8DDD0]/30" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-[#D4AF37]/20 dark:border-[#D4AF37]/10 bg-white dark:bg-[#241C16] pl-10 pr-4 py-2.5 text-sm text-[#361E1E] dark:text-[#E8DDD0] placeholder:text-[#8B4513]/40 dark:placeholder:text-[#E8DDD0]/30 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] transition-colors"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="sacred"
                className="w-full"
                size="lg"
                isLoading={isSubmitting}
              >
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-[#8B4513]/40 dark:text-[#E8DDD0]/30 mt-6">
          Panthulu Garu Admin Panel &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
