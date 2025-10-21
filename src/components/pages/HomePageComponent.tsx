'use client';

import Image from 'next/image';

const services = [
  { id: 1, name: 'PBB', icon: '🏠', color: 'bg-teal-100' },
  { id: 2, name: 'Listrik', icon: '⚡', color: 'bg-yellow-100' },
  { id: 3, name: 'Pulsa', icon: '📱', color: 'bg-gray-100' },
  { id: 4, name: 'PDAM', icon: '🏠', color: 'bg-blue-100' },
  { id: 5, name: 'PGN', icon: '🔥', color: 'bg-red-100' },
  { id: 6, name: 'TV Langganan', icon: '📺', color: 'bg-purple-100' },
  { id: 7, name: 'Musik', icon: '🎵', color: 'bg-pink-100' },
  { id: 8, name: 'Voucher Game', icon: '🎮', color: 'bg-green-100' },
  { id: 9, name: 'Voucher Makanan', icon: '🍔', color: 'bg-blue-100' },
  { id: 10, name: 'Kurban', icon: '🌙', color: 'bg-gray-100' },
  { id: 11, name: 'Zakat', icon: '🤲', color: 'bg-green-100' },
  { id: 12, name: 'Paket Data', icon: '📱', color: 'bg-cyan-100' },
];

const promos = [
  {
    id: 1,
    title: 'Saldo Gratis!',
    description: 'saldo SIMS PPOB gratis maksimal Rp50.000 untuk pengguna pertama',
    image: '/assets/promo1.png',
    bgColor: 'bg-red-500',
  },
  {
    id: 2,
    title: 'Diskon listrik!',
    description: 'diskon untuk setiap pembayaran listrik bayar/tv pascabayar 10%',
    image: '/assets/promo2.png',
    bgColor: 'bg-pink-300',
  },
  {
    id: 3,
    title: 'Promo makan!',
    description: 'dapatkan voucher makan di seluruh tempat favorit anda dengan melakukan transaksi detail',
    image: '/assets/promo3.png',
    bgColor: 'bg-cyan-400',
  },
  {
    id: 4,
    title: 'Cashback 25%',
    description: 'untuk setiap pembelian voucher game diatas Rp100.000',
    image: '/assets/promo4.png',
    bgColor: 'bg-gray-300',
  },
  {
    id: 5,
    title: 'Buy 1 Get 2!',
    description: 'dapatkan dua kopi untuk setiap pembelian satu di kedai kopi pilihan kamu!',
    image: '/assets/promo5.png',
    bgColor: 'bg-orange-200',
  },
];

export default function HomePageComponent(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile and Balance Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Profile Section */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                <Image
                  src="/assets/profile-photo.png"
                  alt="Profile"
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Selamat datang,</p>
                <h2 className="text-2xl font-bold text-black">
                  Kristanto Wibowo
                </h2>
              </div>
            </div>
          </div>

          {/* Balance Card */}
          <div className="relative bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="80" fill="white" />
              </svg>
            </div>
            <div className="relative z-10">
              <p className="text-sm mb-2">Saldo anda</p>
              <h3 className="text-3xl font-bold mb-4">Rp ● ● ● ● ● ● ●</h3>
              <button className="text-sm flex items-center gap-1 hover:underline">
                Lihat Saldo
                <span>👁️</span>
              </button>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-12">
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-4">
            {services.map((service) => (
              <button
                key={service.id}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div
                  className={`w-14 h-14 ${service.color} rounded-lg flex items-center justify-center text-2xl`}
                >
                  {service.icon}
                </div>
                <span className="text-xs text-center text-gray-700">
                  {service.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Promo Section */}
        <div>
          <h3 className="text-lg font-semibold text-black mb-4">
            Temukan promo menarik
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {promos.map((promo) => (
              <div
                key={promo.id}
                className={`${promo.bgColor} rounded-xl p-6 min-w-[320px] flex-shrink-0 relative overflow-hidden`}
              >
                <div className="relative z-10">
                  <h4 className="text-white text-xl font-bold mb-2">
                    {promo.title}
                  </h4>
                  <p className="text-white text-sm mb-4 max-w-[180px]">
                    {promo.description}
                  </p>
                  <button className="text-white text-sm hover:underline">
                    ● lihat lebih
                  </button>
                </div>
                <div className="absolute right-0 bottom-0 w-32 h-32">
                  {/* Placeholder for promo image */}
                  <div className="w-full h-full bg-white bg-opacity-20 rounded-tl-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}