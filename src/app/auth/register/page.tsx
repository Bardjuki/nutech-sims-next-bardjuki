import RegisterPageComponent from '@/components/pages/RegisterPageComponent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Registrasi - SIMS PPOB',
  description: 'Lengkapi data untuk membuat akun',
};

export default function RegisterPage() {
  return <RegisterPageComponent />;
}