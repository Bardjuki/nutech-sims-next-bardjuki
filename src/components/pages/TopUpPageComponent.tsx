'use client';
import { useState, useEffect, ChangeEvent } from 'react';
import { Wallet, CreditCard, X, Check, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/reduxHooks';
import { topUpBalance } from '@/lib/features/transaction/transactionSlice';
import ProfileBalanceCard from '../ui/cards/ProfileBalanceCard';
import { formatCurrency } from '@/lib/utils/numberUtils';
import { useRouter } from 'next/navigation';

const TopUpPageComponent = () => {
  const dispatch = useAppDispatch();
  const { isTopingUp, topUpResult, successMessage, error } = useAppSelector(
    (state) => state.transaction
  );
  const [amount, setAmount] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const router = useRouter();
  
  const MIN_AMOUNT = 10000;
  const MAX_AMOUNT = 1000000;
  const quickAmounts = [10000, 20000, 50000, 100000, 250000, 500000];

  useEffect(() => {
    if (successMessage) {
      setModalType('success');
      setShowModal(true);
      setAmount('');
      setValidationError('');
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

  const validateAmount = (value: string): string => {
    if (!value) {
      return 'Nominal tidak boleh kosong';
    }
    
    const numValue = parseInt(value);
    
    if (numValue < MIN_AMOUNT) {
      return `Nominal minimum adalah ${formatCurrency(MIN_AMOUNT)}`;
    }
    
    if (numValue > MAX_AMOUNT) {
      return `Nominal maksimum adalah ${formatCurrency(MAX_AMOUNT)}`;
    }
    
    return '';
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.replace(/\D/g, '');
    setAmount(value);
    
    if (value) {
      const error = validateAmount(value);
      setValidationError(error);
    } else {
      setValidationError('');
    }
  };

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
    setValidationError(''); // Clear any validation errors
  };

  const handleTopUpClick = () => {
    const error = validateAmount(amount);
    
    if (error) {
      setValidationError(error);
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
        setValidationError('');
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

  const isAmountValid = amount && !validationError;

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileBalanceCard />
        <div> <p className="text-sm text-gray-600 mb-2">Silahkan masukan</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Nominal Top Up</h2></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <CreditCard size={20} />
                  </div>
                  <input
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="masukan nominal Top Up"
                    className={`w-full pl-10 pr-4 py-3 border rounded focus:outline-none focus:ring-2 transition-colors ${
                      validationError
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-red-500'
                    }`}
                  />
                </div>
                
                {/* Validation Error Message */}
                {validationError && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                    <AlertCircle size={16} />
                    <span>{validationError}</span>
                  </div>
                )}
                
                {/* Helper Text */}
                {!validationError && !amount && (
                  <p className="mt-2 text-xs text-gray-500">
                    Minimum {formatCurrency(MIN_AMOUNT)} - Maksimum {formatCurrency(MAX_AMOUNT)}
                  </p>
                )}
              </div>

              <button
                onClick={handleTopUpClick}
                disabled={!isAmountValid || isTopingUp}
                className={`w-full py-3 rounded font-medium transition-colors ${
                  isAmountValid && !isTopingUp
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isTopingUp ? 'Processing...' : 'Top Up'}
              </button>
            </div>
            </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-4">Nominal Cepat</p>
            <div className="grid grid-cols-3 gap-3">
              {quickAmounts.map((value) => (
                <button
                  key={value}
                  onClick={() => handleQuickAmount(value)}
                  disabled={value > MAX_AMOUNT}
                  className={`py-3 px-4 border rounded transition-colors text-sm font-medium ${
                    value > MAX_AMOUNT
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 hover:border-red-500 hover:bg-red-50 cursor-pointer'
                  } ${amount === value.toString() ? 'border-red-500 bg-red-50' : ''}`}
                >
                  {formatCurrency(value)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={handleCloseModal}>
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