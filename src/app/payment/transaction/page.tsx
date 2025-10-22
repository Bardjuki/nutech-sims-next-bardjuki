import TransactionHistoryPageComponent from '@/components/pages/TransactionHistoryPageComponent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Transaction History - ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: 'Riwayat transaksi Anda',
};

export default function TransactionPage() {
  return <TransactionHistoryPageComponent />;
}