'use client';

import { useState, FormEvent, ChangeEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/reduxHooks';
import { clearError, login } from '@/lib/features/auth/authSlice';

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPageComponent(): React.JSX.Element {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Get loading and error state from Redux
  const { isLoading, error: authError } = useAppSelector((state) => state.auth);
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Refs for auto-scroll
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
    if (fieldRef.current) {
      fieldRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Clear any previous auth errors
    if (authError) {
      dispatch(clearError());
    }

    const newErrors: FormErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };

    setErrors(newErrors);

    // Find first error and scroll to it
    if (newErrors.email) {
      scrollToError(emailRef);
      return;
    }
    if (newErrors.password) {
      scrollToError(passwordRef);
      return;
    }

    // If no validation errors, attempt login
    try {
      const result = await dispatch(login({ email, password })).unwrap();
      
      // Login successful, redirect to home
      router.push('/');
    } catch (error) {
      // Error is handled by Redux and shown in UI
      console.error('Login failed:', error);
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
    // Clear error when user types
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
    if (authError) {
      dispatch(clearError());
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
    // Clear error when user types
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
    if (authError) {
      dispatch(clearError());
    }
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <span className="text-xl text-black font-semibold">SIMS PPOB</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-black text-center mb-10">
            Masuk atau buat akun
            <br />
            untuk memulai
          </h1>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* API Error Message */}
            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {authError}
              </div>
            )}

            {/* Email Input */}
            <div ref={emailRef}>
              <div className="relative">
                <span
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                    errors.email ? 'text-red-600' : 'text-gray-400'
                  }`}
                >
                  @
                </span>
                <input
                  type="email"
                  placeholder="masukan email anda"
                  value={email}
                  onChange={handleEmailChange}
                  disabled={isLoading}
                  className={`w-full pl-12 pr-4 py-3 border text-black rounded-md focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.email
                      ? 'border-red-600 focus:ring-red-600'
                      : 'border-gray-300 focus:ring-red-600'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div ref={passwordRef}>
              <div className="relative">
                <span
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                    errors.password ? 'text-red-600' : 'text-gray-400'
                  }`}
                >
                  🔒
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="masukan password anda"
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                  className={`w-full pl-12 pr-12 py-3 border text-black rounded-md focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.password
                      ? 'border-red-600 focus:ring-red-600'
                      : 'border-gray-300 focus:ring-red-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  disabled={isLoading}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 disabled:opacity-50 ${
                    errors.password
                      ? 'text-red-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  👁️
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 text-white py-3 rounded-md font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center mt-6 text-gray-600">
            belum punya akun? registrasi{' '}
            <Link
              href="/auth/register"
              className="text-red-600 font-semibold hover:underline"
            >
              di sini
            </Link>
          </p>
        </div>
      </div>

      {/* Right Section - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src="/assets/login_illustration.png"
          alt="Illustration"
          fill
          priority
          className="object-cover"
        />
      </div>
    </div>
  );
}