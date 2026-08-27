import React, { useState } from 'react';
import { 
  ShoppingBag, 
  ArrowRight, 
  Repeat, 
  Plus, 
  Minus, 
  Trash2, 
  Sparkles, 
  Check, 
  Info,
  Clock,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { InventoryItem, BasketItemCustomization } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

interface BasketPageProps {
  onNavigate: (path: string) => void;
}

export const BasketPage: React.FC<BasketPageProps> = ({ onNavigate }) => {
  const { 
    plans, 
    subscription, 
    inventory, 
    swapBasketItem, 
    addExtraItem, 
    removeExtraItem, 
    updateExtraItemQuantity 
  } = useData();

  const [swapTargetItem, setSwapTargetItem] = useState<BasketItemCustomization | null>(null);
  const [swapFeedback, setSwapFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const currentPlan = plans.find(p => p.id === subscription?.planId) || plans[1];
  const selectedItems = subscription?.basketCustomization?.selectedItems || [];
  const extraItems = subscription?.basketCustomization?.extraItems || [];

  const swapsUsed = selectedItems.filter(i => i.isSwapped).length;
  const maxSwaps = currentPlan.maxSwapsAllowed || 2;
  const remainingSwaps = Math.max(0, maxSwaps - swapsUsed);

  // Extras total
  const extrasTotal = extraItems.reduce((acc, item) => {
    const qty = parseInt(item.quantity) || 1;
    return acc + (item.price * qty);
  }, 0);

  const estimatedTotal = (currentPlan.price || 0) + extrasTotal;

  // Available items for swap (items that are marked isAvailableForSwap and not currently in selectedItems)
  const currentVegIds = selectedItems.map(s => s.vegetableId);
  const availableSwapOptions = inventory.filter(
    inv => inv.isAvailableForSwap && !currentVegIds.includes(inv.id)
  );

  // Available add-on extra produce
  const availableExtras = inventory.filter(inv => inv.isExtraItem);

  const handleExecuteSwap = (newVeg: InventoryItem) => {
    if (!swapTargetItem) return;
    const res = swapBasketItem(swapTargetItem.vegetableId, newVeg);
    if (res.success) {
      setSwapFeedback({ type: 'success', message: res.message });
      setSwapTargetItem(null);
      setTimeout(() => setSwapFeedback(null), 3500);
    } else {
      setSwapFeedback({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="space-y-8 text-left max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl font-bold text-[#1F3D2B]">
              Customize Your Harvest Basket
            </h1>
            <Badge variant="sage">{currentPlan.name}</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#2E2E2E]/70 mt-1">
            Review your curated selection for upcoming delivery on {subscription?.nextDeliveryDate || 'Saturday'}. Swap vegetables or add specialty produce.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={() => onNavigate('/customer/checkout')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>

      {/* Swaps Counter Status Banner */}
      <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8E3DA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#C6A969]/20 text-[#7C6328] flex items-center justify-center font-bold shrink-0">
            <Repeat className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#1F3D2B]">
              Vegetable Swaps Available: <span className="text-[#8C6D23] font-extrabold">{remainingSwaps} of {maxSwaps} remaining</span>
            </p>
            <p className="text-[11px] text-[#6E695F]">
              Don't enjoy a particular crop? Swap it with any fresh harvest in season.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#8A847A]">
          <Clock className="w-3.5 h-3.5" />
          <span>Locks Fri 8:00 PM</span>
        </div>
      </div>

      {/* Toast Feedback */}
      {swapFeedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150 ${
            swapFeedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {swapFeedback.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{swapFeedback.message}</span>
        </div>
      )}

      {/* Main Grid: Basket items & Extras */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col (8 cols): Selected Curated Basket Items */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="space-y-4" padding="lg">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg font-bold text-[#1F3D2B]">
                  Included Basket Items ({selectedItems.length} items)
                </h2>
                <span className="text-xs text-[#8A847A]">({currentPlan.basketSizeWeight})</span>
              </div>
              <span className="text-xs font-bold text-[#1F3D2B]">
                Covered under ₹{currentPlan.price} plan
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {selectedItems.map((item) => (
                <div
                  key={item.vegetableId}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    item.isSwapped
                      ? 'bg-[#FAF6EC] border-[#C6A969]/50 shadow-2xs'
                      : 'bg-white border-[#E8E3DA]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=120&auto=format&fit=crop&q=80'}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover shrink-0 border border-[#E0DBD1]"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#1F3D2B] truncate">{item.name}</p>
                      <p className="text-[11px] text-[#6E695F]">{item.quantity}</p>
                      {item.isSwapped && (
                        <p className="text-[10px] text-[#8C6D23] font-medium truncate">
                          Swapped from {item.originalVegetableName}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setSwapTargetItem(item)}
                    className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#D8D1C5] hover:bg-[#1F3D2B] hover:text-white text-[#1F3D2B] transition-colors cursor-pointer shrink-0"
                    title="Swap with another vegetable"
                  >
                    <Repeat className="w-3 h-3" />
                    <span>Swap</span>
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Add-on Extras Catalog */}
          <Card className="space-y-4" padding="lg">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1F3D2B]">
                  Add Farm-Fresh Extras
                </h3>
                <p className="text-xs text-[#8A847A]">
                  Fresh herbs, specialty mushrooms, and additional staples for this cycle.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {availableExtras.map((extra) => {
                const inBasket = extraItems.find(e => e.vegetableId === extra.id);
                const quantityInBasket = inBasket ? parseInt(inBasket.quantity) || 1 : 0;

                return (
                  <div
                    key={extra.id}
                    className="p-3.5 bg-white rounded-xl border border-[#E8E3DA] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={extra.imageUrl}
                        alt={extra.name}
                        className="w-12 h-12 rounded-lg object-cover shrink-0 border border-[#E0DBD1]"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#1F3D2B] truncate">{extra.name}</p>
                        <p className="text-[11px] text-[#6E695F]">
                          ₹{extra.pricePerUnit} / {extra.unit}
                        </p>
                        <span className="text-[9px] text-[#4B6B48] bg-[#A7C4A0]/20 px-1.5 py-0.5 rounded font-medium">
                          {extra.freshnessGrade}
                        </span>
                      </div>
                    </div>

                    <div>
                      {quantityInBasket > 0 ? (
                        <div className="flex items-center gap-2 bg-[#FAF8F5] border border-[#DDD7CC] rounded-lg p-1">
                          <button
                            onClick={() => updateExtraItemQuantity(extra.id, -1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-[#1F3D2B] hover:bg-white cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-[#1F3D2B] min-w-[16px] text-center">
                            {quantityInBasket}
                          </span>
                          <button
                            onClick={() => updateExtraItemQuantity(extra.id, 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-[#1F3D2B] hover:bg-white cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addExtraItem(extra)}
                          leftIcon={<Plus className="w-3.5 h-3.5" />}
                        >
                          Add
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Col (4 cols): Basket Summary & Checkout Trigger */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="space-y-5 sticky top-24" padding="lg">
            <h3 className="font-serif text-lg font-bold text-[#1F3D2B] pb-3 border-b border-[#F0EBE1]">
              Order & Basket Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-[#2E2E2E]">
                <span>{currentPlan.name} ({currentPlan.frequency})</span>
                <span className="font-bold text-[#1F3D2B]">₹{currentPlan.price}</span>
              </div>

              {/* Extra Items Breakdown */}
              {extraItems.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#F0EBE1]">
                  <span className="text-[11px] font-bold text-[#8A847A] uppercase tracking-wider block">
                    Custom Extras ({extraItems.length})
                  </span>
                  {extraItems.map((extra) => {
                    const qty = parseInt(extra.quantity) || 1;
                    const itemTotal = extra.price * qty;
                    return (
                      <div key={extra.vegetableId} className="flex justify-between items-center text-[#555]">
                        <div className="flex items-center gap-1.5 truncate">
                          <button
                            onClick={() => removeExtraItem(extra.vegetableId)}
                            className="text-rose-600 hover:text-rose-800 cursor-pointer"
                            title="Remove extra"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <span className="truncate">{extra.name} ({extra.quantity})</span>
                        </div>
                        <span className="font-semibold text-[#1F3D2B] shrink-0">₹{itemTotal}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex justify-between text-[#2E2E2E] pt-2 border-t border-[#F0EBE1]">
                <span className="flex items-center gap-1">
                  Enclave Delivery Fee
                  <ShieldCheck className="w-3.5 h-3.5 text-[#4B6B48]" />
                </span>
                <span className="font-bold text-[#4B6B48]">FREE</span>
              </div>

              <div className="flex justify-between items-baseline pt-4 border-t-2 border-[#1F3D2B] text-base">
                <span className="font-serif font-bold text-[#1F3D2B]">Estimated Total</span>
                <span className="font-serif text-2xl font-extrabold text-[#1F3D2B]">
                  ₹{estimatedTotal}
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => onNavigate('/customer/checkout')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Checkout
            </Button>

            <div className="p-3 bg-[#FAF8F5] rounded-xl text-[11px] text-[#6E695F] space-y-1">
              <p className="font-bold text-[#1F3D2B]">Freshness Guarantee:</p>
              <p>
                Inspected on morning of dispatch. Any bruised item replaced immediately with wallet credit.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Swap Modal Dialog */}
      <Modal
        isOpen={!!swapTargetItem}
        onClose={() => setSwapTargetItem(null)}
        title={`Swap ${swapTargetItem?.name}`}
        subtitle={`Select a seasonal harvest replacement (${remainingSwaps} swaps remaining)`}
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="max-h-96 overflow-y-auto space-y-2.5 pr-1">
            {availableSwapOptions.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#8A847A]">
                No other swap-eligible crops currently available in this harvest cycle.
              </div>
            ) : (
              availableSwapOptions.map((opt) => (
                <div
                  key={opt.id}
                  className="p-3 bg-white border border-[#E0DBD1] hover:border-[#1F3D2B] rounded-xl flex items-center justify-between gap-3 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={opt.imageUrl}
                      alt={opt.name}
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#1F3D2B]">{opt.name}</h4>
                      <p className="text-[11px] text-[#8A847A]">
                        {opt.category} • {opt.freshnessGrade} • Grower: {opt.supplierName.split(' ')[0]}
                      </p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleExecuteSwap(opt)}
                  >
                    Select This
                  </Button>
                </div>
              ))
            )}
          </div>

          <div className="pt-3 border-t border-[#F0EBE1] flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSwapTargetItem(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
