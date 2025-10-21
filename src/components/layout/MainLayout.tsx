'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/reduxHooks';
import { fetchBalance } from '@/lib/features/transaction/transactionSlice';
import { fetchBanners, fetchServices } from '@/lib/features/module/moduleSlice';
import { checkAuth } from '@/lib/features/auth/authSlice';

const PUBLIC_ROUTES = ['/auth/login', '/auth/register'];
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  useEffect(() => {
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
    if (!isPublicRoute && !isAuthenticated) {
      dispatch(checkAuth());
    }
  }, [dispatch, pathname, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && token) {
      dispatch(fetchServices());
      dispatch(fetchBanners());
      dispatch(fetchBalance());
    }
  }, [dispatch, isAuthenticated, token]);
  return (
    <div className="flex flex-col min-h-screen">
      {isPublicRoute ? null : <Navbar />}
      <main className="flex-grow">
        <div className="container mx-auto p-4">{children}</div>
      </main>
    </div>
  );
}
