import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  Calendar, 
  ChevronRight, 
  FileText, 
  Star, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  Eye
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Order } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

interface OrdersPageProps {
  onNavigate: (path: string) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ onNavigate }) => {
  const { orders } = useData();
  const { currentUser } = useAuth();
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="secondary" dot>Confirmed</Badge>;
      case 'harvested':
        return <Badge variant="gold" dot>Harvested at Farm</Badge>;
      case 'packed':
        return <Badge variant="sage" dot>Packed in Tote</Badge>;
      case 'out_for_delivery':
        return <Badge variant="warning" dot>Out for Delivery</Badge>;
      case 'delivered':
        return <Badge variant="success" dot>Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="danger" dot>Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 text-left max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1F3D2B]">
            Orders & Delivery History
          </h1>
          <p className="text-xs sm:text-sm text-[#2E2E2E]/70 mt-1">
            Track active shipments, download past harvest receipts, or rate previous deliveries.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => onNavigate('/customer/basket')}
        >
          View Upcoming Basket
        </Button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="space-y-4" padding="lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0EBE1]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1F3D2B]/10 text-[#1F3D2B] flex items-center justify-center font-bold">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-base font-bold text-[#1F3D2B]">
                      Order #{order.orderNumber}
                    </h3>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-xs text-[#8A847A] mt-0.5">
                    Scheduled Delivery: <span className="font-semibold text-[#2E2E2E]">{order.scheduledDeliveryDate}</span> ({order.deliverySlot})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-serif text-lg font-bold text-[#1F3D2B]">
                  ₹{order.totalAmount}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedOrderForInvoice(order)}
                  leftIcon={<Eye className="w-3.5 h-3.5" />}
                >
                  Details
                </Button>
              </div>
            </div>

            {/* Produce items pill strip */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#8A847A] uppercase tracking-wider block">
                Included Harvest Items ({order.items.length} items):
              </span>
              <div className="flex flex-wrap gap-2">
                {order.items.map((item, idx) => (
                  <span
                    key={idx}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                      item.isExtra
                        ? 'bg-[#C6A969]/15 border-[#C6A969]/40 text-[#7C6328]'
                        : 'bg-[#FAF8F5] border-[#E8E3DA] text-[#2E2E2E]'
                    }`}
                  >
                    {item.name} <span className="text-[#8A847A]">({item.quantity})</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-3 border-t border-[#F0EBE1] flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-[#6E695F]">
                Drop-off location: <strong>{order.gatedCommunityUnit}</strong>
              </span>

              <div className="flex items-center gap-2">
                {order.status !== 'delivered' && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => onNavigate('/customer/delivery')}
                    leftIcon={<Truck className="w-3.5 h-3.5" />}
                  >
                    Track Delivery
                  </Button>
                )}

                {order.status === 'delivered' && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onNavigate('/customer/ratings')}
                      leftIcon={<Star className="w-3.5 h-3.5 text-[#C6A969]" />}
                    >
                      Rate Freshness
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onNavigate('/customer/complaints')}
                      leftIcon={<AlertCircle className="w-3.5 h-3.5 text-[#8C6D23]" />}
                    >
                      Report Quality Issue
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Invoice / Details Modal */}
      <Modal
        isOpen={!!selectedOrderForInvoice}
        onClose={() => setSelectedOrderForInvoice(null)}
        title={`Harvest Order Invoice #${selectedOrderForInvoice?.orderNumber}`}
        subtitle={`Scheduled: ${selectedOrderForInvoice?.scheduledDeliveryDate} (${selectedOrderForInvoice?.deliverySlot})`}
        maxWidth="lg"
      >
        {selectedOrderForInvoice && (
          <div className="space-y-4 text-left text-xs">
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E3DA] space-y-1">
              <p className="text-[#6E695F]">
                Resident: <strong>{selectedOrderForInvoice.customerName}</strong> ({selectedOrderForInvoice.customerPhone})
              </p>
              <p className="text-[#6E695F]">
                Delivery Unit: <strong>{selectedOrderForInvoice.gatedCommunityUnit}</strong>, {selectedOrderForInvoice.address}
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-[#1F3D2B] uppercase tracking-wider block">
                Itemized Produce List
              </span>
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[#8A847A] border-b border-[#F0EBE1]">
                    <th className="pb-2 font-medium">Item Name</th>
                    <th className="pb-2 font-medium">Category</th>
                    <th className="pb-2 font-medium text-right">Quantity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4F1EC]">
                  {selectedOrderForInvoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2 font-medium text-[#1F3D2B]">{item.name}</td>
                      <td className="py-2 text-[#8A847A] capitalize">{item.category}</td>
                      <td className="py-2 text-right font-medium">{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-3 border-t border-[#F0EBE1] space-y-1.5">
              <div className="flex justify-between text-[#555]">
                <span>Basket Subtotal</span>
                <span>₹{selectedOrderForInvoice.subtotal}</span>
              </div>
              {selectedOrderForInvoice.extrasTotal > 0 && (
                <div className="flex justify-between text-[#555]">
                  <span>Add-on Extras</span>
                  <span>₹{selectedOrderForInvoice.extrasTotal}</span>
                </div>
              )}
              <div className="flex justify-between text-[#555]">
                <span>Delivery Charge</span>
                <span className="text-[#4B6B48] font-bold">FREE (Gated Partner)</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-[#1F3D2B] text-sm">
                <span className="font-bold text-[#1F3D2B]">Total Paid</span>
                <span className="font-bold text-[#1F3D2B] text-base">₹{selectedOrderForInvoice.totalAmount}</span>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setSelectedOrderForInvoice(null)}
              >
                Close Receipt
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
