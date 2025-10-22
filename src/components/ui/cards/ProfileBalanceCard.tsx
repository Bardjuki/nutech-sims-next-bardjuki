'use client';

import { RootState } from '@/lib/config/reduxStore';
import { formatCurrency } from '@/lib/utils/numberUtils';
import { Eye, EyeClosed } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileBalanceCard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { balance, isLoadingBalance } = useSelector(
    (state: RootState) => state.transaction
  );

  const fullName = user ? `${user.first_name} ${user.last_name}` : 'Pengguna';

  const getProfileImage = () => {
    if (
      !user?.profile_image ||
      user.profile_image === 'null' ||
      user.profile_image.includes('/null')
    ) {
      return '/assets/profile_photo.png';
    }
    return user.profile_image;
  };

  const profileImage = getProfileImage();

  const [showBalance, setShowBalance] = useState(false);
  const userBalance = balance?.balance || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12 px-4 sm:px-0">
      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col justify-center"
      >
        <div className="flex items-center sm:items-start gap-4 mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300 flex-shrink-0"
          >
            <Image
              src={profileImage}
              alt="Profile"
              width={64}
              height={64}
              className="object-cover w-full h-full"
              onError={(e) => {
                e.currentTarget.src = '/assets/profile_photo.png';
              }}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex-1"
          >
            <p className="text-gray-600 text-xs sm:text-sm">Selamat datang,</p>
            <h2 className="text-xl sm:text-2xl font-bold text-black break-words">
              {fullName}
            </h2>
          </motion.div>
        </div>
      </motion.div>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-5 sm:p-6 text-white overflow-hidden"
      >
        {/* Background decoration */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-0 right-0 w-40 h-40 sm:w-64 sm:h-64 opacity-10"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="80" fill="white" />
          </svg>
        </motion.div>

        <div className="relative z-10">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-xs sm:text-sm mb-2"
          >
            Saldo anda
          </motion.p>

          <AnimatePresence mode="wait">
            {isLoadingBalance ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-8 sm:h-9 flex items-center mb-3 sm:mb-4"
              >
                <div className="animate-pulse bg-white bg-opacity-30 h-7 sm:h-8 w-36 sm:w-48 rounded"></div>
              </motion.div>
            ) : (
              <motion.h3
                key={showBalance ? 'visible' : 'hidden'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4"
              >
                {showBalance
                  ? `${formatCurrency(userBalance)}`
                  : 'Rp ● ● ● ● ● ● ●'}
              </motion.h3>
            )}
          </AnimatePresence>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowBalance(!showBalance)}
            className="text-xs sm:text-sm flex cursor-pointer items-center gap-1 sm:gap-2 hover:underline transition-all"
            disabled={isLoadingBalance}
          >
            {showBalance ? 'Sembunyikan Saldo' : 'Lihat Saldo'}
            <motion.span
              key={showBalance ? 'closed' : 'open'}
              initial={{ rotate: 0, scale: 0.8 }}
              animate={{ rotate: 360, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {showBalance ? (
                <EyeClosed size={16} className="sm:w-5 sm:h-5" />
              ) : (
                <Eye size={16} className="sm:w-5 sm:h-5" />
              )}
            </motion.span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileBalanceCard;