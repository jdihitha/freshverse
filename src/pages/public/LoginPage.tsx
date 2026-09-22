import React, { useState, useEffect } from 'react';
import { Sprout, Lock, Mail, ArrowRight, Home, Hash, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

// RFC 5322 compatible email validation pattern
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, currentUser, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [houseName, setHouseName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getDashboardPath = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'packing':
        return '/packing/dashboard';
      case 'delivery':
        return '/delivery/dashboard';
      case 'supplier':
        return '/supplier/dashboard';
      case 'customer':
      default:
        return '/customer/dashboard';
    }
  };

  // If already authenticated, redirect to the user's role dashboard
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      onNavigate(getDashboardPath(currentUser.role));
    }
  }, [isAuthenticated, currentUser, onNavigate]);

  const handleHouseNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Accepts text only (letters and spaces)
    if (val !== '' && !/^[a-zA-Z\s]*$/.test(val)) {
      setError('House name must contain only letters');
      return;
    }
    // Reasonable character limit (maximum 50 characters, do not allow extra characters beyond limit)
    if (val.length > 50) {
      setError('Maximum 50 characters allowed');
      return;
    }
    setHouseName(val);
    if (
      error === 'House name is required' ||
      error === 'House name must contain only letters' ||
      error === 'Maximum 50 characters allowed'
    ) {
      setError('');
    }
  };

  const handleRoomNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Accepts only numbers (digits 0-9)
    if (val !== '' && !/^\d+$/.test(val)) {
      setError('House/Room number must contain only numbers');
      return;
    }
    // Maximum 10 digits, do not allow extra characters beyond limit
    if (val.length > 10) {
      setError('Maximum 10 characters allowed');
      return;
    }
    setRoomNumber(val);
    if (
      error === 'House/Room number is required' ||
      error === 'House/Room number must contain only numbers' ||
      error === 'Maximum 10 characters allowed'
    ) {
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Email validation: trim unnecessary spaces before validation, require valid format
    const cleanEmail = email.trim();
    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
      setError('Invalid email format');
      return;
    }
    if (cleanEmail.length > 100) {
      setError('Maximum 100 characters allowed');
      return;
    }

    // 2. Password validation: MUST remain case-sensitive, do not trim or modify
    if (!password) {
      setError('Password is required');
      return;
    }
    if (password.length > 128) {
      setError('Maximum 128 characters allowed');
      return;
    }

    // 3. House Name validation: text only (letters and spaces), max 50 chars
    const cleanHouseName = houseName.trim();
    if (!cleanHouseName) {
      setError('House name is required');
      return;
    }
    if (!/^[a-zA-Z\s]+$/.test(cleanHouseName)) {
      setError('House name must contain only letters');
      return;
    }
    if (cleanHouseName.length > 50) {
      setError('Maximum 50 characters allowed');
      return;
    }

    // 4. House / Room Number validation: strict digits only, max 10 characters
    const cleanRoomNumber = roomNumber.trim();
    if (!cleanRoomNumber) {
      setError('House/Room number is required');
      return;
    }
    if (!/^\d+$/.test(cleanRoomNumber)) {
      setError('House/Room number must contain only numbers');
      return;
    }
    if (cleanRoomNumber.length > 10) {
      setError('Maximum 10 characters allowed');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Supabase email/password login with exact case-sensitive password
      const res = await login(cleanEmail, password, {
        houseName: cleanHouseName,
        roomNumber: cleanRoomNumber
      });

      if (res.success) {
        const role = res.role || currentUser?.role || 'customer';
        onNavigate(getDashboardPath(role));
      } else {
        setError(res.error || 'Invalid email or password');
      }
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#1F3D2B] text-[#A7C4A0] mx-auto flex items-center justify-center font-bold shadow-md">
          <Sprout className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#1F3D2B]">Welcome to FreshVerse</h1>
        <p className="text-xs text-[#2E2E2E]/70">
          Sign in to manage your subscription basket or access your operations portal.
        </p>
      </div>

      {/* Main Login Form */}
      <Card className="text-left" padding="lg">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {error && (
            <div
              id="login-error-alert"
              role="alert"
              className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* 1. Email / Gmail */}
          <div>
            <label
              htmlFor="login-email"
              className="block text-xs font-bold text-[#1F3D2B] uppercase tracking-wider mb-1.5"
            >
              Email / Gmail
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8A847A] absolute left-3.5 top-3" />
              <input
                id="login-email"
                type="email"
                required
                maxLength={100}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error === 'Invalid email format' || error === 'Maximum 100 characters allowed') {
                    setError('');
                  }
                }}
                placeholder="user@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#E0DBD1] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3D2B] transition-all"
              />
            </div>
          </div>

          {/* 2. Password (strictly case-sensitive, with visibility toggle) */}
          <div>
            <label
              htmlFor="login-password"
              className="block text-xs font-bold text-[#1F3D2B] uppercase tracking-wider mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8A847A] absolute left-3.5 top-3" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                maxLength={128}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error === 'Password is required' || error === 'Maximum 128 characters allowed') {
                    setError('');
                  }
                }}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#FAF8F5] border border-[#E0DBD1] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3D2B] transition-all"
              />
              <button
                id="login-password-visibility-toggle"
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-2.5 p-1 text-[#8A847A] hover:text-[#1F3D2B] focus:outline-none transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* 3. House Name (Text field, allows letters/spaces/house-name characters, max 50) */}
          <div>
            <label
              htmlFor="login-house-name"
              className="block text-xs font-bold text-[#1F3D2B] uppercase tracking-wider mb-1.5"
            >
              House Name
            </label>
            <div className="relative">
              <Home className="w-4 h-4 text-[#8A847A] absolute left-3.5 top-3" />
              <input
                id="login-house-name"
                type="text"
                required
                maxLength={50}
                value={houseName}
                onChange={handleHouseNameChange}
                placeholder="e.g. Palm Grove Villa"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#E0DBD1] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3D2B] transition-all"
              />
            </div>
          </div>

          {/* 4. House / Room Number (Strict digits only, max 10 characters) */}
          <div>
            <label
              htmlFor="login-room-number"
              className="block text-xs font-bold text-[#1F3D2B] uppercase tracking-wider mb-1.5"
            >
              House / Room Number
            </label>
            <div className="relative">
              <Hash className="w-4 h-4 text-[#8A847A] absolute left-3.5 top-3" />
              <input
                id="login-room-number"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                required
                maxLength={10}
                value={roomNumber}
                onChange={handleRoomNumberChange}
                placeholder="e.g. 402"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#E0DBD1] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3D2B] transition-all"
              />
            </div>
          </div>

          <Button
            id="login-submit-button"
            type="submit"
            size="lg"
            variant="primary"
            className="w-full mt-2"
            isLoading={loading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In to Account
          </Button>
        </form>
      </Card>
    </div>
  );
};
