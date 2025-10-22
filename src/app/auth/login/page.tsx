// Remove the curly braces - it's a default export!
import LoginPageComponent from '@/components/pages/LoginPageComponent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Masuk - ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: 'Masuk atau buat akun untuk memulai',
};

export default function LoginPage() {
  return <LoginPageComponent />;
}
