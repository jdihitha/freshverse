import React from 'react';
import { 
  Tractor, 
  Sparkles, 
  PackageCheck, 
  Truck, 
  ShieldCheck, 
  CalendarClock, 
  ArrowRight,
  SunMedium
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

interface HowItWorksPageProps {
  onNavigate: (path: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 sm:space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
        <Badge variant="sage">Farm to Table Transparency</Badge>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1F3D2B]">
          How FreshVerse brings the harvest home
        </h1>
        <p className="text-sm sm:text-base text-[#2E2E2E]/70 leading-relaxed">
          Traditional retail vegetables sit in cold storage trucks and wholesale markets for 4 to 7 days before reaching your kitchen. Here is how FreshVerse rewires the system.
        </p>
      </div>

      {/* 4 Deep Workflow Steps */}
      <div className="space-y-6 sm:space-y-10">
        {/* Step 1 */}
        <Card className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center text-left" padding="lg">
          <div className="md:col-span-5 rounded-xl sm:rounded-2xl overflow-hidden h-48 sm:h-64 bg-[#EAE5DC]">
            <img
              src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80"
              alt="Harvesting fresh vegetables"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:col-span-7 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1F3D2B] text-white flex items-center justify-center font-serif font-bold text-sm shrink-0">
                1
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D23]">
                Plan & Customization Window
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1F3D2B]">
              Choose your weekly baseline & swap items
            </h3>
            <p className="text-xs sm:text-sm text-[#2E2E2E]/80 leading-relaxed">
              Every Tuesday, you receive a preview notification of the upcoming weekend harvest. You can customize your basket, swap up to 4 items based on your recipe plans, or add specialty extras like button mushrooms and Italian herbs.
            </p>
            <div className="flex items-center gap-4 text-xs text-[#1F3D2B] font-semibold pt-1">
              <span className="flex items-center gap-1.5"><CalendarClock className="w-4 h-4 text-[#C6A969]" /> Cutoff: Friday 8:00 PM</span>
            </div>
          </div>
        </Card>

        {/* Step 2 */}
        <Card className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center text-left" padding="lg">
          <div className="md:col-span-7 space-y-3 sm:space-y-4 order-2 md:order-1">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1F3D2B] text-white flex items-center justify-center font-serif font-bold text-sm shrink-0">
                2
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D23]">
                Sunrise Harvest & Sorting
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1F3D2B]">
              Harvested only on demand directly by farmers
            </h3>
            <p className="text-xs sm:text-sm text-[#2E2E2E]/80 leading-relaxed">
              Our partner farmers harvest crops at dawn (5:30 AM). Because our harvest quantities match exact active subscriber baskets, zero food is wasted, and crops retain peak vitamins, crispness, and natural sugars.
            </p>
            <div className="flex items-center gap-4 text-xs text-[#1F3D2B] font-semibold pt-1">
              <span className="flex items-center gap-1.5"><SunMedium className="w-4 h-4 text-[#C6A969]" /> Zero chemical preservatives or waxes</span>
            </div>
          </div>
          <div className="md:col-span-5 rounded-xl sm:rounded-2xl overflow-hidden h-48 sm:h-64 bg-[#EAE5DC] order-1 md:order-2">
            <img
              src="https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80"
              alt="Hand sorted vegetables"
              className="w-full h-full object-cover"
            />
          </div>
        </Card>

        {/* Step 3 */}
        <Card className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center text-left" padding="lg">
          <div className="md:col-span-5 rounded-xl sm:rounded-2xl overflow-hidden h-48 sm:h-64 bg-[#EAE5DC]">
            <img
              src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80"
              alt="Careful clean packaging"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:col-span-7 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1F3D2B] text-white flex items-center justify-center font-serif font-bold text-sm shrink-0">
                3
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D23]">
                Hygienic Sorting & Jute Totes
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1F3D2B]">
              Hand-graded and packed into breathable totes
            </h3>
            <p className="text-xs sm:text-sm text-[#2E2E2E]/80 leading-relaxed">
              At our regional packing station, staff inspect every tomato, leafy bunch, and root vegetable. Baskets are assembled in insulated, washable cotton-lined jute bags that protect delicate greens during transit.
            </p>
            <div className="flex items-center gap-4 text-xs text-[#1F3D2B] font-semibold pt-1">
              <span className="flex items-center gap-1.5"><PackageCheck className="w-4 h-4 text-[#C6A969]" /> Individual batch inspection stamp</span>
            </div>
          </div>
        </Card>

        {/* Step 4 */}
        <Card className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center text-left" padding="lg">
          <div className="md:col-span-7 space-y-3 sm:space-y-4 order-2 md:order-1">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#C6A969] text-[#1F3D2B] flex items-center justify-center font-serif font-bold text-sm shrink-0">
                4
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C6D23]">
                Gated Community Morning Delivery
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1F3D2B]">
              Quiet doorstep arrival at 7:00 AM – 9:00 AM
            </h3>
            <p className="text-xs sm:text-sm text-[#2E2E2E]/80 leading-relaxed">
              Our dedicated delivery partners enter your gated enclave during the designated quiet morning slot. Deliveries are left on your porch or handed directly with photo confirmation updated instantly in your app.
            </p>
            <div className="flex items-center gap-4 text-xs text-[#1F3D2B] font-semibold pt-1">
              <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-[#C6A969]" /> Real-time status & photo proof</span>
            </div>
          </div>
          <div className="md:col-span-5 rounded-xl sm:rounded-2xl overflow-hidden h-48 sm:h-64 bg-[#EAE5DC] order-1 md:order-2">
            <img
              src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80"
              alt="Delivered fresh produce"
              className="w-full h-full object-cover"
            />
          </div>
        </Card>
      </div>

      {/* CTA Box */}
      <div className="text-center bg-[#1F3D2B] text-white p-6 sm:p-14 rounded-2xl sm:rounded-3xl space-y-6">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold">Experience the taste of true morning harvest</h2>
        <p className="text-xs sm:text-sm text-[#F4F1EC]/80 max-w-md mx-auto">
          Start your gated community subscription today with zero risk.
        </p>
        <Button
          variant="gold"
          size="lg"
          className="w-full sm:w-auto"
          onClick={() => onNavigate('/plans')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          View Subscription Plans
        </Button>
      </div>
    </div>
  );
};
