'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/reduxHooks';
import {
  logout,
  updateProfile,
  updateProfileImage,
} from '@/lib/features/auth/authSlice';

export default function AccountPageComponent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user, isUpdatingProfile } = useAppSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      });
      setPreviewImage(user.profile_image || '');
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 100 * 1024; 
      if (file.size > maxSize) {
        setErrorMessage('Ukuran file maksimal 100KB');
        e.target.value = ''; 
        return;
      }

      if (!file.type.startsWith('image/')) {
        setErrorMessage('File harus berupa gambar');
        e.target.value = '';
        return;
      }

      setErrorMessage(null);
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => setIsEditing(true);

  const handleSaveClick = async () => {
    try {
      if (profileImage) {
        await dispatch(updateProfileImage(profileImage)).unwrap();
      }
      await dispatch(
        updateProfile({
          first_name: formData.first_name,
          last_name: formData.last_name,
        })
      ).unwrap();
      setIsEditing(false);
      setProfileImage(null);
       setErrorMessage(null);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setProfileImage(null);
     setErrorMessage(null);
    if (user) {
      setFormData({
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      });
      setPreviewImage(user.profile_image || '');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth/login');
  };

  return (
    <motion.div
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="flex justify-center mb-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <motion.div
            className="relative"
            whileHover={isEditing ? { scale: 1.05 } : {}}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <div className="w-32 h-32 rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center shadow-md">
              {previewImage ? (
                <motion.img
                  src={previewImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />
              ) : (
                <span className="text-5xl">👤</span>
              )}
            </div>
            <AnimatePresence>
              {isEditing && (
                <motion.button
                  key="edit"
                  onClick={handleImageClick}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 250 }}
                  className="absolute cursor-pointer bottom-0 right-0 w-10 h-10 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 shadow-lg"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </motion.button>
              )}
            </AnimatePresence>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </motion.div>
        </motion.div>
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg text-sm text-center"
            >
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.h1
          className="text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {user?.first_name} {user?.last_name}
        </motion.h1>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                @
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Depan
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                👤
              </span>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg ${
                  isEditing ? 'bg-white' : 'bg-gray-50 text-gray-500'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Belakang
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                👤
              </span>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg ${
                  isEditing ? 'bg-white' : 'bg-gray-50 text-gray-500'
                }`}
              />
            </div>
          </div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {!isEditing ? (
              <>
                <motion.button
                  onClick={handleEditClick}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-red-500 cursor-pointer hover:bg-red-600 text-white font-semibold py-3 rounded-lg shadow-sm transition-colors"
                >
                  Edit Profil
                </motion.button>
                <motion.button
                  onClick={handleLogout}
                  whileTap={{ scale: 0.97 }}
                  className="w-full border-2 cursor-pointer border-red-500 text-red-500 hover:bg-red-50 font-semibold py-3 rounded-lg transition-colors"
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  onClick={handleSaveClick}
                  disabled={isUpdatingProfile}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-red-500 cursor-pointer hover:bg-red-600 text-white font-semibold py-3 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingProfile ? 'Menyimpan...' : 'Simpan'}
                </motion.button>
                <motion.button
                  onClick={handleCancelEdit}
                  whileTap={{ scale: 0.97 }}
                  disabled={isUpdatingProfile}
                  className="w-full border-2 cursor-pointer border-red-500 text-red-500 hover:bg-red-50 font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  Batalkan
                </motion.button>
              </>
            )}
          </motion.div>
        </motion.div>
      </main>
    </motion.div>
  );
}
