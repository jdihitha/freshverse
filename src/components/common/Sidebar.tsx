import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  ShoppingBag, 
  Clock, 
  Truck, 
  AlertCircle, 
  Star, 
  Bell, 
  User, 
  Users, 
  Package, 
  Tractor, 
  BarChart3, 
  CheckSquare, 
  Layers, 
  Sliders
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { useData } from '../../context/DataContext';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate }) => {
  const { currentRole, currentUser } = useAuth();
  const { complaints, notifications } = useData();

  const openComplaintsCount = complaints.filter(c => c.status === 'open').length;
  const unreadCount = notifications.filter(n => n.userId === currentUser?.id && !n.isRead).length;

  interface NavItem {
    label: string;
    path: string;
    icon: React.ReactNode;
    badge?: string | number;
  }

  const customerNav: NavItem[] = [
    { label: 'Overview', path: '/customer/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'My Basket & Swaps', path: '/customer/basket', icon: <ShoppingBag className="w-4 h-4" /> },
    { label: 'Subscription', path: '/customer/subscription', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Orders History', path: '/customer/orders', icon: <Clock className="w-4 h-4" /> },
    { label: 'Delivery Tracking', path: '/customer/delivery', icon: <Truck className="w-4 h-4" /> },
    { label: 'Notifications', path: '/customer/notifications', icon: <Bell className="w-4 h-4" />, badge: unreadCount > 0 ? unreadCount : undefined },
    { label: 'Quality & Help', path: '/customer/complaints', icon: <AlertCircle className="w-4 h-4" /> },
    { label: 'Rate Orders', path: '/customer/ratings', icon: <Star className="w-4 h-4" /> },
    { label: 'Account Profile', path: '/customer/profile', icon: <User className="w-4 h-4" /> }
  ];

  const adminNav: NavItem[] = [
    { label: 'Overview & Metrics', path: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Community Residents', path: '/admin/users', icon: <Users className="w-4 h-4" /> },
    { label: 'Subscriptions', path: '/admin/subscriptions', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Active Orders', path: '/admin/orders', icon: <Package className="w-4 h-4" /> },
    { label: 'Inventory & Crops', path: '/admin/inventory', icon: <Layers className="w-4 h-4" /> },
    { label: 'Farms & Suppliers', path: '/admin/suppliers', icon: <Tractor className="w-4 h-4" /> },
    { label: 'Gated Deliveries', path: '/admin/deliveries', icon: <Truck className="w-4 h-4" /> },
    { label: 'Quality Complaints', path: '/admin/complaints', icon: <AlertCircle className="w-4 h-4" />, badge: openComplaintsCount > 0 ? openComplaintsCount : undefined },
    { label: 'Analytics & Trends', path: '/admin/analytics', icon: <BarChart3 className="w-4 h-4" /> }
  ];

  const packingNav: NavItem[] = [
    { label: 'Packing Station', path: '/packing/dashboard', icon: <CheckSquare className="w-4 h-4" /> }
  ];

  const deliveryNav: NavItem[] = [
    { label: 'Driver Route & Drops', path: '/delivery/dashboard', icon: <Truck className="w-4 h-4" /> }
  ];

  const supplierNav: NavItem[] = [
    { label: 'Harvest & Stock Portal', path: '/supplier/dashboard', icon: <Tractor className="w-4 h-4" /> }
  ];

  const navMap: Record<UserRole, NavItem[]> = {
    customer: customerNav,
    admin: adminNav,
    packing: packingNav,
    delivery: deliveryNav,
    supplier: supplierNav
  };

  const items = navMap[currentRole] || customerNav;

  return (
    <aside className="w-64 shrink-0 hidden lg:block bg-white border-r border-[#E8E3DA] min-h-[calc(100vh-6.5rem)] p-4">
      <div className="mb-4 px-3 py-2 bg-[#FAF8F5] rounded-xl border border-[#EBE6DC]">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A847A] block">
          Current Workspace
        </span>
        <p className="text-xs font-bold text-[#1F3D2B] capitalize mt-0.5">
          {currentRole === 'customer' ? 'Resident Subscriber' : `${currentRole} Console`}
        </p>
      </div>

      <nav className="space-y-1">
        {items.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#1F3D2B] text-white shadow-xs'
                  : 'text-[#2E2E2E]/80 hover:bg-[#F4F1EC] hover:text-[#1F3D2B]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-[#A7C4A0]' : 'text-[#8A847A]'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-[#C6A969] text-[#1F3D2B]'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Community Context Card */}
      <div className="mt-8 p-3.5 rounded-xl bg-[#1F3D2B]/5 border border-[#1F3D2B]/10 text-left">
        <p className="text-[11px] font-bold text-[#1F3D2B]">The Palm Grove Community</p>
        <p className="text-[10px] text-[#555] mt-1 leading-relaxed">
          Morning deliveries run on Wed & Sat from 7:00 AM – 9:00 AM via quiet EV shuttles.
        </p>
      </div>
    </aside>
  );
};
