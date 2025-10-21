'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/reduxHooks';
import { logout, updateProfile, updateProfileImage } from '@/lib/features/auth/authSlice';

export default function AccountPageComponent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user, isUpdatingProfile, error, successMessage } = useAppSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');

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
      // Validate file size (max 100KB)
      if (file.size > 100 * 1024) {
        alert('Ukuran file maksimal 100KB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar');
        return;
      }

      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      // Update profile image first if changed
      if (profileImage) {
        await dispatch(updateProfileImage(profileImage)).unwrap();
      }

      // Update profile data
      await dispatch(
        updateProfile({
          first_name: formData.first_name,
          last_name: formData.last_name,
        })
      ).unwrap();

      setIsEditing(false);
      setProfileImage(null);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setProfileImage(null);
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
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-5xl">👤</span>
              )}
            </div>
            {isEditing && (
              <button
                onClick={handleImageClick}
                className="absolute bottom-0 right-0 w-10 h-10 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
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
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        {/* User Name */}
        <h1 className="text-3xl font-bold text-center mb-12">
          {user?.first_name} {user?.last_name}
        </h1>

        {/* Form */}
        <div className="space-y-6">
          {/* Email */}
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

          {/* First Name */}
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

          {/* Last Name */}
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

          {/* Action Buttons */}
          {!isEditing ? (
            <>
              <button
                onClick={handleEditClick}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Edit Profil
              </button>
              <button
                onClick={handleLogout}
                className="w-full border-2 border-red-500 text-red-500 hover:bg-red-50 font-semibold py-3 rounded-lg transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSaveClick}
                disabled={isUpdatingProfile}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingProfile ? 'Menyimpan...' : 'Simpan'}
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={isUpdatingProfile}
                className="w-full border-2 border-red-500 text-red-500 hover:bg-red-50 font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                Batalkan
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}