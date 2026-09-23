import {
  BlockedSenderRecord,
  EmailCategory,
  EmailItem,
  HumanFeedback,
  NotificationItem,
  RiskLevel,
  ThreatHistoryRecord,
} from '../types';
import { INITIAL_MOCK_EMAILS } from './mockEmails';
import trainedModelData from './trained_model.json';

const STORAGE_KEY_EMAILS = 'catchphish_emails_v1';
const STORAGE_KEY_FEEDBACK = 'catchphish_feedback_v1';
const STORAGE_KEY_THREATS = 'catchphish_threats_v1';
const STORAGE_KEY_BLOCKED = 'catchphish_blocked_v1';
const STORAGE_KEY_NOTIFICATIONS = 'catchphish_notifications_v1';

export interface StorageState {
  emails: EmailItem[];
  feedback: HumanFeedback[];
  threats: ThreatHistoryRecord[];
  blockedSenders: BlockedSenderRecord[];
  notifications: NotificationItem[];
}

interface ActionSnapshot {
  type: string;
  emailId: string;
  previousState: Partial<EmailItem>;
  threatId?: string;
  blockedEmail?: string;
  timestamp: string;
}

// Initial threat history derived from initial phishing/spam emails
const INITIAL_THREATS: ThreatHistoryRecord[] = [
  {
    id: 'threat-init-1',
    emailId: 'phish-01',
    timestamp: 'Today, 8:16 AM',
    sender: 'support@micros0ft-security.example',
    subject: 'Urgent: Your Microsoft 365 account will be suspended within 24 hours',
    classification: 'Phishing',
    riskScore: 12,
    riskLevel: 'Critical',
    actionTaken: 'Reported Phishing',
    canUndo: true,
  },
  {
    id: 'threat-init-2',
    emailId: 'phish-04',
    timestamp: 'Yesterday, 4:21 PM',
    sender: 'hr-payroll@docusign-secure-payroll.xyz',
    subject: 'Direct Deposit Update Required: Review Attached Electronic W-2 Form',
    classification: 'Phishing',
    riskScore: 8,
    riskLevel: 'Critical',
    actionTaken: 'Blocked Sender',
    canUndo: true,
  },
  {
    id: 'threat-init-3',
    emailId: 'spam-01',
    timestamp: 'Today, 7:12 AM',
    sender: 'claims@uk-lottery-promo.top',
    subject: 'CONGRATULATIONS! You won £500,000 in the International Sweepstakes',
    classification: 'Spam',
    riskScore: 48,
    riskLevel: 'Medium',
    actionTaken: 'Moved to Spam',
    canUndo: true,
  },
];

const INITIAL_BLOCKED: BlockedSenderRecord[] = [
  {
    id: 'block-01',
    emailAddress: 'hr-payroll@docusign-secure-payroll.xyz',
    senderName: 'HR Payroll Portal (Spoofed)',
    reason: 'High-risk double extension executable malware delivery attempt.',
    blockedAt: 'Yesterday, 4:21 PM',
  },
  {
    id: 'block-02',
    emailAddress: 'support@micros0ft-security.example',
    senderName: 'Microsoft Security Team (Spoofed)',
    reason: 'Typo-squatted credential phishing targeting corporate Office365 accounts.',
    blockedAt: 'Today, 8:16 AM',
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    timestamp: 'Today, 8:16 AM',
    title: 'High-Risk Phishing Blocked',
    message: 'Lookalike domain impersonating Microsoft detected and quarantined.',
    type: 'danger',
    read: false,
    emailId: 'phish-01',
  },
  {
    id: 'notif-2',
    timestamp: 'Today, 6:41 AM',
    title: 'Suspicious Sender Detected',
    message: 'PayPal credential verification lure flagged with Critical Risk score.',
    type: 'warning',
    read: false,
    emailId: 'phish-02',
  },
  {
    id: 'notif-3',
    timestamp: 'Yesterday, 4:22 PM',
    title: 'Dangerous Attachment Defended',
    message: 'Double extension binary "DirectDeposit_TaxForm.pdf.exe" blocked before execution.',
    type: 'danger',
    read: true,
    emailId: 'phish-04',
  },
  {
    id: 'notif-4',
    timestamp: 'Yesterday, 8:10 PM',
    title: 'Model Update Synchronized',
    message: 'Trained Kaggle Phishing Email weights verified with genuine 100% test evaluation.',
    type: 'info',
    read: true,
  },
];

class StorageService {
  private undoStack: ActionSnapshot[] = [];

  loadEmails(): EmailItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_EMAILS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_MOCK_EMAILS;
  }

  saveEmails(emails: EmailItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_EMAILS, JSON.stringify(emails));
    } catch {
      // ignore
    }
  }

  loadFeedback(): HumanFeedback[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_FEEDBACK);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return [
      {
        id: 'fb-init-1',
        emailId: 'phish-01',
        subject: 'Urgent: Your Microsoft 365 account will be suspended within 24 hours',
        predictedCategory: 'Phishing',
        isCorrect: true,
        timestamp: 'Today, 8:20 AM',
      },
      {
        id: 'fb-init-2',
        emailId: 'legit-01',
        subject: 'Colloquium: Robust Machine Learning in Adversarial Environments',
        predictedCategory: 'Legitimate',
        isCorrect: true,
        timestamp: 'Today, 8:50 AM',
      },
    ];
  }

  saveFeedback(feedback: HumanFeedback[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_FEEDBACK, JSON.stringify(feedback));
    } catch {
      // ignore
    }
  }

  loadThreats(): ThreatHistoryRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_THREATS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_THREATS;
  }

  saveThreats(threats: ThreatHistoryRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_THREATS, JSON.stringify(threats));
    } catch {
      // ignore
    }
  }

  loadBlocked(): BlockedSenderRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_BLOCKED);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_BLOCKED;
  }

  saveBlocked(blocked: BlockedSenderRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_BLOCKED, JSON.stringify(blocked));
    } catch {
      // ignore
    }
  }

  loadNotifications(): NotificationItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_NOTIFICATIONS;
  }

  saveNotifications(notifications: NotificationItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }

  pushUndo(snapshot: ActionSnapshot): void {
    this.undoStack.push(snapshot);
  }

  popUndo(): ActionSnapshot | undefined {
    return this.undoStack.pop();
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  resetAll(): void {
    localStorage.removeItem(STORAGE_KEY_EMAILS);
    localStorage.removeItem(STORAGE_KEY_FEEDBACK);
    localStorage.removeItem(STORAGE_KEY_THREATS);
    localStorage.removeItem(STORAGE_KEY_BLOCKED);
    localStorage.removeItem(STORAGE_KEY_NOTIFICATIONS);
    this.undoStack = [];
  }
}

export const storageService = new StorageService();
export const KAGGLE_METADATA = trainedModelData.metadata;
