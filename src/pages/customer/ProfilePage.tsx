import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Home, MapPin, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const ProfilePage: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [gatedUnit, setGatedUnit] = useState(currentUser?.gatedCommunityUnit || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Keep local form in sync when currentUser loads
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPhone(currentUser.phone || '');
      setGatedUnit(currentUser.gatedCommunityUnit || '');
      setAddress(currentUser.address || '');
    }
  }, [currentUser]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const res = await updateProfile({
        name,
        phone,
        gatedCommunityUnit: gatedUnit,
        address
      });

      if (res && res.error) {
        setError(res.error);
      } else {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3500);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 text-left max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F3D2B]">
          Resident Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#2E2E2E]/70 mt-1">
          Manage your gated community resident profile, contact phone, and doorstep delivery address.
        </p>
      </div>

      <Card className="space-y-6" padding="lg">
        <div className="flex items-center gap-3 sm:gap-4 pb-4 border-b border-[#F0EBE1]">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[#1F3D2B] text-[#A7C4A0] flex items-center justify-center font-bold font-serif text-xl sm:text-2xl shrink-0">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'R'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1F3D2B]">
                {currentUser?.name || 'Resident User'}
              </h2>
              <Badge variant="gold" size="sm">
                {currentUser?.role === 'admin' ? 'Admin' : 'Resident'}
              </Badge>
            </div>
            <p className="text-xs text-[#8A847A]">{currentUser?.email}</p>
          </div>
        </div>

        {isSaved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Profile and delivery address updated successfully in FreshVerse database.</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
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
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F0EBE1]/60 border border-[#E0DBD1] rounded-xl text-[#777] cursor-not-allowed"
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
              className="w-full sm:w-auto justify-center"
              isLoading={isSaving}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
