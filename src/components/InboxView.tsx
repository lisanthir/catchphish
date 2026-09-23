import React, { useState, useMemo } from 'react';
import {
  Search,
  Paperclip,
  Star,
  CheckSquare,
  Square,
  Trash2,
  AlertOctagon,
  MailCheck,
  Undo2,
  Filter,
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { EmailCategory, EmailItem, RiskLevel } from '../types';

interface InboxViewProps {
  emails: EmailItem[];
  selectedCategoryFilter: string;
  onSelectCategoryFilter: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenEmail: (id: string) => void;
  onToggleStar: (id: string, e: React.MouseEvent) => void;
  onBulkMarkRead: (ids: string[]) => void;
  onBulkMoveSpam: (ids: string[]) => void;
  onBulkDelete: (ids: string[]) => void;
  onUndoLastAction: () => void;
  canUndo: boolean;
}

export const InboxView: React.FC<InboxViewProps> = ({
  emails,
  selectedCategoryFilter,
  onSelectCategoryFilter,
  searchQuery,
  onSearchChange,
  onOpenEmail,
  onToggleStar,
  onBulkMarkRead,
  onBulkMoveSpam,
  onBulkDelete,
  onUndoLastAction,
  canUndo,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [onlyUnread, setOnlyUnread] = useState(false);

  // Filter emails based on Category, Search query, and Unread filter
  const filteredEmails = useMemo(() => {
    return emails.filter((email) => {
      // Exclude permanently trashed
      if (email.isTrash) return false;

      // Category filter
      if (selectedCategoryFilter !== 'All') {
        if (email.category !== selectedCategoryFilter) return false;
      }

      // Unread toggle
      if (onlyUnread && email.isRead) return false;

      // Universal search query across sender, email, subject, body, domain
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesSender = email.senderName.toLowerCase().includes(q);
        const matchesEmail = email.senderEmail.toLowerCase().includes(q);
        const matchesSubject = email.subject.toLowerCase().includes(q);
        const matchesBody = email.body.toLowerCase().includes(q);
        const domain = email.senderEmail.split('@')[1] || '';
        const matchesDomain = domain.toLowerCase().includes(q);

        if (!matchesSender && !matchesEmail && !matchesSubject && !matchesBody && !matchesDomain) {
          return false;
        }
      }

      return true;
    });
  }, [emails, selectedCategoryFilter, onlyUnread, searchQuery]);

  // Bulk selection logic
  const allFilteredSelected = filteredEmails.length > 0 && selectedIds.length === filteredEmails.length;

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredEmails.map((e) => e.id));
    }
  };

  const toggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const getCategoryBadgeStyles = (cat: EmailCategory) => {
    switch (cat) {
      case 'Phishing':
        return { bg: 'rgba(239, 68, 68, 0.15)', text: 'var(--risk-critical)', border: 'rgba(239, 68, 68, 0.3)' };
      case 'Suspicious':
        return { bg: 'rgba(249, 115, 22, 0.15)', text: 'var(--risk-high)', border: 'rgba(249, 115, 22, 0.3)' };
      case 'Spam':
        return { bg: 'rgba(234, 179, 8, 0.15)', text: 'var(--risk-medium)', border: 'rgba(234, 179, 8, 0.3)' };
      case 'Promotional':
        return { bg: 'rgba(59, 130, 246, 0.15)', text: 'var(--risk-low)', border: 'rgba(59, 130, 246, 0.3)' };
      case 'Legitimate':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: 'var(--risk-safe)', border: 'rgba(16, 185, 129, 0.3)' };
    }
  };

  const getSafetyScoreColor = (score: number) => {
    if (score <= 20) return 'var(--risk-critical)';
    if (score <= 40) return 'var(--risk-high)';
    if (score <= 60) return 'var(--risk-medium)';
    if (score <= 80) return 'var(--risk-low)';
    return 'var(--risk-safe)';
  };

  const categories: { id: string; label: string }[] = [
    { id: 'All', label: 'All' },
    { id: 'Phishing', label: 'Phishing' },
    { id: 'Suspicious', label: 'Suspicious' },
    { id: 'Spam', label: 'Spam' },
    { id: 'Promotional', label: 'Promotional' },
    { id: 'Legitimate', label: 'Legitimate' },
  ];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-57px)] overflow-hidden">
      {/* Top Filter and Actions Bar */}
      <div
        className="px-4 py-2.5 border-b flex flex-wrap items-center justify-between gap-3 shrink-0"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-primary)',
        }}
      >
        {/* Left: Bulk select and action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSelectAll}
            className="p-1.5 rounded-lg border hover:opacity-80 transition-colors cursor-pointer"
            style={{
              borderColor: 'var(--border-primary)',
              color: 'var(--text-secondary)',
            }}
            title={allFilteredSelected ? 'Deselect all' : 'Select all'}
          >
            {allFilteredSelected ? <CheckSquare className="w-4 h-4 text-sky-500" /> : <Square className="w-4 h-4" />}
          </button>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-1.5 pl-2 border-l" style={{ borderColor: 'var(--border-primary)' }}>
              <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent-text)' }}>
                {selectedIds.length} selected
              </span>

              <button
                onClick={() => {
                  onBulkMarkRead(selectedIds);
                  setSelectedIds([]);
                }}
                className="p-1.5 rounded-lg border text-xs flex items-center gap-1 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                style={{ borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
                title="Mark as read"
              >
                <MailCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Read</span>
              </button>

              <button
                onClick={() => {
                  onBulkMoveSpam(selectedIds);
                  setSelectedIds([]);
                }}
                className="p-1.5 rounded-lg border text-xs flex items-center gap-1 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                style={{ borderColor: 'var(--border-primary)', color: 'var(--risk-medium)' }}
                title="Move to Spam"
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Spam</span>
              </button>

              <button
                onClick={() => {
                  onBulkDelete(selectedIds);
                  setSelectedIds([]);
                }}
                className="p-1.5 rounded-lg border text-xs flex items-center gap-1 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                style={{ borderColor: 'var(--border-primary)', color: 'var(--risk-critical)' }}
                title="Move to Trash"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          )}

          {canUndo && (
            <button
              onClick={onUndoLastAction}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium cursor-pointer transition-colors"
              style={{
                backgroundColor: 'var(--accent-subtle)',
                color: 'var(--accent-text)',
                borderColor: 'var(--accent-border)',
              }}
              title="Undo last security action"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Undo Action</span>
            </button>
          )}
        </div>

        {/* Center / Right: Filter Tabs (Segmented Control conforming to zero-pill discipline) */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          <div
            className="flex items-center gap-1 p-1 rounded-lg border shrink-0"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              borderColor: 'var(--border-primary)',
            }}
          >
            {categories.map((cat) => {
              const active = selectedCategoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategoryFilter(cat.id)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap"
                  style={{
                    backgroundColor: active ? 'var(--bg-secondary)' : 'transparent',
                    color: active ? 'var(--accent-text)' : 'var(--text-secondary)',
                    boxShadow: active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setOnlyUnread(!onlyUnread)}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer shrink-0"
            style={{
              backgroundColor: onlyUnread ? 'var(--accent-subtle)' : 'var(--bg-tertiary)',
              color: onlyUnread ? 'var(--accent-text)' : 'var(--text-secondary)',
              borderColor: onlyUnread ? 'var(--accent-border)' : 'var(--border-primary)',
            }}
          >
            Unread Only
          </button>
        </div>
      </div>

      {/* Email List View */}
      <div className="flex-1 overflow-y-auto divide-y transition-colors" style={{ borderColor: 'var(--border-primary)' }}>
        {filteredEmails.length === 0 ? (
          <div className="py-20 px-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center border" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-secondary)' }}>
              <Filter className="w-6 h-6" style={{ color: 'var(--text-muted)' }} />
            </div>
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              No emails match the active filter
            </h3>
            <p className="text-xs max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Try broadening your category selection or clearing the search query "{searchQuery}".
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  onSelectCategoryFilter('All');
                  setOnlyUnread(false);
                  onSearchChange('');
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg text-white cursor-pointer"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                Reset All Filters
              </button>
            </div>
          </div>
        ) : (
          filteredEmails.map((email) => {
            const isSelected = selectedIds.includes(email.id);
            const badgeStyle = getCategoryBadgeStyles(email.category);
            const scoreColor = getSafetyScoreColor(email.safetyScore);

            return (
              <div
                key={email.id}
                onClick={() => onOpenEmail(email.id)}
                className="group flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-l-4"
                style={{
                  backgroundColor: !email.isRead
                    ? 'rgba(255, 255, 255, 0.03)'
                    : isSelected
                    ? 'var(--accent-subtle)'
                    : 'transparent',
                  borderLeftColor: !email.isRead ? 'var(--accent)' : 'transparent',
                }}
              >
                {/* Select Checkbox */}
                <button
                  onClick={(e) => toggleSelectOne(email.id, e)}
                  className="p-1 rounded hover:opacity-80 transition-opacity cursor-pointer shrink-0"
                  style={{ color: isSelected ? 'var(--accent-text)' : 'var(--text-muted)' }}
                >
                  {isSelected ? <CheckSquare className="w-4 h-4 text-sky-500" /> : <Square className="w-4 h-4" />}
                </button>

                {/* Star Button */}
                <button
                  onClick={(e) => onToggleStar(email.id, e)}
                  className="p-1 rounded hover:opacity-80 transition-opacity cursor-pointer shrink-0"
                  style={{ color: email.isStarred ? '#eab308' : 'var(--text-muted)' }}
                >
                  <Star className={`w-4 h-4 ${email.isStarred ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                </button>

                {/* Sender Avatar / Initial */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none border"
                  style={{
                    backgroundColor: badgeStyle.bg,
                    color: badgeStyle.text,
                    borderColor: badgeStyle.border,
                  }}
                >
                  {email.senderName.charAt(0).toUpperCase()}
                </div>

                {/* Sender Name & Domain */}
                <div className="w-44 lg:w-56 shrink-0 truncate">
                  <div className={`text-xs truncate ${!email.isRead ? 'font-bold' : 'font-medium'}`} style={{ color: 'var(--text-primary)' }}>
                    {email.senderName}
                  </div>
                  <div className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>
                    {email.senderEmail}
                  </div>
                </div>

                {/* Subject & Body Preview */}
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs truncate ${!email.isRead ? 'font-bold' : 'font-medium'}`} style={{ color: 'var(--text-primary)' }}>
                      {email.subject}
                    </span>
                    <span className="text-[11px] hidden md:inline truncate opacity-70" style={{ color: 'var(--text-muted)' }}>
                      — {email.preview}
                    </span>
                  </div>
                </div>

                {/* Attachment Icon */}
                {email.hasAttachment && (
                  <div className="shrink-0 text-slate-400" title="Contains Attachment">
                    <Paperclip className="w-3.5 h-3.5" />
                  </div>
                )}

                {/* AI Badge (Category) */}
                <div className="shrink-0 hidden sm:block">
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border"
                    style={{
                      backgroundColor: badgeStyle.bg,
                      color: badgeStyle.text,
                      borderColor: badgeStyle.border,
                    }}
                  >
                    {email.category}
                  </span>
                </div>

                {/* Safety Score Meter */}
                <div className="shrink-0 flex items-center gap-1.5 w-16 justify-end" title={`Safety Score: ${email.safetyScore}/100`}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: scoreColor }} />
                  <span className="text-xs font-mono font-bold tabular-nums" style={{ color: scoreColor }}>
                    {email.safetyScore}
                  </span>
                </div>

                {/* Date / Time */}
                <div className="shrink-0 w-24 text-right text-[11px] tabular-nums whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                  {email.dateFormatted}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
