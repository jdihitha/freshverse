import React, { useState } from 'react';
import { User, Mail, Phone, Home, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const ProfilePage: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  const [name, setName] = useState(currentUser?.name || 'Aarav Sharma');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [gatedUnit, setGatedUnit] = useState(currentUser?.gatedCommunityUnit || 'Villa 42, Palm Grove');
  const [address, setAddress] = useState(currentUser?.address || 'Palm Grove Residency, Phase 1, Gate 2');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      phone,
      gatedCommunityUnit: gatedUnit,
      address
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8 text-left max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#1F3D2B]">
          Resident Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#2E2E2E]/70 mt-1">
          Manage your gated community resident profile, primary phone, and doorstep delivery notes.
        </p>
      </div>

      <Card className="space-y-6" padding="lg">
        <div className="flex items-center gap-4 pb-4 border-b border-[#F0EBE1]">
          <div className="w-16 h-16 rounded-2xl bg-[#1F3D2B] text-[#A7C4A0] flex items-center justify-center font-bold font-serif text-2xl">
            {currentUser?.name ? currentUser.name.charAt(0) : 'R'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl font-bold text-[#1F3D2B]">{currentUser?.name}</h2>
              <Badge variant="gold" size="sm">Phase 1 Resident</Badge>
            </div>
            <p className="text-xs text-[#8A847A]">{currentUser?.email}</p>
          </div>
        </div>

        {isSaved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Profile and delivery address updated successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#1F3D2B] uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8A847A] absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E0DBD1] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3D2B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#1F3D2B] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8A847A] absolute left-3.5 top-3" />
                <input
                  type="email"
                  disabled
                  value={currentUser?.email || ''}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F0EBE1]/60 border border-[#E0DBD1] rounded-xl text-[#777]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#1F3D2B] uppercase tracking-wider mb-1.5">
                Contact Phone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#8A847A] absolute left-3.5 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E0DBD1] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3D2B]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#1F3D2B] uppercase tracking-wider mb-1.5">
              Apartment / Villa Number (In Gated Community)
            </label>
            <div className="relative">
              <Home className="w-4 h-4 text-[#8A847A] absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={gatedUnit}
                onChange={(e) => setGatedUnit(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E0DBD1] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3D2B]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#1F3D2B] uppercase tracking-wider mb-1.5">
              Full Residential Address & Porch Drop Details
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#8A847A] absolute left-3.5 top-3" />
              <textarea
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E0DBD1] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3D2B]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
