import AccountPageComponent from '@/components/pages/AccountPageComponent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Akun - ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: 'Kelola akun Anda',
};

export default function AccountPage() {
  return <AccountPageComponent />;
}