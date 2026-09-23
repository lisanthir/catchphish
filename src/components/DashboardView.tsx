import React from 'react';
import {
  Shield,
  ShieldAlert,
  AlertTriangle,
  Mail,
  ShieldCheck,
  Flame,
  Activity,
  ArrowUpRight,
  TrendingUp,
  UserCheck,
  ExternalLink,
  BrainCircuit,
  Lock,
} from 'lucide-react';
import { EmailCategory, EmailItem, RiskLevel } from '../types';

interface DashboardViewProps {
  emails: EmailItem[];
  blockedCount: number;
  onOpenEmail: (id: string) => void;
  onNavigate: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  emails,
  blockedCount,
  onOpenEmail,
  onNavigate,
}) => {
  // Compute dynamic stats from current state
  const totalScanned = emails.length;
  const phishingCount = emails.filter((e) => e.category === 'Phishing').length;
  const spamCount = emails.filter((e) => e.category === 'Spam').length;
  const suspiciousCount = emails.filter((e) => e.category === 'Suspicious').length;
  const promoCount = emails.filter((e) => e.category === 'Promotional').length;
  const legitCount = emails.filter((e) => e.category === 'Legitimate').length;

  const riskCounts: Record<RiskLevel, number> = {
    Critical: emails.filter((e) => e.riskLevel === 'Critical').length,
    High: emails.filter((e) => e.riskLevel === 'High').length,
    Medium: emails.filter((e) => e.riskLevel === 'Medium').length,
    Low: emails.filter((e) => e.riskLevel === 'Low').length,
    Safe: emails.filter((e) => e.riskLevel === 'Safe').length,
  };

  const statCards = [
    { label: 'Emails Scanned', value: totalScanned, icon: Mail, color: 'var(--accent-text)', bg: 'var(--accent-subtle)' },
    { label: 'Phishing Detected', value: phishingCount, icon: ShieldAlert, color: 'var(--risk-critical)', bg: 'rgba(239, 68, 68, 0.12)' },
    { label: 'Suspicious Flagged', value: suspiciousCount, icon: AlertTriangle, color: 'var(--risk-high)', bg: 'rgba(249, 115, 22, 0.12)' },
    { label: 'Spam Filtered', value: spamCount, icon: Flame, color: 'var(--risk-medium)', bg: 'rgba(234, 179, 8, 0.12)' },
    { label: 'Promotional', value: promoCount, icon: TrendingUp, color: 'var(--risk-low)', bg: 'rgba(59, 130, 246, 0.12)' },
    { label: 'Legitimate', value: legitCount, icon: ShieldCheck, color: 'var(--risk-safe)', bg: 'rgba(16, 185, 129, 0.12)' },
    { label: 'Threats Blocked', value: blockedCount, icon: Lock, color: '#a855f7', bg: 'rgba(168, 85, 247, 0.12)' },
  ];

  // Distribution chart data
  const categorySegments = [
    { label: 'Phishing', count: phishingCount, color: 'var(--risk-critical)' },
    { label: 'Suspicious', count: suspiciousCount, color: 'var(--risk-high)' },
    { label: 'Spam', count: spamCount, color: 'var(--risk-medium)' },
    { label: 'Promotional', count: promoCount, color: 'var(--risk-low)' },
    { label: 'Legitimate', count: legitCount, color: 'var(--risk-safe)' },
  ];

  // Mock timeline activity for Chart 2 (Threat Activity Timeline)
  const timelinePoints = [
    { hour: '00:00', total: 1, threats: 0 },
    { hour: '04:00', total: 3, threats: 1 },
    { hour: '08:00', total: 8, threats: 3 },
    { hour: '12:00', total: 14, threats: 4 },
    { hour: '16:00', total: 20, threats: 7 },
    { hour: '20:00', total: totalScanned, threats: phishingCount + suspiciousCount },
  ];

  // Calculate SVG Donut parameters
  const totalCategoryItems = Math.max(1, totalScanned);
  let accumulatedPercent = 0;
  const donutPaths = categorySegments.map((seg) => {
    const fraction = seg.count / totalCategoryItems;
    const startAngle = accumulatedPercent * 2 * Math.PI;
    accumulatedPercent += fraction;
    const endAngle = accumulatedPercent * 2 * Math.PI;

    const r = 40;
    const cx = 50;
    const cy = 50;

    const x1 = cx + r * Math.cos(startAngle - Math.PI / 2);
    const y1 = cy + r * Math.sin(startAngle - Math.PI / 2);
    const x2 = cx + r * Math.cos(endAngle - Math.PI / 2);
    const y2 = cy + r * Math.sin(endAngle - Math.PI / 2);

    const largeArc = fraction > 0.5 ? 1 : 0;
    const d = fraction >= 0.999
      ? `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.001} ${cy - r} Z`
      : `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return { ...seg, d, percent: Math.round(fraction * 100) };
  });

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-57px)] overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Banner */}
      <div
        className="p-6 rounded-2xl border shadow-lg flex flex-wrap items-center justify-between gap-4"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)',
        }}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent-text)' }}>
              Security Command Overview
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
            Catch threats before they catch you
          </h1>
          <p className="text-xs sm:text-sm max-w-2xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Real-time hybrid phishing detection powered by Kaggle-trained NLP weights, sender integrity verification, and dynamic risk explainability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('threat-intel')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-white shadow-sm cursor-pointer transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            <Activity className="w-4 h-4" />
            <span>Launch Attack Simulator</span>
          </button>

          <button
            onClick={() => onNavigate('inbox')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            style={{ borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
          >
            <span>View Inbox</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 7 Dynamic Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl border flex flex-col justify-between space-y-2 transition-transform hover:-translate-y-0.5"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-primary)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider truncate" style={{ color: 'var(--text-muted)' }}>
                  {card.label}
                </span>
                <div className="p-1 rounded-lg" style={{ backgroundColor: card.bg, color: card.color }}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="text-xl sm:text-2xl font-black font-mono tabular-nums" style={{ color: card.color }}>
                {card.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4 Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CHART 1: Classification Distribution (Donut Chart) */}
        <div
          className="lg:col-span-4 p-5 rounded-2xl border shadow-lg space-y-4"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--card-border)',
          }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              1. Classification Distribution
            </h3>
            <span className="text-[11px] font-mono tabular-nums" style={{ color: 'var(--accent-text)' }}>
              {totalScanned} Total
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-2">
            {/* SVG Donut */}
            <div className="relative w-36 h-36 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {donutPaths.map((seg, i) => (
                  <path
                    key={i}
                    d={seg.d}
                    fill={seg.color}
                    className="transition-opacity hover:opacity-80"
                  />
                ))}
                {/* Center hole for Donut */}
                <circle cx="50" cy="50" r="26" fill="var(--card-bg)" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-base font-black font-mono tabular-nums" style={{ color: 'var(--text-primary)' }}>
                  {totalScanned}
                </span>
                <span className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>
                  Emails
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="w-full space-y-1.5 text-xs">
              {donutPaths.map((seg, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{seg.label}</span>
                  </div>
                  <div className="font-mono font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                    {seg.count} <span className="text-[10px] text-slate-400 font-normal">({seg.percent}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CHART 2: Threat Activity Timeline (Area / Sparkline) */}
        <div
          className="lg:col-span-8 p-5 rounded-2xl border shadow-lg space-y-4"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--card-border)',
          }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              2. Threat Activity Timeline (24-Hour Scan Stream)
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'var(--risk-critical)' }}>
              {phishingCount + suspiciousCount} Active Threats
            </span>
          </div>

          <div className="pt-2">
            {/* SVG Activity Curve */}
            <div className="h-44 w-full">
              <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="var(--border-primary)" strokeDasharray="3 3" />
                <line x1="0" y1="75" x2="500" y2="75" stroke="var(--border-primary)" strokeDasharray="3 3" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="var(--border-primary)" strokeDasharray="3 3" />

                {/* Filled Area */}
                <path
                  d="M 10 130 L 10 115 L 100 100 L 200 65 L 300 45 L 400 30 L 490 20 L 490 130 Z"
                  fill="url(#threatGrad)"
                />

                {/* Line Path */}
                <path
                  d="M 10 115 L 100 100 L 200 65 L 300 45 L 400 30 L 490 20"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Threat Scatter Points */}
                <circle cx="100" cy="100" r="4" fill="var(--risk-high)" />
                <circle cx="200" cy="65" r="4" fill="var(--risk-critical)" />
                <circle cx="300" cy="45" r="4" fill="var(--risk-critical)" />
                <circle cx="400" cy="30" r="4" fill="var(--risk-critical)" />
                <circle cx="490" cy="20" r="5" fill="var(--accent-text)" />
              </svg>
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between text-[10px] font-mono pt-2" style={{ color: 'var(--text-muted)' }}>
              {timelinePoints.map((p, i) => (
                <span key={i}>{p.hour}</span>
              ))}
            </div>
          </div>
        </div>

        {/* CHART 3: Risk Level Distribution (Bar chart) */}
        <div
          className="lg:col-span-5 p-5 rounded-2xl border shadow-lg space-y-4"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--card-border)',
          }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              3. Risk Level Distribution
            </h3>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Safety Score Intervals</span>
          </div>

          <div className="space-y-3 pt-1">
            {[
              { level: 'Critical (0–20)', count: riskCounts.Critical, color: 'var(--risk-critical)' },
              { level: 'High (21–40)', count: riskCounts.High, color: 'var(--risk-high)' },
              { level: 'Medium (41–60)', count: riskCounts.Medium, color: 'var(--risk-medium)' },
              { level: 'Low (61–80)', count: riskCounts.Low, color: 'var(--risk-low)' },
              { level: 'Safe (81–100)', count: riskCounts.Safe, color: 'var(--risk-safe)' },
            ].map((bar, idx) => {
              const pct = Math.round((bar.count / totalScanned) * 100);
              return (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>{bar.level}</span>
                    <span className="font-mono font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                      {bar.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: bar.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHART 4: Recent Detection History (Live Stream Table) */}
        <div
          className="lg:col-span-7 p-5 rounded-2xl border shadow-lg space-y-4"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--card-border)',
          }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              4. Recent Detection History
            </h3>
            <button
              onClick={() => onNavigate('threats')}
              className="text-xs font-semibold cursor-pointer hover:underline"
              style={{ color: 'var(--accent-text)' }}
            >
              Full Threat History →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border-primary)', color: 'var(--text-muted)' }}>
                  <th className="pb-2 font-semibold">Sender</th>
                  <th className="pb-2 font-semibold">Subject</th>
                  <th className="pb-2 font-semibold">Category</th>
                  <th className="pb-2 font-semibold text-right">Safety</th>
                  <th className="pb-2 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border-primary)' }}>
                {emails.slice(0, 5).map((em) => (
                  <tr
                    key={em.id}
                    onClick={() => onOpenEmail(em.id)}
                    className="hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 font-medium truncate max-w-[120px]" style={{ color: 'var(--text-primary)' }}>
                      {em.senderName}
                    </td>
                    <td className="py-2.5 truncate max-w-[180px]" style={{ color: 'var(--text-secondary)' }}>
                      {em.subject}
                    </td>
                    <td className="py-2.5">
                      <span className="font-semibold text-[11px]" style={{
                        color: em.category === 'Phishing' ? 'var(--risk-critical)' : em.category === 'Suspicious' ? 'var(--risk-high)' : em.category === 'Spam' ? 'var(--risk-medium)' : 'var(--risk-safe)'
                      }}>
                        {em.category}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold tabular-nums" style={{
                      color: em.safetyScore <= 20 ? 'var(--risk-critical)' : em.safetyScore <= 40 ? 'var(--risk-high)' : 'var(--risk-safe)'
                    }}>
                      {em.safetyScore}
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenEmail(em.id);
                        }}
                        className="text-[11px] font-semibold hover:underline"
                        style={{ color: 'var(--accent-text)' }}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
