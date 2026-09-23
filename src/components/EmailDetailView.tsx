import React, { useState } from 'react';
import {
  ArrowLeft,
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Paperclip,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Trash2,
  RotateCcw,
  UserX,
  Flag,
  Sparkles,
  Link2,
  Lock,
  Unlock,
  Eye,
  Info,
  ThumbsUp,
  ThumbsDown,
  Layers,
  Crosshair,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  EmailCategory,
  EmailItem,
  HumanFeedback,
  RiskLevel,
} from '../types';

interface EmailDetailViewProps {
  email: EmailItem;
  onBack: () => void;
  onBlockSender: (emailAddress: string, senderName: string) => void;
  onReportPhishing: (emailId: string) => void;
  onMoveToSpam: (emailId: string) => void;
  onDeleteEmail: (emailId: string) => void;
  onKeepEmail: (emailId: string) => void;
  onUndoLastAction: () => void;
  canUndo: boolean;
  onSubmitFeedback: (feedback: Omit<HumanFeedback, 'id' | 'timestamp'>) => void;
  onOpenThreatIntel: (emailId: string) => void;
}

export const EmailDetailView: React.FC<EmailDetailViewProps> = ({
  email,
  onBack,
  onBlockSender,
  onReportPhishing,
  onMoveToSpam,
  onDeleteEmail,
  onKeepEmail,
  onUndoLastAction,
  canUndo,
  onSubmitFeedback,
  onOpenThreatIntel,
}) => {
  const analysis = email.analysis;
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);
  const [feedbackCorrect, setFeedbackCorrect] = useState<boolean | null>(null);
  const [suggestedCategory, setSuggestedCategory] = useState<EmailCategory | ''>('');
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<'block' | 'report' | 'spam' | 'delete' | null>(null);
  const [expandedSection, setExpandedSection] = useState<'sender' | 'url' | 'social' | 'attachment' | null>(null);

  if (!analysis) {
    return (
      <div className="p-12 text-center">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Analysis not available for this email.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 text-xs rounded-lg text-white" style={{ backgroundColor: 'var(--accent)' }}>
          Back to Inbox
        </button>
      </div>
    );
  }

  const getSafetyBadge = (score: number) => {
    if (score <= 20) return { label: 'Critical Risk', color: 'var(--risk-critical)', bg: 'rgba(239, 68, 68, 0.15)' };
    if (score <= 40) return { label: 'High Risk', color: 'var(--risk-high)', bg: 'rgba(249, 115, 22, 0.15)' };
    if (score <= 60) return { label: 'Medium Risk', color: 'var(--risk-medium)', bg: 'rgba(234, 179, 8, 0.15)' };
    if (score <= 80) return { label: 'Low Risk', color: 'var(--risk-low)', bg: 'rgba(59, 130, 246, 0.15)' };
    return { label: 'Safe Verified', color: 'var(--risk-safe)', bg: 'rgba(16, 185, 129, 0.15)' };
  };

  const safetyBadge = getSafetyBadge(analysis.safetyScore);

  const handleFeedbackThumb = (isCorrect: boolean) => {
    setFeedbackCorrect(isCorrect);
    if (isCorrect) {
      onSubmitFeedback({
        emailId: email.id,
        subject: email.subject,
        predictedCategory: analysis.category,
        isCorrect: true,
      });
      setFeedbackSubmitted(true);
    }
  };

  const handleFeedbackSubmitCorrection = () => {
    if (!suggestedCategory) return;
    onSubmitFeedback({
      emailId: email.id,
      subject: email.subject,
      predictedCategory: analysis.category,
      isCorrect: false,
      suggestedCategory: suggestedCategory as EmailCategory,
    });
    setFeedbackSubmitted(true);
  };

  const triggerActionConfirm = (action: 'block' | 'report' | 'spam' | 'delete') => {
    setPendingAction(action);
    setShowConfirmModal(true);
  };

  const executeConfirmedAction = () => {
    if (!pendingAction) return;
    setShowConfirmModal(false);

    if (pendingAction === 'block') {
      onBlockSender(email.senderEmail, email.senderName);
    } else if (pendingAction === 'report') {
      onReportPhishing(email.id);
    } else if (pendingAction === 'spam') {
      onMoveToSpam(email.id);
    } else if (pendingAction === 'delete') {
      onDeleteEmail(email.id);
    }
    setPendingAction(null);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-57px)] overflow-hidden">
      {/* Top Action Ribbon */}
      <div
        className="px-4 py-2.5 border-b flex items-center justify-between gap-4 shrink-0 transition-colors"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-primary)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold hover:opacity-80 transition-colors cursor-pointer"
            style={{
              borderColor: 'var(--border-primary)',
              color: 'var(--text-primary)',
            }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Inbox</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span style={{ color: 'var(--text-muted)' }}>Status:</span>
            <span
              className="px-2 py-0.5 rounded text-xs font-bold"
              style={{ backgroundColor: safetyBadge.bg, color: safetyBadge.color }}
            >
              {safetyBadge.label}
            </span>
          </div>
        </div>

        {/* Security Action Controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {analysis.category === 'Phishing' && (
            <button
              onClick={() => triggerActionConfirm('report')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm cursor-pointer transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--risk-critical)' }}
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Report Phishing</span>
            </button>
          )}

          <button
            onClick={() => triggerActionConfirm('block')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            style={{ borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
          >
            <UserX className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Block Sender</span>
          </button>

          <button
            onClick={() => triggerActionConfirm('spam')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            style={{ borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
          >
            <AlertOctagon className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden md:inline">Move to Spam</span>
          </button>

          <button
            onClick={() => triggerActionConfirm('delete')}
            className="p-1.5 rounded-lg border text-xs font-semibold cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            style={{ borderColor: 'var(--border-primary)', color: 'var(--risk-critical)' }}
            title="Move to Trash"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onKeepEmail(email.id)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            style={{ borderColor: 'var(--border-primary)', color: 'var(--risk-safe)' }}
            title="Keep and mark safe"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Keep</span>
          </button>

          {canUndo && (
            <button
              onClick={onUndoLastAction}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer"
              style={{
                backgroundColor: 'var(--accent-subtle)',
                color: 'var(--accent-text)',
                borderColor: 'var(--accent-border)',
              }}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Undo</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Two-Column Viewport */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto divide-y lg:divide-y-0 lg:divide-x"
        style={{ borderColor: 'var(--border-primary)' }}
      >
        {/* LEFT COLUMN: Original Email (5 / 12 cols on desktop) */}
        <div className="lg:col-span-5 p-5 sm:p-6 overflow-y-auto space-y-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          {/* Email Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-lg font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                {email.subject}
              </h1>
              <span
                className="px-2.5 py-1 rounded text-xs font-extrabold shrink-0 border"
                style={{
                  backgroundColor: safetyBadge.bg,
                  color: safetyBadge.color,
                  borderColor: safetyBadge.color,
                }}
              >
                {analysis.category}
              </span>
            </div>

            {/* Sender Metadata Box */}
            <div className="p-3.5 rounded-xl border space-y-2" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs"
                    style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent-text)' }}
                  >
                    {email.senderName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                      {email.senderName}
                    </div>
                    <div className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                      {email.senderEmail}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] tabular-nums" style={{ color: 'var(--text-muted)' }}>
                    {email.dateFormatted}
                  </div>
                  <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    To: {email.recipientEmail}
                  </div>
                </div>
              </div>

              {/* Sender Integrity Marker */}
              {analysis.senderAnalysis.isLookalikeDomain ? (
                <div className="text-[11px] p-2 rounded-lg flex items-center gap-2 border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.25)', color: 'var(--risk-critical)' }}>
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Look-alike spoofing detected: mimics {analysis.senderAnalysis.lookalikeTarget}</span>
                </div>
              ) : analysis.senderAnalysis.isDomainMismatch ? (
                <div className="text-[11px] p-2 rounded-lg flex items-center gap-2 border" style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)', borderColor: 'rgba(249, 115, 22, 0.25)', color: 'var(--risk-high)' }}>
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Display name mismatch: Claims "{email.senderName}" on external domain</span>
                </div>
              ) : (
                <div className="text-[11px] p-2 rounded-lg flex items-center gap-2 border" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.25)', color: 'var(--risk-safe)' }}>
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Sender domain verified against authorized records</span>
                </div>
              )}
            </div>
          </div>

          {/* Email Body Content */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Message Body
            </div>
            <div
              className="p-4 rounded-xl border text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans select-text"
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
                color: 'var(--text-primary)',
              }}
            >
              {email.body}
            </div>
          </div>

          {/* Links Section (Safe Inspection) */}
          {analysis.urlAnalysis.links.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Contained Links ({analysis.urlAnalysis.links.length})
                </span>
                <span className="text-[10px] text-amber-500 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Safe Sandboxed Inspection
                </span>
              </div>
              <div className="space-y-1.5">
                {analysis.urlAnalysis.links.map((link, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg border text-xs space-y-1"
                    style={{
                      backgroundColor: link.riskScore >= 40 ? 'rgba(239, 68, 68, 0.06)' : 'var(--bg-tertiary)',
                      borderColor: link.riskScore >= 40 ? 'rgba(239, 68, 68, 0.25)' : 'var(--border-primary)',
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] truncate select-all" style={{ color: link.riskScore >= 40 ? 'var(--risk-critical)' : 'var(--accent-text)' }}>
                        {link.actualUrl}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 tabular-nums" style={{ backgroundColor: link.riskScore >= 40 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)', color: link.riskScore >= 40 ? 'var(--risk-critical)' : 'var(--risk-safe)' }}>
                        Risk: {link.riskScore}%
                      </span>
                    </div>
                    {link.warningReasons.length > 0 && (
                      <div className="text-[11px]" style={{ color: 'var(--risk-critical)' }}>
                        Warnings: {link.warningReasons.join(' ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attachments Section */}
          {analysis.attachmentAnalysis.hasAttachments && (
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Attachments ({analysis.attachmentAnalysis.attachments.length})
              </div>
              <div className="space-y-1.5">
                {analysis.attachmentAnalysis.attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border text-xs flex items-center justify-between gap-3"
                    style={{
                      backgroundColor: att.riskLevel === 'High' ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-tertiary)',
                      borderColor: att.riskLevel === 'High' ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-primary)',
                    }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Paperclip className="w-4 h-4 shrink-0" style={{ color: att.riskLevel === 'High' ? 'var(--risk-critical)' : 'var(--accent-text)' }} />
                      <div className="truncate">
                        <div className="font-mono text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                          {att.filename}
                        </div>
                        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          {(att.sizeBytes / 1024).toFixed(1)} KB · {att.fileType}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: att.riskLevel === 'High' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                          color: att.riskLevel === 'High' ? 'var(--risk-critical)' : 'var(--risk-safe)',
                        }}
                      >
                        {att.riskLevel} Risk
                      </span>
                      {att.reason && (
                        <div className="text-[10px] max-w-[200px] mt-1" style={{ color: 'var(--risk-critical)' }}>
                          {att.reason}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: AI Security Analysis & Explainability (7 / 12 cols on desktop) */}
        <div className="lg:col-span-7 p-5 sm:p-6 overflow-y-auto space-y-6" style={{ backgroundColor: 'var(--bg-primary)' }}>
          {/* Header Score Card */}
          <div
            className="p-5 rounded-2xl border shadow-lg space-y-4"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  CatchPhish Explainable Engine
                </span>
                <h2 className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>
                  AI Security Analysis
                </h2>
              </div>

              <button
                onClick={() => onOpenThreatIntel(email.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer transition-colors"
                style={{
                  backgroundColor: 'var(--accent-subtle)',
                  color: 'var(--accent-text)',
                  borderColor: 'var(--accent-border)',
                }}
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Threat Intelligence &amp; Simulators</span>
              </button>
            </div>

            {/* Email Safety Score Gauge & Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Safety Score Dial */}
              <div className="p-4 rounded-xl border flex flex-col items-center justify-center text-center space-y-1"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}
              >
                <span className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                  EMAIL SAFETY SCORE
                </span>
                <div className="text-4xl font-black font-mono tabular-nums" style={{ color: safetyBadge.color }}>
                  {analysis.safetyScore}
                  <span className="text-sm font-normal text-slate-400">/100</span>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: safetyBadge.bg, color: safetyBadge.color }}>
                  {safetyBadge.label}
                </span>
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  Higher is safer (0–100 scale)
                </span>
              </div>

              {/* Classification & ML Model Output */}
              <div className="p-4 rounded-xl border flex flex-col justify-between space-y-2"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}
              >
                <div>
                  <span className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                    FINAL CLASSIFICATION
                  </span>
                  <div className="text-base font-extrabold mt-1" style={{ color: safetyBadge.color }}>
                    {analysis.category}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span style={{ color: 'var(--text-muted)' }}>ML Pattern:</span>
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{analysis.mlPrediction}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono mt-1">
                    <span style={{ color: 'var(--text-muted)' }}>Model Confidence:</span>
                    <span className="font-bold tabular-nums" style={{ color: 'var(--accent-text)' }}>{analysis.confidencePercent}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 mt-1.5 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${analysis.confidencePercent}%`, backgroundColor: 'var(--accent)' }} />
                  </div>
                </div>
              </div>

              {/* Recommended Security Action Box */}
              <div className="p-4 rounded-xl border flex flex-col justify-between space-y-2"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}
              >
                <div>
                  <span className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                    RECOMMENDED ACTION
                  </span>
                  <div className="text-xs font-bold mt-1.5 leading-snug" style={{ color: 'var(--text-primary)' }}>
                    {analysis.recommendedAction}
                  </div>
                </div>

                <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  Requires user confirmation before executing.
                </div>
              </div>
            </div>
          </div>

          {/* DYNAMIC EXPLAINABLE AI SECTION: "WHY THIS EMAIL WAS FLAGGED" */}
          <div
            className="p-5 rounded-2xl border space-y-3"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)',
            }}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <h3 className="text-sm font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                WHY THIS EMAIL WAS FLAGGED
              </h3>
            </div>

            <div
              className="p-4 rounded-xl border text-xs sm:text-sm leading-relaxed font-medium"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-primary)',
                color: 'var(--text-primary)',
              }}
            >
              "{analysis.explanation}"
            </div>

            <div className="text-[11px] italic" style={{ color: 'var(--text-muted)' }}>
              Dynamically synthesized from real sender indicators, URL inspection, social engineering cues, and Kaggle NLP weights.
            </div>
          </div>

          {/* Deep Risk Breakdown Sub-meters */}
          <div
            className="p-5 rounded-2xl border space-y-4"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)',
            }}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Component Risk Breakdown
            </h3>

            <div className="space-y-3">
              {/* Sender Risk */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Sender Risk</span>
                  <span className="font-mono font-bold tabular-nums" style={{ color: analysis.senderRisk > 40 ? 'var(--risk-critical)' : 'var(--risk-safe)' }}>
                    {analysis.senderRisk}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${analysis.senderRisk}%`, backgroundColor: analysis.senderRisk > 40 ? 'var(--risk-critical)' : 'var(--risk-safe)' }} />
                </div>
              </div>

              {/* URL Risk */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>URL Structure Risk</span>
                  <span className="font-mono font-bold tabular-nums" style={{ color: analysis.urlRisk > 40 ? 'var(--risk-critical)' : 'var(--risk-safe)' }}>
                    {analysis.urlRisk}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${analysis.urlRisk}%`, backgroundColor: analysis.urlRisk > 40 ? 'var(--risk-critical)' : 'var(--risk-safe)' }} />
                </div>
              </div>

              {/* Social Engineering Risk */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Social Engineering Risk</span>
                  <span className="font-mono font-bold tabular-nums" style={{ color: analysis.socialRisk > 40 ? 'var(--risk-critical)' : 'var(--risk-safe)' }}>
                    {analysis.socialRisk}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${analysis.socialRisk}%`, backgroundColor: analysis.socialRisk > 40 ? 'var(--risk-critical)' : 'var(--risk-safe)' }} />
                </div>
              </div>

              {/* Content & NLP Risk */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Kaggle NLP Content Risk</span>
                  <span className="font-mono font-bold tabular-nums" style={{ color: analysis.contentRisk > 40 ? 'var(--risk-critical)' : 'var(--risk-safe)' }}>
                    {analysis.contentRisk}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${analysis.contentRisk}%`, backgroundColor: analysis.contentRisk > 40 ? 'var(--risk-critical)' : 'var(--risk-safe)' }} />
                </div>
              </div>

              {/* Attachment Risk */}
              {analysis.attachmentAnalysis.hasAttachments && (
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Attachment Payload Risk</span>
                    <span className="font-mono font-bold tabular-nums" style={{ color: analysis.attachmentRisk > 40 ? 'var(--risk-critical)' : 'var(--risk-safe)' }}>
                      {analysis.attachmentRisk}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${analysis.attachmentRisk}%`, backgroundColor: analysis.attachmentRisk > 40 ? 'var(--risk-critical)' : 'var(--risk-safe)' }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Security Signal Breakdowns (Expandable Accordions) */}
          <div className="space-y-3">
            {/* Sender Analysis Details */}
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-secondary)' }}>
              <button
                onClick={() => setExpandedSection(expandedSection === 'sender' ? null : 'sender')}
                className="w-full flex items-center justify-between p-4 text-xs font-bold cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                style={{ color: 'var(--text-primary)' }}
              >
                <span>Sender Domain &amp; Impersonation Analysis</span>
                {expandedSection === 'sender' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {expandedSection === 'sender' && (
                <div className="p-4 pt-0 text-xs space-y-2 border-t" style={{ borderColor: 'var(--border-primary)', color: 'var(--text-secondary)' }}>
                  <div className="grid grid-cols-2 gap-2 py-2">
                    <div>
                      <span className="text-[10px] block" style={{ color: 'var(--text-muted)' }}>Display Name:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{analysis.senderAnalysis.displayName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] block" style={{ color: 'var(--text-muted)' }}>Actual Email:</span>
                      <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{analysis.senderAnalysis.emailAddress}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {analysis.senderAnalysis.notes.map((note, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs">
                        <span className="text-amber-500">•</span>
                        <span>{note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Social Engineering Details */}
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-secondary)' }}>
              <button
                onClick={() => setExpandedSection(expandedSection === 'social' ? null : 'social')}
                className="w-full flex items-center justify-between p-4 text-xs font-bold cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                style={{ color: 'var(--text-primary)' }}
              >
                <span>Social Engineering Indicators ({analysis.socialEngineeringAnalysis.detectedTechniques.length})</span>
                {expandedSection === 'social' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {expandedSection === 'social' && (
                <div className="p-4 pt-0 text-xs space-y-2 border-t" style={{ borderColor: 'var(--border-primary)', color: 'var(--text-secondary)' }}>
                  {analysis.socialEngineeringAnalysis.detectedTechniques.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No high-pressure psychological manipulation detected.</p>
                  ) : (
                    <div className="space-y-1.5 pt-2">
                      {analysis.socialEngineeringAnalysis.detectedTechniques.map((tech, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 text-red-500 font-semibold text-xs border border-red-500/20">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>{tech}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* HUMAN-IN-THE-LOOP FEEDBACK WIDGET */}
          <div
            className="p-5 rounded-2xl border space-y-3"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                Was this prediction correct?
              </span>
              <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                Human-in-the-Loop Feedback
              </span>
            </div>

            {feedbackSubmitted ? (
              <div className="p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold text-emerald-500 border-emerald-500/30 bg-emerald-500/10">
                <Check className="w-4 h-4 shrink-0" />
                <span>Human-in-the-loop feedback collected and saved to SQLite database.</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleFeedbackThumb(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors"
                    style={{ borderColor: 'var(--border-primary)', color: 'var(--risk-safe)' }}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>👍 Correct</span>
                  </button>

                  <button
                    onClick={() => handleFeedbackThumb(false)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors"
                    style={{ borderColor: 'var(--border-primary)', color: 'var(--risk-critical)' }}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>👎 Incorrect</span>
                  </button>
                </div>

                {feedbackCorrect === false && (
                  <div className="p-3 rounded-xl border space-y-2 text-xs" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                    <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      What should this email be classified as?
                    </div>
                    <select
                      value={suggestedCategory}
                      onChange={(e) => setSuggestedCategory(e.target.value as EmailCategory)}
                      className="w-full p-2 text-xs rounded-lg border"
                      style={{
                        backgroundColor: 'var(--bg-tertiary)',
                        borderColor: 'var(--border-primary)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <option value="">Select correct category...</option>
                      <option value="Legitimate">Legitimate</option>
                      <option value="Promotional">Promotional</option>
                      <option value="Spam">Spam</option>
                      <option value="Suspicious">Suspicious</option>
                      <option value="Phishing">Phishing</option>
                    </select>

                    <button
                      onClick={handleFeedbackSubmitCorrection}
                      disabled={!suggestedCategory}
                      className="w-full py-1.5 text-xs font-semibold rounded-lg text-white disabled:opacity-50 cursor-pointer"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      Submit Correction
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            className="w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-4"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)',
            }}
          >
            <div className="flex items-center gap-2.5 text-base font-bold text-red-500">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>Confirm Defensive Security Action</span>
            </div>

            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {pendingAction === 'block' && `Are you sure you want to block sender "${email.senderEmail}"? Future inbound messages will be rejected.`}
              {pendingAction === 'report' && `Are you sure you want to report this email as Phishing and isolate it into the threat quarantine?`}
              {pendingAction === 'spam' && `Are you sure you want to move this email to the Spam folder?`}
              {pendingAction === 'delete' && `Are you sure you want to move this email to Trash?`}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                style={{ borderColor: 'var(--border-primary)', color: 'var(--text-secondary)' }}
              >
                Cancel
              </button>
              <button
                onClick={executeConfirmedAction}
                className="px-4 py-1.5 text-xs font-bold rounded-lg text-white cursor-pointer"
                style={{ backgroundColor: 'var(--risk-critical)' }}
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
