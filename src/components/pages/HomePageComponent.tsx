'use client';

import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { RootState, AppDispatch } from '@/lib/config/reduxStore';
import { fetchBanners, fetchServices } from '@/lib/features/module/moduleSlice';
import { fetchBalance } from '@/lib/features/transaction/transactionSlice';
import Link from 'next/link';
import ProfileBalanceCard from '../ui/cards/ProfileBalanceCard';

// Fallback icon mapping for services
const serviceIconMap: Record<string, string> = {
  'PAJAK': '🏠',
  'PLN': '⚡',
  'PULSA': '📱',
  'PDAM': '💧',
  'PGN': '🔥',
  'TV': '📺',
  'MUSIK': '🎵',
  'VOUCHER_GAME': '🎮',
  'VOUCHER_MAKANAN': '🍔',
  'QURBAN': '🐐',
  'ZAKAT': '🤲',
  'PAKET_DATA': '📡',
};

const serviceColorMap: Record<string, string> = {
  'PAJAK': 'bg-teal-100',
  'PLN': 'bg-yellow-100',
  'PULSA': 'bg-gray-100',
  'PDAM': 'bg-blue-100',
  'PGN': 'bg-red-100',
  'TV': 'bg-purple-100',
  'MUSIK': 'bg-pink-100',
  'VOUCHER_GAME': 'bg-green-100',
  'VOUCHER_MAKANAN': 'bg-orange-100',
  'QURBAN': 'bg-indigo-100',
  'ZAKAT': 'bg-emerald-100',
  'PAKET_DATA': 'bg-cyan-100',
};

// Fallback banner colors
const bannerColors = [
  'bg-red-500',
  'bg-pink-300',
  'bg-cyan-400',
  'bg-gray-300',
  'bg-orange-200',
  'bg-purple-400',
];

export default function HomePageComponent(): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { banners, services, isLoadingBanners, isLoadingServices } = useSelector(
    (state: RootState) => state.module
  );
  useEffect(() => {
    dispatch(fetchBanners());
    dispatch(fetchServices());
    dispatch(fetchBalance());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileBalanceCard/>

        <div className="mb-12">
          {isLoadingServices ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-4">
              {services.map((service) => {
                // Simple check for valid image
                const showImage = service.service_icon && 
                                 service.service_icon !== 'null' && 
                                 !service.service_icon.includes('/null');
                
                return (
                  <Link  key={service.service_code} href={`/payment/order/${service.service_code}`}>
                   <button
                    className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div
                      className={`w-14 h-14 ${
                        serviceColorMap[service.service_code] || 'bg-gray-100'
                      } rounded-lg flex items-center justify-center text-2xl`}
                    >
                      {showImage ? (
                        <Image
                          src={service.service_icon}
                          alt={service.service_name}
                          width={56}
                          height={56}
                          className="object-contain"
                        />
                      ) : (
                        serviceIconMap[service.service_code] || '📦'
                      )}
                    </div>
                    <span className="text-xs text-center text-gray-700">
                      {service.service_name}
                    </span>
                  </button>
                  </Link>
                 
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Tidak ada layanan tersedia
            </div>
          )}
        </div>

        {/* Banner/Promo Section */}
        <div>
          <h3 className="text-lg font-semibold text-black mb-4">
            Temukan promo menarik
          </h3>
          {isLoadingBanners ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
          ) : banners.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {banners.map((banner, index) => {
                // Simple check for valid image
                const showImage = banner.banner_image && 
                                 banner.banner_image !== 'null' && 
                                 !banner.banner_image.includes('/null');
                
                return (
                  <div
                    key={banner.banner_name}
                    className={`rounded-xl min-w-[320px] h-[160px] flex-shrink-0 relative overflow-hidden ${
                      !showImage ? bannerColors[index % bannerColors.length] + ' flex items-center justify-center' : ''
                    }`}
                  >
                    {showImage ? (
                      <Image
                        src={banner.banner_image}
                        alt={banner.banner_name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="text-white text-center p-6">
                        <h4 className="text-xl font-bold mb-2">{banner.banner_name}</h4>
                        <p className="text-sm">{banner.description}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Tidak ada promo tersedia
            </div>
          )}
        </div>
      </div>
    </div>
  );
}