import React from 'react';
import { Sprout, ShieldCheck, HeartHandshake, PhoneCall, Mail } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#1F3D2B] text-[#F4F1EC] pt-14 pb-10 border-t border-[#1F3D2B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#A7C4A0] text-[#1F3D2B] flex items-center justify-center font-bold">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                FreshVerse
              </span>
            </div>
            <p className="text-xs text-[#F4F1EC]/70 max-w-sm leading-relaxed">
              Curated, farm-fresh vegetable subscriptions tailored for mindful households. Harvested at sunrise, inspected with care, and delivered to your doorstep.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-[#A7C4A0]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> 100% Quality Inspected
              </span>
              <span className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4" /> Direct Farmer Sourcing
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-xs text-[#F4F1EC]/70">
              <li>
                <button onClick={() => onNavigate('/')} className="hover:text-white transition-colors cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/plans')} className="hover:text-white transition-colors cursor-pointer">
                  Subscription Plans
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/how-it-works')} className="hover:text-white transition-colors cursor-pointer">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition-colors cursor-pointer">
                  Partner Organic Farms
                </button>
              </li>
            </ul>
          </div>

          {/* Resident Support */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white mb-4">Resident Support</h4>
            <ul className="space-y-2.5 text-xs text-[#F4F1EC]/70">
              <li>
                <button onClick={() => onNavigate('/customer/complaints')} className="hover:text-white transition-colors cursor-pointer">
                  Report Quality Issue / Complaints
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/customer/orders')} className="hover:text-white transition-colors cursor-pointer">
                  Track Delivery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/customer/subscription')} className="hover:text-white transition-colors cursor-pointer">
                  Pause / Skip Delivery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/customer/ratings')} className="hover:text-white transition-colors cursor-pointer">
                  Rate Recent Harvest
                </button>
              </li>
            </ul>
          </div>

          {/* Gated Community Helpdesk */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white mb-4">Community Desk</h4>
            <div className="space-y-3 text-xs text-[#F4F1EC]/70">
              <p className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-[#C6A969]" />
                <span>+91 98000 77112 (Concierge)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C6A969]" />
                <span>care@freshverse.farm</span>
              </p>
              <p className="text-[11px] text-[#A7C4A0] pt-1">
                Dispatch Hub: Bay #4, Palm Grove Gate.
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F4F1EC]/50">
          <p>© {new Date().getFullYear()} FreshVerse Technologies Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Terms of Subscription</span>
            <span>Privacy Policy</span>
            <span>Organic Sourcing Standard</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
