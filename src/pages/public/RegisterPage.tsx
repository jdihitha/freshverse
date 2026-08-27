import React, { useState } from 'react';
import { Sprout, User, Mail, Phone, Lock, Home, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

interface RegisterPageProps {
  onNavigate: (path: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [gatedCommunityUnit, setGatedCommunityUnit] = useState('Villa 18, Palm Grove');
  const [address, setAddress] = useState('Palm Grove Residency, Phase 1, Gate 2');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !address) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await register({
        name,
        email,
        phone,
        password,
        address,
        gatedCommunityUnit
      });
      if (res.success) {
        onNavigate('/customer/dashboard');
      }
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
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
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
              Password *
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
              Full Delivery Address & Landmark
            </label>
            <textarea
              rows={2}
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
