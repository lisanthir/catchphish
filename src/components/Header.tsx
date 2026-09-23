import React, { useState } from 'react';
import {
  Bell,
  Moon,
  Sun,
  Shield,
  Search,
  Sparkles,
  Info,
  CheckCircle2,
  X,
  Palette,
} from 'lucide-react';
import { useTheme, ACCENT_OPTIONS } from '../context/ThemeContext';
import { NotificationItem } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  notifications: NotificationItem[];
  onNotificationClick: (notif: NotificationItem) => void;
  onClearNotifications: () => void;
  onOpenEmail: (id: string) => void;
  onNavigate: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  notifications,
  onNotificationClick,
  onClearNotifications,
  onOpenEmail,
  onNavigate,
}) => {
  const { theme, toggleTheme, accent, setAccent } = useTheme();
  const [showNotifPopover, setShowNotifPopover] = useState(false);
  const [showAccentPicker, setShowAccentPicker] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 py-3 border-b backdrop-blur-md transition-colors"
      style={{
        backgroundColor: 'var(--glass-bg)',
        borderColor: 'var(--border-primary)',
      }}
    >
      {/* Zone 1: Single text element wordmark + Quick Demo indicator */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-sm transition-transform group-hover:scale-105"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              CatchPhish
            </span>
          </div>
        </button>

        {/* DEMO MODE Badge */}
        <button
          onClick={() => setShowDemoModal(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border cursor-pointer transition-colors"
          style={{
            backgroundColor: 'var(--accent-subtle)',
            color: 'var(--accent-text)',
            borderColor: 'var(--accent-border)',
          }}
          title="Click to learn about Demo Mode"
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)' }} />
          <span>DEMO MODE</span>
        </button>
      </div>

      {/* Zone 2: Real Universal Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-xl mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search sender, email, subject, body text, or domain..."
            className="w-full pl-10 pr-9 py-1.5 text-sm rounded-lg border transition-all focus:outline-none focus:ring-2"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-primary)',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs opacity-60 hover:opacity-100"
              style={{ color: 'var(--text-muted)' }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Zone 3: Actions (Accent customizer, Theme toggle, Notification bell, Sandbox Avatar) */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Accent Color Customizer Button */}
        <div className="relative">
          <button
            onClick={() => setShowAccentPicker(!showAccentPicker)}
            className="p-2 rounded-lg border transition-colors hover:opacity-90 cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-secondary)',
            }}
            title="Customize Accent Color"
            aria-label="Customize Accent Color"
          >
            <Palette className="w-4 h-4" />
          </button>

          {showAccentPicker && (
            <div
              className="absolute right-0 mt-2 w-48 p-2.5 rounded-xl border shadow-xl z-50 animate-in fade-in zoom-in-95"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-primary)',
              }}
            >
              <div className="text-xs font-semibold px-2 py-1 mb-1.5" style={{ color: 'var(--text-muted)' }}>
                ACCENT COLOR
              </div>
              <div className="space-y-1">
                {ACCENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setAccent(opt.id);
                      setShowAccentPicker(false);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                    style={{
                      backgroundColor: accent === opt.id ? 'var(--accent-subtle)' : 'transparent',
                      color: accent === opt.id ? 'var(--accent-text)' : 'var(--text-primary)',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: opt.color }} />
                      <span>{opt.label}</span>
                    </div>
                    {accent === opt.id && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle (Dark / Light) */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg border transition-colors hover:opacity-90 cursor-pointer"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)',
            color: 'var(--text-secondary)',
          }}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme mode"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
        </button>

        {/* Notification Bell with Badge */}
        <div className="relative">
          <button
            onClick={() => setShowNotifPopover(!showNotifPopover)}
            className="relative p-2 rounded-lg border transition-colors hover:opacity-90 cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-secondary)',
            }}
            title="Notifications"
            aria-label="View security notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white rounded-full flex items-center justify-center animate-pulse"
                style={{ backgroundColor: 'var(--risk-critical)' }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Popover */}
          {showNotifPopover && (
            <div
              className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-primary)',
              }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border-primary)' }}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Security Alerts</span>
                  {unreadCount > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent-text)' }}>
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={onClearNotifications}
                    className="text-xs hover:underline cursor-pointer"
                    style={{ color: 'var(--accent-text)' }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y" style={{ borderColor: 'var(--border-primary)' }}>
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        onNotificationClick(notif);
                        if (notif.emailId) {
                          onOpenEmail(notif.emailId);
                          setShowNotifPopover(false);
                        }
                      }}
                      className="p-3.5 text-left transition-colors cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
                      style={{
                        backgroundColor: notif.read ? 'transparent' : 'var(--accent-subtle)',
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>
                          {notif.title}
                        </span>
                        <span className="text-[10px] tabular-nums shrink-0" style={{ color: 'var(--text-muted)' }}>
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                        {notif.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Demo Mode / User Indicator */}
        <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l" style={{ borderColor: 'var(--border-primary)' }}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              borderColor: 'var(--border-primary)',
              color: 'var(--accent-text)',
            }}
          >
            AC
          </div>
          <div className="text-left hidden lg:block">
            <div className="text-xs font-semibold leading-none" style={{ color: 'var(--text-primary)' }}>
              Alex Chen
            </div>
            <div className="text-[10px] leading-tight" style={{ color: 'var(--text-muted)' }}>
              alex.chen@workplace.example
            </div>
          </div>
        </div>
      </div>

      {/* Demo Mode Explanation Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            className="w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-4"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-base font-bold" style={{ color: 'var(--accent-text)' }}>
                <Info className="w-5 h-5" />
                <span>Safe Sandbox Demonstration</span>
              </div>
              <button
                onClick={() => setShowDemoModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-xs cursor-pointer"
                style={{ color: 'var(--text-muted)' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs space-y-2.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <p>
                <strong>DEMO MODE Active:</strong> CatchPhish is operating in a secure demonstration environment using 25 fictional sample emails across all 5 security categories.
              </p>
              <p>
                <strong>Safety Guarantee:</strong> All hyperlinks, attachments, and domains are simulated for educational defense. No real credentials are requested or stored, and external URLs are never executed.
              </p>
              <p>
                <strong>Future Roadmap:</strong> The modular architecture is pre-configured to connect to Google Workspace / Gmail API via official OAuth tokens in production, replacing this mock data source.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowDemoModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg text-white cursor-pointer"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
