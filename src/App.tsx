import React, { useState, useEffect } from 'react';
import { Sprout, ShieldAlert, X } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';
import { Button } from './components/common/Button';
import { UserRole } from './types';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { PlansPage } from './pages/public/PlansPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { AboutPage } from './pages/public/AboutPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';

// Customer Pages
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

const getDashboardForRole = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'packing':
      return '/packing/dashboard';
    case 'delivery':
      return '/delivery/dashboard';
    case 'supplier':
      return '/supplier/dashboard';
    case 'customer':
    default:
      return '/customer/dashboard';
  }
};

interface AccessRestrictedProps {
  currentRole: UserRole;
  requiredRoleName: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

const AccessRestricted: React.FC<AccessRestrictedProps> = ({
  currentRole,
  requiredRoleName,
  onNavigate,
  onLogout
}) => (
  <div className="max-w-md mx-auto py-12 text-center space-y-5">
    <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center shadow-xs">
      <ShieldAlert className="w-7 h-7" />
    </div>
    <div className="space-y-2">
      <h2 className="font-serif text-2xl font-bold text-[#1F3D2B]">Access Restricted</h2>
      <p className="text-xs text-[#6E695F] leading-relaxed">
        Your account is signed in with the <strong className="capitalize">{currentRole}</strong> role.
        Access to this section requires <strong>{requiredRoleName}</strong> permissions.
      </p>
    </div>
    <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
      <Button
        variant="primary"
        size="md"
        onClick={() => onNavigate(getDashboardForRole(currentRole))}
      >
        Go to My Dashboard
      </Button>
      <Button
        variant="outline"
        size="md"
        onClick={async () => {
          await onLogout();
          onNavigate('/login');
        }}
      >
        Sign Out
      </Button>
    </div>
  </div>
);

const MainRouter: React.FC = () => {
  const { currentUser, isAuthenticated, loading, logout } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Verify Supabase connection on load
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

  const isDashboardView =
    currentPath.startsWith('/customer') ||
    currentPath.startsWith('/admin') ||
    currentPath.startsWith('/packing') ||
    currentPath.startsWith('/delivery') ||
    currentPath.startsWith('/supplier');

  // Loading screen while Supabase session is being checked
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F1EC] flex flex-col items-center justify-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-[#1F3D2B] text-[#A7C4A0] flex items-center justify-center font-bold shadow-md animate-pulse">
          <Sprout className="w-6 h-6" />
        </div>
        <p className="text-xs font-semibold text-[#1F3D2B] tracking-wider uppercase">
          Restoring FreshVerse Session...
        </p>
      </div>
    );
  }

  const renderContent = () => {
    // 1. Unauthenticated users cannot access dashboard routes
    if (!isAuthenticated && isDashboardView) {
      return <LoginPage onNavigate={navigate} />;
    }

    // 2. Authenticated users visiting /login or /register are redirected to their dashboard
    if (isAuthenticated && currentUser && (currentPath === '/login' || currentPath === '/register')) {
      const targetDashboard = getDashboardForRole(currentUser.role);
      setTimeout(() => navigate(targetDashboard), 0);
      return (
        <div className="p-8 text-center text-xs text-[#8A847A]">
          Redirecting to your dashboard...
        </div>
      );
    }

    // 3. Role-based Route Protection for authenticated users
    const userRole = currentUser?.role || 'customer';

    // Admin portal protection: Admin only
    if (currentPath.startsWith('/admin') && userRole !== 'admin') {
      return (
        <AccessRestricted
          currentRole={userRole}
          requiredRoleName="Administrator"
          onNavigate={navigate}
          onLogout={logout}
        />
      );
    }

    // Packing portal protection: Packing staff or Admin
    if (currentPath.startsWith('/packing') && userRole !== 'packing' && userRole !== 'admin') {
      return (
        <AccessRestricted
          currentRole={userRole}
          requiredRoleName="Packing Staff"
          onNavigate={navigate}
          onLogout={logout}
        />
      );
    }

    // Delivery portal protection: Delivery partner or Admin
    if (currentPath.startsWith('/delivery') && userRole !== 'delivery' && userRole !== 'admin') {
      return (
        <AccessRestricted
          currentRole={userRole}
          requiredRoleName="Delivery Partner"
          onNavigate={navigate}
          onLogout={logout}
        />
      );
    }

    // Supplier portal protection: Supplier farmer or Admin
    if (currentPath.startsWith('/supplier') && userRole !== 'supplier' && userRole !== 'admin') {
      return (
        <AccessRestricted
          currentRole={userRole}
          requiredRoleName="Organic Supplier"
          onNavigate={navigate}
          onLogout={logout}
        />
      );
    }

    // Customer routes protection: Customer or Admin
    if (currentPath.startsWith('/customer') && userRole !== 'customer' && userRole !== 'admin') {
      return (
        <AccessRestricted
          currentRole={userRole}
          requiredRoleName="Resident / Customer"
          onNavigate={navigate}
          onLogout={logout}
        />
      );
    }

    // Route Switching
    switch (currentPath) {
      // Public routes
      case '/':
        return <LandingPage onNavigate={navigate} />;
      case '/plans':
        return <PlansPage onNavigate={navigate} />;
      case '/how-it-works':
        return <HowItWorksPage onNavigate={navigate} />;
      case '/about':
        return <AboutPage onNavigate={navigate} />;
      case '/login':
      case '/register':
        return <LoginPage onNavigate={navigate} />;

      // Customer routes
      case '/customer/dashboard':
        return <CustomerDashboard onNavigate={navigate} />;
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

      // Operations / Staff routes
      case '/admin/dashboard':
        return <AdminDashboard />;
      case '/packing/dashboard':
        return <PackingDashboard />;
      case '/delivery/dashboard':
        return <DeliveryDashboard />;
      case '/supplier/dashboard':
        return <SupplierDashboard />;

      default:
        // Default route fallback
        if (isAuthenticated && currentUser) {
          if (currentUser.role === 'admin') return <AdminDashboard />;
          if (currentUser.role === 'packing') return <PackingDashboard />;
          if (currentUser.role === 'delivery') return <DeliveryDashboard />;
          if (currentUser.role === 'supplier') return <SupplierDashboard />;
          return <CustomerDashboard onNavigate={navigate} />;
        }
        return <LandingPage onNavigate={navigate} />;
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
      {isDashboardView && isAuthenticated ? (
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
                    className="p-1.5 text-[#2E2E2E]/60 hover:text-[#2E2E2E] hover:bg-[#F4F1EC] rounded-lg transition-colors"
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

      {/* Footer on public pages */}
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
