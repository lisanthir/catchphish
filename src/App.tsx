import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { InboxView } from './components/InboxView';
import { EmailDetailView } from './components/EmailDetailView';
import { DashboardView } from './components/DashboardView';
import { ThreatsView } from './components/ThreatsView';
import { ProtectionView } from './components/ProtectionView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { ThreatIntelligenceView } from './components/ThreatIntelligenceView';
import { storageService, KAGGLE_METADATA } from './data/storage';
import {
  EmailCategory,
  EmailItem,
  HumanFeedback,
  NotificationItem,
  RiskLevel,
  ThreatHistoryRecord,
} from './types';

export function CatchPhishApp() {
  const [emails, setEmails] = useState<EmailItem[]>(() => storageService.loadEmails());
  const [threats, setThreats] = useState<ThreatHistoryRecord[]>(() => storageService.loadThreats());
  const [blockedSenders, setBlockedSenders] = useState(() => storageService.loadBlocked());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => storageService.loadNotifications());
  const [feedback, setFeedback] = useState<HumanFeedback[]>(() => storageService.loadFeedback());

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openedEmailId, setOpenedEmailId] = useState<string | null>(null);
  const [threatIntelContextEmailId, setThreatIntelContextEmailId] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state to storage
  useEffect(() => {
    storageService.saveEmails(emails);
  }, [emails]);

  useEffect(() => {
    storageService.saveThreats(threats);
  }, [threats]);

  useEffect(() => {
    storageService.saveBlocked(blockedSenders);
  }, [blockedSenders]);

  useEffect(() => {
    storageService.saveNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    storageService.saveFeedback(feedback);
  }, [feedback]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Open an email in detailed Two-Column view
  const handleOpenEmail = (id: string) => {
    setOpenedEmailId(id);
    // Mark as read
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isRead: true } : e))
    );
  };

  const handleBackToInbox = () => {
    setOpenedEmailId(null);
  };

  const handleToggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEmails((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isStarred: !item.isStarred } : item))
    );
  };

  // Security actions
  const handleBlockSender = (emailAddress: string, senderName: string) => {
    // 1. Add to blocked senders
    const newBlock = {
      id: `block-${Date.now()}`,
      emailAddress,
      senderName,
      reason: 'User blocked sender following AI security analysis alert.',
      blockedAt: 'Just now',
    };
    setBlockedSenders((prev) => [newBlock, ...prev]);

    // 2. Add to threat history
    const targetEmail = emails.find((e) => e.senderEmail === emailAddress);
    if (targetEmail) {
      storageService.pushUndo({
        type: 'block',
        emailId: targetEmail.id,
        previousState: { isTrash: targetEmail.isTrash },
        blockedEmail: emailAddress,
        timestamp: 'Just now',
      });

      const newThreat: ThreatHistoryRecord = {
        id: `threat-${Date.now()}`,
        emailId: targetEmail.id,
        timestamp: 'Just now',
        sender: emailAddress,
        subject: targetEmail.subject,
        classification: targetEmail.category,
        riskScore: targetEmail.safetyScore,
        riskLevel: targetEmail.riskLevel,
        actionTaken: 'Blocked Sender',
        canUndo: true,
      };
      setThreats((prev) => [newThreat, ...prev]);
    }

    // 3. Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      title: 'Sender Blocked',
      message: `Sender ${emailAddress} has been added to blocked rules.`,
      type: 'warning',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Sender ${emailAddress} has been blocked.`);
    setOpenedEmailId(null);
  };

  const handleReportPhishing = (emailId: string) => {
    const targetEmail = emails.find((e) => e.id === emailId);
    if (!targetEmail) return;

    storageService.pushUndo({
      type: 'report',
      emailId,
      previousState: { isTrash: targetEmail.isTrash, category: targetEmail.category },
      timestamp: 'Just now',
    });

    // Move to quarantine / mark trash
    setEmails((prev) =>
      prev.map((e) => (e.id === emailId ? { ...e, isTrash: true } : e))
    );

    // Record in threat history
    const newThreat: ThreatHistoryRecord = {
      id: `threat-${Date.now()}`,
      emailId,
      timestamp: 'Just now',
      sender: targetEmail.senderEmail,
      subject: targetEmail.subject,
      classification: 'Phishing',
      riskScore: targetEmail.safetyScore,
      riskLevel: targetEmail.riskLevel,
      actionTaken: 'Reported Phishing',
      canUndo: true,
    };
    setThreats((prev) => [newThreat, ...prev]);

    // Record notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      title: 'Phishing Reported',
      message: `Threat "${targetEmail.subject.slice(0, 30)}..." quarantined and logged.`,
      type: 'danger',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast('Email quarantined and reported as Phishing.');
    setOpenedEmailId(null);
  };

  const handleMoveToSpam = (emailId: string) => {
    const targetEmail = emails.find((e) => e.id === emailId);
    if (!targetEmail) return;

    storageService.pushUndo({
      type: 'spam',
      emailId,
      previousState: { category: targetEmail.category },
      timestamp: 'Just now',
    });

    setEmails((prev) =>
      prev.map((e) => (e.id === emailId ? { ...e, category: 'Spam' as EmailCategory } : e))
    );

    const newThreat: ThreatHistoryRecord = {
      id: `threat-${Date.now()}`,
      emailId,
      timestamp: 'Just now',
      sender: targetEmail.senderEmail,
      subject: targetEmail.subject,
      classification: 'Spam',
      riskScore: targetEmail.safetyScore,
      riskLevel: targetEmail.riskLevel,
      actionTaken: 'Moved to Spam',
      canUndo: true,
    };
    setThreats((prev) => [newThreat, ...prev]);

    showToast('Email moved to Spam.');
    setOpenedEmailId(null);
  };

  const handleDeleteEmail = (emailId: string) => {
    const targetEmail = emails.find((e) => e.id === emailId);
    if (!targetEmail) return;

    storageService.pushUndo({
      type: 'delete',
      emailId,
      previousState: { isTrash: targetEmail.isTrash },
      timestamp: 'Just now',
    });

    setEmails((prev) =>
      prev.map((e) => (e.id === emailId ? { ...e, isTrash: true } : e))
    );

    showToast('Email moved to Trash.');
    setOpenedEmailId(null);
  };

  const handleKeepEmail = (emailId: string) => {
    setEmails((prev) =>
      prev.map((e) => (e.id === emailId ? { ...e, isRead: true } : e))
    );
    showToast('Email kept in inbox.');
    setOpenedEmailId(null);
  };

  // Undo system
  const handleUndoLastAction = () => {
    const snapshot = storageService.popUndo();
    if (!snapshot) return;

    if (snapshot.type === 'block' && snapshot.blockedEmail) {
      setBlockedSenders((prev) => prev.filter((b) => b.emailAddress !== snapshot.blockedEmail));
    }

    if (snapshot.emailId && snapshot.previousState) {
      setEmails((prev) =>
        prev.map((e) => (e.id === snapshot.emailId ? { ...e, ...snapshot.previousState } : e))
      );
    }

    showToast('Previous security action was successfully undone.');
  };

  const handleUndoThreatAction = (threatId: string) => {
    const th = threats.find((t) => t.id === threatId);
    if (!th) return;

    // Restore email if trashed
    setEmails((prev) =>
      prev.map((e) => (e.id === th.emailId ? { ...e, isTrash: false } : e))
    );

    // Remove from threats
    setThreats((prev) => prev.filter((t) => t.id !== threatId));
    showToast('Action undone from Threat History.');
  };

  const handleBulkMarkRead = (ids: string[]) => {
    setEmails((prev) =>
      prev.map((e) => (ids.includes(e.id) ? { ...e, isRead: true } : e))
    );
    showToast(`Marked ${ids.length} emails as read.`);
  };

  const handleBulkMoveSpam = (ids: string[]) => {
    setEmails((prev) =>
      prev.map((e) => (ids.includes(e.id) ? { ...e, category: 'Spam' as EmailCategory } : e))
    );
    showToast(`Moved ${ids.length} emails to Spam.`);
  };

  const handleBulkDelete = (ids: string[]) => {
    setEmails((prev) =>
      prev.map((e) => (ids.includes(e.id) ? { ...e, isTrash: true } : e))
    );
    showToast(`Moved ${ids.length} emails to Trash.`);
  };

  const handleSubmitFeedback = (fb: Omit<HumanFeedback, 'id' | 'timestamp'>) => {
    const newFeedbackItem: HumanFeedback = {
      ...fb,
      id: `fb-${Date.now()}`,
      timestamp: 'Just now',
    };
    setFeedback((prev) => [newFeedbackItem, ...prev]);
    showToast('Feedback saved to database.');
  };

  const handleUnblockSender = (id: string) => {
    setBlockedSenders((prev) => prev.filter((b) => b.id !== id));
    showToast('Sender unblocked.');
  };

  const handleClearNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.');
  };

  const handleResetSandbox = () => {
    storageService.resetAll();
    setEmails(storageService.loadEmails());
    setThreats(storageService.loadThreats());
    setBlockedSenders(storageService.loadBlocked());
    setNotifications(storageService.loadNotifications());
    setFeedback(storageService.loadFeedback());
    setOpenedEmailId(null);
    setActiveTab('dashboard');
    showToast('Sandbox reset to pristine demonstration state.');
  };

  // Threat count and unread count
  const unreadCount = emails.filter((e) => !e.isRead && !e.isTrash).length;
  const threatCount = emails.filter((e) => (e.category === 'Phishing' || e.category === 'Suspicious') && !e.isTrash).length;

  const categoryCounts: Record<EmailCategory, number> = {
    Phishing: emails.filter((e) => e.category === 'Phishing' && !e.isTrash).length,
    Suspicious: emails.filter((e) => e.category === 'Suspicious' && !e.isTrash).length,
    Spam: emails.filter((e) => e.category === 'Spam' && !e.isTrash).length,
    Promotional: emails.filter((e) => e.category === 'Promotional' && !e.isTrash).length,
    Legitimate: emails.filter((e) => e.category === 'Legitimate' && !e.isTrash).length,
  };

  const openedEmail = emails.find((e) => e.id === openedEmailId);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Top Bar Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        notifications={notifications}
        onNotificationClick={(notif) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
          );
        }}
        onClearNotifications={handleClearNotifications}
        onOpenEmail={handleOpenEmail}
        onNavigate={(tab) => {
          setActiveTab(tab);
          setOpenedEmailId(null);
        }}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={openedEmailId ? 'inbox' : activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setOpenedEmailId(null);
          }}
          unreadCount={unreadCount}
          threatCount={threatCount}
          selectedCategoryFilter={selectedCategoryFilter}
          onSelectCategoryFilter={(cat) => {
            setSelectedCategoryFilter(cat);
            setActiveTab('inbox');
            setOpenedEmailId(null);
          }}
          categoryCounts={categoryCounts}
        />

        {/* Center / Right Content Panel */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {openedEmailId && openedEmail ? (
            <EmailDetailView
              email={openedEmail}
              onBack={handleBackToInbox}
              onBlockSender={handleBlockSender}
              onReportPhishing={handleReportPhishing}
              onMoveToSpam={handleMoveToSpam}
              onDeleteEmail={handleDeleteEmail}
              onKeepEmail={handleKeepEmail}
              onUndoLastAction={handleUndoLastAction}
              canUndo={storageService.canUndo()}
              onSubmitFeedback={handleSubmitFeedback}
              onOpenThreatIntel={(emailId) => {
                setThreatIntelContextEmailId(emailId);
                setActiveTab('threat-intel');
                setOpenedEmailId(null);
              }}
            />
          ) : activeTab === 'dashboard' ? (
            <DashboardView
              emails={emails.filter((e) => !e.isTrash)}
              blockedCount={blockedSenders.length}
              onOpenEmail={handleOpenEmail}
              onNavigate={(tab) => {
                setActiveTab(tab);
                setOpenedEmailId(null);
              }}
            />
          ) : activeTab === 'inbox' ? (
            <InboxView
              emails={emails}
              selectedCategoryFilter={selectedCategoryFilter}
              onSelectCategoryFilter={setSelectedCategoryFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onOpenEmail={handleOpenEmail}
              onToggleStar={handleToggleStar}
              onBulkMarkRead={handleBulkMarkRead}
              onBulkMoveSpam={handleBulkMoveSpam}
              onBulkDelete={handleBulkDelete}
              onUndoLastAction={handleUndoLastAction}
              canUndo={storageService.canUndo()}
            />
          ) : activeTab === 'threats' ? (
            <ThreatsView
              threats={threats}
              onUndoThreatAction={handleUndoThreatAction}
              onOpenEmail={handleOpenEmail}
            />
          ) : activeTab === 'threat-intel' ? (
            <ThreatIntelligenceView
              emails={emails.filter((e) => !e.isTrash)}
              selectedEmailId={threatIntelContextEmailId}
              onOpenEmail={handleOpenEmail}
            />
          ) : activeTab === 'ai-analysis' ? (
            <ThreatIntelligenceView
              emails={emails.filter((e) => !e.isTrash)}
              selectedEmailId={threatIntelContextEmailId}
              onOpenEmail={handleOpenEmail}
            />
          ) : activeTab === 'protection' ? (
            <ProtectionView
              blockedSenders={blockedSenders}
              onUnblockSender={handleUnblockSender}
              reportedEmails={emails.filter((e) => e.isTrash && e.category === 'Phishing')}
              spamEmails={emails.filter((e) => e.category === 'Spam')}
              onOpenEmail={handleOpenEmail}
            />
          ) : activeTab === 'reports' ? (
            <ReportsView
              emails={emails.filter((e) => !e.isTrash)}
              threats={threats}
              feedback={feedback}
              blockedCount={blockedSenders.length}
            />
          ) : activeTab === 'settings' ? (
            <SettingsView onResetSandbox={handleResetSandbox} />
          ) : (
            <DashboardView
              emails={emails.filter((e) => !e.isTrash)}
              blockedCount={blockedSenders.length}
              onOpenEmail={handleOpenEmail}
              onNavigate={setActiveTab}
            />
          )}

          {/* Toast Notification */}
          {toastMessage && (
            <div className="absolute bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border shadow-2xl animate-in slide-in-from-bottom-5 bg-slate-900 text-white border-slate-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
              <span>{toastMessage}</span>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <CatchPhishApp />
    </ThemeProvider>
  );
}
