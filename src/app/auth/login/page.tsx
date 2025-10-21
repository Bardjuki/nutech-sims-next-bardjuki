// Remove the curly braces - it's a default export!
import LoginPageComponent from '@/components/pages/LoginPageComponent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Masuk - SIMS PPOB',
  description: 'Masuk atau buat akun untuk memulai',
};

export default function LoginPage() {
  return <LoginPageComponent />;
}
