import PaymentPageComponent from '@/components/pages/PaymentPageComponent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pembayaran - SIMS PPOB',
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