import React, { useState } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Truck, 
  Calendar, 
  Sprout, 
  AlertCircle, 
  ArrowRight,
  Info
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

interface NotificationsPageProps {
  onNavigate: (path: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigate }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();
  const { currentUser } = useAuth();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredNotifs = notifications.filter(n => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'delivery':
        return <Truck className="w-4 h-4 text-[#8C6D23]" />;
      case 'subscription':
        return <Calendar className="w-4 h-4 text-[#4B6B48]" />;
      case 'inventory':
        return <Sprout className="w-4 h-4 text-[#1F3D2B]" />;
      case 'complaint':
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
      default:
        return <Bell className="w-4 h-4 text-[#8A847A]" />;
    }
  };

  return (
    <div className="space-y-8 text-left max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1F3D2B]">
            Notifications & Harvest Alerts
          </h1>
          <p className="text-xs sm:text-sm text-[#2E2E2E]/70 mt-1">
            Real-time updates regarding basket customization windows, morning departures, and farm news.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={markAllNotificationsRead}
          leftIcon={<CheckCheck className="w-4 h-4" />}
        >
          Mark All as Read
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-[#E8E3DA]">
        {['all', 'delivery', 'subscription', 'inventory', 'complaint'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer ${
              filterType === type
                ? 'bg-[#1F3D2B] text-white'
                : 'bg-[#FAF8F5] text-[#6E695F] hover:text-[#1F3D2B] border border-[#E8E3DA]'
            }`}
          >
            {type === 'all' ? 'All Alerts' : type}
          </button>
        ))}
      </div>

      {/* Notification items */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <Card className="text-center py-12 text-[#8A847A]" padding="lg">
            <Bell className="w-8 h-8 mx-auto text-[#A7C4A0] mb-2" />
            <p className="font-serif text-base font-bold text-[#1F3D2B]">No Notifications</p>
            <p className="text-xs text-[#8A847A] mt-0.5">You are completely up to date with your community harvest alerts.</p>
          </Card>
        ) : (
          filteredNotifs.map((notif) => (
            <Card
              key={notif.id}
              className={`flex items-start justify-between gap-4 transition-all ${
                !notif.isRead ? 'bg-[#FAF6EC] border-[#C6A969]/40' : 'bg-white'
              }`}
              padding="md"
            >
              <div className="flex items-start gap-3.5 text-xs min-w-0">
                <div className="w-9 h-9 rounded-xl bg-white border border-[#E0DBD1] flex items-center justify-center shrink-0">
                  {getNotifIcon(notif.type)}
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-[#1F3D2B] truncate">{notif.title}</h4>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#C6A969] shrink-0" />
                    )}
                  </div>
                  <p className="text-[#2E2E2E]/80 leading-relaxed">{notif.message}</p>
                  <span className="text-[10px] text-[#8A847A] block">
                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(notif.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {notif.actionUrl && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      markNotificationRead(notif.id);
                      onNavigate(notif.actionUrl!);
                    }}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    View
                  </Button>
                )}
                {!notif.isRead && (
                  <button
                    onClick={() => markNotificationRead(notif.id)}
                    className="text-[11px] text-[#8A847A] hover:text-[#1F3D2B] font-medium cursor-pointer"
                  >
                    Dismiss
                  </button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
