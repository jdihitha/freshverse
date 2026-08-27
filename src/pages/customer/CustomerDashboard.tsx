import React from 'react';
import { 
  Calendar, 
  ShoppingBag, 
  Truck, 
  AlertCircle, 
  Star, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  PauseCircle, 
  PlayCircle,
  Package,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

interface CustomerDashboardProps {
  onNavigate: (path: string) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { 
    plans, 
    subscription, 
    orders, 
    deliveries, 
    notifications, 
    toggleSkipNextDelivery,
    updateSubscriptionStatus
  } = useData();

  const currentPlan = plans.find(p => p.id === subscription?.planId) || plans[1];
  const activeOrder = orders.find(o => o.status !== 'delivered' && o.status !== 'cancelled') || orders[0];
  const activeDelivery = deliveries.find(d => d.orderId === activeOrder?.id) || deliveries[0];
  const unreadNotifs = notifications.filter(n => n.userId === currentUser?.id && !n.isRead);

  const selectedItems = subscription?.basketCustomization?.selectedItems || [];
  const extraItems = subscription?.basketCustomization?.extraItems || [];
  const swapsUsed = selectedItems.filter(i => i.isSwapped).length;

  return (
    <div className="space-y-8 text-left">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#1F3D2B] to-[#2B543C] text-white p-6 sm:p-8 rounded-3xl shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#A7C4A0] uppercase tracking-wider">
              {currentUser?.gatedCommunityUnit || 'Resident Subscriber'}
            </span>
            <Badge variant="gold" size="sm">Phase 1 Member</Badge>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">
            Welcome back, {currentUser?.name.split(' ')[0]}!
          </h1>
          <p className="text-xs sm:text-sm text-[#F4F1EC]/80 max-w-xl leading-relaxed">
            Your fresh harvest basket is in preparation for the upcoming morning run.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="gold"
            size="md"
            onClick={() => onNavigate('/customer/basket')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Customize Basket
          </Button>
        </div>
      </div>

      {/* Grid of Main Context Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col (8 cols): Current Subscription & Basket Snapshot */}
        <div className="lg:col-span-8 space-y-6">
          {/* Subscription Status Card */}
          <Card className="space-y-5" padding="lg">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0EBE1]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1F3D2B]/10 text-[#1F3D2B] flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#1F3D2B]">
                    {currentPlan.name}
                  </h2>
                  <p className="text-xs text-[#8A847A]">
                    ₹{currentPlan.price} / {currentPlan.frequency.toLowerCase()} • {currentPlan.basketSizeWeight}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {subscription?.status === 'active' ? (
                  <Badge variant="success" dot>Active Subscription</Badge>
                ) : (
                  <Badge variant="warning" dot>Paused</Badge>
                )}
                {subscription?.isSkippedNext && (
                  <Badge variant="danger">Next Delivery Skipped</Badge>
                )}
              </div>
            </div>

            {/* Delivery Date Highlight */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8E3DA]">
              <div>
                <span className="text-[11px] font-bold text-[#8A847A] uppercase tracking-wider block">
                  Next Scheduled Delivery
                </span>
                <p className="font-serif text-lg font-bold text-[#1F3D2B] mt-0.5">
                  {subscription?.nextDeliveryDate ? new Date(subscription.nextDeliveryDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Saturday, Aug 29'}
                </p>
                <span className="text-[11px] text-[#6E695F]">
                  {subscription?.deliverySlot || '7:00 AM - 9:00 AM'}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#8A847A] uppercase tracking-wider block">
                  Customization Window
                </span>
                <p className="text-xs font-bold text-[#8C6D23] mt-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Closes Fri, 8:00 PM
                </p>
                <span className="text-[11px] text-[#6E695F]">
                  {swapsUsed} of {currentPlan.maxSwapsAllowed} swaps utilized
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#8A847A] uppercase tracking-wider block">
                  Quick Controls
                </span>
                <div className="flex gap-2 mt-1.5">
                  <button
                    onClick={toggleSkipNextDelivery}
                    className="text-xs font-semibold px-2.5 py-1 bg-white hover:bg-black/5 rounded-lg border border-[#D8D1C5] text-[#2E2E2E] transition-colors cursor-pointer"
                  >
                    {subscription?.isSkippedNext ? 'Undo Skip' : 'Skip Next'}
                  </button>
                  <button
                    onClick={() => updateSubscriptionStatus(subscription?.status === 'active' ? 'paused' : 'active')}
                    className="text-xs font-semibold px-2.5 py-1 bg-white hover:bg-black/5 rounded-lg border border-[#D8D1C5] text-[#2E2E2E] transition-colors cursor-pointer"
                  >
                    {subscription?.status === 'active' ? 'Pause' : 'Resume'}
                  </button>
                </div>
              </div>
            </div>

            {/* Current Basket Items Snapshot */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif text-sm font-bold text-[#1F3D2B]">
                    Current Curated Basket ({selectedItems.length} items)
                  </h4>
                  {extraItems.length > 0 && (
                    <Badge variant="sage" size="sm">+{extraItems.length} extras</Badge>
                  )}
                </div>
                <button
                  onClick={() => onNavigate('/customer/basket')}
                  className="text-xs font-bold text-[#1F3D2B] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Edit & Swap</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {selectedItems.slice(0, 4).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-white border border-[#E8E3DA] rounded-xl flex items-center gap-2.5 text-left"
                  >
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100&auto=format&fit=crop&q=80'}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#1F3D2B] truncate">{item.name}</p>
                      <p className="text-[10px] text-[#8A847A]">{item.quantity}</p>
                      {item.isSwapped && (
                        <span className="text-[9px] text-[#8C6D23] font-bold block">Swapped</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Active Order & Live Status */}
          {activeOrder && (
            <Card className="space-y-4" padding="lg">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#A7C4A0]/30 text-[#1F3D2B] flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#1F3D2B]">
                      Order #{activeOrder.orderNumber}
                    </h3>
                    <p className="text-xs text-[#8A847A]">
                      Scheduled: {activeOrder.scheduledDeliveryDate} ({activeOrder.deliverySlot})
                    </p>
                  </div>
                </div>

                <Badge
                  variant={
                    activeOrder.status === 'out_for_delivery'
                      ? 'warning'
                      : activeOrder.status === 'delivered'
                      ? 'success'
                      : 'sage'
                  }
                  size="md"
                  dot
                >
                  {activeOrder.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E8E3DA]">
                <div>
                  <span className="text-[#8A847A]">Delivering to:</span>
                  <p className="font-semibold text-[#1F3D2B]">{activeOrder.gatedCommunityUnit}</p>
                </div>
                {activeDelivery?.deliveryPartnerName && (
                  <div>
                    <span className="text-[#8A847A]">Delivery Partner:</span>
                    <p className="font-semibold text-[#1F3D2B]">{activeDelivery.deliveryPartnerName} (EV Van)</p>
                  </div>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onNavigate('/customer/delivery')}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Track Live Progress
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Right Col (4 cols): Quick Actions & Community Notifications */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions Grid */}
          <Card className="space-y-4" padding="lg">
            <h3 className="font-serif text-base font-bold text-[#1F3D2B] pb-2 border-b border-[#F0EBE1]">
              Quick Actions
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => onNavigate('/customer/subscription')}
                className="p-3 text-left bg-[#FAF8F5] hover:bg-[#1F3D2B] hover:text-white rounded-xl border border-[#E8E3DA] transition-all group cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#8C6D23] group-hover:text-[#A7C4A0] mb-2" />
                <span className="text-xs font-bold block leading-tight">Manage Plan</span>
                <span className="text-[10px] text-[#7A756D] group-hover:text-white/70">Pause / Skip</span>
              </button>

              <button
                onClick={() => onNavigate('/customer/basket')}
                className="p-3 text-left bg-[#FAF8F5] hover:bg-[#1F3D2B] hover:text-white rounded-xl border border-[#E8E3DA] transition-all group cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#8C6D23] group-hover:text-[#A7C4A0] mb-2" />
                <span className="text-xs font-bold block leading-tight">View Basket</span>
                <span className="text-[10px] text-[#7A756D] group-hover:text-white/70">Swap veggies</span>
              </button>

              <button
                onClick={() => onNavigate('/customer/orders')}
                className="p-3 text-left bg-[#FAF8F5] hover:bg-[#1F3D2B] hover:text-white rounded-xl border border-[#E8E3DA] transition-all group cursor-pointer"
              >
                <Package className="w-4 h-4 text-[#8C6D23] group-hover:text-[#A7C4A0] mb-2" />
                <span className="text-xs font-bold block leading-tight">Past Orders</span>
                <span className="text-[10px] text-[#7A756D] group-hover:text-white/70">Receipts & log</span>
              </button>

              <button
                onClick={() => onNavigate('/customer/delivery')}
                className="p-3 text-left bg-[#FAF8F5] hover:bg-[#1F3D2B] hover:text-white rounded-xl border border-[#E8E3DA] transition-all group cursor-pointer"
              >
                <Truck className="w-4 h-4 text-[#8C6D23] group-hover:text-[#A7C4A0] mb-2" />
                <span className="text-xs font-bold block leading-tight">Track Delivery</span>
                <span className="text-[10px] text-[#7A756D] group-hover:text-white/70">Live timeline</span>
              </button>

              <button
                onClick={() => onNavigate('/customer/complaints')}
                className="p-3 text-left bg-[#FAF8F5] hover:bg-[#1F3D2B] hover:text-white rounded-xl border border-[#E8E3DA] transition-all group cursor-pointer"
              >
                <AlertCircle className="w-4 h-4 text-[#8C6D23] group-hover:text-[#A7C4A0] mb-2" />
                <span className="text-xs font-bold block leading-tight">Report Issue</span>
                <span className="text-[10px] text-[#7A756D] group-hover:text-white/70">Freshness claim</span>
              </button>

              <button
                onClick={() => onNavigate('/customer/ratings')}
                className="p-3 text-left bg-[#FAF8F5] hover:bg-[#1F3D2B] hover:text-white rounded-xl border border-[#E8E3DA] transition-all group cursor-pointer"
              >
                <Star className="w-4 h-4 text-[#8C6D23] group-hover:text-[#A7C4A0] mb-2" />
                <span className="text-xs font-bold block leading-tight">Rate Harvest</span>
                <span className="text-[10px] text-[#7A756D] group-hover:text-white/70">Give feedback</span>
              </button>
            </div>
          </Card>

          {/* Recent Community Notifications */}
          <Card className="space-y-4" padding="lg">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE1]">
              <h3 className="font-serif text-base font-bold text-[#1F3D2B]">
                Recent Updates
              </h3>
              {unreadNotifs.length > 0 && (
                <Badge variant="warning" size="sm">{unreadNotifs.length} new</Badge>
              )}
            </div>

            <div className="space-y-3 divide-y divide-[#F4F1EC]">
              {notifications.slice(0, 3).map((n) => (
                <div key={n.id} className="pt-2 first:pt-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-[#1F3D2B]">{n.title}</p>
                    <span className="text-[10px] text-[#8A847A]">
                      {new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-xs text-[#555] leading-relaxed line-clamp-2">{n.message}</p>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={() => onNavigate('/customer/notifications')}
            >
              View All Notifications
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
