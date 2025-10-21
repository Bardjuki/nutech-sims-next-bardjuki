
import HomePageComponent from '@/components/pages/HomePageComponent';
import ProtectedRoute from '@/components/pages/ProtectedRoute';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home - SIMS PPOB',
  description: 'Dashboard SIMS PPOB',
};

export default function HomePage() {
  return (
    <ProtectedRoute>
      <HomePageComponent />
    </ProtectedRoute>
  );
}