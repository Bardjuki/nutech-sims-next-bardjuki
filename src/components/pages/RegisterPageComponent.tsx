'use client';

import { useState, FormEvent, ChangeEvent, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  
  // Get auth state from Redux
  const { isLoading, error, successMessage } = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // Refs for auto-scroll
  const emailRef = useRef<HTMLDivElement>(null);
  const firstNameRef = useRef<HTMLDivElement>(null);
  const lastNameRef = useRef<HTMLDivElement>(null);
  const passwordRef = useRef<HTMLDivElement>(null);
  const confirmPasswordRef = useRef<HTMLDivElement>(null);

  // Clear messages on component mount and unmount
  useEffect(() => {
    dispatch(clearMessages());
    
    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);

  // Redirect to login after successful registration
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        router.push('/auth/login');
      }, 2000); // Redirect after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [successMessage, router]);

  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email harus diisi';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Format email tidak valid';
    return undefined;
  };

  const validateFirstName = (name: string): string | undefined => {
    if (!name) return 'Nama depan harus diisi';
    if (name.length < 2) return 'Nama depan minimal 2 karakter';
    return undefined;
  };

  const validateLastName = (name: string): string | undefined => {
    if (!name) return 'Nama belakang harus diisi';
    if (name.length < 2) return 'Nama belakang minimal 2 karakter';
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password harus diisi';
    if (password.length < 8) return 'Password minimal 8 karakter';
    return undefined;
  };

  const validateConfirmPassword = (
    password: string,
    confirmPassword: string
  ): string | undefined => {
    if (!confirmPassword) return 'Konfirmasi password harus diisi';
    if (password !== confirmPassword) return 'Password tidak sama';
    return undefined;
  };

  const handleInputChange = (field: keyof FormData) => (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    
    // Clear Redux error when user types
    if (error) {
      dispatch(clearMessages());
    }
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

    const newErrors: FormErrors = {
      email: validateEmail(formData.email),
      firstName: validateFirstName(formData.firstName),
      lastName: validateLastName(formData.lastName),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(
        formData.password,
        formData.confirmPassword
      ),
    };

    setErrors(newErrors);

    // Find first error and scroll to it
    if (newErrors.email) {
      scrollToError(emailRef);
      return;
    }
    if (newErrors.firstName) {
      scrollToError(firstNameRef);
      return;
    }
    if (newErrors.lastName) {
      scrollToError(lastNameRef);
      return;
    }
    if (newErrors.password) {
      scrollToError(passwordRef);
      return;
    }
    if (newErrors.confirmPassword) {
      scrollToError(confirmPasswordRef);
      return;
    }

    // If no validation errors, attempt registration
    try {
      await dispatch(
        register({
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          password: formData.password,
        })
      ).unwrap();
      
      // Success is handled by useEffect above
    } catch (error) {
      // Error is handled by Redux and shown in UI
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <span className="text-xl font-semibold">SIMS PPOB</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-center mb-10">
            Lengkapi data untuk
            <br />
            membuat akun
          </h1>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800 text-sm text-center font-medium">
                ✓ {successMessage}
              </p>
              <p className="text-green-600 text-xs text-center mt-1">
                Mengalihkan ke halaman login...
              </p>
            </div>
          )}

          {/* Error Message from API */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm text-center font-medium">
                ✕ {error}
              </p>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  disabled={isLoading}
                  className={`w-full pl-12 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed ${
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

            {/* First Name Input */}
            <div ref={firstNameRef}>
              <div className="relative">
                <span
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                    errors.firstName ? 'text-red-600' : 'text-gray-400'
                  }`}
                >
                  👤
                </span>
                <input
                  type="text"
                  placeholder="nama depan"
                  value={formData.firstName}
                  onChange={handleInputChange('firstName')}
                  disabled={isLoading}
                  className={`w-full pl-12 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    errors.firstName
                      ? 'border-red-600 focus:ring-red-600'
                      : 'border-gray-300 focus:ring-red-600'
                  }`}
                />
              </div>
              {errors.firstName && (
                <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name Input */}
            <div ref={lastNameRef}>
              <div className="relative">
                <span
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                    errors.lastName ? 'text-red-600' : 'text-gray-400'
                  }`}
                >
                  👤
                </span>
                <input
                  type="text"
                  placeholder="nama belakang"
                  value={formData.lastName}
                  onChange={handleInputChange('lastName')}
                  disabled={isLoading}
                  className={`w-full pl-12 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    errors.lastName
                      ? 'border-red-600 focus:ring-red-600'
                      : 'border-gray-300 focus:ring-red-600'
                  }`}
                />
              </div>
              {errors.lastName && (
                <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
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
                  placeholder="buat password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  disabled={isLoading}
                  className={`w-full pl-12 pr-12 py-3 border rounded-md focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    errors.password
                      ? 'border-red-600 focus:ring-red-600'
                      : 'border-gray-300 focus:ring-red-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 disabled:cursor-not-allowed ${
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

            {/* Confirm Password Input */}
            <div ref={confirmPasswordRef}>
              <div className="relative">
                <span
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                    errors.confirmPassword ? 'text-red-600' : 'text-gray-400'
                  }`}
                >
                  🔒
                </span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="konfirmasi password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  disabled={isLoading}
                  className={`w-full pl-12 pr-12 py-3 border rounded-md focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    errors.confirmPassword
                      ? 'border-red-600 focus:ring-red-600'
                      : 'border-gray-300 focus:ring-red-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 disabled:cursor-not-allowed ${
                    errors.confirmPassword
                      ? 'text-red-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  👁️
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 text-white py-3 rounded-md font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Memproses...
                </>
              ) : (
                'Registrasi'
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-6 text-gray-600">
            sudah punya akun? login{' '}
            <Link
              href="/auth/login"
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