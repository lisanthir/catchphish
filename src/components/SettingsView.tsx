import React, { useState } from 'react';
import {
  Settings,
  Moon,
  Sun,
  Palette,
  Bell,
  Shield,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Info,
  Sliders,
  Mail,
  Lock,
} from 'lucide-react';
import { ACCENT_OPTIONS, useTheme } from '../context/ThemeContext';
import { AccentColor } from '../types';

interface SettingsViewProps {
  onResetSandbox: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onResetSandbox }) => {
  const { theme, setTheme, accent, setAccent } = useTheme();

  // Settings state
  const [notifyCritical, setNotifyCritical] = useState(true);
  const [notifyHighRisk, setNotifyHighRisk] = useState(true);
  const [blockExecutableAttachments, setBlockExecutableAttachments] = useState(true);
  const [flagTypoDomains, setFlagTypoDomains] = useState(true);
  const [inspectUrlProtocols, setInspectUrlProtocols] = useState(true);
  const [sensitivityLevel, setSensitivityLevel] = useState<'Standard' | 'Aggressive' | 'Lenient'>('Standard');
  const [resetConfirm, setResetConfirm] = useState(false);

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-57px)] overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header Banner */}
      <div
        className="p-6 rounded-2xl border shadow-lg space-y-2"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)',
        }}
      >
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent-text)' }}>
            System Configuration
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black mt-1" style={{ color: 'var(--text-primary)' }}>
          Settings &amp; Customization
        </h1>
        <p className="text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Personalize interface aesthetics, tune detection thresholds, configure defensive notification rules, and inspect future integration architectures.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 1: APPEARANCE & THEME (Dark/Light & Accent Colors) */}
        <div
          className="p-6 rounded-2xl border shadow-lg space-y-5"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--card-border)',
          }}
        >
          <div className="flex items-center gap-2.5">
            <Palette className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              Appearance &amp; Theme Customization
            </h2>
          </div>

          {/* Dark / Light Mode Switch */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Interface Mode
            </span>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => setTheme('dark')}
                className="p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all"
                style={{
                  backgroundColor: theme === 'dark' ? 'var(--accent-subtle)' : 'var(--bg-secondary)',
                  borderColor: theme === 'dark' ? 'var(--accent)' : 'var(--border-primary)',
                  color: theme === 'dark' ? 'var(--accent-text)' : 'var(--text-primary)',
                }}
              >
                <div className="flex items-center gap-2.5 text-xs font-bold">
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span>Dark Mode (Default)</span>
                </div>
                {theme === 'dark' && <CheckCircle2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setTheme('light')}
                className="p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all"
                style={{
                  backgroundColor: theme === 'light' ? 'var(--accent-subtle)' : 'var(--bg-secondary)',
                  borderColor: theme === 'light' ? 'var(--accent)' : 'var(--border-primary)',
                  color: theme === 'light' ? 'var(--accent-text)' : 'var(--text-primary)',
                }}
              >
                <div className="flex items-center gap-2.5 text-xs font-bold">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Light Mode</span>
                </div>
                {theme === 'light' && <CheckCircle2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Accent Color Customizer */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Cybersecurity Accent Colors
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {ACCENT_OPTIONS.map((opt) => {
                const isActive = accent === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setAccent(opt.id as AccentColor)}
                    className="p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all"
                    style={{
                      backgroundColor: isActive ? 'var(--accent-subtle)' : 'var(--bg-secondary)',
                      borderColor: isActive ? 'var(--accent)' : 'var(--border-primary)',
                      color: isActive ? 'var(--accent-text)' : 'var(--text-primary)',
                    }}
                  >
                    <div className="flex items-center gap-2.5 text-xs font-semibold">
                      <span className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: opt.color }} />
                      <span>{opt.label}</span>
                    </div>
                    {isActive && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] pt-1" style={{ color: 'var(--text-muted)' }}>
              Instantly updates navigation highlights, buttons, badges, chart colors, and indicators. Persisted via localStorage.
            </p>
          </div>
        </div>

        {/* SECTION 2: DEFENSIVE NOTIFICATION & DETECTION RULES */}
        <div
          className="p-6 rounded-2xl border shadow-lg space-y-5"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--card-border)',
          }}
        >
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              Defensive Notification Rules
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl border cursor-pointer" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
              <div>
                <span className="font-bold block" style={{ color: 'var(--text-primary)' }}>Critical Threat Popups</span>
                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Alert immediately on Safety Score &lt;= 20/100</span>
              </div>
              <input
                type="checkbox"
                checked={notifyCritical}
                onChange={(e) => setNotifyCritical(e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border cursor-pointer" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
              <div>
                <span className="font-bold block" style={{ color: 'var(--text-primary)' }}>High-Risk Domain Warnings</span>
                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Notify on detected look-alike domain spoofing</span>
              </div>
              <input
                type="checkbox"
                checked={notifyHighRisk}
                onChange={(e) => setNotifyHighRisk(e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border cursor-pointer" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
              <div>
                <span className="font-bold block" style={{ color: 'var(--text-primary)' }}>Executable Attachment Isolation</span>
                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Flag and disarm .exe, .scr, and double extensions</span>
              </div>
              <input
                type="checkbox"
                checked={blockExecutableAttachments}
                onChange={(e) => setBlockExecutableAttachments(e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* SECTION 3: DEMO SANDBOX & RESTART */}
        <div
          className="p-6 rounded-2xl border shadow-lg space-y-4"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--card-border)',
          }}
        >
          <div className="flex items-center gap-2.5">
            <RotateCcw className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              Demo Sandbox Controls
            </h2>
          </div>

          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Reset all sample emails to their initial read/unread states, clear threat history, restore unblocked senders, and re-arm the demonstration dataset.
          </p>

          {!resetConfirm ? (
            <button
              onClick={() => setResetConfirm(true)}
              className="px-4 py-2 text-xs font-semibold rounded-xl border hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors"
              style={{ borderColor: 'var(--border-primary)', color: 'var(--risk-high)' }}
            >
              Reset Sandbox to Fresh State
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onResetSandbox();
                  setResetConfirm(false);
                }}
                className="px-4 py-2 text-xs font-bold rounded-xl text-white cursor-pointer"
                style={{ backgroundColor: 'var(--risk-critical)' }}
              >
                Yes, Reset All Data
              </button>
              <button
                onClick={() => setResetConfirm(false)}
                className="px-3 py-2 text-xs font-semibold rounded-xl border cursor-pointer"
                style={{ borderColor: 'var(--border-primary)', color: 'var(--text-muted)' }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* SECTION 4: FUTURE GMAIL API ARCHITECTURE */}
        <div
          className="p-6 rounded-2xl border shadow-lg space-y-4"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--card-border)',
          }}
        >
          <div className="flex items-center gap-2.5">
            <Mail className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              Future Gmail API Architecture
            </h2>
          </div>

          <div className="space-y-2 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <p>
              <strong>Production Roadmap:</strong> In this MVP demonstration, emails are supplied via a secure Mock Gmail Data Source with 25 realistic scenarios.
            </p>
            <div className="p-3 rounded-xl border font-mono text-[11px] space-y-1" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
              <div>Current: Mock Gmail Data Source → AI Analysis Engine → CatchPhish UI</div>
              <div className="text-emerald-400">Future: Gmail API (Google OAuth 2.0) → AI Analysis Engine → CatchPhish UI</div>
            </div>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Note: This demo intentionally avoids mock OAuth screens or password solicitations. Future integration will follow strict client-side OAuth token exchange.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
