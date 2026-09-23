import React, { useState } from 'react';
import {
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  Search,
  CheckCircle2,
  Trash2,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { ThreatHistoryRecord } from '../types';

interface ThreatsViewProps {
  threats: ThreatHistoryRecord[];
  onUndoThreatAction: (threatId: string) => void;
  onOpenEmail: (emailId: string) => void;
}

export const ThreatsView: React.FC<ThreatsViewProps> = ({
  threats,
  onUndoThreatAction,
  onOpenEmail,
}) => {
  const [filterAction, setFilterAction] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  const filteredThreats = threats.filter((th) => {
    if (filterAction !== 'All' && th.actionTaken !== filterAction) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        th.sender.toLowerCase().includes(q) ||
        th.subject.toLowerCase().includes(q) ||
        th.classification.toLowerCase().includes(q)
      );
    }
    return true;
  });

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
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                Threat Quarantine &amp; Defense Log
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black mt-1" style={{ color: 'var(--text-primary)' }}>
              Threat History
            </h1>
            <p className="text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Audit trail of quarantined emails, blocked adversaries, reported phishing lures, and user-confirmed defensive interventions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl border tabular-nums" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}>
              Total Logged: {threats.length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-primary)',
        }}
      >
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search threat sender or subject..."
            className="w-full text-xs bg-transparent border-none focus:outline-none"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span style={{ color: 'var(--text-muted)' }}>Action:</span>
          {['All', 'Reported Phishing', 'Blocked Sender', 'Moved to Spam'].map((act) => (
            <button
              key={act}
              onClick={() => setFilterAction(act)}
              className="px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors"
              style={{
                backgroundColor: filterAction === act ? 'var(--accent-subtle)' : 'transparent',
                color: filterAction === act ? 'var(--accent-text)' : 'var(--text-secondary)',
              }}
            >
              {act}
            </button>
          ))}
        </div>
      </div>

      {/* Threat Log Table */}
      <div
        className="rounded-2xl border shadow-lg overflow-hidden"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                <th className="p-3.5 font-semibold">Time</th>
                <th className="p-3.5 font-semibold">Sender</th>
                <th className="p-3.5 font-semibold">Subject</th>
                <th className="p-3.5 font-semibold">Classification</th>
                <th className="p-3.5 font-semibold text-center">Safety Score</th>
                <th className="p-3.5 font-semibold">Action Taken</th>
                <th className="p-3.5 font-semibold text-right">Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border-primary)' }}>
              {filteredThreats.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>
                    No threat logs match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredThreats.map((th) => (
                  <tr key={th.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="p-3.5 font-mono text-[11px] whitespace-nowrap tabular-nums" style={{ color: 'var(--text-muted)' }}>
                      {th.timestamp}
                    </td>
                    <td className="p-3.5 font-mono font-medium max-w-[180px] truncate" style={{ color: 'var(--text-primary)' }}>
                      {th.sender}
                    </td>
                    <td className="p-3.5 max-w-[240px] truncate font-medium" style={{ color: 'var(--text-secondary)' }}>
                      {th.subject}
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-[11px] px-2 py-0.5 rounded" style={{
                        backgroundColor: th.classification === 'Phishing' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                        color: th.classification === 'Phishing' ? 'var(--risk-critical)' : 'var(--risk-medium)'
                      }}>
                        {th.classification}
                      </span>
                    </td>
                    <td className="p-3.5 text-center font-mono font-bold tabular-nums" style={{
                      color: th.riskScore <= 20 ? 'var(--risk-critical)' : 'var(--risk-high)'
                    }}>
                      {th.riskScore}/100
                    </td>
                    <td className="p-3.5 font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {th.actionTaken}
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onOpenEmail(th.emailId)}
                          className="px-2.5 py-1 rounded text-[11px] font-semibold hover:underline"
                          style={{ color: 'var(--accent-text)' }}
                        >
                          View Email
                        </button>

                        {th.canUndo && (
                          <button
                            onClick={() => onUndoThreatAction(th.id)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-semibold cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
                            style={{ borderColor: 'var(--border-primary)', color: 'var(--text-secondary)' }}
                            title="Undo this action"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Undo</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
