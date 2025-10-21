'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/hooks/reduxHooks';
import { fetchBalance } from '@/lib/features/transaction/transactionSlice';
import { fetchServices } from '@/lib/features/module/moduleSlice';

export default function MainLayout({children}: {
  children: React.ReactNode;
}) {
    const dispatch = useAppDispatch();
  const pathname = usePathname();

  const isFullscreen = ['/auth/login', '/auth/register']?.includes(pathname)
    useEffect(() => {
        dispatch(fetchBalance());
        dispatch(fetchServices());
      }, [dispatch]);
  return (
    <div className="flex flex-col min-h-screen">
      {isFullscreen ? null : <Navbar />}
      <main className="flex-grow">
        <div className="container mx-auto p-4">{children}</div>
      </main>
    </div>
  )
}