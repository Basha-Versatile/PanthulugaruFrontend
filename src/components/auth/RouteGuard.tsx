'use client';

import React, { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { usePGAuth } from '@/contexts/PGAuthContext';
import { Skeleton } from '@/components/ui/skeleton';

type RouteGuardProps = {
  role: 'customer' | 'pg';
  children: ReactNode;
  redirectTo?: string;
};

export function RouteGuard({ role, children, redirectTo }: RouteGuardProps) {
  const router = useRouter();
  const customerAuth = useAuth();
  const pgAuth = usePGAuth();

  const auth = role === 'customer' ? customerAuth : pgAuth;
  const isAuthenticated = auth.isAuthenticated;
  const isLoading = auth.isLoading;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      if (role === 'customer') {
        customerAuth.openLoginModal(redirectTo || typeof window !== 'undefined' ? window.location.pathname : '/');
      } else {
        router.push(redirectTo || '/pg/login');
      }
    }
  }, [isLoading, isAuthenticated, role, router, customerAuth, redirectTo]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
