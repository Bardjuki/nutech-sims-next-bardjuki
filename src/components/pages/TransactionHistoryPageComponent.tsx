'use client';

import { useEffect, useState } from 'react';
import { Transaction } from '@/lib/types/apiTypes';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/reduxHooks';
import { fetchBalance, fetchTransactionHistory, resetTransactions } from '@/lib/features/transaction/transactionSlice';
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

  useEffect(() => {
    dispatch(fetchBalance());
    dispatch(resetTransactions());
    dispatch(fetchTransactionHistory({ offset: 0, limit: 5 }));
  }, [dispatch]);

  const handleLoadMore = () => {
    if (!isLoadingTransactions && hasMore) {
      dispatch(
        fetchTransactionHistory({
          offset: offset + limit,
          limit,
        })
      );
    }
  };

  const getTransactionIcon = (transactionType: string) => {
    if (transactionType === 'TOPUP') {
      return '+';
    }
    return '−';
  };

  const getTransactionColor = (transactionType: string) => {
    if (transactionType === 'TOPUP') {
      return 'text-green-500';
    }
    return 'text-red-500';
  };


  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileBalanceCard/>

        {/* Transaction Section */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">Semua Transaksi</h2>
          {/* Transaction List */}
          <div className="space-y-4">
            {isLoadingTransactions && transactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Memuat transaksi...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">
                  Maaf tidak ada histori transaksi saat ini
                </p>
              </div>
            ) : (
              <>
                {transactions.map((transaction: Transaction) => (
                  <div
                    key={transaction.invoice_number}
                    className="border border-gray-200 rounded-lg p-4"
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
                  </div>
                ))}

                {/* Show More Button */}
                {hasMore && (
                  <div className="text-center pt-4">
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoadingTransactions}
                      className="text-red-500 font-semibold hover:text-red-600 disabled:opacity-50"
                    >
                      {isLoadingTransactions ? 'Memuat...' : 'Show more'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}