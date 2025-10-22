'use client';

import { useState, FormEvent, ChangeEvent, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/reduxHooks';
import { clearError, login } from '@/lib/features/auth/authSlice';

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPageComponent(): React.JSX.Element {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error: authError } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const emailRef = useRef<HTMLDivElement>(null);
  const passwordRef = useRef<HTMLDivElement>(null);

  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email harus diisi';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Format email tidak valid';
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password harus diisi';
    if (password.length < 8) return 'Password minimal 8 karakter';
    return undefined;
  };

  const scrollToError = (fieldRef: React.RefObject<HTMLDivElement | null>): void => {
    fieldRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (authError) dispatch(clearError());
    const newErrors: FormErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(newErrors);
    if (newErrors.email) return scrollToError(emailRef);
    if (newErrors.password) return scrollToError(passwordRef);
    try {
      await dispatch(login({ email, password })).unwrap();
      router.push('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
    if (authError) dispatch(clearError());
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
    if (authError) dispatch(clearError());
  };

  return (
    <div className="min-h-screen flex">
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center justify-center gap-2 mb-8"
          >
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <span className="text-xl text-black font-semibold">SIMS PPOB</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl font-bold text-black text-center mb-10"
          >
            Masuk atau buat akun
            <br />
            untuk memulai
          </motion.h1>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {authError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm"
              >
                {authError}
              </motion.div>
            )}

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
                  value={email}
                  onChange={handleEmailChange}
                  disabled={isLoading}
                  className={`w-full pl-12 pr-4 py-3 border text-black rounded-md focus:outline-none focus:ring-2 disabled:opacity-50 ${
                    errors.email
                      ? 'border-red-600 focus:ring-red-600'
                      : 'border-gray-300 focus:ring-red-600'
                  }`}
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-sm mt-1"
                >
                  {errors.email}
                </motion.p>
              )}
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
                  placeholder="Masukan password anda"
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                  className={`w-full pl-12 pr-12 py-3 border text-black rounded-md focus:outline-none focus:ring-2 disabled:opacity-50 ${
                    errors.password
                      ? 'border-red-600 focus:ring-red-600'
                      : 'border-gray-300 focus:ring-red-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-sm mt-1"
                >
                  {errors.password}
                </motion.p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              className="w-full bg-red-600 cursor-pointer text-white py-3 rounded-md font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Memproses...' : 'Masuk'}
            </motion.button>
          </motion.form>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-center mt-6 text-gray-600"
          >
            belum punya akun? registrasi{' '}
            <Link href="/auth/register" className="text-red-600 font-semibold hover:underline">
              di sini
            </Link>
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
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
