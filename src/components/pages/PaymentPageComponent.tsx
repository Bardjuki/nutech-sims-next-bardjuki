'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/reduxHooks';
import { useRouter } from 'next/navigation';
import {
  createTransaction,
  clearMessages,
  clearCurrentTransaction,
  resetTransactionTopUp,
} from '@/lib/features/transaction/transactionSlice';
import { Service } from '@/lib/types/apiTypes';
import ProfileBalanceCard from '../ui/cards/ProfileBalanceCard';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, CheckCircle, XCircle } from 'lucide-react';

interface PaymentPageComponentProps {
  serviceCode: string;
}

export default function PaymentPageComponent({ serviceCode }: PaymentPageComponentProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [serviceDetail, setServiceDetail] = useState<Service | null>(null);

  const {
    currentTransaction,
    isCreatingTransaction,
    error,
    successMessage,
  } = useAppSelector((state) => state.transaction);

  const { services, isLoadingServices } = useAppSelector((state) => state.module);

  useEffect(() => {
    if (services.length > 0) {
      const foundService = services.find(
        (service) => service.service_code.toLowerCase() === serviceCode.toLowerCase()
      );

      if (foundService) {
        setServiceDetail(foundService);
      } else {
        router.push('/');
      }
    }
  }, [services, serviceCode, router]);

  useEffect(() => {
    if (successMessage && currentTransaction) {
      setPaymentSuccess(true);
      setShowConfirmModal(false);
      setShowResultModal(true);
    } else if (error) {
      setPaymentSuccess(false);
      setShowConfirmModal(false);
      setShowResultModal(true);
    }
  }, [successMessage, error, currentTransaction]);

  const handlePaymentClick = () => setShowConfirmModal(true);
  const handleConfirmPayment = () => {
    if (serviceDetail) {
      dispatch(createTransaction({ service_code: serviceDetail.service_code }));
    }
  };
  const handleCloseModal = () => {
    setShowConfirmModal(false);
    setShowResultModal(false);
    dispatch(resetTransactionTopUp());
  };
  const handleBackToHome = () => {
    setShowResultModal(false);
    dispatch(clearMessages());
    dispatch(clearCurrentTransaction());
    router.push('/');
  };

  useEffect(() => {
    return () => {
      dispatch(resetTransactionTopUp());
    };
  }, [dispatch]);

  if (isLoadingServices || !serviceDetail) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileBalanceCard />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-12 max-w-2xl"
        >
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Pembayaran</h2>

          <div className="flex items-center space-x-3 mb-8">
            {serviceDetail.service_icon && (
              <img
                src={serviceDetail.service_icon}
                alt={serviceDetail.service_name}
                className="w-10 h-10 object-contain"
              />
            )}
            <span className="text-lg font-medium text-gray-800">
              {serviceDetail.service_name}
            </span>
          </div>

          <div className="mb-6 relative">
            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={serviceDetail.service_tariff.toLocaleString('id-ID')}
              disabled
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
            />
          </div>

          <motion.button
            onClick={handlePaymentClick}
            disabled={isCreatingTransaction}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            className="w-full bg-red-600 cursor-pointer hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {isCreatingTransaction ? 'Memproses...' : 'Bayar'}
          </motion.button>
        </motion.div>
      </main>

      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="bg-white rounded-xl p-8 max-w-sm w-full text-center shadow-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              // ✅ Stop click bubbling so clicking inside doesn’t close modal
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-8 h-8 text-white" />
              </div>

              <p className="text-gray-600 mb-2">
                Beli <span className="font-semibold">{serviceDetail.service_name}</span> senilai
              </p>
              <p className="text-2xl font-bold mb-6">
                Rp{serviceDetail.service_tariff.toLocaleString('id-ID')} ?
              </p>

              <motion.button
                onClick={handleConfirmPayment}
                disabled={isCreatingTransaction}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                className="text-red-600 cursor-pointer font-semibold mb-3 block w-full"
              >
                {isCreatingTransaction ? 'Memproses...' : 'Ya, lanjutkan Bayar'}
              </motion.button>
              <button
                onClick={handleCloseModal}
                disabled={isCreatingTransaction}
                className="text-gray-400 cursor-pointer hover:text-gray-600 transition disabled:opacity-50"
              >
                Batalkan
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showResultModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="bg-white rounded-xl p-8 max-w-sm w-full text-center shadow-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              // ✅ Prevent close when clicking inside
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
                  paymentSuccess ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                {paymentSuccess ? (
                  <CheckCircle className="w-8 h-8 text-white" />
                ) : (
                  <XCircle className="w-8 h-8 text-white" />
                )}
              </div>

              <p className="text-gray-600 mb-2">
                Pembayaran <span className="font-semibold">{serviceDetail.service_name}</span> sebesar
              </p>
              <p className="text-2xl font-bold mb-2">
                Rp{serviceDetail.service_tariff.toLocaleString('id-ID')}
              </p>
              <p className="text-gray-600 mb-6">
                {paymentSuccess ? 'berhasil!' : `${error || 'gagal'}`}
              </p>

              <motion.button
                onClick={handleBackToHome}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                className="text-red-600 cursor-pointer font-semibold hover:text-red-700 transition"
              >
                Kembali ke Beranda
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
