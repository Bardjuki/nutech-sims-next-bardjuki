'use client';
import { useState, useEffect, ChangeEvent } from 'react';
import { Wallet, CreditCard, X, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/reduxHooks';
import { topUpBalance } from '@/lib/features/transaction/transactionSlice';
import ProfileBalanceCard from '../ui/cards/ProfileBalanceCard';
import { formatCurrency } from '@/lib/utils/numberUtils';
import { useRouter } from 'next/navigation';

const TopUpPageComponent = () => {
  const dispatch = useAppDispatch();
  const {  isTopingUp, topUpResult, successMessage, error } = useAppSelector(
    (state) => state.transaction
  );
  const [amount, setAmount] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const router = useRouter();
  const quickAmounts = [10000, 20000, 50000, 100000, 250000, 500000];

 
  useEffect(() => {
    if (successMessage) {
      setModalType('success');
      setShowModal(true);
      setAmount('');
      setTimeout(() => {
      }, 3000);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      setModalType('error');
      setShowModal(true);
      setTimeout(() => {
      }, 3000);
    }
  }, [error]);

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.replace(/\D/g, '');
    setAmount(value);
  };

  const handleQuickAmount = (value : number) => {
    setAmount(value.toString());
  };

  const handleTopUpClick = () => {
    if (!amount || parseInt(amount) < 10000) {
      return;
    }
    setModalType('confirm');
    setShowModal(true);
  };

  const handleConfirmTopUp = async () => {
    setShowModal(false);
    const topUpData = {
      top_up_amount: parseInt(amount)
    };
    
    try {
      await dispatch(topUpBalance(topUpData)).unwrap();
      setTimeout(() => {
        setModalType('success');
        setShowModal(true);
        setAmount('');
      }, 1000);
    } catch (err) {
      console.error('Top up failed:', err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (modalType === 'success') {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-white">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileBalanceCard/>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="">
              <p className="text-sm text-gray-600 mb-2">Silahkan masukan</p>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Nominal Top Up</h2>

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <CreditCard size={20} />
                  </div>
                  <input
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="masukan nominal Top Up"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <button
                  onClick={handleTopUpClick}
                  disabled={!amount || parseInt(amount) < 10000 || isTopingUp}
                  className={`w-full py-3 rounded font-medium transition-colors ${
                    amount && parseInt(amount) >= 10000 && !isTopingUp
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isTopingUp ? 'Processing...' : 'Top Up'}
                </button>
              </div>
            </div>
             <div className="grid grid-cols-3 gap-3">
              {quickAmounts.map((value) => (
                <button
                  key={value}
                  onClick={() => handleQuickAmount(value)}
                  className="py-3 px-4 border border-gray-300 rounded hover:border-red-500 hover:bg-red-50 transition-colors text-sm font-medium"
                >
                  {formatCurrency(value)}
                </button>
              ))}
          </div>

        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black-100 bg-opacity-5 flex items-center justify-center p-4 z-50" onClick={handleCloseModal}>
          <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
            {modalType === 'confirm' && (
              <>
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wallet size={32} className="text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Anda yakin untuk Top Up sebesar
                </p>
                <p className="text-2xl font-bold mb-6">{formatCurrency(parseInt(amount))} ?</p>
                <button
                  onClick={handleConfirmTopUp}
                  className="w-full py-2 bg-red-600 text-white rounded mb-2 hover:bg-red-700 font-medium"
                >
                  Ya, lanjutkan Top Up
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-2 text-gray-500 hover:text-gray-700 font-medium"
                >
                  Batalkan
                </button>
              </>
            )}

            {modalType === 'success' && (
              <>
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-2">Top Up sebesar</p>
                <p className="text-2xl font-bold mb-2">{formatCurrency(Number(topUpResult?.balance ?? amount ?? 0))}</p>
                <p className="text-sm text-gray-600 mb-6">berhasil!</p>
                <button
                  onClick={handleCloseModal}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Kembali ke Beranda
                </button>
              </>
            )}

            {modalType === 'error' && (
              <>
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X size={32} className="text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-2">Top Up sebesar</p>
                <p className="text-2xl font-bold mb-2">{formatCurrency(parseInt(amount))}</p>
                <p className="text-sm text-gray-600 mb-6">gagal</p>
                <button
                  onClick={handleCloseModal}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Kembali ke Beranda
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopUpPageComponent;