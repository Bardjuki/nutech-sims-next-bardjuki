'use client';
import { useState, useEffect, ChangeEvent } from 'react';
import { Wallet, CreditCard, X, Check, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/reduxHooks';
import { topUpBalance } from '@/lib/features/transaction/transactionSlice';
import ProfileBalanceCard from '../ui/cards/ProfileBalanceCard';
import { formatCurrency } from '@/lib/utils/numberUtils';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

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
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      setModalType('error');
      setShowModal(true);
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
    setValidationError('');
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

  // Modal animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
        delay: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileBalanceCard />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm text-gray-600 mb-2">Silahkan masukan</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Nominal Top Up</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
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
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      validationError
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-red-500'
                    }`}
                  />
                </div>
                
                <AnimatePresence mode="wait">
                  {validationError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-2 mt-2 text-red-600 text-sm"
                    >
                      <AlertCircle size={16} />
                      <span>{validationError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {!validationError && !amount && (
                  <p className="mt-2 text-xs text-gray-500">
                    Minimum {formatCurrency(MIN_AMOUNT)} - Maksimum {formatCurrency(MAX_AMOUNT)}
                  </p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: isAmountValid && !isTopingUp ? 1.02 : 1 }}
                whileTap={{ scale: isAmountValid && !isTopingUp ? 0.98 : 1 }}
                onClick={handleTopUpClick}
                disabled={!isAmountValid || isTopingUp}
                className={`w-full py-3 rounded-lg font-medium transition-all ${
                  isAmountValid && !isTopingUp
                    ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isTopingUp ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Processing...
                  </span>
                ) : (
                  'Top Up'
                )}
              </motion.button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-sm text-gray-600 mb-4">Nominal Cepat</p>
            <div className="grid grid-cols-3 gap-3">
              {quickAmounts.map((value, index) => (
                <motion.button
                  key={value}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                  whileHover={{ scale: value <= MAX_AMOUNT ? 1.05 : 1 }}
                  whileTap={{ scale: value <= MAX_AMOUNT ? 0.95 : 1 }}
                  onClick={() => handleQuickAmount(value)}
                  disabled={value > MAX_AMOUNT}
                  className={`py-3 px-4 border rounded-lg transition-all text-sm font-medium ${
                    value > MAX_AMOUNT
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 hover:border-red-500 hover:bg-red-50 cursor-pointer'
                  } ${amount === value.toString() ? 'border-red-500 bg-red-50 ring-2 ring-red-200' : ''}`}
                >
                  {formatCurrency(value)}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Enhanced Modal with Framer Motion */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
            onClick={handleCloseModal}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {modalType === 'confirm' && (
                <>
                  <motion.div
                    variants={iconVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                  >
                    <Wallet size={32} className="text-white sm:w-10 sm:h-10" />
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-sm text-gray-600 mb-2"
                  >
                    Anda yakin untuk Top Up sebesar
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900"
                  >
                    {formatCurrency(parseInt(amount))} ?
                  </motion.p>
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleConfirmTopUp}
                    className="w-full py-3 bg-red-600 text-white rounded-lg mb-3 hover:bg-red-700 font-medium shadow-lg transition-all"
                  >
                    Ya, lanjutkan Top Up
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowModal(false)}
                    className="w-full py-3 text-gray-500 hover:text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-all"
                  >
                    Batalkan
                  </motion.button>
                </>
              )}

              {modalType === 'success' && (
                <>
                  <motion.div
                    variants={iconVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                  >
                    <Check size={32} className="text-white sm:w-10 sm:h-10" />
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-sm text-gray-600 mb-2"
                  >
                    Top Up sebesar
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900"
                  >
                    {formatCurrency(Number(topUpResult?.balance ?? amount ?? 0))}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm text-gray-600 mb-6"
                  >
                    berhasil!
                  </motion.p>
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCloseModal}
                    className="text-red-600 hover:text-red-700 font-medium py-2 px-6 rounded-lg hover:bg-red-50 transition-all"
                  >
                    Kembali ke Beranda
                  </motion.button>
                </>
              )}

              {modalType === 'error' && (
                <>
                  <motion.div
                    variants={iconVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                  >
                    <X size={32} className="text-white sm:w-10 sm:h-10" />
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-sm text-gray-600 mb-2"
                  >
                    Top Up sebesar
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900"
                  >
                    {formatCurrency(parseInt(amount))}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm text-gray-600 mb-6"
                  >
                    gagal
                  </motion.p>
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCloseModal}
                    className="text-red-600 hover:text-red-700 font-medium py-2 px-6 rounded-lg hover:bg-red-50 transition-all"
                  >
                    Kembali ke Beranda
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TopUpPageComponent;