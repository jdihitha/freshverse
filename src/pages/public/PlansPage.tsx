import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, Sparkles, Sliders, ShieldCheck } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

interface PlansPageProps {
  onNavigate: (path: string) => void;
}

export const PlansPage: React.FC<PlansPageProps> = ({ onNavigate }) => {
  const { plans, changeSubscriptionPlan } = useData();
  const { isAuthenticated } = useAuth();
  const [selectedPlanId, setSelectedPlanId] = useState<string>(plans[1]?.id || plans[0]?.id);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    changeSubscriptionPlan(planId);
    if (isAuthenticated) {
      onNavigate('/customer/basket');
    } else {
      onNavigate('/register');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="sage">Flexible Farm-Fresh Memberships</Badge>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1F3D2B]">
          Choose the harvest basket that fits your home
        </h1>
        <p className="text-sm sm:text-base text-[#2E2E2E]/70 leading-relaxed">
          Every basket includes seasonal variety, free gated community delivery, and the flexibility to swap produce, pause, or skip deliveries anytime.
        </p>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const isSelected = selectedPlanId === plan.id;
          return (
            <Card
              key={plan.id}
              className={`relative flex flex-col justify-between transition-all duration-200 ${
                plan.isPopular
                  ? 'border-2 border-[#C6A969] shadow-xl ring-4 ring-[#C6A969]/10'
                  : 'hover:border-[#C6A969]/50'
              }`}
              padding="lg"
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge variant="gold" size="md">Most Popular Choice</Badge>
                </div>
              )}

              <div className="space-y-6 text-left">
                <div className="h-48 rounded-xl overflow-hidden bg-[#EAE5DC] relative">
                  <img
                    src={plan.imageUrl}
                    alt={plan.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-semibold text-[#1F3D2B]">
                    {plan.idealFor}
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#1F3D2B]">{plan.name}</h3>
                  <p className="text-xs text-[#8A847A] mt-1">{plan.tagLine}</p>
                </div>

                <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E3DA] flex items-baseline justify-between">
                  <div>
                    <span className="font-serif text-3xl font-bold text-[#1F3D2B]">₹{plan.price}</span>
                    <span className="text-xs text-[#6E695F] block">Per {plan.frequency.toLowerCase()} delivery</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#1F3D2B] block">{plan.basketSizeWeight}</span>
                    <span className="text-[11px] text-[#8A847A]">{plan.itemCount} Fresh Items</span>
                  </div>
                </div>

                <p className="text-xs text-[#2E2E2E]/80 leading-relaxed">{plan.description}</p>

                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1F3D2B] block">
                    What's included in this plan:
                  </span>
                  <ul className="space-y-2.5 text-xs text-[#2E2E2E]/80">
                    <li className="flex items-center gap-2 text-[#1F3D2B] font-medium">
                      <Sliders className="w-4 h-4 text-[#8C6D23] shrink-0" />
                      <span>Up to <strong>{plan.maxSwapsAllowed} custom vegetable swaps</strong> per cycle</span>
                    </li>
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#1F3D2B] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <Button
                  variant={plan.isPopular ? 'primary' : 'outline'}
                  size="lg"
                  className="w-full"
                  onClick={() => handleSelectPlan(plan.id)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Choose {plan.name}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Community FAQ / Policy Callout */}
      <div className="bg-[#FAF8F5] p-8 sm:p-10 rounded-3xl border border-[#E8E3DA] grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <div className="space-y-2">
          <div className="w-8 h-8 rounded-lg bg-[#1F3D2B]/10 text-[#1F3D2B] flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <h4 className="font-serif text-sm font-bold text-[#1F3D2B]">Free Community Logistics</h4>
          <p className="text-xs text-[#2E2E2E]/70">
            Because our delivery vans batch drop for your gated enclave, there are zero delivery surcharges.
          </p>
        </div>

        <div className="space-y-2">
          <div className="w-8 h-8 rounded-lg bg-[#A7C4A0]/30 text-[#1F3D2B] flex items-center justify-center font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="font-serif text-sm font-bold text-[#1F3D2B]">No Lock-In Contract</h4>
          <p className="text-xs text-[#2E2E2E]/70">
            Pause, modify your basket, or cancel anytime before the Friday 8:00 PM packing cutoff.
          </p>
        </div>

        <div className="space-y-2">
          <div className="w-8 h-8 rounded-lg bg-[#C6A969]/20 text-[#7C6328] flex items-center justify-center font-bold">
            <Sliders className="w-4 h-4" />
          </div>
          <h4 className="font-serif text-sm font-bold text-[#1F3D2B]">Custom Extras</h4>
          <p className="text-xs text-[#2E2E2E]/70">
            Add specialty items like hydroponic microgreens, fresh button mushrooms, or extra cherry tomatoes on the go.
          </p>
        </div>
      </div>
    </div>
  );
};
