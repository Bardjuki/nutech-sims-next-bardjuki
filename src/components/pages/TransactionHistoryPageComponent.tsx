'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Transaction } from '@/lib/types/apiTypes';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/reduxHooks';
import { fetchTransactionHistory, resetTransactions } from '@/lib/features/transaction/transactionSlice';
import { formatCurrency } from '@/lib/utils/numberUtils';
import { formatDate } from '@/lib/utils/dateUtils';
import ProfileBalanceCard from '../ui/cards/ProfileBalanceCard';

export default function TransactionHistoryPageComponent() {
  const dispatch = useAppDispatch();
  const {
    transactions,
    offset,
    limit,
    hasMore,
    isLoadingTransactions,
  } = useAppSelector((state) => state.transaction);

  // Reset and fetch on mount
  useEffect(() => {
    dispatch(resetTransactions());
    dispatch(fetchTransactionHistory({ offset: 0, limit: 5 }));
  }, [dispatch]);

  const handleLoadMore = () => {
    if (!isLoadingTransactions && hasMore) {
      dispatch(fetchTransactionHistory({ offset: offset + limit, limit }));
    }
  };

  const getTransactionIcon = (type: string) => (type === 'TOPUP' ? '+' : '−');
  const getTransactionColor = (type: string) =>
    type === 'TOPUP' ? 'text-green-500' : 'text-red-500';

  // Framer Motion Variants

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.05, duration: 0.4 },
    }),
    exit: { opacity: 0, y: -10 },
  };

  return (
    <motion.div
      className="min-h-screen bg-white"
      variants={{
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }}
      initial="hidden"
      animate="visible"
    >
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ProfileBalanceCard />
        </motion.div>

        {/* Transaction Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <h2 className="text-xl font-bold mb-6">Semua Transaksi</h2>

          {/* Transaction List */}
          <AnimatePresence mode="wait">
            <div className="space-y-4">
              {/* Loading State */}
              {isLoadingTransactions && transactions.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-gray-500">Memuat transaksi...</p>
                </motion.div>
              )}

              {/* Empty State */}
              {!isLoadingTransactions && transactions.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-gray-400">
                    Maaf tidak ada histori transaksi saat ini
                  </p>
                </motion.div>
              )}

              {/* Transaction List */}
              {transactions.map((transaction: Transaction, index: number) => (
                <motion.div
                  key={transaction.invoice_number}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`text-2xl font-bold mb-1 ${getTransactionColor(
                          transaction.transaction_type
                        )}`}
                      >
                        {getTransactionIcon(transaction.transaction_type)}{' '}
                        {formatCurrency(transaction.total_amount)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(transaction.created_on)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">
                        {transaction.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Load More Button */}
              {hasMore && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center pt-4"
                >
                  <motion.button
                    onClick={handleLoadMore}
                    disabled={isLoadingTransactions}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-red-500 cursor-pointer font-semibold hover:text-red-600 disabled:opacity-50 transition-all"
                  >
                    {isLoadingTransactions ? 'Loading...' : 'Show more'}
                  </motion.button>
                </motion.div>
              )}
            </div>
          </AnimatePresence>
        </motion.div>
      </main>
    </motion.div>
  );
}
