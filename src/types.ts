export type EmailCategory = 'Legitimate' | 'Promotional' | 'Spam' | 'Suspicious' | 'Phishing';

export type RiskLevel = 'Critical' | 'High' | 'Medium' | 'Low' | 'Safe';

export type ThemeMode = 'dark' | 'light';

export type AccentColor = 'blue' | 'purple' | 'teal' | 'emerald' | 'amber';

export interface EmailAttachment {
  filename: string;
  fileType: string;
  sizeBytes: number;
  riskLevel: 'Safe' | 'Medium' | 'High';
  isSuspiciousExtension: boolean;
  isExecutable: boolean;
  hasMacroOrScript: boolean;
  isDoubleExtension: boolean;
  reason?: string;
}

export interface EmailLink {
  displayText: string;
  actualUrl: string;
  isHttps: boolean;
  isLookalikeDomain: boolean;
  isShortener: boolean;
  isIpAddress: boolean;
  isDomainMismatch: boolean;
  riskScore: number;
  warningReasons: string[];
}

export interface SenderAnalysis {
  displayName: string;
  emailAddress: string;
  domain: string;
  isDomainMismatch: boolean;
  isLookalikeDomain: boolean;
  lookalikeTarget?: string;
  isAuthorityImpersonation: boolean;
  suspiciousCharacters: boolean;
  senderRiskScore: number; // 0 to 100
  notes: string[];
}

export interface UrlAnalysis {
  totalUrls: number;
  suspiciousUrlCount: number;
  links: EmailLink[];
  urlRiskScore: number; // 0 to 100
  notes: string[];
}

export interface SocialEngineeringAnalysis {
  urgencyDetected: boolean;
  fearOrThreatsDetected: boolean;
  accountSuspensionDetected: boolean;
  authorityImpersonationDetected: boolean;
  fakeRewardsDetected: boolean;
  financialPressureDetected: boolean;
  passwordRequestDetected: boolean;
  otpRequestDetected: boolean;
  sensitiveInfoRequestDetected: boolean;
  detectedTechniques: string[];
  socialRiskScore: number; // 0 to 100
}

export interface AttachmentAnalysis {
  hasAttachments: boolean;
  attachments: EmailAttachment[];
  attachmentRiskScore: number; // 0 to 100
  notes: string[];
}

export interface AttackChainStage {
  stepNumber: number;
  stageName: string;
  whatHappens: string;
  whyDangerous: string;
  potentialImpact: string;
  howToStaySafe: string;
  status: 'simulated' | 'neutralized' | 'prevented';
}

export interface TargetingAssessment {
  possibleAttackerGoal: string;
  likelyTechnique: string;
  psychologicalTechnique: string;
  targetedInformation: string;
  potentialImpact: string;
  disclaimer: string;
}

export interface AIAnalysisResult {
  category: EmailCategory;
  mlPrediction: string;
  confidencePercent: number;
  safetyScore: number; // 0 (Critical) to 100 (Safe)
  riskLevel: RiskLevel;
  explanation: string;
  senderRisk: number;
  urlRisk: number;
  socialRisk: number;
  contentRisk: number;
  attachmentRisk: number;
  senderAnalysis: SenderAnalysis;
  urlAnalysis: UrlAnalysis;
  socialEngineeringAnalysis: SocialEngineeringAnalysis;
  attachmentAnalysis: AttachmentAnalysis;
  recommendedAction: string;
  recommendedActionType: 'block_report' | 'spam' | 'caution' | 'none';
  targetingAssessment: TargetingAssessment;
  attackChain: AttackChainStage[];
}

export interface EmailItem {
  id: string;
  senderName: string;
  senderEmail: string;
  recipientEmail: string;
  subject: string;
  preview: string;
  body: string;
  timestamp: string;
  dateFormatted: string;
  isRead: boolean;
  isStarred: boolean;
  isTrash: boolean;
  isSpam: boolean;
  isBlocked: boolean;
  isReported: boolean;
  category: EmailCategory;
  safetyScore: number;
  riskLevel: RiskLevel;
  hasAttachment: boolean;
  attachments?: EmailAttachment[];
  analysis?: AIAnalysisResult;
}

export interface HumanFeedback {
  id: string;
  emailId: string;
  subject: string;
  predictedCategory: EmailCategory;
  isCorrect: boolean;
  suggestedCategory?: EmailCategory;
  timestamp: string;
}

export interface ThreatHistoryRecord {
  id: string;
  emailId: string;
  timestamp: string;
  sender: string;
  subject: string;
  classification: EmailCategory;
  riskScore: number;
  riskLevel: RiskLevel;
  actionTaken: 'Blocked Sender' | 'Reported Phishing' | 'Moved to Spam' | 'Moved to Trash' | 'Marked Safe / Kept';
  canUndo: boolean;
}

export interface BlockedSenderRecord {
  id: string;
  emailAddress: string;
  senderName: string;
  reason: string;
  blockedAt: string;
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  read: boolean;
  emailId?: string;
}

export interface DatasetMetrics {
  datasetName: string;
  author: string;
  datasetUrl: string;
  sources: string[];
  referenceFullSize: string;
  actualLoadedSamples: number;
  trainSamples: number;
  testSamples: number;
  vocabSize: number;
  modelType: string;
  trainingStatus: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: {
    tp: number;
    fp: number;
    tn: number;
    fn: number;
  };
}
