import React from 'react';
import { Sprout, MapPin, Award, Star, HeartHandshake } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = () => {
  const { suppliers } = useData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Story Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <Badge variant="sage">Our Philosophy & Origins</Badge>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1F3D2B]">
          Rooted in respect for soil, farmers, and family meals
        </h1>
        <p className="text-sm sm:text-base text-[#2E2E2E]/80 leading-relaxed">
          FreshVerse was founded with a single mission: bring back the vibrant flavor, fragrance, and nutritional density of vegetables that are eaten within hours of leaving the earth.
        </p>
      </div>

      {/* Hero Image Collage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl overflow-hidden h-72 shadow-md">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80"
            alt="Organic lush field"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="rounded-2xl overflow-hidden h-72 shadow-md">
          <img
            src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80"
            alt="Freshly harvested spinach"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="rounded-2xl overflow-hidden h-72 shadow-md">
          <img
            src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=600&auto=format&fit=crop&q=80"
            alt="Farmer in organic farm"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Partner Farms Section */}
      <div className="space-y-8">
        <div className="text-left space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8C6D23]">
            Verified Sourcing Network
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#1F3D2B]">
            Meet our certified organic partner growers
          </h2>
          <p className="text-xs sm:text-sm text-[#2E2E2E]/70">
            We partner with regional family growers practicing regenerative, chemical-free agriculture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {suppliers.map((supplier) => (
            <Card key={supplier.id} className="text-left space-y-4" padding="lg">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#1F3D2B]/10 text-[#1F3D2B] flex items-center justify-center font-bold">
                  <Sprout className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-[#1F3D2B] bg-[#FAF8F5] px-2.5 py-1 rounded-full border border-[#E8E3DA]">
                  <Star className="w-3.5 h-3.5 fill-[#C6A969] text-[#C6A969]" />
                  <span>{supplier.rating}</span>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-[#1F3D2B]">{supplier.farmName}</h3>
                <p className="text-xs text-[#8A847A] flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" /> {supplier.location}
                </p>
              </div>

              <div className="pt-2 border-t border-[#F0EBE1] space-y-2 text-xs text-[#2E2E2E]/80">
                <div className="flex items-center gap-1.5 text-[#1F3D2B] font-semibold">
                  <Award className="w-4 h-4 text-[#8C6D23]" />
                  <span>{supplier.certification}</span>
                </div>
                <p className="text-[#6E695F]">
                  Grower: <span className="font-medium text-[#2E2E2E]">{supplier.name}</span>
                </p>
                <p className="text-[#6E695F]">
                  Active Seasonal Crops: <span className="font-medium text-[#2E2E2E]">{supplier.activeCropsCount} Varieties</span>
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
