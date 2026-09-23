import React from 'react';
import {
  LayoutDashboard,
  Inbox,
  AlertTriangle,
  BrainCircuit,
  ShieldCheck,
  FileBarChart2,
  Settings,
  Flame,
  ChevronRight,
} from 'lucide-react';
import { EmailCategory } from '../types';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadCount: number;
  threatCount: number;
  selectedCategoryFilter: string;
  onSelectCategoryFilter: (cat: string) => void;
  categoryCounts: Record<EmailCategory, number>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  unreadCount,
  threatCount,
  selectedCategoryFilter,
  onSelectCategoryFilter,
  categoryCounts,
}) => {
  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inbox', label: 'Inbox', icon: Inbox, badge: unreadCount > 0 ? unreadCount : undefined },
    { id: 'threats', label: 'Threats', icon: AlertTriangle, badge: threatCount > 0 ? threatCount : undefined, dangerBadge: true },
    { id: 'ai-analysis', label: 'AI Analysis', icon: BrainCircuit },
    { id: 'protection', label: 'Protection', icon: ShieldCheck },
    { id: 'reports', label: 'Reports', icon: FileBarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const categoryFilters: { id: string; label: string; count: number; color: string }[] = [
    { id: 'All', label: 'All Messages', count: Object.values(categoryCounts).reduce((a, b) => a + b, 0), color: 'var(--text-secondary)' },
    { id: 'Phishing', label: 'Phishing', count: categoryCounts.Phishing || 0, color: 'var(--risk-critical)' },
    { id: 'Suspicious', label: 'Suspicious', count: categoryCounts.Suspicious || 0, color: 'var(--risk-high)' },
    { id: 'Spam', label: 'Spam', count: categoryCounts.Spam || 0, color: 'var(--risk-medium)' },
    { id: 'Promotional', label: 'Promotional', count: categoryCounts.Promotional || 0, color: 'var(--risk-low)' },
    { id: 'Legitimate', label: 'Legitimate', count: categoryCounts.Legitimate || 0, color: 'var(--risk-safe)' },
  ];

  return (
    <aside
      className="w-64 shrink-0 flex flex-col border-r transition-colors h-[calc(100vh-57px)] select-none overflow-y-auto"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-primary)',
      }}
    >
      {/* Primary Navigation List */}
      <div className="p-3 space-y-1">
        <div className="text-[11px] font-bold px-3 py-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Navigation
        </div>
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all"
              style={{
                backgroundColor: isActive ? 'var(--accent-subtle)' : 'transparent',
                color: isActive ? 'var(--accent-text)' : 'var(--text-secondary)',
                borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
              }}
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4" style={{ color: isActive ? 'var(--accent)' : 'inherit' }} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className="px-2 py-0.5 text-[10px] font-bold rounded-full tabular-nums"
                  style={{
                    backgroundColor: item.dangerBadge ? 'rgba(239, 68, 68, 0.15)' : 'var(--accent-subtle)',
                    color: item.dangerBadge ? 'var(--risk-critical)' : 'var(--accent-text)',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Gmail Inbox Category Filter Segment */}
      <div className="p-3 border-t space-y-1" style={{ borderColor: 'var(--border-primary)' }}>
        <div className="flex items-center justify-between px-3 py-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Inbox Categories
          </span>
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Filter</span>
        </div>

        {categoryFilters.map((cat) => {
          const isSelected = activeTab === 'inbox' && selectedCategoryFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                onTabChange('inbox');
                onSelectCategoryFilter(cat.id);
              }}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-colors"
              style={{
                backgroundColor: isSelected ? 'var(--accent-subtle)' : 'transparent',
                color: isSelected ? 'var(--accent-text)' : 'var(--text-primary)',
              }}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className={isSelected ? 'font-bold' : 'font-medium'}>{cat.label}</span>
              </div>
              <span className="text-[11px] font-mono tabular-nums opacity-75" style={{ color: 'var(--text-muted)' }}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* AI Threat Defense Status card */}
      <div className="mt-auto p-4 m-3 rounded-xl border space-y-2"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)',
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
            <Flame className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
            <span>Hybrid AI Active</span>
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded font-bold" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--risk-safe)' }}>
            ONLINE
          </span>
        </div>
        <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Kaggle NLP + Rule-based Social Engineering &amp; URL Inspector safeguarding mock inbox.
        </p>
        <button
          onClick={() => onTabChange('threat-intel')}
          className="w-full text-left text-xs font-semibold flex items-center justify-between pt-1 cursor-pointer hover:underline"
          style={{ color: 'var(--accent-text)' }}
        >
          <span>Open Threat Intelligence</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
