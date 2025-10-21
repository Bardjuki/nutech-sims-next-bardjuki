import {  RootState } from '@/lib/config/reduxStore';
import { formatCurrency } from '@/lib/utils/numberUtils';
import Image from 'next/image';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';

const ProfileBalanceCard = () => {
      const { user } = useSelector((state: RootState) => state.auth);
const { balance, isLoadingBalance } = useSelector(
    (state: RootState) => state.transaction
  );

  const fullName = user ? `${user.first_name} ${user.last_name}` : 'Pengguna';

  const getProfileImage = () => {
    if (!user?.profile_image || 
        user.profile_image === 'null' || 
        user.profile_image.includes('/null')) {
      return '/assets/profile_photo.png';
    }
    return user.profile_image;
  };

  const profileImage = getProfileImage();

  const [showBalance, setShowBalance] = useState(false);
  const userBalance = balance?.balance || 0;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
             <div className="flex flex-col justify-center">
               <div className="flex items-center gap-4 mb-4">
                 <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300">
                   <Image
                     src={profileImage}
                     alt="Profile"
                     width={64}
                     height={64}
                     className="object-cover"
                     onError={(e) => {
                       e.currentTarget.src = '/assets/profile_photo.png';
                     }}
                   />
                 </div>
                 <div>
                   <p className="text-gray-600 text-sm">Selamat datang,</p>
                   <h2 className="text-2xl font-bold text-black">{fullName}</h2>
                 </div>
               </div>
             </div>
   
             <div className="relative bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
                 <svg viewBox="0 0 200 200" className="w-full h-full">
                   <circle cx="100" cy="100" r="80" fill="white" />
                 </svg>
               </div>
               <div className="relative z-10">
                 <p className="text-sm mb-2">Saldo anda</p>
                 {isLoadingBalance ? (
                   <div className="h-9 flex items-center">
                     <div className="animate-pulse bg-white bg-opacity-30 h-8 w-48 rounded"></div>
                   </div>
                 ) : (
                   <h3 className="text-3xl font-bold mb-4">
                     {showBalance ? `${formatCurrency(userBalance)}` : 'Rp ● ● ● ● ● ● ●'}
                   </h3>
                 )}
                 <button
                   onClick={() => setShowBalance(!showBalance)}
                   className="text-sm flex items-center gap-1 hover:underline"
                   disabled={isLoadingBalance}
                 >
                   {showBalance ? 'Sembunyikan Saldo' : 'Lihat Saldo'}
                   <span>{showBalance ? '🙈' : '👁️'}</span>
                 </button>
               </div>
             </div>
           </div>
  )
}

export default ProfileBalanceCard