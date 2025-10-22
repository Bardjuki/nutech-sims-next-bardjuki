'use client';

import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/config/reduxStore';
import Link from 'next/link';
import ProfileBalanceCard from '../ui/cards/ProfileBalanceCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
  const { banners, services, isLoadingBanners, isLoadingServices } = useSelector(
    (state: RootState) => state.module
  );

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position to show/hide navigation buttons
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, [banners]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340; // Banner width + gap
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileBalanceCard />

        {/* Services Section */}
        <div className="mb-12">
          {isLoadingServices ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
          ) : services.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-4"
            >
              {services.map((service, index) => {
                const showImage = service.service_icon && 
                                 service.service_icon !== 'null' && 
                                 !service.service_icon.includes('/null');
                
                return (
                  <Link key={service.service_code} href={`/payment/order/${service.service_code}`}>
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col cursor-pointer items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition-colors w-full"
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
                    </motion.button>
                  </Link>
                );
              })}
            </motion.div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Tidak ada layanan tersedia
            </div>
          )}
        </div>

        {/* Banners Section with Navigation */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-black">
              Temukan promo menarik
            </h3>
            {banners.length > 0 && (
              <div className="hidden sm:flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => scroll('left')}
                  disabled={!canScrollLeft}
                  className={`p-2 rounded-full transition-all ${
                    canScrollLeft
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ChevronLeft size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => scroll('right')}
                  disabled={!canScrollRight}
                  className={`p-2 rounded-full transition-all ${
                    canScrollRight
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ChevronRight size={20} />
                </motion.button>
              </div>
            )}
          </div>

          {isLoadingBanners ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
          ) : banners.length > 0 ? (
            <div className="relative group">
              <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
              >
                {banners.map((banner, index) => {
                  const showImage = banner.banner_image && 
                                   banner.banner_image !== 'null' && 
                                   !banner.banner_image.includes('/null');
                  
                  return (
                    <motion.div
                      key={banner.banner_name}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className={`rounded-xl min-w-[280px] sm:min-w-[320px] h-[160px] flex-shrink-0 relative overflow-hidden ${
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
                    </motion.div>
                  );
                })}
              </div>

              {/* Mobile Navigation Buttons (Overlay) */}
              {canScrollLeft && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => scroll('left')}
                  className="sm:hidden absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 text-red-500 shadow-lg"
                >
                  <ChevronLeft size={20} />
                </motion.button>
              )}
              {canScrollRight && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => scroll('right')}
                  className="sm:hidden absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 text-red-500 shadow-lg"
                >
                  <ChevronRight size={20} />
                </motion.button>
              )}
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