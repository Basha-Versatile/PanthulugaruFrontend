'use client';

import React, { useState } from 'react';
import { X, Mail, Lock, Phone, User, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { usePGAuth } from '@/contexts/PGAuthContext';
import { sendPGOtp } from '@/lib/api/pgAuth';
import toast from 'react-hot-toast';

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  role?: 'customer' | 'pg';
  redirectPath?: string | null;
};

export function LoginModal({ isOpen, onClose, role = 'customer', redirectPath }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [authMethod, setAuthMethod] = useState<'email' | 'otp'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form
  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupLastName, setSignupLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  // OTP form
  const [otpPhone, setOtpPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const customerAuth = useAuth();
  const pgAuth = usePGAuth();

  if (!isOpen) return null;

  const resetForm = () => {
    setLoginEmail('');
    setLoginPassword('');
    setSignupFirstName('');
    setSignupLastName('');
    setSignupEmail('');
    setSignupPhone('');
    setSignupPassword('');
    setSignupConfirmPassword('');
    setOtpPhone('');
    setOtp('');
    setOtpSent(false);
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    setIsSubmitting(true);
    try {
      const success = role === 'customer'
        ? await customerAuth.login(loginEmail, loginPassword)
        : await pgAuth.login(loginEmail, loginPassword);
      if (success) {
        handleClose();
        if (redirectPath && typeof window !== 'undefined') {
          window.location.href = redirectPath;
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupFirstName || !signupLastName || !signupEmail || !signupPhone || !signupPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (signupPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setIsSubmitting(true);
    try {
      const success = role === 'customer'
        ? await customerAuth.signup({
            firstName: signupFirstName,
            lastName: signupLastName,
            email: signupEmail,
            phone: signupPhone,
            password: signupPassword,
          })
        : await pgAuth.signup({
            firstName: signupFirstName,
            lastName: signupLastName,
            email: signupEmail,
            phone: signupPhone,
            password: signupPassword,
          });
      if (success) {
        handleClose();
        if (redirectPath && typeof window !== 'undefined') {
          window.location.href = redirectPath;
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendOtp = async () => {
    if (!otpPhone || otpPhone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await sendPGOtp(otpPhone);
      if (response.success) {
        setOtpSent(true);
        toast.success('OTP sent successfully');
      } else {
        toast.error(response.message || 'Failed to send OTP');
      }
    } catch {
      toast.error('Failed to send OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      toast.error('Please enter a valid OTP');
      return;
    }
    setIsSubmitting(true);
    try {
      const success = await pgAuth.otpLogin(otpPhone, otp);
      if (success) {
        handleClose();
        if (redirectPath && typeof window !== 'undefined') {
          window.location.href = redirectPath;
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = () => {
    toast('Google authentication coming soon!', { icon: 'info' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-[#361E1E]/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white dark:bg-[#1A1210] rounded-2xl shadow-2xl shadow-[#361E1E]/20 dark:shadow-black/40 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto border border-[#D4AF37]/15 dark:border-[#D4AF37]/10">
        {/* Sacred top accent */}
        <div className="h-1 w-full bg-gradient-to-r from-[#D4AF37] via-[#FF6B00] to-[#D4AF37] rounded-t-2xl" />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-4 text-[#8B4513]/50 hover:text-[#361E1E] dark:text-[#E8DDD0]/50 dark:hover:text-[#E8DDD0] transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <img src="/logo-full.png" alt="Panthulu Garu" className="h-12 w-12 rounded-full object-cover mb-3 mx-auto" />
            <h2 className="text-xl font-heading font-bold text-[#361E1E] dark:text-[#E8DDD0]">
              {role === 'customer' ? 'Welcome to Panthulu Garu' : 'PG Portal'}
            </h2>
            <p className="text-sm text-[#8B4513]/70 dark:text-[#E8DDD0]/60 mt-1">
              {activeTab === 'login' ? 'Sign in to your account' : 'Create a new account'}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-[#FDF8F0] dark:bg-[#241C16] rounded-xl p-1 mb-6 border border-[#D4AF37]/10 dark:border-[#D4AF37]/5">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === 'login'
                  ? 'bg-white dark:bg-[#1A1210] text-[#FF6B00] shadow-sm shadow-[#D4AF37]/10 border border-[#D4AF37]/10 dark:border-[#D4AF37]/10'
                  : 'text-[#8B4513]/60 dark:text-[#E8DDD0]/50 hover:text-[#8B4513] dark:hover:text-[#E8DDD0]/80'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === 'signup'
                  ? 'bg-white dark:bg-[#1A1210] text-[#FF6B00] shadow-sm shadow-[#D4AF37]/10 border border-[#D4AF37]/10 dark:border-[#D4AF37]/10'
                  : 'text-[#8B4513]/60 dark:text-[#E8DDD0]/50 hover:text-[#8B4513] dark:hover:text-[#E8DDD0]/80'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Login form */}
          {activeTab === 'login' && (
            <div>
              {/* Auth method switcher for PG */}
              {role === 'pg' && (
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setAuthMethod('email')}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all duration-200 ${
                      authMethod === 'email'
                        ? 'border-[#FF6B00] text-[#FF6B00] bg-[#FF6B00]/5 dark:bg-[#FF6B00]/10'
                        : 'border-[#D4AF37]/20 dark:border-[#D4AF37]/10 text-[#8B4513]/60 dark:text-[#E8DDD0]/50 hover:border-[#D4AF37]/40'
                    }`}
                  >
                    <Mail className="h-3.5 w-3.5 inline mr-1" />
                    Email
                  </button>
                  <button
                    onClick={() => setAuthMethod('otp')}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all duration-200 ${
                      authMethod === 'otp'
                        ? 'border-[#FF6B00] text-[#FF6B00] bg-[#FF6B00]/5 dark:bg-[#FF6B00]/10'
                        : 'border-[#D4AF37]/20 dark:border-[#D4AF37]/10 text-[#8B4513]/60 dark:text-[#E8DDD0]/50 hover:border-[#D4AF37]/40'
                    }`}
                  >
                    <Phone className="h-3.5 w-3.5 inline mr-1" />
                    Phone OTP
                  </button>
                </div>
              )}

              {authMethod === 'email' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <Input
                    label="Email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                  <div className="relative">
                    <Input
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-[38px] text-[#8B4513]/40 hover:text-[#361E1E] dark:text-[#E8DDD0]/40 dark:hover:text-[#E8DDD0] transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <Button type="submit" variant="sacred" className="w-full" isLoading={isSubmitting}>
                    Sign In
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        label="Phone Number"
                        type="tel"
                        value={otpPhone}
                        onChange={(e) => setOtpPhone(e.target.value)}
                        placeholder="Enter phone number"
                        disabled={otpSent}
                        required
                      />
                    </div>
                    <div className="pt-[26px]">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSendOtp}
                        disabled={otpSent}
                        isLoading={isSubmitting && !otpSent}
                      >
                        {otpSent ? 'Sent' : 'Send OTP'}
                      </Button>
                    </div>
                  </div>
                  {otpSent && (
                    <Input
                      label="Enter OTP"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      required
                    />
                  )}
                  {otpSent && (
                    <Button type="submit" variant="sacred" className="w-full" isLoading={isSubmitting}>
                      Verify OTP
                    </Button>
                  )}
                </form>
              )}

              {/* Google auth for customers */}
              {role === 'customer' && (
                <>
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#D4AF37]/15 dark:border-[#D4AF37]/10" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white dark:bg-[#1A1210] px-3 text-sm text-[#8B4513]/50 dark:text-[#E8DDD0]/40">or</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleAuth}
                  >
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Signup form */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="First Name"
                  value={signupFirstName}
                  onChange={(e) => setSignupFirstName(e.target.value)}
                  placeholder="First name"
                  required
                />
                <Input
                  label="Last Name"
                  value={signupLastName}
                  onChange={(e) => setSignupLastName(e.target.value)}
                  placeholder="Last name"
                  required
                />
              </div>
              <Input
                label="Email"
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              <Input
                label="Phone"
                type="tel"
                value={signupPhone}
                onChange={(e) => setSignupPhone(e.target.value)}
                placeholder="Enter your phone number"
                required
              />
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-[#8B4513]/40 hover:text-[#361E1E] dark:text-[#E8DDD0]/40 dark:hover:text-[#E8DDD0] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Input
                label="Confirm Password"
                type="password"
                value={signupConfirmPassword}
                onChange={(e) => setSignupConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
              <Button type="submit" variant="sacred" className="w-full" isLoading={isSubmitting}>
                Create Account
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
