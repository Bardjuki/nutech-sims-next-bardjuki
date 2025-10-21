import TopUpPageComponent from '@/components/pages/TopUpPageComponent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Top Up - SIMS PPOB',
  description: 'Top up saldo Anda',
};

export default function TopUpPage() {
  return <TopUpPageComponent />;
}