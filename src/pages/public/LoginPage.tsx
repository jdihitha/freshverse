import React, { useState } from 'react';
import { Sprout, Lock, Mail, ArrowRight, Shield, User, Package, Truck, Tractor, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, demoUsers, switchRole } = useAuth();
  const [email, setEmail] = useState('aarav.sharma@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getDashboardPath = (role: UserRole) => {
    switch (role) {
      case 'admin': return '/admin/dashboard';
      case 'packing': return '/packing/dashboard';
      case 'delivery': return '/delivery/dashboard';
      case 'supplier': return '/supplier/dashboard';
      case 'customer':
      default:
        return '/customer/dashboard';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        // Find role of logging in user
        const matched = demoUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
        const role = matched ? matched.role : 'customer';
        onNavigate(getDashboardPath(role));
      } else {
        setError(res.error || 'Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRoleLogin = (role: UserRole) => {
    const user = demoUsers.find(u => u.role === role);
    if (user) {
      setEmail(user.email);
      switchRole(role);
      onNavigate(getDashboardPath(role));
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

      {/* 1-Click Role Switcher Demo Cards */}
      <Card className="text-left space-y-3 bg-[#FAF8F5] border border-[#DDD7CC]" padding="md">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C6D23]">
            Instant Role Test (Phase 1 MVP)
          </span>
          <Badge variant="sage" size="sm">5 Roles Available</Badge>
        </div>
        <p className="text-xs text-[#6E695F]">
          Click any role below to immediately enter its dedicated dashboard:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleQuickRoleLogin('customer')}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-white hover:bg-[#1F3D2B] hover:text-white text-[#1F3D2B] border border-[#E0DBD1] text-xs font-semibold transition-all cursor-pointer shadow-2xs"
          >
            <User className="w-4 h-4 text-[#8C6D23]" />
            <span>Resident</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickRoleLogin('admin')}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-white hover:bg-[#1F3D2B] hover:text-white text-[#1F3D2B] border border-[#E0DBD1] text-xs font-semibold transition-all cursor-pointer shadow-2xs"
          >
            <Shield className="w-4 h-4 text-[#8C6D23]" />
            <span>Admin</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickRoleLogin('packing')}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-white hover:bg-[#1F3D2B] hover:text-white text-[#1F3D2B] border border-[#E0DBD1] text-xs font-semibold transition-all cursor-pointer shadow-2xs"
          >
            <Package className="w-4 h-4 text-[#8C6D23]" />
            <span>Packing</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickRoleLogin('delivery')}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-white hover:bg-[#1F3D2B] hover:text-white text-[#1F3D2B] border border-[#E0DBD1] text-xs font-semibold transition-all cursor-pointer shadow-2xs"
          >
            <Truck className="w-4 h-4 text-[#8C6D23]" />
            <span>Delivery</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickRoleLogin('supplier')}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-white hover:bg-[#1F3D2B] hover:text-white text-[#1F3D2B] border border-[#E0DBD1] text-xs font-semibold transition-all cursor-pointer shadow-2xs sm:col-span-2"
          >
            <Tractor className="w-4 h-4 text-[#8C6D23]" />
            <span>Organic Supplier (Farmer)</span>
          </button>
        </div>
      </Card>

      {/* Main Login Form */}
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
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8A847A] absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#E0DBD1] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3D2B] transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[#1F3D2B] uppercase tracking-wider">
                Password
              </label>
              <span className="text-xs text-[#8A847A]">Any password for demo</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8A847A] absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#E0DBD1] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3D2B] transition-all"
              />
            </div>
          </div>

          <Button
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

        <div className="mt-6 pt-6 border-t border-[#F0EBE1] text-center text-xs text-[#6E695F]">
          New to FreshVerse in your community?{' '}
          <button
            onClick={() => onNavigate('/register')}
            className="font-bold text-[#1F3D2B] hover:underline cursor-pointer"
          >
            Create Resident Subscription
          </button>
        </div>
      </Card>
    </div>
  );
};
