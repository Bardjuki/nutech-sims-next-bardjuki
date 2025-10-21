'use client';

import { useState, FormEvent, ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
  };

  const scrollToError = (fieldRef: React.RefObject<HTMLDivElement | null>): void => {
    if (fieldRef.current) {
      fieldRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
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

    // If no errors, submit form
    console.log('Form submitted:', formData);
    // Handle registration logic here
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
                  className={`w-full pl-12 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 ${
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
                  className={`w-full pl-12 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 ${
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
                  className={`w-full pl-12 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 ${
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
                  className={`w-full pl-12 pr-12 py-3 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.password
                      ? 'border-red-600 focus:ring-red-600'
                      : 'border-gray-300 focus:ring-red-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 ${
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
                  className={`w-full pl-12 pr-12 py-3 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.confirmPassword
                      ? 'border-red-600 focus:ring-red-600'
                      : 'border-gray-300 focus:ring-red-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 ${
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
              className="w-full bg-red-600 text-white py-3 rounded-md font-semibold hover:bg-red-700 transition-colors"
            >
              Registrasi
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