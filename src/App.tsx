import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';
import { UserRole } from './types';

// Public & Info Pages
import { LandingPage } from './pages/public/LandingPage';
import { PlansPage } from './pages/public/PlansPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { AboutPage } from './pages/public/AboutPage';

// Customer Main Application Pages
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { SubscriptionPage } from './pages/customer/SubscriptionPage';
import { BasketPage } from './pages/customer/BasketPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { OrdersPage } from './pages/customer/OrdersPage';
import { DeliveryTrackingPage } from './pages/customer/DeliveryTrackingPage';
import { ComplaintsPage } from './pages/customer/ComplaintsPage';
import { RatingsPage } from './pages/customer/RatingsPage';
import { NotificationsPage } from './pages/customer/NotificationsPage';
import { ProfilePage } from './pages/customer/ProfilePage';

// Ops / Staff Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { PackingDashboard } from './pages/packing/PackingDashboard';
import { DeliveryDashboard } from './pages/delivery/DeliveryDashboard';
import { SupplierDashboard } from './pages/supplier/SupplierDashboard';

import { testSupabaseConnection } from './lib/supabase';

const MainRouter: React.FC = () => {
  const { currentRole } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Verify Supabase database tables connection on load
  useEffect(() => {
    testSupabaseConnection();
  }, []);

  // Sync with browser hash / path
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setCurrentPath(hash);
      }
    };

    if (window.location.hash) {
      setCurrentPath(window.location.hash.replace('#', ''));
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine if viewing a dashboard portal
  const isDashboardView =
    currentPath === '/' ||
    currentPath.startsWith('/customer') ||
    currentPath.startsWith('/admin') ||
    currentPath.startsWith('/packing') ||
    currentPath.startsWith('/delivery') ||
    currentPath.startsWith('/supplier');

  const renderContent = () => {
    switch (currentPath) {
      // Main Application Entry: opening FreshVerse directly loads the main dashboard
      case '/':
      case '/customer/dashboard':
      case '/login':
      case '/register':
        return <CustomerDashboard onNavigate={navigate} />;

      // Informational / Discovery Pages
      case '/welcome':
      case '/landing':
        return <LandingPage onNavigate={navigate} />;
      case '/plans':
        return <PlansPage onNavigate={navigate} />;
      case '/how-it-works':
        return <HowItWorksPage onNavigate={navigate} />;
      case '/about':
        return <AboutPage onNavigate={navigate} />;

      // Customer features
      case '/customer/subscription':
        return <SubscriptionPage onNavigate={navigate} />;
      case '/customer/basket':
        return <BasketPage onNavigate={navigate} />;
      case '/customer/checkout':
        return <CheckoutPage onNavigate={navigate} />;
      case '/customer/orders':
        return <OrdersPage onNavigate={navigate} />;
      case '/customer/delivery':
        return <DeliveryTrackingPage onNavigate={navigate} />;
      case '/customer/complaints':
        return <ComplaintsPage onNavigate={navigate} />;
      case '/customer/ratings':
        return <RatingsPage onNavigate={navigate} />;
      case '/customer/notifications':
        return <NotificationsPage onNavigate={navigate} />;
      case '/customer/profile':
        return <ProfilePage />;

      // Operations / Staff features
      case '/admin/dashboard':
      case '/admin/users':
      case '/admin/subscriptions':
      case '/admin/orders':
      case '/admin/inventory':
      case '/admin/suppliers':
      case '/admin/deliveries':
      case '/admin/complaints':
      case '/admin/analytics':
        return <AdminDashboard />;
      case '/packing/dashboard':
        return <PackingDashboard />;
      case '/delivery/dashboard':
        return <DeliveryDashboard />;
      case '/supplier/dashboard':
        return <SupplierDashboard />;

      default:
        return <CustomerDashboard onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EC] text-[#2E2E2E] flex flex-col font-sans selection:bg-[#1F3D2B] selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      {/* Main Body */}
      {isDashboardView ? (
        <div className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 flex gap-4 lg:gap-8">
          {/* Mobile Sidebar Overlay Drawer */}
          {isMobileSidebarOpen && (
            <div
              className="fixed inset-0 bg-[#1F3D2B]/50 backdrop-blur-xs z-50 lg:hidden flex"
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <div
                className="w-72 max-w-[85vw] h-full bg-white shadow-2xl overflow-y-auto flex flex-col animate-in slide-in-from-left duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b border-[#E8E3DA] flex items-center justify-between">
                  <span className="font-serif font-bold text-[#1F3D2B] text-lg">FreshVerse</span>
                  <button
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="p-1.5 text-[#2E2E2E]/60 hover:text-[#2E2E2E] hover:bg-[#F4F1EC] rounded-lg transition-colors cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <Sidebar
                    currentPath={currentPath}
                    isMobile
                    onNavigate={(path) => {
                      navigate(path);
                      setIsMobileSidebarOpen(false);
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Persistent Sidebar on Desktop */}
          <div className="hidden lg:block shrink-0">
            <Sidebar
              currentPath={currentPath}
              onNavigate={(path) => {
                navigate(path);
              }}
            />
          </div>

          {/* Main Dashboard Workspace View */}
          <main className="flex-1 min-w-0">{renderContent()}</main>
        </div>
      ) : (
        <main className="flex-1">{renderContent()}</main>
      )}

      {/* Footer on informational pages */}
      {!isDashboardView && <Footer onNavigate={navigate} />}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainRouter />
      </DataProvider>
    </AuthProvider>
  );
}
