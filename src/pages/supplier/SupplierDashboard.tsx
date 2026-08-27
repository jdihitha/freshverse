import React, { useState } from 'react';
import { 
  Sprout, 
  CheckCircle2, 
  Star, 
  MapPin, 
  Truck, 
  Calendar, 
  Award, 
  Sparkles,
  TrendingUp,
  Layers
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const SupplierDashboard: React.FC = () => {
  const { suppliers, inventory, ratings } = useData();
  const { currentUser } = useAuth();

  const [harvestDispatched, setHarvestDispatched] = useState<Record<string, boolean>>({
    'inv-1': true,
    'inv-2': true
  });
  const [successBanner, setSuccessBanner] = useState('');

  const currentSupplier = suppliers[0]; // Kisan Valley Organic Farm

  const supplierCrops = inventory.filter(i => i.supplierId === currentSupplier.id);

  const toggleDispatch = (id: string, name: string) => {
    setHarvestDispatched(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    setSuccessBanner(`${name} marked as harvested and loaded onto dawn refrigerated shuttle.`);
    setTimeout(() => setSuccessBanner(''), 3500);
  };

  return (
    <div className="space-y-8 text-left max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl font-bold text-[#1F3D2B]">
              Organic Grower Portal
            </h1>
            <Badge variant="gold">Certified Organic Partner</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#2E2E2E]/70 mt-1">
            {currentSupplier.farmName} • {currentSupplier.location} • Lead Grower: {currentSupplier.name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="sage" size="md">
            Sunrise Harvest: 5:30 AM
          </Badge>
        </div>
      </div>

      {successBanner && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Farm Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="space-y-2" padding="md">
          <span className="text-xs font-bold text-[#8A847A] uppercase tracking-wider">
            Subscribed Harvest Demand
          </span>
          <p className="font-serif text-2xl font-bold text-[#1F3D2B]">340 Kg</p>
          <p className="text-[11px] text-[#6E695F]">For Palm Grove Enclave run</p>
        </Card>

        <Card className="space-y-2" padding="md">
          <span className="text-xs font-bold text-[#8A847A] uppercase tracking-wider">
            Community Quality Rating
          </span>
          <p className="font-serif text-2xl font-bold text-[#1F3D2B] flex items-center gap-1.5">
            <Star className="w-6 h-6 fill-[#C6A969] text-[#C6A969]" />
            <span>4.9 / 5.0</span>
          </p>
          <p className="text-[11px] text-[#4B6B48] font-medium">98% positive reviews</p>
        </Card>

        <Card className="space-y-2" padding="md">
          <span className="text-xs font-bold text-[#8A847A] uppercase tracking-wider">
            Soil & Quality Certifications
          </span>
          <p className="font-serif text-lg font-bold text-[#1F3D2B]">{currentSupplier.certification}</p>
          <p className="text-[11px] text-[#6E695F]">Zero chemical pesticide audit passed</p>
        </Card>
      </div>

      {/* Main Grid: Crop Harvest Orders & Customer Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col (8 cols): Harvest Dispatch Sheet */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-[#1F3D2B]">
              This Week's Harvest Allocations
            </h2>
            <span className="text-xs text-[#8A847A]">Cutoff: Friday 10:00 PM</span>
          </div>

          <div className="space-y-3">
            {supplierCrops.map((crop) => {
              const isDispatched = !!harvestDispatched[crop.id];
              return (
                <Card
                  key={crop.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  padding="md"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={crop.imageUrl}
                      alt={crop.name}
                      className="w-14 h-14 rounded-xl object-cover border border-[#E0DBD1]"
                    />
                    <div className="space-y-0.5 text-xs">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-[#1F3D2B]">{crop.name}</h3>
                        <Badge variant="sage" size="sm">{crop.freshnessGrade}</Badge>
                      </div>
                      <p className="text-[#6E695F]">
                        Target: <strong>{crop.stockAvailableKg * 2} {crop.unit}</strong> • Rate: ₹{crop.pricePerUnit}/{crop.unit}
                      </p>
                      <p className="text-[11px] text-[#8A847A]">
                        Category: {crop.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant={isDispatched ? 'secondary' : 'primary'}
                      size="sm"
                      onClick={() => toggleDispatch(crop.id, crop.name)}
                      leftIcon={isDispatched ? <CheckCircle2 className="w-4 h-4 text-[#4B6B48]" /> : <Truck className="w-4 h-4" />}
                    >
                      {isDispatched ? 'Harvest Dispatched' : 'Mark Dispatched'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right Col (4 cols): Subscriber Praise & Quality Feedback */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#1F3D2B]">
            Resident Feedback
          </h2>

          <div className="space-y-3">
            {ratings.slice(0, 3).map((r) => (
              <Card key={r.id} className="space-y-2 text-xs" padding="md">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1F3D2B]">{r.customerName}</span>
                  <div className="flex items-center gap-1 text-[#C6A969] font-bold">
                    <Star className="w-3.5 h-3.5 fill-[#C6A969]" />
                    <span>{r.freshnessScore}.0</span>
                  </div>
                </div>
                <p className="text-[#555] italic">"{r.comment}"</p>
                {r.tags && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {r.tags.map((t, idx) => (
                      <span key={idx} className="bg-[#FAF8F5] border border-[#E8E3DA] text-[9px] px-1.5 py-0.5 rounded text-[#4B6B48] font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
