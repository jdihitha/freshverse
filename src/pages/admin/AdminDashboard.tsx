import React, { useState } from 'react';
import { 
  Users, 
  Package, 
  Truck, 
  AlertCircle, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  Plus, 
  CheckCircle2, 
  Sliders, 
  Calendar,
  Sparkles,
  Layers,
  Search,
  Filter
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { InventoryItem, Complaint } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { 
    plans, 
    orders, 
    inventory, 
    complaints, 
    suppliers, 
    updateInventoryStock, 
    resolveComplaint,
    updateOrderStatus
  } = useData();

  const [activeTab, setActiveTab] = useState<'overview' | 'subscribers' | 'inventory' | 'complaints' | 'orders'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [resolutionText, setResolutionText] = useState('Credited ₹150 to resident wallet & flagged to Kisan Valley grower.');
  const [stockEditItem, setStockEditItem] = useState<InventoryItem | null>(null);
  const [newStockQty, setNewStockQty] = useState(0);

  // Key KPI metrics
  const totalSubscribersCount = 48;
  const activeSubscribersCount = 44;
  const pausedSubscribersCount = 4;
  const openComplaintsCount = complaints.filter(c => c.status !== 'resolved').length;
  const totalRevenueMonth = orders.reduce((acc, o) => acc + o.totalAmount, 0) + 125000;

  const handleResolveComplaint = () => {
    if (!selectedComplaint) return;
    resolveComplaint(selectedComplaint.id, resolutionText);
    setSelectedComplaint(null);
  };

  const handleSaveStock = () => {
    if (!stockEditItem) return;
    updateInventoryStock(stockEditItem.id, newStockQty);
    setStockEditItem(null);
  };

  return (
    <div className="space-y-6 sm:space-y-8 text-left max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F3D2B]">
              Community Operations Hub
            </h1>
            <Badge variant="gold">Admin Master</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#2E2E2E]/70 mt-1">
            Palm Grove Residency Phase 1 Pilot • 48 / 50 Target Capacity
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Badge variant="sage" size="md">Harvest Cycle: Aug 26, 2026</Badge>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        <Card className="space-y-2" padding="md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8A847A] uppercase tracking-wider">Subscribers</span>
            <div className="w-8 h-8 rounded-lg bg-[#1F3D2B]/10 text-[#1F3D2B] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-[#1F3D2B]">48 <span className="text-xs font-normal text-[#8A847A]">/ 50 cap</span></p>
          <div className="flex items-center gap-2 text-[11px] text-[#6E695F]">
            <span className="text-[#4B6B48] font-bold">44 active</span> • 4 paused
          </div>
        </Card>

        <Card className="space-y-2" padding="md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8A847A] uppercase tracking-wider">Monthly Recurring</span>
            <div className="w-8 h-8 rounded-lg bg-[#C6A969]/20 text-[#7C6328] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-[#1F3D2B]">₹{totalRevenueMonth.toLocaleString()}</p>
          <p className="text-[11px] text-[#4B6B48] font-medium">+14% vs last cycle</p>
        </Card>

        <Card className="space-y-2" padding="md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8A847A] uppercase tracking-wider">Active Harvests</span>
            <div className="w-8 h-8 rounded-lg bg-[#A7C4A0]/30 text-[#1F3D2B] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-[#1F3D2B]">{orders.length} Baskets</p>
          <p className="text-[11px] text-[#6E695F]">3 partner farms reporting</p>
        </Card>

        <Card className="space-y-2" padding="md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8A847A] uppercase tracking-wider">Quality Tickets</span>
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-[#1F3D2B]">{openComplaintsCount} Open</p>
          <p className="text-[11px] text-[#6E695F]">Average resolution: 45 min</p>
        </Card>
      </div>

      {/* Tabs Navigation (Horizontally scrollable on mobile) */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 border-b border-[#E8E3DA] pb-2 -mx-2 px-2 sm:mx-0 sm:px-0">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#1F3D2B] text-white'
              : 'bg-[#FAF8F5] text-[#6E695F] hover:text-[#1F3D2B]'
          }`}
        >
          Operations Overview
        </button>
        <button
          onClick={() => setActiveTab('subscribers')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'subscribers'
              ? 'bg-[#1F3D2B] text-white'
              : 'bg-[#FAF8F5] text-[#6E695F] hover:text-[#1F3D2B]'
          }`}
        >
          Resident Subscribers (48)
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'inventory'
              ? 'bg-[#1F3D2B] text-white'
              : 'bg-[#FAF8F5] text-[#6E695F] hover:text-[#1F3D2B]'
          }`}
        >
          Farm Stock & Crops ({inventory.length})
        </button>
        <button
          onClick={() => setActiveTab('complaints')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'complaints'
              ? 'bg-[#1F3D2B] text-white'
              : 'bg-[#FAF8F5] text-[#6E695F] hover:text-[#1F3D2B]'
          }`}
        >
          Complaints & Claims ({complaints.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-[#1F3D2B] text-white'
              : 'bg-[#FAF8F5] text-[#6E695F] hover:text-[#1F3D2B]'
          }`}
        >
          All Orders ({orders.length})
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Left Col (7 cols): Today's Dispatch Status */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="space-y-4" padding="lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0EBE1]">
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#1F3D2B]">
                  Live Enclave Morning Dispatch
                </h3>
                <Badge variant="warning" dot>Run #PG-01 Active</Badge>
              </div>

              <div className="space-y-3">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    className="p-3.5 bg-[#FAF8F5] border border-[#E8E3DA] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-[#1F3D2B]">{o.gatedCommunityUnit}</span>
                        <span className="text-[#8A847A]">({o.customerName})</span>
                      </div>
                      <p className="text-[11px] text-[#6E695F]">
                        {o.items.length} items • ₹{o.totalAmount}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E8E3DA]">
                      <Badge
                        variant={
                          o.status === 'delivered' ? 'success' : o.status === 'out_for_delivery' ? 'warning' : 'secondary'
                        }
                        size="sm"
                      >
                        {o.status.replace('_', ' ')}
                      </Badge>
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                        className="p-1 bg-white border border-[#D8D1C5] rounded text-[11px] font-semibold"
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="harvested">Harvested</option>
                        <option value="packed">Packed</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Col (5 cols): Partner Farms Status */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="space-y-4" padding="lg">
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#1F3D2B] pb-3 border-b border-[#F0EBE1]">
                Partner Farms Yield
              </h3>

              <div className="space-y-3">
                {suppliers.map((s) => (
                  <div key={s.id} className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E8E3DA] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-[#1F3D2B]">{s.farmName}</h4>
                      <Badge variant="sage" size="sm">{s.certification}</Badge>
                    </div>
                    <p className="text-[11px] text-[#6E695F]">
                      Grower: {s.name} • {s.location}
                    </p>
                    <div className="flex justify-between pt-1 border-t border-[#E8E3DA] text-[11px]">
                      <span>Active crops: <strong>{s.activeCropsCount}</strong></span>
                      <span>Quality score: <strong className="text-[#8C6D23]">{s.rating} / 5.0</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tab: Subscribers */}
      {activeTab === 'subscribers' && (
        <Card className="space-y-4" padding="lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3 border-b border-[#F0EBE1]">
            <h3 className="font-serif text-base sm:text-lg font-bold text-[#1F3D2B]">
              Palm Grove Enclave Roster
            </h3>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#8A847A] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search unit or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E0DBD1] rounded-xl"
              />
            </div>
          </div>

          <div className="overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="text-[#8A847A] border-b border-[#F0EBE1]">
                  <th className="pb-3 font-semibold pr-4">Resident Name</th>
                  <th className="pb-3 font-semibold pr-4">Gated Unit</th>
                  <th className="pb-3 font-semibold pr-4">Plan</th>
                  <th className="pb-3 font-semibold pr-4">Frequency</th>
                  <th className="pb-3 font-semibold pr-4">Status</th>
                  <th className="pb-3 font-semibold pr-4">Swaps Used</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F1EC]">
                <tr>
                  <td className="py-3 font-bold text-[#1F3D2B] pr-4">Aarav Sharma</td>
                  <td className="py-3 font-medium pr-4">Villa 42, Palm Grove</td>
                  <td className="py-3 pr-4">Gourmet Family Feast</td>
                  <td className="py-3 pr-4">Weekly</td>
                  <td className="py-3 pr-4"><Badge variant="success" size="sm">Active</Badge></td>
                  <td className="py-3 pr-4">1 / 4</td>
                  <td className="py-3 text-right">
                    <button className="text-xs text-[#1F3D2B] font-bold hover:underline cursor-pointer">
                      Manage
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 font-bold text-[#1F3D2B] pr-4">Dr. Priya Nair</td>
                  <td className="py-3 font-medium pr-4">Villa 12, Palm Grove</td>
                  <td className="py-3 pr-4">Vitality Greens & Roots</td>
                  <td className="py-3 pr-4">Weekly</td>
                  <td className="py-3 pr-4"><Badge variant="success" size="sm">Active</Badge></td>
                  <td className="py-3 pr-4">2 / 3</td>
                  <td className="py-3 text-right">
                    <button className="text-xs text-[#1F3D2B] font-bold hover:underline cursor-pointer">
                      Manage
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 font-bold text-[#1F3D2B] pr-4">Vikramaditya Roy</td>
                  <td className="py-3 font-medium pr-4">Tower B - 402</td>
                  <td className="py-3 pr-4">Essential Fresh Harvest</td>
                  <td className="py-3 pr-4">Weekly</td>
                  <td className="py-3 pr-4"><Badge variant="warning" size="sm">Paused</Badge></td>
                  <td className="py-3 pr-4">0 / 2</td>
                  <td className="py-3 text-right">
                    <button className="text-xs text-[#1F3D2B] font-bold hover:underline cursor-pointer">
                      Manage
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 font-bold text-[#1F3D2B] pr-4">Ananya Iyer</td>
                  <td className="py-3 font-medium pr-4">Villa 08, Palm Grove</td>
                  <td className="py-3 pr-4">Gourmet Family Feast</td>
                  <td className="py-3 pr-4">Weekly</td>
                  <td className="py-3 pr-4"><Badge variant="success" size="sm">Active</Badge></td>
                  <td className="py-3 pr-4">0 / 4</td>
                  <td className="py-3 text-right">
                    <button className="text-xs text-[#1F3D2B] font-bold hover:underline cursor-pointer">
                      Manage
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab: Inventory & Farm Stock */}
      {activeTab === 'inventory' && (
        <Card className="space-y-4" padding="lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-[#F0EBE1]">
            <h3 className="font-serif text-base sm:text-lg font-bold text-[#1F3D2B]">
              Farm Stock & Swap Allocation
            </h3>
            <span className="text-xs text-[#8A847A]">{inventory.length} active produce types</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {inventory.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-white border border-[#E8E3DA] rounded-xl flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover border border-[#E0DBD1] shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-[#1F3D2B] truncate">{item.name}</h4>
                    <p className="text-[11px] text-[#8A847A] truncate">
                      ₹{item.pricePerUnit} / {item.unit} • {item.supplierName.split(' ')[0]}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Badge variant={item.stockAvailableKg < 20 ? 'danger' : 'sage'} size="sm">
                        {item.stockAvailableKg} {item.unit} in stock
                      </Badge>
                    </div>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0"
                  onClick={() => {
                    setStockEditItem(item);
                    setNewStockQty(item.stockAvailableKg);
                  }}
                >
                  Adjust
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab: Complaints */}
      {activeTab === 'complaints' && (
        <Card className="space-y-4" padding="lg">
          <h3 className="font-serif text-base sm:text-lg font-bold text-[#1F3D2B] pb-3 border-b border-[#F0EBE1]">
            Resident Quality Issues & Refunds
          </h3>

          <div className="space-y-3">
            {complaints.map((c) => (
              <div key={c.id} className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E3DA] space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[#1F3D2B]">{c.customerName}</span>
                    <Badge variant="warning" size="sm">{c.issueType.replace('_', ' ')}</Badge>
                  </div>
                  <Badge variant={c.status === 'resolved' ? 'success' : 'danger'} size="sm" dot>
                    {c.status.toUpperCase()}
                  </Badge>
                </div>

                <p className="text-[#2E2E2E] leading-relaxed">"{c.description}"</p>

                {c.resolutionNotes ? (
                  <div className="p-2.5 bg-white border border-[#E0DBD1] rounded-lg text-[11px] text-[#555]">
                    <strong className="text-[#1F3D2B]">Resolution:</strong> {c.resolutionNotes}
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="primary"
                    className="w-full sm:w-auto justify-center"
                    onClick={() => setSelectedComplaint(c)}
                  >
                    Resolve & Grant Wallet Credit
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab: Orders */}
      {activeTab === 'orders' && (
        <Card className="space-y-4" padding="lg">
          <h3 className="font-serif text-base sm:text-lg font-bold text-[#1F3D2B] pb-3 border-b border-[#F0EBE1]">
            Master Orders Log
          </h3>

          <div className="overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="text-[#8A847A] border-b border-[#F0EBE1]">
                  <th className="pb-3 font-semibold pr-4">Order #</th>
                  <th className="pb-3 font-semibold pr-4">Resident</th>
                  <th className="pb-3 font-semibold pr-4">Unit</th>
                  <th className="pb-3 font-semibold pr-4">Delivery Date</th>
                  <th className="pb-3 font-semibold pr-4">Total</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F1EC]">
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="py-3 font-bold text-[#1F3D2B] pr-4">#{o.orderNumber}</td>
                    <td className="py-3 pr-4">{o.customerName}</td>
                    <td className="py-3 font-medium pr-4">{o.gatedCommunityUnit}</td>
                    <td className="py-3 pr-4">{o.scheduledDeliveryDate}</td>
                    <td className="py-3 font-bold text-[#1F3D2B] pr-4">₹{o.totalAmount}</td>
                    <td className="py-3">
                      <Badge
                        variant={o.status === 'delivered' ? 'success' : o.status === 'out_for_delivery' ? 'warning' : 'secondary'}
                        size="sm"
                      >
                        {o.status.replace('_', ' ')}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Complaint Resolution Modal */}
      <Modal
        isOpen={!!selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        title="Resolve Resident Quality Ticket"
        subtitle={`Resident: ${selectedComplaint?.customerName}`}
      >
        <div className="space-y-4 text-left text-xs">
          <p className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E3DA] text-[#2E2E2E]">
            "{selectedComplaint?.description}"
          </p>

          <div>
            <label className="block font-bold text-[#1F3D2B] uppercase tracking-wider mb-1.5">
              Resolution Note & Action:
            </label>
            <textarea
              rows={3}
              value={resolutionText}
              onChange={(e) => setResolutionText(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#E0DBD1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F3D2B]"
            />
          </div>

          <div className="pt-3 border-t border-[#F0EBE1] flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <Button
              variant="outline"
              className="w-full sm:w-auto justify-center"
              onClick={() => setSelectedComplaint(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="w-full sm:w-auto justify-center"
              onClick={handleResolveComplaint}
            >
              Confirm & Resolve Ticket
            </Button>
          </div>
        </div>
      </Modal>

      {/* Stock Edit Modal */}
      <Modal
        isOpen={!!stockEditItem}
        onClose={() => setStockEditItem(null)}
        title={`Adjust Farm Stock: ${stockEditItem?.name}`}
      >
        <div className="space-y-4 text-left text-xs">
          <div>
            <label className="block font-bold text-[#1F3D2B] uppercase tracking-wider mb-1.5">
              Available Quantity ({stockEditItem?.unit})
            </label>
            <input
              type="number"
              value={newStockQty}
              onChange={(e) => setNewStockQty(parseFloat(e.target.value) || 0)}
              className="w-full p-2.5 bg-[#FAF8F5] border border-[#E0DBD1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1F3D2B]"
            />
          </div>

          <div className="pt-3 border-t border-[#F0EBE1] flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <Button
              variant="outline"
              className="w-full sm:w-auto justify-center"
              onClick={() => setStockEditItem(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="w-full sm:w-auto justify-center"
              onClick={handleSaveStock}
            >
              Save Stock
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
