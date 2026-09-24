import React from 'react';
import {
  FileBarChart2,
  Database,
  BrainCircuit,
  Award,
  CheckCircle2,
  ExternalLink,
  Download,
  Info,
  ShieldAlert,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { EmailItem, HumanFeedback, ThreatHistoryRecord } from '../types';
import { KAGGLE_METADATA } from '../data/storage';

interface ReportsViewProps {
  emails: EmailItem[];
  threats: ThreatHistoryRecord[];
  feedback: HumanFeedback[];
  blockedCount: number;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  emails,
  threats,
  feedback,
  blockedCount,
}) => {
  const totalAnalyzed = emails.length;
  const phishingCount = emails.filter((e) => e.category === 'Phishing').length;
  const spamCount = emails.filter((e) => e.category === 'Spam').length;
  const suspCount = emails.filter((e) => e.category === 'Suspicious').length;
  const promoCount = emails.filter((e) => e.category === 'Promotional').length;
  const legitCount = emails.filter((e) => e.category === 'Legitimate').length;

  const correctFeedback = feedback.filter((f) => f.isCorrect).length;
  const totalFeedback = feedback.length;
  const humanAccuracy = totalFeedback > 0 ? Math.round((correctFeedback / totalFeedback) * 100) : 100;

  const handleExportJSON = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      platform: 'CatchPhish MVP',
      datasetMetadata: KAGGLE_METADATA,
      summary: {
        totalEmailsScanned: totalAnalyzed,
        phishingDetected: phishingCount,
        suspiciousFlagged: suspCount,
        spamFiltered: spamCount,
        promotional: promoCount,
        legitimate: legitCount,
        threatsBlocked: blockedCount,
      },
      humanFeedbackRecords: feedback,
      recentThreatRecords: threats,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `catchphish_security_report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
              <FileBarChart2 className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent-text)' }}>
                Security Auditing &amp; Transparency
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black mt-1" style={{ color: 'var(--text-primary)' }}>
              Comprehensive Security &amp; Model Report
            </h1>
            <p className="text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Empirical evaluation metrics, Kaggle benchmark dataset audit, genuine test accuracy, and human-in-the-loop performance logs.
            </p>
          </div>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl text-white shadow-sm cursor-pointer transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            <Download className="w-4 h-4" />
            <span>Export Report (JSON)</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: GENUINE CALCULATED ML MODEL METRICS (Held-out Test Set) */}
      <div
        className="p-6 rounded-2xl border shadow-lg space-y-5"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BrainCircuit className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <h2 className="text-base font-extrabold" style={{ color: 'var(--text-primary)' }}>
              Machine Learning Model Evaluation Metrics
            </h2>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--risk-safe)' }}>
            EVALUATION STATUS: {KAGGLE_METADATA.training_status}
          </span>
        </div>

        {/* 4 Metric Cards: Accuracy, Precision, Recall, F1 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border space-y-1 text-center" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Test Accuracy
            </span>
            <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-emerald-500">
              {KAGGLE_METADATA.metrics.accuracy}%
            </div>
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              Held-Out Split (241 samples)
            </span>
          </div>

          <div className="p-4 rounded-xl border space-y-1 text-center" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Precision
            </span>
            <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-sky-400">
              {KAGGLE_METADATA.metrics.precision}%
            </div>
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              TP / (TP + FP)
            </span>
          </div>

          <div className="p-4 rounded-xl border space-y-1 text-center" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Recall (Sensitivity)
            </span>
            <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-purple-400">
              {KAGGLE_METADATA.metrics.recall}%
            </div>
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              TP / (TP + FN)
            </span>
          </div>

          <div className="p-4 rounded-xl border space-y-1 text-center" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              F1-Score
            </span>
            <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-amber-400">
              {KAGGLE_METADATA.metrics.f1_score}%
            </div>
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              Harmonic Mean
            </span>
          </div>
        </div>

        {/* Confusion Matrix Table */}
        <div className="p-4 rounded-xl border space-y-2 text-xs" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
          <div className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>
            Evaluation Confusion Matrix (Held-out Test Set)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-center pt-1">
            <div className="p-2 rounded bg-black/5 dark:bg-white/5">
              <span className="text-[10px] block" style={{ color: 'var(--text-muted)' }}>True Positives (TP)</span>
              <span className="text-base font-bold text-emerald-400">{KAGGLE_METADATA.metrics.confusion_matrix.tp}</span>
            </div>
            <div className="p-2 rounded bg-black/5 dark:bg-white/5">
              <span className="text-[10px] block" style={{ color: 'var(--text-muted)' }}>False Positives (FP)</span>
              <span className="text-base font-bold text-slate-400">{KAGGLE_METADATA.metrics.confusion_matrix.fp}</span>
            </div>
            <div className="p-2 rounded bg-black/5 dark:bg-white/5">
              <span className="text-[10px] block" style={{ color: 'var(--text-muted)' }}>True Negatives (TN)</span>
              <span className="text-base font-bold text-emerald-400">{KAGGLE_METADATA.metrics.confusion_matrix.tn}</span>
            </div>
            <div className="p-2 rounded bg-black/5 dark:bg-white/5">
              <span className="text-[10px] block" style={{ color: 'var(--text-muted)' }}>False Negatives (FN)</span>
              <span className="text-base font-bold text-slate-400">{KAGGLE_METADATA.metrics.confusion_matrix.fn}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: KAGGLE DATASET TRANSPARENCY */}
      <div
        className="p-6 rounded-2xl border shadow-lg space-y-4"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)',
        }}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-extrabold" style={{ color: 'var(--text-primary)' }}>
              Dataset Transparency &amp; Provenance
            </h2>
          </div>

          <a
            href="https://www.kaggle.com/datasets/naserabdullahalam/phishing-email-dataset"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            style={{ borderColor: 'var(--border-primary)', color: 'var(--accent-text)' }}
          >
            <span>View on Kaggle</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl border space-y-2" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Primary Reference Dataset
            </span>
            <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              {KAGGLE_METADATA.dataset_name}
            </div>
            <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
              Author: <strong>{KAGGLE_METADATA.dataset_author}</strong>
            </div>
            <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
              Reference Source Full Size: <strong>{KAGGLE_METADATA.dataset_full_size_reference}</strong>
            </div>
            <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
              Actual Samples Loaded into Training Pipeline: <strong className="font-mono">{KAGGLE_METADATA.actual_loaded_samples}</strong> (Train: {KAGGLE_METADATA.train_samples} / Test: {KAGGLE_METADATA.test_samples})
            </div>
            <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
              Vocabulary Dimension: <strong className="font-mono">{KAGGLE_METADATA.vocab_size} tokens</strong>
            </div>
          </div>

          <div className="p-4 rounded-xl border space-y-2" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Integrated Sub-Corpora Sources
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {KAGGLE_METADATA.sources.map((src, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md text-xs font-semibold border"
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {src}
                </span>
              ))}
            </div>
            <p className="text-[11px] leading-relaxed pt-2" style={{ color: 'var(--text-secondary)' }}>
              Combines Enron corporate mail, CEAS &amp; Nazario credential phishing collections, Nigerian 419 fraud corpora, SpamAssassin bulk mailers, and Ling academic discourse.
            </p>
          </div>
        </div>

        {/* Mandatory Transparency Callout */}
        <div className="p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
          <Info className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
          <div style={{ color: 'var(--text-secondary)' }}>
            <strong className="block text-slate-800 dark:text-slate-100 mb-0.5">
              Architectural Separation of Concerns:
            </strong>
            The Kaggle dataset provides the underlying binary email classification (spam vs. ham). CatchPhish combines these ML predictions with sender integrity verification, sandboxed URL inspection, social engineering detection, and attachment heuristics to synthesize its <strong>five application categories</strong> (Legitimate, Promotional, Spam, Suspicious, Phishing). Spam is never automatically classified as phishing.
          </div>
        </div>
      </div>

      {/* SECTION 3: HUMAN-IN-THE-LOOP FEEDBACK AUDIT */}
      <div
        className="p-6 rounded-2xl border shadow-lg space-y-4"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ThumbsUp className="w-5 h-5 text-emerald-500" />
            <h2 className="text-base font-extrabold" style={{ color: 'var(--text-primary)' }}>
              Human-in-the-Loop Feedback Audit
            </h2>
          </div>
          <span className="text-xs font-mono font-bold" style={{ color: 'var(--accent-text)' }}>
            User Agreement: {humanAccuracy}% ({correctFeedback}/{totalFeedback})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border-primary)', color: 'var(--text-muted)' }}>
                <th className="pb-2 font-semibold">Subject</th>
                <th className="pb-2 font-semibold">Model Prediction</th>
                <th className="pb-2 font-semibold">User Verdict</th>
                <th className="pb-2 font-semibold">User Suggested</th>
                <th className="pb-2 font-semibold text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border-primary)' }}>
              {feedback.map((fb) => (
                <tr key={fb.id} className="hover:bg-black/5 dark:hover:bg-white/5">
                  <td className="py-2.5 max-w-[200px] truncate font-medium" style={{ color: 'var(--text-primary)' }}>
                    {fb.subject}
                  </td>
                  <td className="py-2.5 font-semibold text-[11px]" style={{ color: 'var(--accent-text)' }}>
                    {fb.predictedCategory}
                  </td>
                  <td className="py-2.5">
                    {fb.isCorrect ? (
                      <span className="text-emerald-500 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                      </span>
                    ) : (
                      <span className="text-red-500 font-bold">Incorrect</span>
                    )}
                  </td>
                  <td className="py-2.5 font-mono text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                    {fb.suggestedCategory || '—'}
                  </td>
                  <td className="py-2.5 text-right font-mono text-[11px] tabular-nums" style={{ color: 'var(--text-muted)' }}>
                    {fb.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
