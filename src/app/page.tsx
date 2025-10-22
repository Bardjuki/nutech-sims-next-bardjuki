
import HomePageComponent from '@/components/pages/HomePageComponent';
import ProtectedRoute from '@/components/pages/ProtectedRoute';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title:`Home - ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: `Dashboard - ${process.env.NEXT_PUBLIC_APP_NAME}`,
};

export default function HomePage() {
  return (
    <ProtectedRoute>
      <HomePageComponent />
    </ProtectedRoute>
  );
}