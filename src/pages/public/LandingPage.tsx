import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Calendar, 
  Truck, 
  ShieldCheck, 
  Repeat, 
  SlidersHorizontal,
  PackageCheck,
  Star
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { plans, inventory } = useData();

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="pt-8 sm:pt-14 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1F3D2B]/10 text-[#1F3D2B] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#8C6D23]" />
              <span>Phase 1 Gated Community Subscription Service</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1F3D2B] leading-[1.12]">
              Fresh vegetables, <br />
              <span className="italic font-normal text-[#C6A969]">delivered your way.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#2E2E2E]/80 max-w-xl leading-relaxed">
              Curated fresh vegetable baskets, delivered to your doorstep through a simple and flexible subscription. Harvested at dawn from certified organic farms, hand-graded, and brought quietly to your residence.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                size="lg"
                variant="primary"
                onClick={() => onNavigate('/plans')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Explore Plans
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate('/how-it-works')}
              >
                How It Works
              </Button>
            </div>

            {/* Micro proof tags */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-[#E8E3DA] max-w-lg">
              <div>
                <p className="font-serif text-xl font-bold text-[#1F3D2B]">50+</p>
                <p className="text-[11px] text-[#6E695F] mt-0.5">Enclave Subscribers</p>
              </div>
              <div>
                <p className="font-serif text-xl font-bold text-[#1F3D2B]">&lt; 12 hrs</p>
                <p className="text-[11px] text-[#6E695F] mt-0.5">Farm-to-Door Time</p>
              </div>
              <div>
                <p className="font-serif text-xl font-bold text-[#1F3D2B]">4.9 / 5.0</p>
                <p className="text-[11px] text-[#6E695F] mt-0.5">Freshness Rating</p>
              </div>
            </div>
          </div>

          {/* Right Visual Produce Feature */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#E0DBD1] bg-white group">
              <img
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80"
                alt="Curated fresh organic vegetable basket"
                className="w-full h-[440px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1F3D2B]/90 via-[#1F3D2B]/20 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="warning" size="sm">This Week's Curated Batch</Badge>
                  <span className="text-xs text-[#F4F1EC]/80 font-medium">Sat 7:00 AM Dispatch</span>
                </div>
                <h3 className="font-serif text-xl font-bold">The Family Gourmet Harvest</h3>
                <p className="text-xs text-[#F4F1EC]/80 line-clamp-2">
                  14 varieties including crisp spinach, hydroponic butterhead lettuce, fresh broccoli crowns, and golden potatoes.
                </p>
              </div>
            </div>

            {/* Floating Quality Stamp */}
            <div className="absolute -top-4 -right-4 bg-white p-3.5 rounded-2xl shadow-lg border border-[#E8E3DA] hidden sm:flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#A7C4A0]/30 text-[#1F3D2B] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#1F3D2B]">Zero Cold Storage</p>
                <p className="text-[10px] text-[#6E695F]">Harvested on demand</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why FreshVerse Section */}
      <section className="px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8C6D23]">
              The FreshVerse Difference
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F3D2B]">
              Why our gated community chooses us
            </h2>
            <p className="text-sm text-[#2E2E2E]/70 leading-relaxed">
              We built FreshVerse specifically to eliminate the stress of crowded grocery runs and sub-par marketplace veggies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-left space-y-3 transition-transform hover:-translate-y-1 duration-200">
              <div className="w-12 h-12 rounded-xl bg-[#1F3D2B]/10 text-[#1F3D2B] flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1F3D2B]">Fresh & Curated</h3>
              <p className="text-xs text-[#2E2E2E]/70 leading-relaxed">
                Expertly curated seasonal selections of vegetables harvested only after you subscribe, ensuring zero stale stock.
              </p>
            </Card>

            <Card className="text-left space-y-3 transition-transform hover:-translate-y-1 duration-200">
              <div className="w-12 h-12 rounded-xl bg-[#A7C4A0]/30 text-[#1F3D2B] flex items-center justify-center">
                <Repeat className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1F3D2B]">Flexible Subscription</h3>
              <p className="text-xs text-[#2E2E2E]/70 leading-relaxed">
                Traveling or have leftover produce? Pause for a week, skip a delivery, or swap vegetables with a single click.
              </p>
            </Card>

            <Card className="text-left space-y-3 transition-transform hover:-translate-y-1 duration-200">
              <div className="w-12 h-12 rounded-xl bg-[#C6A969]/20 text-[#7C6328] flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1F3D2B]">Doorstep Delivery</h3>
              <p className="text-xs text-[#2E2E2E]/70 leading-relaxed">
                Silent morning drop-offs directly to your villa porch or apartment entrance without disturbing your quiet mornings.
              </p>
            </Card>

            <Card className="text-left space-y-3 transition-transform hover:-translate-y-1 duration-200">
              <div className="w-12 h-12 rounded-xl bg-[#1F3D2B]/10 text-[#1F3D2B] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1F3D2B]">Quality Focused</h3>
              <p className="text-xs text-[#2E2E2E]/70 leading-relaxed">
                Every basket undergoes two-stage manual inspection and ozonated rinsing. If you ever find a flaw, we replace it instantly.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 sm:px-6 bg-[#FAF8F5] py-16 border-y border-[#E8E3DA]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8C6D23]">
              Simple Four-Step Workflow
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F3D2B]">
              How FreshVerse Works
            </h2>
            <p className="text-sm text-[#2E2E2E]/70">
              From local organic farm soil straight to your kitchen cutting board in 4 seamless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="text-left space-y-3 bg-white p-6 rounded-2xl border border-[#E0DBD1] shadow-xs">
              <div className="w-10 h-10 rounded-full bg-[#1F3D2B] text-white flex items-center justify-center font-serif font-bold text-sm">
                1
              </div>
              <h4 className="font-serif text-base font-bold text-[#1F3D2B]">Choose Your Plan</h4>
              <p className="text-xs text-[#2E2E2E]/70 leading-relaxed">
                Select between Essential, Family Gourmet, or Vitality Greens tailored for your household size and cooking frequency.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-left space-y-3 bg-white p-6 rounded-2xl border border-[#E0DBD1] shadow-xs">
              <div className="w-10 h-10 rounded-full bg-[#1F3D2B] text-white flex items-center justify-center font-serif font-bold text-sm">
                2
              </div>
              <h4 className="font-serif text-base font-bold text-[#1F3D2B]">Customize Your Basket</h4>
              <p className="text-xs text-[#2E2E2E]/70 leading-relaxed">
                Review this week's harvest preview. Swap out items you don't need or add specialty culinary herbs and mushrooms.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-left space-y-3 bg-white p-6 rounded-2xl border border-[#E0DBD1] shadow-xs">
              <div className="w-10 h-10 rounded-full bg-[#1F3D2B] text-white flex items-center justify-center font-serif font-bold text-sm">
                3
              </div>
              <h4 className="font-serif text-base font-bold text-[#1F3D2B]">We Pack Fresh</h4>
              <p className="text-xs text-[#2E2E2E]/70 leading-relaxed">
                Our packing team hand-selects only prime grade-A crops at dawn, packaging them in breathable, insulated cotton totes.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-left space-y-3 bg-white p-6 rounded-2xl border border-[#E0DBD1] shadow-xs">
              <div className="w-10 h-10 rounded-full bg-[#C6A969] text-[#1F3D2B] flex items-center justify-center font-serif font-bold text-sm">
                4
              </div>
              <h4 className="font-serif text-base font-bold text-[#1F3D2B]">Delivered to You</h4>
              <p className="text-xs text-[#2E2E2E]/70 leading-relaxed">
                Receive fresh deliveries at your scheduled morning slot. Get live door delivery updates directly on your app.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Preview (Dynamic from Data) */}
      <section className="px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="text-left space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#8C6D23]">
                Curated Subscription Tiers
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F3D2B]">
                Choose your harvest basket
              </h2>
              <p className="text-sm text-[#2E2E2E]/70">
                All plans include free gated community delivery and flexible pause/skip options.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => onNavigate('/plans')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              View Full Comparison
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative flex flex-col justify-between text-left transition-all duration-200 hover:shadow-lg ${
                  plan.isPopular ? 'border-2 border-[#C6A969] ring-4 ring-[#C6A969]/10' : ''
                }`}
                padding="lg"
              >
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge variant="gold" size="md">Community Favorite</Badge>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="h-44 rounded-xl overflow-hidden bg-[#EAE5DC]">
                    <img
                      src={plan.imageUrl}
                      alt={plan.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#1F3D2B]">{plan.name}</h3>
                    <p className="text-xs text-[#8A847A] mt-0.5">{plan.tagLine}</p>
                  </div>

                  <div className="flex items-baseline gap-1.5 pb-4 border-b border-[#F0EBE1]">
                    <span className="font-serif text-3xl font-bold text-[#1F3D2B]">₹{plan.price}</span>
                    <span className="text-xs text-[#6E695F]">/ {plan.frequency.toLowerCase()} delivery</span>
                  </div>

                  <div className="space-y-2 text-xs text-[#2E2E2E]/80">
                    <p className="font-semibold text-[#1F3D2B]">
                      Includes {plan.itemCount} varieties ({plan.basketSizeWeight})
                    </p>
                    <ul className="space-y-2 pt-1">
                      {plan.features.slice(0, 4).map((feature, i) => (
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
                    className="w-full"
                    onClick={() => onNavigate('/plans')}
                  >
                    Choose {plan.name}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Freshness & Trust Section */}
      <section className="px-4 sm:px-6 bg-[#1F3D2B] text-[#F4F1EC] py-16 rounded-3xl max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6 text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[#A7C4A0]">
              The Freshness Guarantee
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
              Grown by responsible farmers, inspected with hospital-grade care
            </h2>
            <p className="text-sm text-[#F4F1EC]/80 leading-relaxed">
              We eliminate wholesale middlemen. Our harvest schedules are synchronized directly with local family farms in Kanakapura, Sirsi, and Hosur.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#A7C4A0] shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">100% Replacement Guarantee</h4>
                  <p className="text-xs text-[#F4F1EC]/70 mt-0.5">
                    If any vegetable doesn’t meet your kitchen standards, report it with one photo for an instant wallet credit.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#A7C4A0] shrink-0">
                  <PackageCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Eco-friendly Insulated Packaging</h4>
                  <p className="text-xs text-[#F4F1EC]/70 mt-0.5">
                    We deliver in washable jute & breathable cotton tote bags that we sanitize and rotate on every cycle.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&auto=format&fit=crop&q=80"
              alt="Fresh carrots"
              className="rounded-2xl h-48 w-full object-cover shadow-md"
            />
            <img
              src="https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&auto=format&fit=crop&q=80"
              alt="Crisp spinach"
              className="rounded-2xl h-48 w-full object-cover shadow-md mt-6"
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6 bg-[#FAF8F5] p-10 sm:p-14 rounded-3xl border border-[#E8E3DA]">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F3D2B]">
            Ready to make fresh eating easier?
          </h2>
          <p className="text-sm text-[#2E2E2E]/70 max-w-lg mx-auto leading-relaxed">
            Join your neighbors at Palm Grove Residency who receive farm-fresh, chemical-free produce every week.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Button
              size="lg"
              variant="primary"
              onClick={() => onNavigate('/register')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate('/plans')}
            >
              Browse Plans
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
