import React, { useState } from 'react';
import { Star, CheckCircle2, MessageSquare, Sparkles, Send } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { RatingStars } from '../../components/common/RatingStars';

interface RatingsPageProps {
  onNavigate: (path: string) => void;
}

export const RatingsPage: React.FC<RatingsPageProps> = ({ onNavigate }) => {
  const { orders, ratings, submitRating } = useData();
  const { currentUser } = useAuth();

  const deliveredOrders = orders.filter(o => o.status === 'delivered');
  const [selectedOrderId, setSelectedOrderId] = useState<string>(deliveredOrders[0]?.id || '');
  const [freshnessScore, setFreshnessScore] = useState<number>(5);
  const [packagingScore, setPackagingScore] = useState<number>(5);
  const [deliveryScore, setDeliveryScore] = useState<number>(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Super Fresh Greens', 'Clean & Dirt Free']);
  const [comment, setComment] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const availableTags = [
    'Super Fresh Greens',
    'Crisp Carrots & Roots',
    'Carefully Packed',
    'On Time Delivery',
    'Zero Bruises',
    'Sweet & Natural Flavor',
    'Clean & Dirt Free'
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId) return;

    submitRating({
      orderId: selectedOrderId,
      userId: currentUser?.id || 'usr-customer-1',
      customerName: currentUser?.name || 'Aarav Sharma',
      freshnessScore,
      packagingScore,
      deliveryScore,
      comment: comment.trim() ? comment : selectedTags.join(', '),
      tags: selectedTags
    });

    setIsSuccess(true);
    setComment('');
    setTimeout(() => setIsSuccess(false), 4000);
  };

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#1F3D2B]">
          Rate Your Harvest Baskets
        </h1>
        <p className="text-xs sm:text-sm text-[#2E2E2E]/70 mt-1">
          Your feedback directly guides partner farmers and packing supervisors for next week's harvest.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Rating Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="space-y-5" padding="lg">
            <h2 className="font-serif text-lg font-bold text-[#1F3D2B] pb-3 border-b border-[#F0EBE1]">
              Submit Feedback for Recent Delivery
            </h2>

            {isSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Thank you! Your rating has been shared with the harvest crew.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              <div>
                <label className="block font-bold text-[#1F3D2B] uppercase tracking-wider mb-1.5">
                  Select Completed Delivery
                </label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E0DBD1] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3D2B]"
                >
                  {deliveredOrders.map((o) => (
                    <option key={o.id} value={o.id}>
                      Order #{o.orderNumber} ({o.scheduledDeliveryDate})
                    </option>
                  ))}
                </select>
              </div>

              {/* 3 Rating Dimensions */}
              <div className="space-y-3 p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8E3DA]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1F3D2B]">Produce Freshness & Crispness:</span>
                  <RatingStars rating={freshnessScore} onRate={setFreshnessScore} size="md" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1F3D2B]">Packaging & Hygiene:</span>
                  <RatingStars rating={packagingScore} onRate={setPackagingScore} size="md" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1F3D2B]">Delivery Punctuality:</span>
                  <RatingStars rating={deliveryScore} onRate={setDeliveryScore} size="md" />
                </div>
              </div>

              {/* Feedback Tags */}
              <div className="space-y-2">
                <span className="block font-bold text-[#1F3D2B] uppercase tracking-wider">
                  What did you love about this harvest?
                </span>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1F3D2B] text-white border-[#1F3D2B]'
                            : 'bg-white text-[#2E2E2E] border-[#D8D1C5] hover:border-[#1F3D2B]'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1F3D2B] uppercase tracking-wider mb-1.5">
                  Chef Notes / Additional Feedback
                </label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about flavor, particular varieties, or storage freshness..."
                  className="w-full p-3 bg-[#FAF8F5] border border-[#E0DBD1] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3D2B]"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                rightIcon={<Send className="w-4 h-4" />}
              >
                Submit Harvest Rating
              </Button>
            </form>
          </Card>
        </div>

        {/* Previous Community Ratings (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#1F3D2B]">
            Previous Feedback
          </h2>

          <div className="space-y-3">
            {ratings.map((r) => (
              <Card key={r.id} className="space-y-2.5 text-xs" padding="md">
                <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE1]">
                  <div className="flex items-center gap-1.5">
                    <RatingStars rating={r.freshnessScore} size="sm" />
                    <span className="font-bold text-[#1F3D2B]">({r.freshnessScore}.0)</span>
                  </div>
                  <span className="text-[10px] text-[#8A847A]">
                    {new Date(r.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <p className="text-[#2E2E2E] italic">"{r.comment}"</p>

                {r.tags && r.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {r.tags.map((t, idx) => (
                      <span key={idx} className="bg-[#FAF8F5] border border-[#E8E3DA] text-[10px] px-2 py-0.5 rounded text-[#555]">
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
