'use client';

import { useState, FormEvent, ChangeEvent, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, User, Lock, Eye, EyeOff } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/reduxHooks';
import { register, clearMessages } from '@/lib/features/auth/authSlice';

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterPageComponent(): React.JSX.Element {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, successMessage } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<FormData>({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const emailRef = useRef<HTMLDivElement>(null);
  const firstNameRef = useRef<HTMLDivElement>(null);
  const lastNameRef = useRef<HTMLDivElement>(null);
  const passwordRef = useRef<HTMLDivElement>(null);
  const confirmPasswordRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(clearMessages());
    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, router]);

  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email harus diisi';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Format email tidak valid';
    return undefined;
  };

  const validateName = (name: string, field: string): string | undefined => {
    if (!name) return `${field} harus diisi`;
    if (name.length < 2) return `${field} minimal 2 karakter`;
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password harus diisi';
    if (password.length < 8) return 'Password minimal 8 karakter';
    return undefined;
  };

  const validateConfirmPassword = (password: string, confirm: string): string | undefined => {
    if (!confirm) return 'Konfirmasi password harus diisi';
    if (password !== confirm) return 'Password tidak sama';
    return undefined;
  };

  const scrollToError = (ref: React.RefObject<HTMLDivElement | null>): void => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleInputChange =
    (field: keyof FormData) => (e: ChangeEvent<HTMLInputElement>): void => {
      const value = e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
      if (error) dispatch(clearMessages());
    };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const newErrors: FormErrors = {
      email: validateEmail(formData.email),
      firstName: validateName(formData.firstName, 'Nama depan'),
      lastName: validateName(formData.lastName, 'Nama belakang'),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.password, formData.confirmPassword),
    };
    setErrors(newErrors);
    if (newErrors.email) return scrollToError(emailRef);
    if (newErrors.firstName) return scrollToError(firstNameRef);
    if (newErrors.lastName) return scrollToError(lastNameRef);
    if (newErrors.password) return scrollToError(passwordRef);
    if (newErrors.confirmPassword) return scrollToError(confirmPasswordRef);

    try {
      await dispatch(
        register({
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          password: formData.password,
        })
      ).unwrap();
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex">
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white"
      >
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-2 mb-8"
          >
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <span className="text-xl font-semibold text-black">SIMS PPOB</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-center text-black mb-10"
          >
            Lengkapi data untuk
            <br />
            membuat akun
          </motion.h1>

          {successMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md text-center"
            >
              <p className="text-green-800 text-sm font-medium">{successMessage}</p>
              <p className="text-green-600 text-xs mt-1">Mengalihkan ke halaman login...</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-center"
            >
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </motion.div>
          )}

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div ref={emailRef}>
              <div className="relative">
                <Mail
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    errors.email ? 'text-red-600' : 'text-gray-400'
                  }`}
                />
                <input
                  type="email"
                  placeholder="Masukan email anda"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  disabled={isLoading}
                  className={`w-full pl-12 pr-4 py-3 border rounded-md text-black focus:outline-none focus:ring-2 ${
                    errors.email
                      ? 'border-red-600 focus:ring-red-600'
                      : 'border-gray-300 focus:ring-red-600'
                  }`}
                />
              </div>
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>

            <div ref={firstNameRef}>
              <div className="relative">
                <User
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    errors.firstName ? 'text-red-600' : 'text-gray-400'
                  }`}
                />
                <input
                  type="text"
                  placeholder="Nama depan"
                  value={formData.firstName}
                  onChange={handleInputChange('firstName')}
                  disabled={isLoading}
                  className={`w-full pl-12 pr-4 py-3 border rounded-md text-black focus:outline-none focus:ring-2 ${
                    errors.firstName
                      ? 'border-red-600 focus:ring-red-600'
                      : 'border-gray-300 focus:ring-red-600'
                  }`}
                />
              </div>
              {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
            </div>

            <div ref={lastNameRef}>
              <div className="relative">
                <User
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    errors.lastName ? 'text-red-600' : 'text-gray-400'
                  }`}
                />
                <input
                  type="text"
                  placeholder="Nama belakang"
                  value={formData.lastName}
                  onChange={handleInputChange('lastName')}
                  disabled={isLoading}
                  className={`w-full pl-12 pr-4 py-3 border rounded-md text-black focus:outline-none focus:ring-2 ${
                    errors.lastName
                      ? 'border-red-600 focus:ring-red-600'
                      : 'border-gray-300 focus:ring-red-600'
                  }`}
                />
              </div>
              {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
            </div>

            <div ref={passwordRef}>
              <div className="relative">
                <Lock
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    errors.password ? 'text-red-600' : 'text-gray-400'
                  }`}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Buat password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  disabled={isLoading}
                  className={`w-full pl-12 pr-12 py-3 border rounded-md text-black focus:outline-none focus:ring-2 ${
                    errors.password
                      ? 'border-red-600 focus:ring-red-600'
                      : 'border-gray-300 focus:ring-red-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
            </div>

            <div ref={confirmPasswordRef}>
              <div className="relative">
                <Lock
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    errors.confirmPassword ? 'text-red-600' : 'text-gray-400'
                  }`}
                />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Konfirmasi password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  disabled={isLoading}
                  className={`w-full pl-12 pr-12 py-3 border rounded-md text-black focus:outline-none focus:ring-2 ${
                    errors.confirmPassword
                      ? 'border-red-600 focus:ring-red-600'
                      : 'border-gray-300 focus:ring-red-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                  className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              className="w-full bg-red-600 cursor-pointer text-white py-3 rounded-md font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Memproses...' : 'Registrasi'}
            </motion.button>
          </motion.form>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-6 text-gray-600"
          >
            sudah punya akun? login{' '}
            <Link href="/auth/login" className="text-red-600 font-semibold hover:underline">
              di sini
            </Link>
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 relative"
      >
        <Image
          src="/assets/login_illustration.png"
          alt="Illustration"
          fill
          priority
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}
