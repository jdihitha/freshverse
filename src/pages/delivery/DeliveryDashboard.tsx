import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Phone, 
  Camera, 
  Navigation, 
  ShieldCheck, 
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const DeliveryDashboard: React.FC = () => {
  const { orders, deliveries, updateOrderStatus, addNotification } = useData();
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const [isPhotoCaptured, setIsPhotoCaptured] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const activeOrder = orders.find(o => o.id === selectedOrderId) || orders[0];
  const activeDelivery = deliveries.find(d => d.orderId === activeOrder?.id) || deliveries[0];

  const handleUpdateStatus = (newStatus: 'out_for_delivery' | 'delivered') => {
    if (!activeOrder) return;
    updateOrderStatus(activeOrder.id, newStatus);
    
    if (newStatus === 'delivered') {
      addNotification({
        userId: activeOrder.userId,
        title: `Harvest Basket Delivered! (#${activeOrder.orderNumber})`,
        message: `Your fresh produce basket was placed safely at ${activeOrder.gatedCommunityUnit}.`,
        type: 'delivery'
      });
      setStatusMessage(`Order #${activeOrder.orderNumber} marked as Delivered to ${activeOrder.gatedCommunityUnit}!`);
    } else {
      setStatusMessage(`Order #${activeOrder.orderNumber} status changed to Out for Delivery.`);
    }

    setTimeout(() => setStatusMessage(''), 4000);
  };

  return (
    <div className="space-y-8 text-left max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl font-bold text-[#1F3D2B]">
              Driver Delivery Console
            </h1>
            <Badge variant="gold">Palm Grove Enclave Run #PG-01</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#2E2E2E]/70 mt-1">
            Driver: Vikram Singh • EV Logistics Shuttle #04 • 8 Stops Scheduled
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="sage" size="md">
            Morning Run: 7:00 AM - 9:00 AM
          </Badge>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (5 cols): Route Stops List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-[#1F3D2B]">
              Enclave Route Stops ({orders.length})
            </h2>
            <span className="text-xs text-[#8A847A]">Gate 2 Entry Verified</span>
          </div>

          <div className="space-y-3">
            {orders.map((order, idx) => {
              const isSelected = order.id === selectedOrderId;
              return (
                <div
                  key={order.id}
                  onClick={() => {
                    setSelectedOrderId(order.id);
                    setIsPhotoCaptured(false);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-xs space-y-2 ${
                    isSelected
                      ? 'bg-[#1F3D2B] text-white border-[#1F3D2B] shadow-md'
                      : 'bg-white border-[#E8E3DA] hover:border-[#1F3D2B]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-white/20 text-center font-bold text-[10px] leading-5">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-sm">
                        {order.gatedCommunityUnit}
                      </span>
                    </div>

                    <Badge
                      variant={order.status === 'delivered' ? 'success' : isSelected ? 'gold' : 'warning'}
                      size="sm"
                    >
                      {order.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  <p className={`${isSelected ? 'text-[#F4F1EC]/80' : 'text-[#6E695F]'}`}>
                    Resident: {order.customerName} ({order.customerPhone})
                  </p>

                  <div className="text-[11px] truncate">
                    Note: {order.notes || 'Porch drop'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (7 cols): Active Stop Navigation & Photo Proof */}
        <div className="lg:col-span-7 space-y-6">
          {activeOrder && (
            <Card className="space-y-6" padding="lg">
              <div className="flex items-center justify-between pb-4 border-b border-[#F0EBE1]">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#1F3D2B]">
                    Stop: {activeOrder.gatedCommunityUnit}
                  </h3>
                  <p className="text-xs text-[#8A847A]">{activeOrder.address}</p>
                </div>
                <Badge
                  variant={activeOrder.status === 'delivered' ? 'success' : 'warning'}
                  size="md"
                  dot
                >
                  {activeOrder.status.toUpperCase()}
                </Badge>
              </div>

              {/* Resident info & call button */}
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8E3DA] flex items-center justify-between gap-4 text-xs">
                <div>
                  <span className="text-[#8A847A] block">Recipient:</span>
                  <p className="font-bold text-sm text-[#1F3D2B]">{activeOrder.customerName}</p>
                  <p className="text-[#6E695F]">{activeOrder.customerPhone}</p>
                </div>

                <a
                  href={`tel:${activeOrder.customerPhone}`}
                  className="px-3.5 py-2 bg-white border border-[#D8D1C5] hover:bg-[#1F3D2B] hover:text-white rounded-xl text-xs font-bold text-[#1F3D2B] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-[#8C6D23]" />
                  <span>Call Resident</span>
                </a>
              </div>

              {/* Special instructions */}
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 space-y-1">
                <span className="font-bold block">Delivery Porch Instruction:</span>
                <p>"{activeOrder.notes || 'Please leave in the porch thermal tote basket if doorbell is quiet.'}"</p>
              </div>

              {/* Simulated Doorstep Camera Capture */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#1F3D2B] uppercase tracking-wider block">
                  Proof of Doorstep Drop (Required):
                </span>

                <div className="h-56 rounded-2xl overflow-hidden border border-[#E0DBD1] bg-[#FAF8F5] relative flex items-center justify-center">
                  {isPhotoCaptured || activeOrder.status === 'delivered' ? (
                    <img
                      src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80"
                      alt="Delivery confirmed photo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center space-y-2 p-6">
                      <Camera className="w-10 h-10 text-[#8A847A] mx-auto" />
                      <p className="text-xs text-[#8A847A]">No photo taken yet</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsPhotoCaptured(true)}
                        leftIcon={<Camera className="w-4 h-4" />}
                      >
                        Snap Porch Photo
                      </Button>
                    </div>
                  )}

                  {(isPhotoCaptured || activeOrder.status === 'delivered') && (
                    <div className="absolute bottom-3 left-3 bg-black/70 text-white text-[10px] px-2.5 py-1 rounded-full backdrop-blur-xs">
                      Photo Verified • GPS: Palm Grove Enclave
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleUpdateStatus('out_for_delivery')}
                >
                  Mark En Route
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => handleUpdateStatus('delivered')}
                  leftIcon={<CheckCircle2 className="w-5 h-5" />}
                >
                  Confirm Delivered
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
