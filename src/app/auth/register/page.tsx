import RegisterPageComponent from '@/components/pages/RegisterPageComponent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Registrasi - ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: 'Lengkapi data untuk membuat akun',
};

export default function RegisterPage() {
  return <RegisterPageComponent />;
}