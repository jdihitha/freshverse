import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';
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

const MainRouter: React.FC = () => {
  const { currentUser, isAuthenticated, switchRole, logout } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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

  const isDashboardView = currentPath.startsWith('/customer') ||
    currentPath.startsWith('/admin') ||
    currentPath.startsWith('/packing') ||
    currentPath.startsWith('/delivery') ||
    currentPath.startsWith('/supplier');

  const renderContent = () => {
    // Public routes
    switch (currentPath) {
      case '/':
        return <LandingPage onNavigate={navigate} />;
      case '/plans':
        return <PlansPage onNavigate={navigate} />;
      case '/how-it-works':
        return <HowItWorksPage onNavigate={navigate} />;
      case '/about':
        return <AboutPage onNavigate={navigate} />;
      case '/login':
        return <LoginPage onNavigate={navigate} />;
      case '/register':
        return <RegisterPage onNavigate={navigate} />;

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

      // Role ops routes
      case '/admin/dashboard':
        return <AdminDashboard />;
      case '/packing/dashboard':
        return <PackingDashboard />;
      case '/delivery/dashboard':
        return <DeliveryDashboard />;
      case '/supplier/dashboard':
        return <SupplierDashboard />;

      default:
        // Default fallback
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
      {isDashboardView ? (
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex gap-8">
          {/* Persistent Sidebar on Desktop, Drawer on Mobile */}
          <div className={`${isMobileSidebarOpen ? 'block' : 'hidden'} lg:block shrink-0`}>
            <Sidebar
              currentPath={currentPath}
              onNavigate={(path) => {
                navigate(path);
                setIsMobileSidebarOpen(false);
              }}
            />
          </div>

          {/* Main Dashboard Workspace View */}
          <main className="flex-1 min-w-0">
            {renderContent()}
          </main>
        </div>
      ) : (
        <main className="flex-1">
          {renderContent()}
        </main>
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
