import React, { useState } from 'react';
import { 
  PackageCheck, 
  CheckSquare, 
  Square, 
  QrCode, 
  ShieldCheck, 
  User, 
  Clock, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const PackingDashboard: React.FC = () => {
  const { orders, updateOrderStatus, addNotification } = useData();
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [toteTag, setToteTag] = useState('TOTE-PG-882');
  const [packedSuccess, setPackedSuccess] = useState(false);

  const activeOrder = orders.find(o => o.id === selectedOrderId) || orders[0];

  const toggleCheckItem = (index: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [`${selectedOrderId}-${index}`]: !prev[`${selectedOrderId}-${index}`]
    }));
  };

  const isAllItemsChecked = activeOrder?.items.every((_, idx) => checkedItems[`${selectedOrderId}-${idx}`]);

  const handleCompletePacking = () => {
    if (!activeOrder) return;
    updateOrderStatus(activeOrder.id, 'packed');
    addNotification({
      userId: activeOrder.userId,
      title: `Basket Packed & Inspected (#${activeOrder.orderNumber})`,
      message: `Your harvest basket has been hand-inspected and sealed in insulated tote ${toteTag}.`,
      type: 'delivery'
    });
    setPackedSuccess(true);
    setTimeout(() => setPackedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 text-left max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl font-bold text-[#1F3D2B]">
              Morning Packing & QC Station
            </h1>
            <Badge variant="sage">Operator: Ramesh Kumar</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#2E2E2E]/70 mt-1">
            Palm Grove Enclave Run • Hand inspection, ozonated wipe, and cotton tote assembly.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="gold" size="md">Station #2 Active</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (5 cols): Orders Packing Queue */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#1F3D2B]">
            Packing Queue ({orders.length} Baskets)
          </h2>

          <div className="space-y-3">
            {orders.map((order) => {
              const isSelected = order.id === selectedOrderId;
              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-xs space-y-2 ${
                    isSelected
                      ? 'bg-[#1F3D2B] text-white border-[#1F3D2B] shadow-md'
                      : 'bg-white border-[#E8E3DA] hover:border-[#1F3D2B]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">
                      {order.gatedCommunityUnit}
                    </span>
                    <Badge
                      variant={order.status === 'packed' ? 'success' : isSelected ? 'gold' : 'secondary'}
                      size="sm"
                    >
                      {order.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  <p className={`${isSelected ? 'text-[#F4F1EC]/80' : 'text-[#6E695F]'}`}>
                    Resident: {order.customerName} • {order.items.length} items
                  </p>

                  <div className="flex justify-between items-center text-[11px] pt-1">
                    <span>Slot: {order.deliverySlot}</span>
                    <span className="font-semibold">₹{order.totalAmount}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (7 cols): Active Checklist & QC */}
        <div className="lg:col-span-7 space-y-6">
          {activeOrder && (
            <Card className="space-y-6" padding="lg">
              <div className="flex items-center justify-between pb-4 border-b border-[#F0EBE1]">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#1F3D2B]">
                    Assembly for {activeOrder.gatedCommunityUnit}
                  </h3>
                  <p className="text-xs text-[#8A847A]">Order #{activeOrder.orderNumber} • {activeOrder.customerName}</p>
                </div>
                <Badge variant="sage" size="md">
                  {activeOrder.status.toUpperCase()}
                </Badge>
              </div>

              {packedSuccess && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Basket packed, sealed in tote, and transferred to delivery loading dock.</span>
                </div>
              )}

              {/* Items checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1F3D2B] uppercase tracking-wider">
                    Grade-A Quality Inspection Checklist:
                  </span>
                  <span className="text-[#8A847A]">
                    Click items as you pack into tote
                  </span>
                </div>

                <div className="space-y-2">
                  {activeOrder.items.map((item, idx) => {
                    const isChecked = !!checkedItems[`${selectedOrderId}-${idx}`];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleCheckItem(idx)}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-[#A7C4A0]/20 border-[#A7C4A0] text-[#1F3D2B]'
                            : 'bg-[#FAF8F5] border-[#E8E3DA] text-[#2E2E2E]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isChecked ? (
                            <CheckSquare className="w-5 h-5 text-[#1F3D2B] shrink-0" />
                          ) : (
                            <Square className="w-5 h-5 text-[#8A847A] shrink-0" />
                          )}
                          <span className={`font-semibold ${isChecked ? 'line-through text-[#1F3D2B]/70' : ''}`}>
                            {item.name}
                          </span>
                          {item.isExtra && (
                            <Badge variant="gold" size="sm">Extra Add-on</Badge>
                          )}
                        </div>

                        <span className="text-xs font-bold text-[#1F3D2B]">
                          {item.quantity}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tote Tag Assignment */}
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8E3DA] space-y-3 text-xs">
                <div className="flex items-center gap-2 text-[#1F3D2B] font-bold">
                  <QrCode className="w-4 h-4 text-[#8C6D23]" />
                  <span>Insulated Jute Tote Tag:</span>
                </div>
                <input
                  type="text"
                  value={toteTag}
                  onChange={(e) => setToteTag(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#E0DBD1] rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#1F3D2B]"
                />
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleCompletePacking}
                leftIcon={<PackageCheck className="w-5 h-5" />}
              >
                Mark as Packed & Seal Tote
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
