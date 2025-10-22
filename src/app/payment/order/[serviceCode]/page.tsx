import PaymentPageComponent from '@/components/pages/PaymentPageComponent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Pembayaran - ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: 'Pembayaran layanan',
};

interface PaymentPageProps {
  params: {
    serviceCode: string;
  };
}

export default function PaymentPage({ params }: PaymentPageProps) {
  return <PaymentPageComponent serviceCode={params.serviceCode} />;
}