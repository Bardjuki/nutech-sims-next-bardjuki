import TopUpPageComponent from '@/components/pages/TopUpPageComponent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Top Up - ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: 'Top up saldo Anda',
};

export default function TopUpPage() {
  return <TopUpPageComponent />;
}