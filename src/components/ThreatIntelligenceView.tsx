import React, { useState } from 'react';
import {
  Crosshair,
  ShieldAlert,
  ArrowRight,
  HelpCircle,
  AlertTriangle,
  Lock,
  ChevronRight,
  ExternalLink,
  Flame,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { EmailItem } from '../types';

interface ThreatIntelligenceViewProps {
  emails: EmailItem[];
  selectedEmailId?: string;
  onOpenEmail: (id: string) => void;
}

export const ThreatIntelligenceView: React.FC<ThreatIntelligenceViewProps> = ({
  emails,
  selectedEmailId,
  onOpenEmail,
}) => {
  // Filter for emails with threat potential or default to the first phishing email
  const phishingEmails = emails.filter((e) => e.category === 'Phishing' || e.category === 'Suspicious');
  const [activeEmailId, setActiveEmailId] = useState<string>(
    selectedEmailId || phishingEmails[0]?.id || emails[0]?.id
  );
  const [activeStageStep, setActiveStageStep] = useState<number>(1);

  const currentEmail = emails.find((e) => e.id === activeEmailId) || emails[0];
  const analysis = currentEmail?.analysis;
  const attackChain = analysis?.attackChain || [];
  const targeting = analysis?.targetingAssessment;

  const currentStage = attackChain.find((s) => s.stepNumber === activeStageStep) || attackChain[0];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-57px)] overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header Banner */}
      <div
        className="p-6 rounded-2xl border shadow-lg space-y-2 relative overflow-hidden"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)',
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Crosshair className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent-text)' }}>
                Threat Intelligence Hub
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold mt-1" style={{ color: 'var(--text-primary)' }}>
              Attack-Chain Simulator &amp; Targeting Assessment
            </h1>
            <p className="text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Explore the anatomy of modern social engineering threats. This safe, educational sandbox breaks down attack vectors stage-by-stage and analyzes adversary motives.
            </p>
          </div>

          {/* Email Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Target Email:</span>
            <select
              value={activeEmailId}
              onChange={(e) => {
                setActiveEmailId(e.target.value);
                setActiveStageStep(1);
              }}
              className="p-2 text-xs rounded-xl border font-medium cursor-pointer max-w-xs truncate"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-primary)',
                color: 'var(--text-primary)',
              }}
            >
              {emails.map((em) => (
                <option key={em.id} value={em.id}>
                  [{em.category}] {em.subject.slice(0, 45)}...
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid: Novel Feature 1 (Attack Chain Simulator) + Novel Feature 2 (Why Am I Being Targeted?) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* NOVEL FEATURE 1: Attack-Chain Simulator (7 / 12 cols) */}
        <div
          className="lg:col-span-7 p-6 rounded-2xl border shadow-lg space-y-6"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--card-border)',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: 'var(--accent)' }}>
                1
              </span>
              <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                Safe Attack-Chain Simulator
              </h2>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--risk-safe)' }}>
              SAFE SIMULATION
            </span>
          </div>

          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Cyberattacks are not single moments—they are structured sequences. Step through the stages below to understand how an adversary attempts to breach systems from this specific email lure.
          </p>

          {/* Interactive Multi-Stage Progress Bar */}
          <div className="grid grid-cols-6 gap-1.5 pt-2">
            {attackChain.map((st) => {
              const isSelected = st.stepNumber === activeStageStep;
              return (
                <button
                  key={st.stepNumber}
                  onClick={() => setActiveStageStep(st.stepNumber)}
                  className="p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 group"
                  style={{
                    backgroundColor: isSelected ? 'var(--accent-subtle)' : 'var(--bg-secondary)',
                    borderColor: isSelected ? 'var(--accent)' : 'var(--border-primary)',
                  }}
                >
                  <span className="text-[10px] font-mono font-bold" style={{ color: isSelected ? 'var(--accent-text)' : 'var(--text-muted)' }}>
                    0{st.stepNumber}
                  </span>
                  <span className="text-[10px] font-semibold truncate w-full group-hover:text-sky-400" style={{ color: isSelected ? 'var(--accent-text)' : 'var(--text-primary)' }}>
                    {st.stageName.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Stage Deep Dive Card */}
          {currentStage && (
            <div
              className="p-5 rounded-xl border space-y-4 animate-in fade-in duration-200"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-primary)',
              }}
            >
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-primary)' }}>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent-text)' }}>
                    Stage 0{currentStage.stepNumber}
                  </span>
                  <h3 className="text-sm font-extrabold" style={{ color: 'var(--text-primary)' }}>
                    {currentStage.stageName}
                  </h3>
                </div>
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> CatchPhish Defends
                </span>
              </div>

              {/* 4 Quadrants for the Stage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* What Happens */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">
                    What Happens
                  </span>
                  <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {currentStage.whatHappens}
                  </p>
                </div>

                {/* Why It Is Dangerous */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">
                    Why It Is Dangerous
                  </span>
                  <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {currentStage.whyDangerous}
                  </p>
                </div>

                {/* Potential Impact */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">
                    Potential Impact
                  </span>
                  <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {currentStage.potentialImpact}
                  </p>
                </div>

                {/* How to Stay Safe */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                    Defensive Countermeasure
                  </span>
                  <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {currentStage.howToStaySafe}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t" style={{ borderColor: 'var(--border-primary)' }}>
                <button
                  disabled={activeStageStep <= 1}
                  onClick={() => setActiveStageStep((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg border text-xs font-semibold disabled:opacity-30 cursor-pointer"
                  style={{ borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
                >
                  Previous Stage
                </button>

                <button
                  disabled={activeStageStep >= attackChain.length}
                  onClick={() => setActiveStageStep((p) => Math.min(attackChain.length, p + 1))}
                  className="px-3 py-1.5 rounded-lg border text-xs font-semibold disabled:opacity-30 cursor-pointer flex items-center gap-1"
                  style={{ backgroundColor: 'var(--accent)', borderColor: 'var(--accent)', color: '#fff' }}
                >
                  <span>Next Stage</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* NOVEL FEATURE 2: Why Am I Being Targeted? (5 / 12 cols) */}
        <div
          className="lg:col-span-5 p-6 rounded-2xl border shadow-lg space-y-5"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--card-border)',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: 'var(--accent)' }}>
                2
              </span>
              <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                Why Am I Being Targeted?
              </h2>
            </div>
          </div>

          {targeting ? (
            <div className="space-y-4">
              {/* Attacker Goal */}
              <div className="p-3.5 rounded-xl border space-y-1" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                  Possible Attacker Goal
                </span>
                <p className="text-xs font-semibold leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  {targeting.possibleAttackerGoal}
                </p>
              </div>

              {/* Likely Technique */}
              <div className="p-3.5 rounded-xl border space-y-1" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                  Likely Technique
                </span>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {targeting.likelyTechnique}
                </p>
              </div>

              {/* Psychological Technique */}
              <div className="p-3.5 rounded-xl border space-y-1" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Psychological Leverage
                </span>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {targeting.psychologicalTechnique}
                </p>
              </div>

              {/* Targeted Information */}
              <div className="p-3.5 rounded-xl border space-y-1" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                  Information Being Targeted
                </span>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {targeting.targetedInformation}
                </p>
              </div>

              {/* Potential Impact */}
              <div className="p-3.5 rounded-xl border space-y-1" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Potential Organizational Impact
                </span>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {targeting.potentialImpact}
                </p>
              </div>

              {/* Mandatory AI Disclaimer */}
              <div className="p-3 rounded-lg border flex items-start gap-2 text-[11px]" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)', color: 'var(--text-muted)' }}>
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  <strong>Disclaimer:</strong> {targeting.disclaimer}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No targeting profile available for this message.</p>
          )}

          <div className="pt-2">
            <button
              onClick={() => onOpenEmail(currentEmail.id)}
              className="w-full py-2 px-3 text-xs font-bold rounded-xl text-white cursor-pointer transition-opacity hover:opacity-90 flex items-center justify-center gap-1.5"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              <span>Inspect Full Email in Analysis View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
