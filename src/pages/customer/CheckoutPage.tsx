import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Wallet, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Lock, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

interface CheckoutPageProps {
  onNavigate: (path: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { plans, subscription, createOrder, addNotification } = useData();
  const { currentUser } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'wallet'>('upi');
  const [deliverySlot, setDeliverySlot] = useState(subscription?.deliverySlot || 'Morning (7:00 AM - 9:00 AM)');
  const [deliveryNotes, setDeliveryNotes] = useState('Please leave in porch thermal tote basket if doorbell is quiet.');
  const [unitAddress, setUnitAddress] = useState(subscription?.gatedCommunityUnit || currentUser?.gatedCommunityUnit || 'Villa 42, Palm Grove');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState('');

  const currentPlan = plans.find(p => p.id === subscription?.planId) || plans[1];
  const selectedItems = subscription?.basketCustomization?.selectedItems || [];
  const extraItems = subscription?.basketCustomization?.extraItems || [];

  const extrasTotal = extraItems.reduce((acc, item) => {
    const qty = parseInt(item.quantity) || 1;
    return acc + (item.price * qty);
  }, 0);

  const subtotal = currentPlan.price || 0;
  const totalAmount = subtotal + extrasTotal;

  const handleConfirmOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Create confirmed order
      const orderItems = [
        ...selectedItems.map(i => ({ name: i.name, quantity: i.quantity, category: i.category })),
        ...extraItems.map(e => ({ name: e.name, quantity: e.quantity, category: 'extra', isExtra: true, price: e.price }))
      ];

      const newOrder = createOrder({
        userId: currentUser?.id || 'usr-customer-1',
        customerName: currentUser?.name || 'Aarav Sharma',
        customerPhone: currentUser?.phone || '+91 98765 43210',
        gatedCommunityUnit: unitAddress,
        address: currentUser?.address || 'Villa 42, Palm Grove Enclave',
        deliverySlot,
        items: orderItems,
        subtotal,
        extrasTotal,
        totalAmount,
        notes: deliveryNotes
      });

      addNotification({
        userId: currentUser?.id || 'usr-customer-1',
        title: `Harvest Order Confirmed (#${newOrder.orderNumber})`,
        message: `Your harvest basket is scheduled for delivery on ${newOrder.scheduledDeliveryDate}.`,
        type: 'delivery',
        actionUrl: '/customer/orders'
      });

      setCreatedOrderNumber(newOrder.orderNumber);
      setIsProcessing(false);
      setIsConfirmed(true);
    }, 1200);
  };

  if (isConfirmed) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#1F3D2B] text-[#A7C4A0] flex items-center justify-center mx-auto shadow-lg animate-in zoom-in">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <Badge variant="gold" size="md">Subscription Scheduled</Badge>
          <h1 className="font-serif text-3xl font-bold text-[#1F3D2B]">
            Harvest Order Confirmed!
          </h1>
          <p className="text-sm text-[#2E2E2E]/80">
            Order <span className="font-bold text-[#1F3D2B]">#{createdOrderNumber}</span> has been queued for morning farm harvesting.
          </p>
        </div>

        <Card className="text-left space-y-3 bg-[#FAF8F5]" padding="md">
          <div className="flex justify-between text-xs pb-2 border-b border-[#E8E3DA]">
            <span className="text-[#8A847A]">Delivery Window:</span>
            <span className="font-bold text-[#1F3D2B]">Saturday Morning, 7:00 AM - 9:00 AM</span>
          </div>
          <div className="flex justify-between text-xs pb-2 border-b border-[#E8E3DA]">
            <span className="text-[#8A847A]">Resident Drop-off:</span>
            <span className="font-bold text-[#1F3D2B]">{unitAddress}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#8A847A]">Total Amount:</span>
            <span className="font-bold text-[#1F3D2B]">₹{totalAmount}</span>
          </div>
        </Card>

        <div className="flex justify-center gap-4 pt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={() => onNavigate('/customer/orders')}
          >
            View Active Orders
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => onNavigate('/customer/dashboard')}
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-left">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#1F3D2B]">
          Confirm Harvest Subscription & Checkout
        </h1>
        <p className="text-xs sm:text-sm text-[#2E2E2E]/70 mt-1">
          Review your residential delivery preferences, curated produce breakdown, and payment mode.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Address, Slot, Payment details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Gated Community Delivery Address Card */}
          <Card className="space-y-4" padding="lg">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F0EBE1]">
              <MapPin className="w-5 h-5 text-[#8C6D23]" />
              <h2 className="font-serif text-lg font-bold text-[#1F3D2B]">
                1. Delivery Location & Residence
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#1F3D2B] uppercase tracking-wider mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  disabled
                  value={currentUser?.name || 'Aarav Sharma'}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E0DBD1] rounded-xl text-[#2E2E2E] font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1F3D2B] uppercase tracking-wider mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  disabled
                  value={currentUser?.phone || '+91 98765 43210'}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E0DBD1] rounded-xl text-[#2E2E2E] font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F3D2B] uppercase tracking-wider mb-1">
                Villa / Flat Number in Enclave
              </label>
              <input
                type="text"
                value={unitAddress}
                onChange={(e) => setUnitAddress(e.target.value)}
                className="w-full p-2.5 text-xs bg-white border border-[#E0DBD1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F3D2B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F3D2B] uppercase tracking-wider mb-1">
                Delivery Instructions (For Driver)
              </label>
              <textarea
                rows={2}
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder="e.g. Leave in the thermal basket by the front porch"
                className="w-full p-2.5 text-xs bg-white border border-[#E0DBD1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F3D2B]"
              />
            </div>
          </Card>

          {/* Delivery Slot Selection */}
          <Card className="space-y-4" padding="lg">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F0EBE1]">
              <Clock className="w-5 h-5 text-[#8C6D23]" />
              <h2 className="font-serif text-lg font-bold text-[#1F3D2B]">
                2. Preferred Delivery Slot
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  deliverySlot.includes('Morning')
                    ? 'bg-[#1F3D2B]/5 border-[#1F3D2B] ring-2 ring-[#1F3D2B]/20'
                    : 'bg-white border-[#E8E3DA]'
                }`}
              >
                <input
                  type="radio"
                  name="slot"
                  checked={deliverySlot.includes('Morning')}
                  onChange={() => setDeliverySlot('Morning (7:00 AM - 9:00 AM)')}
                  className="mt-0.5 accent-[#1F3D2B]"
                />
                <div>
                  <p className="text-xs font-bold text-[#1F3D2B]">Morning Sunrise Drop</p>
                  <p className="text-[11px] text-[#6E695F]">7:00 AM - 9:00 AM (Recommended)</p>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  deliverySlot.includes('Evening')
                    ? 'bg-[#1F3D2B]/5 border-[#1F3D2B] ring-2 ring-[#1F3D2B]/20'
                    : 'bg-white border-[#E8E3DA]'
                }`}
              >
                <input
                  type="radio"
                  name="slot"
                  checked={deliverySlot.includes('Evening')}
                  onChange={() => setDeliverySlot('Evening (4:00 PM - 6:00 PM)')}
                  className="mt-0.5 accent-[#1F3D2B]"
                />
                <div>
                  <p className="text-xs font-bold text-[#1F3D2B]">Evening Twilight Drop</p>
                  <p className="text-[11px] text-[#6E695F]">4:00 PM - 6:00 PM</p>
                </div>
              </label>
            </div>
          </Card>

          {/* Secure Payment Mode */}
          <Card className="space-y-4" padding="lg">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#8C6D23]" />
                <h2 className="font-serif text-lg font-bold text-[#1F3D2B]">
                  3. Payment Method
                </h2>
              </div>
              <span className="flex items-center gap-1 text-[11px] text-[#4B6B48] font-semibold">
                <Lock className="w-3.5 h-3.5" /> 256-Bit Encrypted
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                className={`p-3.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                  paymentMethod === 'upi'
                    ? 'bg-[#1F3D2B]/5 border-[#1F3D2B] ring-2 ring-[#1F3D2B]/20'
                    : 'bg-white border-[#E8E3DA]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Smartphone className="w-4 h-4 text-[#8C6D23]" />
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="accent-[#1F3D2B]"
                  />
                </div>
                <div className="mt-3">
                  <p className="text-xs font-bold text-[#1F3D2B]">UPI AutoPay</p>
                  <p className="text-[10px] text-[#8A847A]">GPay, PhonePe, Paytm</p>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-[#1F3D2B]/5 border-[#1F3D2B] ring-2 ring-[#1F3D2B]/20'
                    : 'bg-white border-[#E8E3DA]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <CreditCard className="w-4 h-4 text-[#8C6D23]" />
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="accent-[#1F3D2B]"
                  />
                </div>
                <div className="mt-3">
                  <p className="text-xs font-bold text-[#1F3D2B]">Credit / Debit Card</p>
                  <p className="text-[10px] text-[#8A847A]">Visa, Mastercard, RuPay</p>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                  paymentMethod === 'wallet'
                    ? 'bg-[#1F3D2B]/5 border-[#1F3D2B] ring-2 ring-[#1F3D2B]/20'
                    : 'bg-white border-[#E8E3DA]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Wallet className="w-4 h-4 text-[#8C6D23]" />
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'wallet'}
                    onChange={() => setPaymentMethod('wallet')}
                    className="accent-[#1F3D2B]"
                  />
                </div>
                <div className="mt-3">
                  <p className="text-xs font-bold text-[#1F3D2B]">Resident Wallet</p>
                  <p className="text-[10px] text-[#8A847A]">Balance: ₹2,450</p>
                </div>
              </label>
            </div>
          </Card>
        </div>

        {/* Right Column (5 cols): Order Review & Action */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="space-y-4" padding="lg">
            <h3 className="font-serif text-lg font-bold text-[#1F3D2B] pb-3 border-b border-[#F0EBE1]">
              Harvest Basket Breakdown
            </h3>

            {/* Selected Plan Details */}
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E3DA] space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#1F3D2B]">{currentPlan.name}</span>
                <span className="font-bold text-[#1F3D2B]">₹{subtotal}</span>
              </div>
              <p className="text-[11px] text-[#6E695F]">
                {selectedItems.length} seasonal items ({currentPlan.basketSizeWeight})
              </p>
            </div>

            {/* Produce list mini scroll */}
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 text-xs divide-y divide-[#F4F1EC]">
              {selectedItems.map((item, idx) => (
                <div key={idx} className="pt-1.5 first:pt-0 flex justify-between items-center">
                  <span className="truncate max-w-[200px] text-[#2E2E2E]">{item.name}</span>
                  <span className="text-[#8A847A] shrink-0">{item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Extra items if any */}
            {extraItems.length > 0 && (
              <div className="pt-3 border-t border-[#F0EBE1] space-y-2">
                <span className="text-[11px] font-bold text-[#8A847A] uppercase tracking-wider block">
                  Add-on Extras
                </span>
                {extraItems.map((extra, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="text-[#555]">{extra.name} ({extra.quantity})</span>
                    <span className="font-semibold text-[#1F3D2B]">₹{extra.price * (parseInt(extra.quantity) || 1)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Price Calculations */}
            <div className="pt-3 border-t border-[#F0EBE1] space-y-2 text-xs">
              <div className="flex justify-between text-[#555]">
                <span>Basket Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {extrasTotal > 0 && (
                <div className="flex justify-between text-[#555]">
                  <span>Extras Subtotal</span>
                  <span>₹{extrasTotal}</span>
                </div>
              )}
              <div className="flex justify-between text-[#555]">
                <span>Gated Community Logistics</span>
                <span className="text-[#4B6B48] font-bold">FREE (₹0)</span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t-2 border-[#1F3D2B] text-base">
                <span className="font-serif font-bold text-[#1F3D2B]">Total to Pay</span>
                <span className="font-serif text-2xl font-extrabold text-[#1F3D2B]">
                  ₹{totalAmount}
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full mt-2"
              onClick={handleConfirmOrder}
              isLoading={isProcessing}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Confirm Subscription & Order
            </Button>

            <p className="text-center text-[11px] text-[#8A847A]">
              By confirming, you agree to the community fresh produce charter. Zero cancellation fees.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
