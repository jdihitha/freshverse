import React, { useState } from 'react';
import { 
  Calendar, 
  PauseCircle, 
  PlayCircle, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

interface SubscriptionPageProps {
  onNavigate: (path: string) => void;
}

export const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ onNavigate }) => {
  const { plans, subscription, updateSubscriptionStatus, toggleSkipNextDelivery } = useData();
  const { currentUser } = useAuth();
  
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [pauseUntilDate, setPauseUntilDate] = useState('2026-09-15');
  const [pauseReason, setPauseReason] = useState('Traveling / On Vacation');

  const currentPlan = plans.find(p => p.id === subscription?.planId) || plans[1];

  const handleConfirmPause = () => {
    updateSubscriptionStatus('paused', pauseUntilDate);
    setIsPauseModalOpen(false);
  };

  const handleResume = () => {
    updateSubscriptionStatus('active');
  };

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1F3D2B]">
            Manage Resident Subscription
          </h1>
          <p className="text-xs sm:text-sm text-[#2E2E2E]/70 mt-1">
            Configure your harvest delivery cadence, pause while traveling, or skip upcoming runs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {subscription?.status === 'active' ? (
            <Badge variant="success" size="md" dot>Subscription Active</Badge>
          ) : (
            <Badge variant="warning" size="md" dot>Subscription Paused</Badge>
          )}
        </div>
      </div>

      {/* Main Active Subscription Card */}
      <Card className="space-y-6" padding="lg">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[#F0EBE1]">
          <div className="flex items-start gap-4">
            <img
              src={currentPlan.imageUrl}
              alt={currentPlan.name}
              className="w-24 h-24 rounded-2xl object-cover border border-[#E8E3DA] shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-2xl font-bold text-[#1F3D2B]">
                  {currentPlan.name}
                </h2>
                <Badge variant="sage" size="sm">{currentPlan.frequency}</Badge>
              </div>
              <p className="text-xs text-[#8A847A]">{currentPlan.tagLine}</p>
              <p className="font-serif text-xl font-bold text-[#1F3D2B] pt-1">
                ₹{currentPlan.price} <span className="text-xs font-normal text-[#6E695F]">/ delivery cycle</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('/plans')}
            >
              Switch Plan Tier
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigate('/customer/basket')}
            >
              Customize Vegetables
            </Button>
          </div>
        </div>

        {/* Cadence & Delivery Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E3DA] space-y-1">
            <span className="text-[11px] font-bold text-[#8A847A] uppercase tracking-wider block">
              Delivery Schedule
            </span>
            <p className="text-sm font-bold text-[#1F3D2B]">
              Every {subscription?.deliveryDayOfWeek || 'Saturday'}
            </p>
            <p className="text-xs text-[#6E695F]">{subscription?.deliverySlot || '7:00 AM - 9:00 AM'}</p>
          </div>

          <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E3DA] space-y-1">
            <span className="text-[11px] font-bold text-[#8A847A] uppercase tracking-wider block">
              Enclave Drop Location
            </span>
            <p className="text-sm font-bold text-[#1F3D2B]">
              {subscription?.gatedCommunityUnit || currentUser?.gatedCommunityUnit}
            </p>
            <p className="text-xs text-[#6E695F] truncate">{subscription?.address}</p>
          </div>

          <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E3DA] space-y-1">
            <span className="text-[11px] font-bold text-[#8A847A] uppercase tracking-wider block">
              Basket Composition
            </span>
            <p className="text-sm font-bold text-[#1F3D2B]">
              {currentPlan.itemCount} Varieties ({currentPlan.basketSizeWeight})
            </p>
            <p className="text-xs text-[#8C6D23] font-medium">Up to {currentPlan.maxSwapsAllowed} item swaps</p>
          </div>
        </div>

        {/* Action Controls Section */}
        <div className="p-5 bg-white border border-[#E8E3DA] rounded-2xl space-y-4">
          <h3 className="font-serif text-base font-bold text-[#1F3D2B]">
            Flexible Subscription Controls
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Skip Next Delivery Card */}
            <div className="p-4 rounded-xl border border-[#E0DBD1] bg-[#FAF8F5] flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#8C6D23]" />
                  <h4 className="text-xs font-bold text-[#1F3D2B]">Skip Next Delivery</h4>
                </div>
                <p className="text-xs text-[#6E695F]">
                  Skip the delivery scheduled for {subscription?.nextDeliveryDate || 'this Saturday'}. You will not be billed for skipped weeks.
                </p>
                {subscription?.isSkippedNext && (
                  <Badge variant="danger" size="sm" className="mt-1">
                    Delivery on {subscription?.nextDeliveryDate} is skipped
                  </Badge>
                )}
              </div>
              <Button
                variant={subscription?.isSkippedNext ? 'secondary' : 'outline'}
                size="sm"
                onClick={toggleSkipNextDelivery}
              >
                {subscription?.isSkippedNext ? 'Resume Delivery' : 'Skip Next'}
              </Button>
            </div>

            {/* Pause Subscription Card */}
            <div className="p-4 rounded-xl border border-[#E0DBD1] bg-[#FAF8F5] flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <PauseCircle className="w-4 h-4 text-[#8C6D23]" />
                  <h4 className="text-xs font-bold text-[#1F3D2B]">Pause Entire Subscription</h4>
                </div>
                <p className="text-xs text-[#6E695F]">
                  Temporarily suspend all deliveries until a specific return date (e.g. vacation).
                </p>
                {subscription?.status === 'paused' && (
                  <p className="text-xs font-bold text-[#7C6328]">
                    Paused until {subscription.pausedUntil || 'further notice'}
                  </p>
                )}
              </div>
              {subscription?.status === 'paused' ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleResume}
                >
                  Resume Now
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPauseModalOpen(true)}
                >
                  Pause Plan
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Subscription Cycles History */}
      <Card className="space-y-4" padding="lg">
        <h3 className="font-serif text-lg font-bold text-[#1F3D2B] pb-2 border-b border-[#F0EBE1]">
          Recent Subscription Cycles & Invoices
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#8A847A] border-b border-[#F0EBE1]">
                <th className="pb-3 font-semibold">Delivery Date</th>
                <th className="pb-3 font-semibold">Plan & Items</th>
                <th className="pb-3 font-semibold">Billed Amount</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F1EC]">
              <tr>
                <td className="py-3 font-bold text-[#1F3D2B]">Aug 26, 2026</td>
                <td className="py-3">Gourmet Family Harvest (14 items + 2 extras)</td>
                <td className="py-3 font-semibold">₹1,314</td>
                <td className="py-3"><Badge variant="warning" size="sm">Out for Delivery</Badge></td>
                <td className="py-3 text-right">
                  <button onClick={() => onNavigate('/customer/delivery')} className="text-[#1F3D2B] font-bold hover:underline cursor-pointer">
                    Track
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-[#1F3D2B]">Aug 19, 2026</td>
                <td className="py-3">Gourmet Family Harvest (14 items)</td>
                <td className="py-3 font-semibold">₹1,199</td>
                <td className="py-3"><Badge variant="success" size="sm">Delivered</Badge></td>
                <td className="py-3 text-right">
                  <button onClick={() => onNavigate('/customer/orders')} className="text-[#1F3D2B] font-bold hover:underline cursor-pointer">
                    View
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-[#1F3D2B]">Aug 12, 2026</td>
                <td className="py-3">Gourmet Family Harvest (14 items)</td>
                <td className="py-3 font-semibold">₹1,199</td>
                <td className="py-3"><Badge variant="success" size="sm">Delivered</Badge></td>
                <td className="py-3 text-right">
                  <button onClick={() => onNavigate('/customer/orders')} className="text-[#1F3D2B] font-bold hover:underline cursor-pointer">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pause Confirmation Modal */}
      <Modal
        isOpen={isPauseModalOpen}
        onClose={() => setIsPauseModalOpen(false)}
        title="Pause Fresh Harvest Deliveries"
        subtitle="You will not be billed while your subscription is paused."
      >
        <div className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-[#1F3D2B] uppercase tracking-wider mb-1.5">
              Resume Deliveries On:
            </label>
            <input
              type="date"
              value={pauseUntilDate}
              onChange={(e) => setPauseUntilDate(e.target.value)}
              className="w-full p-2.5 text-sm bg-[#FAF8F5] border border-[#E0DBD1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F3D2B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1F3D2B] uppercase tracking-wider mb-1.5">
              Reason for Pausing (Optional)
            </label>
            <select
              value={pauseReason}
              onChange={(e) => setPauseReason(e.target.value)}
              className="w-full p-2.5 text-sm bg-[#FAF8F5] border border-[#E0DBD1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F3D2B]"
            >
              <option value="Traveling / On Vacation">Traveling / On Vacation</option>
              <option value="Excess Produce Leftover">Still have leftover produce</option>
              <option value="Dietary Routine Change">Temporary dietary routine change</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-[#F0EBE1]">
            <Button
              variant="outline"
              onClick={() => setIsPauseModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmPause}
            >
              Confirm Pause
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
