import AccountPageComponent from '@/components/pages/AccountPageComponent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Akun - SIMS PPOB',
  description: 'Kelola akun Anda',
};

export default function AccountPage() {
  return <AccountPageComponent />;
}