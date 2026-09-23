import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  UserX,
  Lock,
  Globe,
  Mail,
  Zap,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { BlockedSenderRecord, EmailItem } from '../types';

interface ProtectionViewProps {
  blockedSenders: BlockedSenderRecord[];
  onUnblockSender: (id: string) => void;
  reportedEmails: EmailItem[];
  spamEmails: EmailItem[];
  onOpenEmail: (id: string) => void;
}

export const ProtectionView: React.FC<ProtectionViewProps> = ({
  blockedSenders,
  onUnblockSender,
  reportedEmails,
  spamEmails,
  onOpenEmail,
}) => {
  const [activeTab, setActiveTab] = useState<'blocked' | 'reported' | 'spam'>('blocked');

  const protectionModules = [
    {
      title: 'Phishing Detection Engine',
      description: 'Kaggle-trained Multinomial Naive Bayes + TF-IDF analyzing vocabulary and adversarial intent.',
      status: 'Active',
      icon: ShieldAlert,
      color: 'var(--risk-critical)',
    },
    {
      title: 'Sender & Domain Integrity',
      description: 'Heuristic typo-squatting, Levenshtein brand mismatch, and high-risk disposable TLD filtering.',
      status: 'Active',
      icon: Mail,
      color: 'var(--accent-text)',
    },
    {
      title: 'URL Sandboxed Inspection',
      description: 'Detection of raw IP URLs, URL shorteners, fake subdomains, and HTTP insecure transport.',
      status: 'Active',
      icon: Globe,
      color: 'var(--risk-high)',
    },
    {
      title: 'Social Engineering Shield',
      description: 'Deep NLP detection of urgency, fear, account suspension threats, and OTP interception requests.',
      status: 'Active',
      icon: Zap,
      color: '#a855f7',
    },
    {
      title: 'Defensive Security Notifications',
      description: 'Dynamic user alerts for high-risk inbound payloads with user-confirmed action dispatch.',
      status: 'Active',
      icon: Lock,
      color: 'var(--risk-safe)',
    },
  ];

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
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Active Protection Engine
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black mt-1" style={{ color: 'var(--text-primary)' }}>
              Protection &amp; Quarantine Controls
            </h1>
            <p className="text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Manage perimeter defenses, review blocked adversarial domains, and verify the operational status of defensive inspection modules.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl border text-xs font-bold text-emerald-500 border-emerald-500/30 bg-emerald-500/10 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>ALL 5 MODULES OPERATIONAL</span>
            </span>
          </div>
        </div>
      </div>

      {/* 5 Protection Modules Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {protectionModules.map((mod, i) => {
          const Icon = mod.icon;
          return (
            <div
              key={i}
              className="p-5 rounded-xl border space-y-3 flex flex-col justify-between"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-primary)',
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--accent-subtle)', color: mod.color }}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-emerald-500 bg-emerald-500/10 border border-emerald-500/30">
                  {mod.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  {mod.title}
                </h3>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {mod.description}
                </p>
              </div>

              <div className="pt-2 border-t flex items-center justify-between text-[11px]" style={{ borderColor: 'var(--border-primary)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Response Latency</span>
                <span className="font-mono font-bold text-emerald-500">&lt; 15ms</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Defensive Management Tabs: Blocked Senders, Reported Phishing, Spam Actions */}
      <div
        className="p-6 rounded-2xl border shadow-lg space-y-5"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)',
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4" style={{ borderColor: 'var(--border-primary)' }}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('blocked')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors"
              style={{
                backgroundColor: activeTab === 'blocked' ? 'var(--accent-subtle)' : 'transparent',
                color: activeTab === 'blocked' ? 'var(--accent-text)' : 'var(--text-secondary)',
              }}
            >
              Blocked Senders ({blockedSenders.length})
            </button>

            <button
              onClick={() => setActiveTab('reported')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors"
              style={{
                backgroundColor: activeTab === 'reported' ? 'var(--accent-subtle)' : 'transparent',
                color: activeTab === 'reported' ? 'var(--accent-text)' : 'var(--text-secondary)',
              }}
            >
              Reported Phishing ({reportedEmails.length})
            </button>

            <button
              onClick={() => setActiveTab('spam')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors"
              style={{
                backgroundColor: activeTab === 'spam' ? 'var(--accent-subtle)' : 'transparent',
                color: activeTab === 'spam' ? 'var(--accent-text)' : 'var(--text-secondary)',
              }}
            >
              Spam Actions ({spamEmails.length})
            </button>
          </div>

          <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            All rules enforced in real-time
          </span>
        </div>

        {/* Tab 1: Blocked Senders */}
        {activeTab === 'blocked' && (
          <div className="space-y-3">
            {blockedSenders.length === 0 ? (
              <p className="p-8 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                No senders currently blocked.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {blockedSenders.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-xl border flex flex-col justify-between space-y-2"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                          {b.senderName}
                        </div>
                        <div className="text-[11px] font-mono text-red-400">
                          {b.emailAddress}
                        </div>
                      </div>

                      <button
                        onClick={() => onUnblockSender(b.id)}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded-lg border hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer text-slate-400 hover:text-white"
                        style={{ borderColor: 'var(--border-primary)' }}
                      >
                        Unblock
                      </button>
                    </div>

                    <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      Reason: {b.reason}
                    </p>

                    <div className="text-[10px] font-mono text-slate-500 pt-1">
                      Blocked on: {b.blockedAt}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Reported Phishing */}
        {activeTab === 'reported' && (
          <div className="space-y-2">
            {reportedEmails.length === 0 ? (
              <p className="p-8 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                No emails reported as phishing yet.
              </p>
            ) : (
              <div className="divide-y rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border-primary)' }}>
                {reportedEmails.map((em) => (
                  <div
                    key={em.id}
                    onClick={() => onOpenEmail(em.id)}
                    className="p-3.5 flex items-center justify-between gap-3 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                  >
                    <div>
                      <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                        {em.subject}
                      </span>
                      <div className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                        Sender: {em.senderEmail} · Score: {em.safetyScore}/100
                      </div>
                    </div>

                    <button className="text-xs font-semibold hover:underline" style={{ color: 'var(--accent-text)' }}>
                      Inspect Analysis
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Spam Actions */}
        {activeTab === 'spam' && (
          <div className="space-y-2">
            {spamEmails.length === 0 ? (
              <p className="p-8 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                No emails moved to Spam.
              </p>
            ) : (
              <div className="divide-y rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border-primary)' }}>
                {spamEmails.map((em) => (
                  <div
                    key={em.id}
                    onClick={() => onOpenEmail(em.id)}
                    className="p-3.5 flex items-center justify-between gap-3 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                  >
                    <div>
                      <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                        {em.subject}
                      </span>
                      <div className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                        From: {em.senderEmail}
                      </div>
                    </div>

                    <span className="text-xs font-semibold px-2 py-0.5 rounded text-amber-500 bg-amber-500/10">
                      Spam Quarantined
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
