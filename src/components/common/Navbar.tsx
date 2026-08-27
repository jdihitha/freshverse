import React, { useState } from 'react';
import { 
  Sprout, 
  ShoppingBag, 
  Bell, 
  User as UserIcon, 
  Menu, 
  X, 
  LogOut, 
  ChevronDown, 
  Shield, 
  Package, 
  Truck, 
  Tractor,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { UserRole } from '../../types';
import { Badge } from './Badge';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { currentUser, currentRole, isAuthenticated, logout, switchRole } = useAuth();
  const { notifications, markNotificationAsRead, subscription } = useData();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => n.userId === currentUser?.id && !n.isRead);
  const basketItemCount = (subscription?.basketCustomization?.selectedItems?.length || 0) + 
                          (subscription?.basketCustomization?.extraItems?.length || 0);

  const roleMeta: Record<UserRole, { label: string; icon: React.ReactNode; defaultPath: string; color: string }> = {
    customer: { label: 'Resident / Customer', icon: <UserIcon className="w-3.5 h-3.5" />, defaultPath: '/customer/dashboard', color: 'bg-[#1F3D2B] text-white' },
    admin: { label: 'Community Admin', icon: <Shield className="w-3.5 h-3.5" />, defaultPath: '/admin/dashboard', color: 'bg-[#C6A969] text-[#1F3D2B]' },
    packing: { label: 'Packing Staff', icon: <Package className="w-3.5 h-3.5" />, defaultPath: '/packing/dashboard', color: 'bg-[#A7C4A0] text-[#1F3D2B]' },
    delivery: { label: 'Delivery Partner', icon: <Truck className="w-3.5 h-3.5" />, defaultPath: '/delivery/dashboard', color: 'bg-[#2E2E2E] text-white' },
    supplier: { label: 'Organic Supplier', icon: <Tractor className="w-3.5 h-3.5" />, defaultPath: '/supplier/dashboard', color: 'bg-[#1F3D2B] text-[#A7C4A0]' }
  };

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
    setIsRoleDropdownOpen(false);
    onNavigate(roleMeta[role].defaultPath);
  };

  const isPublicPage = ['/', '/plans', '/how-it-works', '/about', '/login', '/register'].includes(currentPath);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E3DA] transition-all">
      {/* Top Demo Bar for Easy Role Switching */}
      <div className="bg-[#1F3D2B] text-[#F4F1EC] text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#A7C4A0] animate-pulse" />
            <span className="font-medium text-[#F4F1EC]/90">
              Gated Community MVP — Palm Grove Residency
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#A7C4A0] hidden sm:inline text-[11px]">Role view:</span>
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-2.5 py-0.5 rounded text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                {roleMeta[currentRole].icon}
                <span>{roleMeta[currentRole].label}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-1 w-52 bg-white text-[#2E2E2E] rounded-xl shadow-xl border border-[#E0DBD1] py-1 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[11px] uppercase tracking-wider font-bold text-[#8A847A] border-b border-[#F0EBE1]">
                    Switch User Role View
                  </div>
                  {(['customer', 'admin', 'packing', 'delivery', 'supplier'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRoleSwitch(r)}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-[#F4F1EC] cursor-pointer transition-colors ${
                        currentRole === r ? 'bg-[#A7C4A0]/20 font-bold text-[#1F3D2B]' : ''
                      }`}
                    >
                      {roleMeta[r].icon}
                      <span>{roleMeta[r].label}</span>
                      {currentRole === r && <span className="ml-auto text-[#1F3D2B] text-[10px]">● Active</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate(isAuthenticated ? roleMeta[currentRole].defaultPath : '/')}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-[#1F3D2B] flex items-center justify-center text-[#A7C4A0] shadow-sm group-hover:scale-105 transition-transform">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif text-xl font-bold tracking-tight text-[#1F3D2B] block leading-none">
              FreshVerse
            </span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-[#8C6D23]">
              Curated Harvests
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#2E2E2E]/80">
          {isPublicPage ? (
            <>
              <button
                onClick={() => onNavigate('/')}
                className={`hover:text-[#1F3D2B] transition-colors cursor-pointer ${currentPath === '/' ? 'text-[#1F3D2B] font-bold' : ''}`}
              >
                Home
              </button>
              <button
                onClick={() => onNavigate('/how-it-works')}
                className={`hover:text-[#1F3D2B] transition-colors cursor-pointer ${currentPath === '/how-it-works' ? 'text-[#1F3D2B] font-bold' : ''}`}
              >
                How It Works
              </button>
              <button
                onClick={() => onNavigate('/plans')}
                className={`hover:text-[#1F3D2B] transition-colors cursor-pointer ${currentPath === '/plans' ? 'text-[#1F3D2B] font-bold' : ''}`}
              >
                Subscription Plans
              </button>
              <button
                onClick={() => onNavigate('/about')}
                className={`hover:text-[#1F3D2B] transition-colors cursor-pointer ${currentPath === '/about' ? 'text-[#1F3D2B] font-bold' : ''}`}
              >
                About Our Farms
              </button>
            </>
          ) : (
            <>
              {currentRole === 'customer' && (
                <>
                  <button
                    onClick={() => onNavigate('/customer/dashboard')}
                    className={`hover:text-[#1F3D2B] transition-colors cursor-pointer ${currentPath === '/customer/dashboard' ? 'text-[#1F3D2B] font-bold' : ''}`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => onNavigate('/customer/basket')}
                    className={`hover:text-[#1F3D2B] transition-colors cursor-pointer ${currentPath === '/customer/basket' ? 'text-[#1F3D2B] font-bold' : ''}`}
                  >
                    My Basket
                  </button>
                  <button
                    onClick={() => onNavigate('/customer/subscription')}
                    className={`hover:text-[#1F3D2B] transition-colors cursor-pointer ${currentPath === '/customer/subscription' ? 'text-[#1F3D2B] font-bold' : ''}`}
                  >
                    Subscription
                  </button>
                  <button
                    onClick={() => onNavigate('/customer/orders')}
                    className={`hover:text-[#1F3D2B] transition-colors cursor-pointer ${currentPath === '/customer/orders' ? 'text-[#1F3D2B] font-bold' : ''}`}
                  >
                    Orders & Deliveries
                  </button>
                </>
              )}
              {currentRole === 'admin' && (
                <span className="text-xs font-semibold text-[#1F3D2B] bg-[#F4F1EC] px-3 py-1 rounded-md border border-[#E0DBD1]">
                  Administrator Console
                </span>
              )}
              {currentRole === 'packing' && (
                <span className="text-xs font-semibold text-[#1F3D2B] bg-[#F4F1EC] px-3 py-1 rounded-md border border-[#E0DBD1]">
                  Fulfillment Packing Station
                </span>
              )}
              {currentRole === 'delivery' && (
                <span className="text-xs font-semibold text-[#1F3D2B] bg-[#F4F1EC] px-3 py-1 rounded-md border border-[#E0DBD1]">
                  Gated Delivery Driver App
                </span>
              )}
              {currentRole === 'supplier' && (
                <span className="text-xs font-semibold text-[#1F3D2B] bg-[#F4F1EC] px-3 py-1 rounded-md border border-[#E0DBD1]">
                  Farmer Harvest Portal
                </span>
              )}
            </>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Basket quick button for customer */}
              {currentRole === 'customer' && (
                <button
                  onClick={() => onNavigate('/customer/basket')}
                  className="relative p-2 rounded-lg text-[#2E2E2E] hover:bg-[#F4F1EC] transition-colors cursor-pointer"
                  title="View Customized Basket"
                >
                  <ShoppingBag className="w-5 h-5 text-[#1F3D2B]" />
                  {basketItemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C6A969] text-[#1F3D2B] font-bold text-[10px] rounded-full flex items-center justify-center">
                      {basketItemCount}
                    </span>
                  )}
                </button>
              )}

              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="relative p-2 rounded-lg text-[#2E2E2E] hover:bg-[#F4F1EC] transition-colors cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5 text-[#1F3D2B]" />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-600 rounded-full ring-2 ring-white" />
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E0DBD1] rounded-2xl shadow-xl py-3 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 pb-2 border-b border-[#F0EBE1] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif font-bold text-sm text-[#1F3D2B]">Notifications</h4>
                        {unreadNotifications.length > 0 && (
                          <Badge variant="warning" size="sm">{unreadNotifications.length} new</Badge>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setIsNotifOpen(false);
                          if (currentRole === 'customer') onNavigate('/customer/notifications');
                        }}
                        className="text-xs text-[#1F3D2B] font-semibold hover:underline cursor-pointer"
                      >
                        View all
                      </button>
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-[#F4F1EC]">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-[#8A847A]">
                          No notifications at this time.
                        </div>
                      ) : (
                        notifications.slice(0, 4).map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => {
                              markNotificationAsRead(notif.id);
                              if (notif.actionUrl) {
                                setIsNotifOpen(false);
                                onNavigate(notif.actionUrl);
                              }
                            }}
                            className={`p-3.5 hover:bg-[#FAF8F5] transition-colors cursor-pointer text-left ${
                              !notif.isRead ? 'bg-[#A7C4A0]/10' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs font-semibold text-[#1F3D2B]">{notif.title}</p>
                              {!notif.isRead && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#1F3D2B] mt-1 shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-[#525252] mt-0.5 line-clamp-2">{notif.message}</p>
                            <span className="text-[10px] text-[#8A847A] mt-1 block">
                              {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User profile dropdown pill */}
              <div className="flex items-center gap-2 pl-2 border-l border-[#E0DBD1]">
                <button
                  onClick={() => onNavigate(roleMeta[currentRole].defaultPath)}
                  className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full hover:bg-[#F4F1EC] transition-colors cursor-pointer border border-[#E8E3DA]"
                >
                  <img
                    src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={currentUser?.name || 'User'}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-[#1F3D2B]/20"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-[#1F3D2B] leading-none">
                      {currentUser?.name.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-[#6E695F] leading-none mt-0.5">
                      {currentUser?.gatedCommunityUnit?.split(',')[0]}
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    logout();
                    onNavigate('/');
                  }}
                  className="p-2 text-[#8A847A] hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('/login')}
                className="text-xs font-semibold px-3.5 py-2 text-[#1F3D2B] hover:bg-[#1F3D2B]/5 rounded-lg transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('/register')}
                className="text-xs font-bold px-4 py-2 bg-[#1F3D2B] text-white hover:bg-[#284f38] rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Get Started
              </button>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 md:hidden text-[#2E2E2E] hover:bg-[#F4F1EC] rounded-lg cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8E3DA] bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2">
          {isPublicPage ? (
            <>
              <button
                onClick={() => { setIsMobileMenuOpen(false); onNavigate('/'); }}
                className="block w-full text-left py-2 text-sm font-medium text-[#2E2E2E]"
              >
                Home
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); onNavigate('/how-it-works'); }}
                className="block w-full text-left py-2 text-sm font-medium text-[#2E2E2E]"
              >
                How It Works
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); onNavigate('/plans'); }}
                className="block w-full text-left py-2 text-sm font-medium text-[#2E2E2E]"
              >
                Subscription Plans
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); onNavigate('/about'); }}
                className="block w-full text-left py-2 text-sm font-medium text-[#2E2E2E]"
              >
                About Our Farms
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { setIsMobileMenuOpen(false); onNavigate(roleMeta[currentRole].defaultPath); }}
                className="block w-full text-left py-2 text-sm font-bold text-[#1F3D2B]"
              >
                Role Dashboard ({roleMeta[currentRole].label})
              </button>
              {currentRole === 'customer' && (
                <>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); onNavigate('/customer/basket'); }}
                    className="block w-full text-left py-2 text-sm font-medium text-[#2E2E2E]"
                  >
                    My Basket Customization
                  </button>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); onNavigate('/customer/subscription'); }}
                    className="block w-full text-left py-2 text-sm font-medium text-[#2E2E2E]"
                  >
                    Manage Subscription
                  </button>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); onNavigate('/customer/orders'); }}
                    className="block w-full text-left py-2 text-sm font-medium text-[#2E2E2E]"
                  >
                    Orders & Delivery Tracking
                  </button>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); onNavigate('/customer/complaints'); }}
                    className="block w-full text-left py-2 text-sm font-medium text-[#2E2E2E]"
                  >
                    Quality Complaints
                  </button>
                </>
              )}
            </>
          )}

          {!isAuthenticated && (
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => { setIsMobileMenuOpen(false); onNavigate('/login'); }}
                className="w-full py-2.5 text-center text-sm font-semibold border border-[#1F3D2B] text-[#1F3D2B] rounded-lg"
              >
                Sign In
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); onNavigate('/register'); }}
                className="w-full py-2.5 text-center text-sm font-semibold bg-[#1F3D2B] text-white rounded-lg"
              >
                Subscribe Now
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
