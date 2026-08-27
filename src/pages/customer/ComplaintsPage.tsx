import React, { useState } from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Send, 
  Clock, 
  ShieldCheck, 
  HelpCircle, 
  Image as ImageIcon,
  MessageSquare
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Complaint } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

interface ComplaintsPageProps {
  onNavigate: (path: string) => void;
}

export const ComplaintsPage: React.FC<ComplaintsPageProps> = ({ onNavigate }) => {
  const { complaints, orders, createComplaint } = useData();
  const { currentUser } = useAuth();

  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const [issueType, setIssueType] = useState<Complaint['issueType']>('quality');
  const [description, setDescription] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const userComplaints = complaints.filter(c => c.userId === currentUser?.id || currentUser?.role === 'admin');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    createComplaint({
      orderId: selectedOrderId,
      userId: currentUser?.id || 'usr-customer-1',
      customerName: currentUser?.name || 'Aarav Sharma',
      issueType,
      description,
      photoUrl: issueType === 'quality' ? 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&auto=format&fit=crop&q=80' : undefined
    });

    setIsSuccess(true);
    setDescription('');
    setTimeout(() => setIsSuccess(false), 4000);
  };

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#1F3D2B]">
          Freshness Guarantee & Issue Reporting
        </h1>
        <p className="text-xs sm:text-sm text-[#2E2E2E]/70 mt-1">
          Every harvest basket is covered by our 100% replacement guarantee. If anything is bruised or missing, let us know for an instant resolution.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (5 cols): Complaint Form */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="space-y-4" padding="lg">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F0EBE1]">
              <AlertCircle className="w-5 h-5 text-[#8C6D23]" />
              <h2 className="font-serif text-lg font-bold text-[#1F3D2B]">
                File a Report
              </h2>
            </div>

            {isSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Your report has been logged. Our concierge will review it within 2 hours.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#1F3D2B] uppercase tracking-wider mb-1.5">
                  Select Order
                </label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E0DBD1] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3D2B]"
                >
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      Order #{o.orderNumber} ({o.scheduledDeliveryDate})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#1F3D2B] uppercase tracking-wider mb-1.5">
                  Issue Category
                </label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value as Complaint['issueType'])}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E0DBD1] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3D2B]"
                >
                  <option value="quality">Quality / Freshness Defect</option>
                  <option value="missing_item">Missing Vegetable / Extra</option>
                  <option value="damaged">Crushed / Damaged During Transit</option>
                  <option value="late_delivery">Late Delivery Timing</option>
                  <option value="wrong_item">Incorrect Item in Basket</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#1F3D2B] uppercase tracking-wider mb-1.5">
                  Describe What Happened *
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. The spinach bunch had wilting on the outer leaves..."
                  className="w-full p-3 bg-[#FAF8F5] border border-[#E0DBD1] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3D2B]"
                />
              </div>

              <div className="p-3 bg-[#FAF8F5] border border-[#E8E3DA] rounded-xl text-[11px] text-[#6E695F] space-y-1">
                <p className="font-bold text-[#1F3D2B]">Replacement Policy:</p>
                <p>
                  We either dispatch a same-day replacement with our morning van or immediately credit ₹100–₹250 back to your resident wallet.
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                rightIcon={<Send className="w-4 h-4" />}
              >
                Submit Report
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Column (7 cols): Past Complaints & Resolutions */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#1F3D2B]">
            Your Quality Tickets ({userComplaints.length})
          </h2>

          {userComplaints.length === 0 ? (
            <Card className="text-center py-12 text-[#8A847A]" padding="lg">
              <ShieldCheck className="w-10 h-10 mx-auto text-[#A7C4A0] mb-2" />
              <p className="font-serif text-base font-bold text-[#1F3D2B]">Zero Quality Issues</p>
              <p className="text-xs text-[#8A847A] mt-0.5">All your previous harvest baskets arrived in prime grade condition.</p>
            </Card>
          ) : (
            userComplaints.map((c) => (
              <Card key={c.id} className="space-y-3" padding="md">
                <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE1]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1F3D2B] capitalize">
                      {c.issueType.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-[#8A847A]">
                      ({new Date(c.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })})
                    </span>
                  </div>

                  <Badge
                    variant={
                      c.status === 'resolved'
                        ? 'success'
                        : c.status === 'investigating'
                        ? 'warning'
                        : 'secondary'
                    }
                    size="sm"
                    dot
                  >
                    {c.status.toUpperCase()}
                  </Badge>
                </div>

                <p className="text-xs text-[#2E2E2E] leading-relaxed">{c.description}</p>

                {/* Resolution note */}
                {c.resolutionNotes && (
                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E0DBD1] text-xs space-y-1">
                    <span className="font-bold text-[#1F3D2B] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4B6B48]" />
                      Resolution from FreshVerse Team:
                    </span>
                    <p className="text-[#555]">{c.resolutionNotes}</p>
                    {c.resolvedAt && (
                      <span className="text-[10px] text-[#8A847A] block">
                        Resolved on {new Date(c.resolvedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
