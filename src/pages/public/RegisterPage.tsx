import React, { useState, useEffect } from 'react';
import { Sprout, User, Mail, Phone, Lock, Home, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

interface RegisterPageProps {
  onNavigate: (path: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register, isAuthenticated, currentUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [gatedCommunityUnit, setGatedCommunityUnit] = useState('Villa 18, Palm Grove');
  const [address, setAddress] = useState('Palm Grove Residency, Phase 1, Gate 2');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to customer dashboard
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      onNavigate('/customer/dashboard');
    }
  }, [isAuthenticated, currentUser, onNavigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !phone.trim() || !password || !address.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const res = await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        address: address.trim(),
        gatedCommunityUnit: gatedCommunityUnit.trim()
      });

      if (res.success) {
        if (res.message) {
          setSuccessMessage(res.message);
        } else {
          onNavigate('/customer/dashboard');
        }
      } else {
        setError(res.error || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
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
        <h1 className="font-serif text-3xl font-bold text-[#1F3D2B]">Join FreshVerse</h1>
        <p className="text-xs text-[#2E2E2E]/70">
          Subscribe to curated, chemical-free fresh vegetable baskets delivered to your doorstep.
        </p>
      </div>

      <Card className="text-left" padding="lg">
        {successMessage ? (
          <div className="space-y-6 py-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-[#1F3D2B]">Account Created</h2>
              <p className="text-xs text-[#6E695F] max-w-md mx-auto leading-relaxed">
                {successMessage}
              </p>
            </div>
            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => onNavigate('/login')}
              >
                Proceed to Sign In
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#1F3D2B] uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8A847A] absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Meera Raman"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#E0DBD1] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3D2B] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1F3D2B] uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8A847A] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="meera@example.com"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#E0DBD1] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3D2B] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F3D2B] uppercase tracking-wider mb-1.5">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8A847A] absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#E0DBD1] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3D2B] transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F3D2B] uppercase tracking-wider mb-1.5">
                Password * (minimum 6 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8A847A] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a secure password"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#E0DBD1] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3D2B] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F3D2B] uppercase tracking-wider mb-1.5">
                Apartment / Villa Number (Gated Enclave) *
              </label>
              <div className="relative">
                <Home className="w-4 h-4 text-[#8A847A] absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={gatedCommunityUnit}
                  onChange={(e) => setGatedCommunityUnit(e.target.value)}
                  placeholder="e.g. Villa 18, Palm Grove or Tower B - 402"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#E0DBD1] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3D2B] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F3D2B] uppercase tracking-wider mb-1.5">
                Full Delivery Address & Landmark *
              </label>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Palm Grove Residency, Near South Clubhouse Gate"
                className="w-full p-3 text-sm bg-[#FAF8F5] border border-[#E0DBD1] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3D2B] transition-all"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                size="lg"
                variant="primary"
                className="w-full"
                isLoading={loading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Complete Registration
              </Button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-[#F0EBE1] text-center text-xs text-[#6E695F]">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('/login')}
            className="font-bold text-[#1F3D2B] hover:underline cursor-pointer"
          >
            Sign In here
          </button>
        </div>
      </Card>
    </div>
  );
};
