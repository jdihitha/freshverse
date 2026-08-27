import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  Package, 
  ChevronRight, 
  Calendar,
  Image as ImageIcon
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Timeline, TimelineStep } from '../../components/common/Timeline';

interface DeliveryTrackingPageProps {
  onNavigate: (path: string) => void;
}

export const DeliveryTrackingPage: React.FC<DeliveryTrackingPageProps> = ({ onNavigate }) => {
  const { orders, deliveries } = useData();
  const { currentUser } = useAuth();

  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    orders.find(o => o.status !== 'delivered')?.id || orders[0]?.id
  );

  const selectedOrder = orders.find(o => o.id === selectedOrderId) || orders[0];
  const selectedDelivery = deliveries.find(d => d.orderId === selectedOrder?.id) || deliveries[0];

  // Map order delivery status to timeline steps
  const getTimelineSteps = (): TimelineStep[] => {
    if (!selectedOrder) return [];

    const isConfirmed = true;
    const isHarvested = ['harvested', 'packed', 'out_for_delivery', 'delivered'].includes(selectedOrder.status);
    const isPacked = ['packed', 'out_for_delivery', 'delivered'].includes(selectedOrder.status);
    const isOut = ['out_for_delivery', 'delivered'].includes(selectedOrder.status);
    const isDelivered = selectedOrder.status === 'delivered';

    return [
      {
        id: '1',
        title: 'Order Confirmed & Farm Allocation',
        description: 'Harvest requirements dispatched to Kisan Valley & Sahyadri Highlands partner farms.',
        timestamp: 'Aug 25, 6:00 PM',
        status: isConfirmed ? 'completed' : 'pending'
      },
      {
        id: '2',
        title: 'Sunrise Fresh Harvest',
        description: 'Vegetables harvested at dawn at 5:30 AM, cold-rinsed with purified water.',
        timestamp: 'Aug 26, 5:45 AM',
        status: isHarvested ? (isPacked ? 'completed' : 'current') : 'pending'
      },
      {
        id: '3',
        title: 'Quality Inspection & Cotton Tote Packing',
        description: selectedDelivery?.packedBy ? `Packed and sealed by ${selectedDelivery.packedBy}` : 'Hand-graded and packed into breathable totes.',
        timestamp: 'Aug 26, 6:40 AM',
        status: isPacked ? (isOut ? 'completed' : 'current') : 'pending'
      },
      {
        id: '4',
        title: 'Out for Gated Enclave Delivery',
        description: selectedDelivery?.deliveryPartnerName 
          ? `Dispatched in ${selectedDelivery.vehicleNumber || 'EV Van'} with partner ${selectedDelivery.deliveryPartnerName}.`
          : 'En route to your gated residency.',
        timestamp: 'Aug 26, 7:15 AM',
        status: isOut ? (isDelivered ? 'completed' : 'current') : 'pending'
      },
      {
        id: '5',
        title: 'Delivered to Doorstep',
        description: `Left safely at ${selectedOrder.gatedCommunityUnit}.`,
        timestamp: selectedOrder.status === 'delivered' ? 'Aug 26, 7:55 AM' : 'Estimated 7:45 AM - 8:15 AM',
        status: isDelivered ? 'completed' : 'pending'
      }
    ];
  };

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1F3D2B]">
            Live Delivery Tracking
          </h1>
          <p className="text-xs sm:text-sm text-[#2E2E2E]/70 mt-1">
            Real-time status of your morning fresh vegetable dispatch and delivery vehicle.
          </p>
        </div>

        {/* Order Selector Pill */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#8A847A]">Viewing:</span>
          <select
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
            className="text-xs font-bold bg-[#FAF8F5] border border-[#E0DBD1] rounded-xl p-2 text-[#1F3D2B] focus:outline-none focus:ring-2 focus:ring-[#1F3D2B]"
          >
            {orders.map((o) => (
              <option key={o.id} value={o.id}>
                Order #{o.orderNumber} ({o.status.replace('_', ' ')})
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedOrder && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Col (7 cols): Timeline & Route Tracking */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="space-y-6" padding="lg">
              <div className="flex items-center justify-between pb-4 border-b border-[#F0EBE1]">
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#1F3D2B]">
                    Shipment Timeline
                  </h2>
                  <p className="text-xs text-[#8A847A]">Order #{selectedOrder.orderNumber}</p>
                </div>
                <Badge
                  variant={selectedOrder.status === 'delivered' ? 'success' : 'warning'}
                  size="md"
                  dot
                >
                  {selectedOrder.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>

              {/* Clean Timeline */}
              <div className="py-2">
                <Timeline steps={getTimelineSteps()} />
              </div>
            </Card>

            {/* Delivery Photo Proof if Delivered */}
            {selectedDelivery?.photoProofUrl && selectedOrder.status === 'delivered' && (
              <Card className="space-y-3" padding="lg">
                <div className="flex items-center gap-2 text-[#1F3D2B]">
                  <ImageIcon className="w-4 h-4 text-[#8C6D23]" />
                  <h3 className="font-serif text-base font-bold">
                    Doorstep Delivery Photo Confirmation
                  </h3>
                </div>
                <div className="rounded-xl overflow-hidden border border-[#E8E3DA] h-64 bg-[#FAF8F5]">
                  <img
                    src={selectedDelivery.photoProofUrl}
                    alt="Doorstep delivery proof"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-[#6E695F]">
                  Delivered and photographed at porch entrance on {selectedDelivery.deliveredAt || 'Aug 26, 7:55 AM'}.
                </p>
              </Card>
            )}
          </div>

          {/* Right Col (5 cols): Delivery Driver & Basket Details */}
          <div className="lg:col-span-5 space-y-6">
            {/* Delivery Partner Info */}
            <Card className="space-y-4" padding="lg">
              <h3 className="font-serif text-base font-bold text-[#1F3D2B] pb-2 border-b border-[#F0EBE1]">
                Assigned Delivery Partner
              </h3>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#1F3D2B] text-[#A7C4A0] flex items-center justify-center font-bold font-serif text-xl">
                  {selectedDelivery?.deliveryPartnerName ? selectedDelivery.deliveryPartnerName.charAt(0) : 'V'}
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-[#1F3D2B]">
                    {selectedDelivery?.deliveryPartnerName || 'Vikram Singh'}
                  </h4>
                  <p className="text-xs text-[#8A847A]">
                    {selectedDelivery?.vehicleNumber || 'EV Delivery Van #04'}
                  </p>
                  <p className="text-xs text-[#6E695F] flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-[#8C6D23]" />
                    <span>{selectedDelivery?.deliveryPartnerPhone || '+91 98450 11223'}</span>
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E8E3DA] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#8A847A]">Destination Unit:</span>
                  <span className="font-bold text-[#1F3D2B]">{selectedOrder.gatedCommunityUnit}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8A847A]">Designated Slot:</span>
                  <span className="font-semibold text-[#1F3D2B]">{selectedOrder.deliverySlot}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8A847A]">Driver Note:</span>
                  <span className="text-[#2E2E2E] truncate max-w-[180px]">{selectedOrder.notes || 'Porch drop'}</span>
                </div>
              </div>
            </Card>

            {/* Quick Basket Items in this order */}
            <Card className="space-y-4" padding="lg">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE1]">
                <h3 className="font-serif text-base font-bold text-[#1F3D2B]">
                  Bags & Items in Delivery
                </h3>
                <span className="text-xs text-[#8A847A]">{selectedOrder.items.length} items</span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs p-2 bg-[#FAF8F5] rounded-lg border border-[#F0EBE1]">
                    <span className="font-medium text-[#2E2E2E]">{item.name}</span>
                    <span className="text-[#6E695F]">{item.quantity}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
