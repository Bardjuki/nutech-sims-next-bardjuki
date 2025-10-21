'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/reduxHooks';
import { useRouter } from 'next/navigation';
import {
  fetchBalance,
  createTransaction,
  clearMessages,
  clearCurrentTransaction,
} from '@/lib/features/transaction/transactionSlice';
import { fetchServices } from '@/lib/features/module/moduleSlice';
import { Service } from '@/lib/types/apiTypes';
import ProfileBalanceCard from '../ui/cards/ProfileBalanceCard';

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
    dispatch(fetchBalance());
    dispatch(fetchServices());

    return () => {
      dispatch(clearMessages());
      dispatch(clearCurrentTransaction());
    };
  }, [dispatch]);

  useEffect(() => {
    // Find service by service_code from Redux store
    if (services.length > 0) {
      const foundService = services.find(
        (service) => service.service_code.toLowerCase() === serviceCode.toLowerCase()
      );
      
      if (foundService) {
        setServiceDetail(foundService);
      } else {
        // Service not found, redirect to home
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

  const handlePaymentClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmPayment = () => {
    if (serviceDetail) {
      dispatch(
        createTransaction({
          service_code: serviceDetail.service_code,
        })
      );
    }
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);
  };

  const handleBackToHome = () => {
    setShowResultModal(false);
    dispatch(clearMessages());
    dispatch(clearCurrentTransaction());
    router.push('/');
  };

  if (isLoadingServices || !serviceDetail) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
    

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProfileBalanceCard/>

        {/* Payment Section */}
        <div className="mt-12 max-w-2xl">
          <h2 className="text-xl font-normal mb-6">PemBayaran</h2>

          {/* Service Info */}
          <div className="flex items-center space-x-3 mb-8">
            {serviceDetail.service_icon && (
              <img
                src={serviceDetail.service_icon}
                alt={serviceDetail.service_name}
                className="w-10 h-10 object-contain"
              />
            )}
            <span className="text-lg font-medium">{serviceDetail.service_name}</span>
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                💳
              </span>
              <input
                type="text"
                value={serviceDetail.service_tariff.toLocaleString('id-ID')}
                disabled
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
              />
            </div>
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePaymentClick}
            disabled={isCreatingTransaction}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreatingTransaction ? 'Memproses...' : 'Bayar'}
          </button>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              {serviceDetail.service_icon ? (
                <img
                  src={serviceDetail.service_icon}
                  alt={serviceDetail.service_name}
                  className="w-8 h-8 object-contain"
                />
              ) : (
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              )}
            </div>
            <p className="text-gray-600 mb-2">Beli {serviceDetail.service_name.toLowerCase()} senilai</p>
            <p className="text-2xl font-bold mb-6">
              Rp{serviceDetail.service_tariff.toLocaleString('id-ID')} ?
            </p>
            <button
              onClick={handleConfirmPayment}
              disabled={isCreatingTransaction}
              className="text-red-500 font-semibold mb-3 hover:text-red-600 disabled:opacity-50 block w-full"
            >
              {isCreatingTransaction ? 'Memproses...' : 'Ya, lanjutkan Bayar'}
            </button>
            <button
              onClick={handleCloseModal}
              disabled={isCreatingTransaction}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              Batalkan
            </button>
          </div>
        </div>
      )}

      {/* Result Modal */}
      {showResultModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full text-center">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
                paymentSuccess ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {paymentSuccess ? (
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </div>
            <p className="text-gray-600 mb-2">Pembayaran {serviceDetail.service_name.toLowerCase()} sebesar</p>
            <p className="text-2xl font-bold mb-2">
              Rp{serviceDetail.service_tariff.toLocaleString('id-ID')}
            </p>
            <p className="text-gray-600 mb-6">
              {paymentSuccess ? 'berhasil!' : 'gagal'}
            </p>
            <button
              onClick={handleBackToHome}
              className="text-red-500 font-semibold hover:text-red-600"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      )}
    </div>
  );
}