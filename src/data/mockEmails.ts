import { EmailItem } from '../types';
import { runHybridPhishingAnalysis } from '../services/detectionEngine';

const RAW_MOCK_EMAILS = [
  // 1. Phishing Scenarios
  {
    id: 'phish-01',
    senderName: 'Microsoft Security Team',
    senderEmail: 'support@micros0ft-security.example',
    recipientEmail: 'alex.chen@workplace.example',
    subject: 'Urgent: Your Microsoft 365 account will be suspended within 24 hours',
    preview: 'Immediate action required. Unusual sign-in attempts detected from a foreign IP address...',
    body: `Dear Office 365 Administrator,

We have detected multiple unauthorized sign-in attempts to your Microsoft 365 tenant from an unverified location (IP: 185.220.101.4).

To safeguard your organization's mailbox, your corporate credentials have been flagged for imminent deactivation. Your account will be permanently suspended within 24 hours unless you re-authenticate your identity.

Please click the secure verification link below immediately:
https://micros0ft-security.example/login/verify-m365?session=99281a

Failure to verify credentials will result in termination of your active mailbox, SharePoint records, and Teams access.

Sincerely,
Microsoft Security Operations Team
(c) 2026 Microsoft Corporation. All rights reserved.`,
    timestamp: '2026-09-23T08:15:00Z',
    dateFormatted: 'Today, 8:15 AM',
    isRead: false,
    isStarred: true,
    isTrash: false,
    isSpam: false,
    isBlocked: false,
    isReported: false,
    category: 'Phishing' as const,
    hasAttachment: false,
  },
  {
    id: 'phish-02',
    senderName: 'PayPal Account Alert',
    senderEmail: 'service@paypa1-verification-center.info',
    recipientEmail: 'alex.chen@workplace.example',
    subject: 'Action Required: Your PayPal account has been restricted',
    preview: 'We noticed suspicious transactions on your debit card. Confirm your account details...',
    body: `Dear Valued Customer,

Your PayPal account has been placed under temporary restriction following suspicious activity and unauthorized attempts to link a new banking instrument.

Access to sending, receiving, and withdrawing funds is currently disabled.

To restore full privileges, update your billing profile and confirm your identity:
http://paypal-security-update.info/login/restore?ref=88319

You will be asked to verify:
1. Full Legal Name and Date of Birth
2. Debit / Credit Card number and CVV
3. 2-Step OTP Security Code

If not resolved within 12 hours, a penalty holding fee may be applied to your balance.

PayPal Customer Fraud Prevention Department`,
    timestamp: '2026-09-23T06:40:00Z',
    dateFormatted: 'Today, 6:40 AM',
    isRead: false,
    isStarred: false,
    isTrash: false,
    isSpam: false,
    isBlocked: false,
    isReported: false,
    category: 'Phishing' as const,
    hasAttachment: false,
  },
  {
    id: 'phish-03',
    senderName: 'Chase Fraud Department',
    senderEmail: 'fraud-alerts@chase-online-protect.com',
    recipientEmail: 'alex.chen@workplace.example',
    subject: 'Security Alert: Enter One-Time Password to cancel $1,249.00 charge',
    preview: 'A pending transfer of $1,249.00 to CryptoExchange Ltd was requested from your account...',
    body: `Chase Online Banking Alert:

A wire transfer of $1,249.00 to "CryptoExchange Global Ltd" was requested today at 04:12 AM EST.

If you initiated this wire, no action is needed.

If you DID NOT authorize this wire transfer, cancel it immediately before funds leave your checking account:
http://chase-online-protect.com/session/cancel-wire?auth_id=981240

You must confirm your online user ID and enter the 6-digit SMS verification code to verify your ownership and halt the wire.

Chase Security & Fraud Operations`,
    timestamp: '2026-09-22T21:30:00Z',
    dateFormatted: 'Yesterday, 9:30 PM',
    isRead: false,
    isStarred: true,
    isTrash: false,
    isSpam: false,
    isBlocked: false,
    isReported: false,
    category: 'Phishing' as const,
    hasAttachment: false,
  },
  {
    id: 'phish-04',
    senderName: 'HR Payroll Portal',
    senderEmail: 'hr-payroll@docusign-secure-payroll.xyz',
    recipientEmail: 'alex.chen@workplace.example',
    subject: 'Direct Deposit Update Required: Review Attached Electronic W-2 Form',
    preview: 'Your quarterly payroll direct deposit failed due to tax withholding discrepancies...',
    body: `Hello Team Member,

Your scheduled direct deposit for the upcoming pay cycle could not be processed due to missing tax allocation forms required under state compliance regulations.

Please open and review the attached electronic document to verify your direct deposit banking routing number:

Direct Portal Link:
http://docusign-secure-payroll.xyz/view/employee-tax-w2?org=corp

Please confirm submission before 5:00 PM today to prevent delays in your salary disbursement.

Human Resources Department`,
    timestamp: '2026-09-22T16:20:00Z',
    dateFormatted: 'Yesterday, 4:20 PM',
    isRead: true,
    isStarred: false,
    isTrash: false,
    isSpam: false,
    isBlocked: false,
    isReported: false,
    category: 'Phishing' as const,
    hasAttachment: true,
    attachments: [
      {
        filename: 'DirectDeposit_TaxForm.pdf.exe',
        fileType: 'application/octet-stream',
        sizeBytes: 142050,
        riskLevel: 'High' as const,
        isSuspiciousExtension: true,
        isExecutable: true,
        hasMacroOrScript: false,
        isDoubleExtension: true,
        reason: 'Double extension (.pdf.exe) concealing executable binary payload.',
      },
    ],
  },
  {
    id: 'phish-05',
    senderName: 'DHL Express Delivery',
    senderEmail: 'tracking@dhl-express-redelivery.co.vu',
    recipientEmail: 'alex.chen@workplace.example',
    subject: 'Delivery Exception: Package #DH-88219 held at customs hub',
    preview: 'Your package could not be delivered due to an unpaid customs duty fee of $2.99...',
    body: `DHL Express Notice:

Shipment tracking number #DH-88219 has been placed on hold at our regional parcel distribution hub.

Reason: Outstanding duty and address verification fee of $2.99 USD.

To arrange immediate home dispatch, verify your shipping address and pay the fee online:
http://dhl-express-redelivery.co.vu/parcel/dh88219/pay

Packages unclaimed for more than 48 hours will be destroyed at sender expense.

DHL International Courier Network`,
    timestamp: '2026-09-22T11:05:00Z',
    dateFormatted: 'Yesterday, 11:05 AM',
    isRead: true,
    isStarred: false,
    isTrash: false,
    isSpam: false,
    isBlocked: false,
    isReported: false,
    category: 'Phishing' as const,
    hasAttachment: false,
  },

  // 2. Spam Scenarios (Unsolicited mass marketing, prizes, lottery, but NOT targeted credential theft)
  {
    id: 'spam-01',
    senderName: 'UK National Lottery Promo',
    senderEmail: 'claims@uk-lottery-promo.top',
    recipientEmail: 'alex.chen@workplace.example',
    subject: 'CONGRATULATIONS! You won £500,000 in the International Sweepstakes',
    preview: 'Official prize notification: Your email was drawn as the lucky recipient of the grand prize...',
    body: `OFFICIAL NOTIFICATION:

We are pleased to inform you that your email address was selected in the Category A drawing of the International Consumer Goodwill Sweepstakes!

You are entitled to a lump-sum award of £500,000 (Five Hundred Thousand Great British Pounds).

Winning Ticket Ref: UK/LOTTO-9921-X
Batch Number: 88201-GL

To process your payout check, reply to this message with your full name, telephone number, and residential delivery address.

No purchase necessary. Administered by Global Promotions Trust Ltd.`,
    timestamp: '2026-09-23T07:10:00Z',
    dateFormatted: 'Today, 7:10 AM',
    isRead: false,
    isStarred: false,
    isTrash: false,
    isSpam: true,
    isBlocked: false,
    isReported: false,
    category: 'Spam' as const,
    hasAttachment: false,
  },
  {
    id: 'spam-02',
    senderName: 'Luxury Watch Clearance',
    senderEmail: 'deals@watches-clearance-sale.shop',
    recipientEmail: 'alex.chen@workplace.example',
    subject: 'Best Replica Watches: Rolex, Omega, Breitling at 90% Discount!',
    preview: 'Flash liquidation event. Top quality Swiss replicas starting from only $79 with free box...',
    body: `Exclusive 24-Hour Watch Clearance Event!

Own the prestige of iconic luxury timepieces for a fraction of retail prices:
- Submariner Ceramic Editions: $89 (Was $850)
- Speedmaster Chronograph: $95
- Daytona Oysterflex: $110

All watches come with authentic presentation boxes and 2-year movement warranty.

Visit our online catalog now:
http://luxury-clearance-store-88.shop/catalog

Fast worldwide express shipping. Limited stock available!`,
    timestamp: '2026-09-22T19:45:00Z',
    dateFormatted: 'Yesterday, 7:45 PM',
    isRead: true,
    isStarred: false,
    isTrash: false,
    isSpam: true,
    isBlocked: false,
    isReported: false,
    category: 'Spam' as const,
    hasAttachment: false,
  },
  {
    id: 'spam-03',
    senderName: 'Miracle Keto Wellness',
    senderEmail: 'offers@ketomax-burn.buzz',
    recipientEmail: 'alex.chen@workplace.example',
    subject: 'Drop 20 lbs in 14 days without exercise! Free trial bottles',
    preview: 'Doctor recommended natural formula burns fat while you sleep. Claim your free bottle...',
    body: `Are you struggling with stubborn belly fat?

Celebrity doctors are raving about the all-new Keto Max Burn complex. Activate deep metabolic thermogenesis and melt away excess calories effortlessly!

Key Benefits:
- 100% Organic botanical extracts
- Zero dietary restrictions or heavy gym routines
- Money back satisfaction guarantee

Claim your complimentary trial bottle before supplies run out:
http://ketomax-burn.buzz/trial-offer

Unsubscribe at http://ketomax-burn.buzz/opt-out`,
    timestamp: '2026-09-22T14:15:00Z',
    dateFormatted: 'Yesterday, 2:15 PM',
    isRead: true,
    isStarred: false,
    isTrash: false,
    isSpam: true,
    isBlocked: false,
    isReported: false,
    category: 'Spam' as const,
    hasAttachment: false,
  },
  {
    id: 'spam-04',
    senderName: 'Royal Vegas Casino',
    senderEmail: 'bonus@royal-vegas-spin.click',
    recipientEmail: 'alex.chen@workplace.example',
    subject: 'Claim 250 Free Spins + 500% Deposit Match on your first bet',
    preview: 'Play high-stakes progressive slots, blackjack, and live roulette from home with instant cashouts...',
    body: `WELCOME HIGH ROLLER!

Your VIP welcome package has been unlocked:
- 250 Free Bonus Spins on Mega Moolah
- 500% Cash Match up to $2,500 on first deposit
- Instant crypto and card withdrawals

Experience Las Vegas excitement directly on your phone:
http://royal-vegas-spin.click/welcome-bonus

Play responsibly. 18+ only. Terms and wagering conditions apply.`,
    timestamp: '2026-09-21T23:00:00Z',
    dateFormatted: 'Sep 21, 11:00 PM',
    isRead: true,
    isStarred: false,
    isTrash: false,
    isSpam: true,
    isBlocked: false,
    isReported: false,
    category: 'Spam' as const,
    hasAttachment: false,
  },
  {
    id: 'spam-05',
    senderName: 'B2B Growth Leads List',
    senderEmail: 'sales@b2b-executive-leads.rest',
    recipientEmail: 'alex.chen@workplace.example',
    subject: '1,000,000 Verified Decision Maker Emails for Q4 Outreach',
    preview: 'Supercharge your B2B sales pipeline with fresh CEO, CTO, and VP marketing databases...',
    body: `Hi Sales Leader,

Are you looking to scale your qualified outbound meetings for Q4?

We have compiled 1,000,000 fresh, verified decision-maker emails across North America, Europe, and Asia:
- Includes direct dial phone numbers and LinkedIn profile URLs
- Verified 98% email deliverability rate
- Instant CSV export upon checkout

Special early-bird rate: $149 for the entire enterprise dataset.

Download sample records:
http://b2b-executive-leads.rest/download-sample

Reply "REMOVE" to opt out from future communications.`,
    timestamp: '2026-09-21T15:20:00Z',
    dateFormatted: 'Sep 21, 3:20 PM',
    isRead: true,
    isStarred: false,
    isTrash: false,
    isSpam: true,
    isBlocked: false,
    isReported: false,
    category: 'Spam' as const,
    hasAttachment: false,
  },

  // 3. Promotional Scenarios (Authentic commercial newsletters, opt-in sales, SaaS discounts)
  {
    id: 'promo-01',
    senderName: 'Figma',
    senderEmail: 'news@figma.com',
    recipientEmail: 'alex.chen@workplace.example',
    subject: 'Config 2026 is coming: Early-bird passes are now live',
    preview: 'Join 10,000+ designers, developers, and product creators in San Francisco this June...',
    body: `Hey Alex,

Config 2026 is officially around the corner!

We are gathering the global design and engineering community in San Francisco for two days of keynote reveals, hands-on design systems workshops, and community showcases.

Early-bird ticket pricing is available until October 15:
- In-Person Full Conference Pass: $399 (Regular $599)
- Free Virtual Livestream Pass available worldwide

Explore speaker lineup and reserve passes:
https://figma.com/config-2026

See you there!
The Figma Events Team`,
    timestamp: '2026-09-23T09:00:00Z',
    dateFormatted: 'Today, 9:00 AM',
    isRead: false,
    isStarred: false,
    isTrash: false,
    isSpam: false,
    isBlocked: false,
    isReported: false,
    category: 'Promotional' as const,
    hasAttachment: false,
  },
  {
    id: 'promo-02',
    senderName: 'Linear',
    senderEmail: 'updates@linear.app',
    recipientEmail: 'alex.chen@workplace.example',
    subject: 'Linear 2026 Release: Automated triage and initiative roadmaps',
    preview: 'Introducing powerful new ways to plan quarterly goals, track roadmap health, and streamline backlog reviews...',
    body: `Hi Alex,

Today we are releasing our biggest product cycle update: Linear Initiatives 2.0.

What is new:
- Roadmap Health Tracking: Connect engineering projects directly to executive company objectives
- Smart Backlog Triage: Automatically group duplicate tickets and route to squad leads
- Enhanced GitHub Enterprise sync: Real-time PR previews inside issues

Upgrade your workspace to Linear Business today and receive 20% off annual billing:
https://linear.app/upgrade/annual-promo

Best,
Karri & the Linear Team`,
    timestamp: '2026-09-22T17:40:00Z',
    dateFormatted: 'Yesterday, 5:40 PM',
    isRead: true,
    isStarred: false,
    isTrash: false,
    isSpam: false,
    isBlocked: false,
    isReported: false,
    category: 'Promotional' as const,
    hasAttachment: false,
  },
  {
    id: 'promo-03',
    senderName: 'Datadog Events',
    senderEmail: 'webinars@datadoghq.com',
    recipientEmail: 'alex.chen@workplace.example',
    subject: 'RSVP: Observability & Cloud Security Summit — Live Masterclass',
    preview: 'Learn how modern DevOps teams monitor Kubernetes clusters and investigate cloud vulnerabilities...',
    body: `Alex,

Join industry leaders from Airbnb, Stripe, and Datadog for an exclusive virtual masterclass:

"Architecting Resilient Cloud Observability at Enterprise Scale"
Date: Thursday, October 8 | 11:00 AM PDT

Key topics covered:
- Real-time distributed tracing across microservices
- Cloud SIEM and automated anomaly detection
- Hands-on demo of APM query optimization

Save your complimentary virtual seat:
https://datadoghq.com/events/cloud-summit-2026

Datadog Developer Relations`,
    timestamp: '2026-09-22T13:10:00Z',
    dateFormatted: 'Yesterday, 1:10 PM',
    isRead: true,
    isStarred: false,
    isTrash: false,
    isSpam: false,
    isBlocked: false,
    isReported: false,
    category: 'Promotional' as const,
    hasAttachment: false,
  },
  {
    id: 'promo-04',
    senderName: 'GitHub Community',
    senderEmail: 'notifications@github.com',
    recipientEmail: 'alex.chen@workplace.example',
    subject: 'GitHub Copilot Enterprise: Special team pricing for September',
    preview: 'Empower your engineering squads with codebase-aware AI suggestions and security scanning...',
    body: `Hello Alex,

Accelerate your development velocity with GitHub Copilot Enterprise.

Over 77,000 organizations use Copilot to write secure code 55% faster and reduce pull request cycle times.

Special offer this month:
- 30-day risk-free team trial for up to 50 engineers
- Personalized onboarding consultation with a GitHub solutions architect

Learn more about enterprise pricing:
https://github.com/features/copilot/enterprise

Happy coding,
GitHub Team`,
    timestamp: '2026-09-21T18:00:00Z',
    dateFormatted: 'Sep 21, 6:00 PM',
    isRead: true,
    isStarred: false,
    isTrash: false,
    isSpam: false,
    isBlocked: false,
    isReported: false,
    category: 'Promotional' as const,
    hasAttachment: false,
  },
  {
    id: 'promo-05',
    senderName: 'Vercel Newsletter',
    senderEmail: 'ship@vercel.com',
    recipientEmail: 'alex.chen@workplace.example',
    subject: 'Next.js 16 is here: Turbopack by default and Server Actions 2.0',
    preview: 'Check out the official highlights from Next.js Conf, including 10x faster local builds...',
    body: `Hi Alex,

Next.js 16 is officially released for production!

Highlights:
- Turbopack is now stable and enabled by default for dev and build
- Dynamic IO caching provides granular control over stale-while-revalidate data
- React 19 architecture support with zero configuration

Read the complete announcement and migration guide:
https://vercel.com/blog/next-16-announcement

Ship faster,
The Vercel Team`,
    timestamp: '2026-09-20T16:30:00Z',
    dateFormatted: 'Sep 20, 4:30 PM',
    isRead: true,
    isStarred: false,
    isTrash: false,
    isSpam: false,
    isBlocked: false,
    isReported: false,
    category: 'Promotional' as const,
    hasAttachment: false,
  },

  // 4. Suspicious Scenarios (Ambiguous messages with several risk indicators but insufficient proof of phishing)
  {
    id: 'susp-01',
    senderName: 'Apex Cloud Solutions',
    senderEmail: 'billing@apexcloud-portal.net',
    recipientEmail: 'alex.chen@workplace.example',
    subject: 'Pending Invoice #AP-9042 from External Supplier',
    preview: 'Please find attached invoice for cloud infrastructure provisioning completed last week...',
    body: `Hello Alex,

Please find attached the billing statement for the additional cloud infrastructure resources allocated during your performance testing sprint last week.

Total Amount Due: $3,450.00
Payment Terms: Net 15 days

The invoice breakdown is contained in the attached password-protected archive. Please review and route to accounts payable.

Portal Reference:
http://apexcloud-portal.net/invoices/AP-9042

Thank you,
Finance Department
Apex Cloud Systems`,
    timestamp: '2026-09-23T05:50:00Z',
    dateFormatted: 'Today, 5:50 AM',
    isRead: false,
    isStarred: false,
    isTrash: false,
    isSpam: false,
    isBlocked: false,
    isReported: false,
    category: 'Suspicious' as const,
    hasAttachment: true,
    attachments: [
      {
        filename: 'Invoice_AP9042_Sep2026.zip',
        fileType: 'application/zip',
        sizeBytes: 84210,
        riskLevel: 'Medium' as const,
        isSuspiciousExtension: false,
        isExecutable: false,
        hasMacroOrScript: false,
        isDoubleExtension: false,
        reason: 'Compressed archive from unverified external supplier; potential macro risk.',
      },
    ],
  },
  {
    id: 'susp-02',
    senderName: 'Technical Seminar Coordinator',
    senderEmail: 'organizer@summit-registrations-hub.xyz',
    recipientEmail: 'alex.chen@workplace.example',
    subject: 'Your session speaker invitation for the AI Security Symposium',
    preview: 'We would be honored to host you as a panel speaker on autonomous defensive security...',
    body: `Dear Alex Chen,

Our program committee has reviewed your recent technical publications and would like to formally invite you as an invited panelist at the International AI Security Symposium.

Travel accommodations and speaker honorarium will be fully subsidized by the organizing foundation.

Please confirm your availability and download the speaker bio submission form:
http://summit-registrations-hub.xyz/speakers/invite?id=8831

We would appreciate your response by Friday so we can finalize the printed program brochure.

Dr. Ronald Vance
Symposium Chair`,
    timestamp: '2026-09-22T18:15:00Z',
    dateFormatted: 'Yesterday, 6:15 PM',
    isRead: true,
    isStarred: false,
    isTrash: false,
    isSpam: false,
    isBlocked: false,
    isReported: false,
    category: 'Suspicious' as const,
    hasAttachment: false,
  },
  {
    id: 'susp-03',
    senderName: 'IT Network Helpdesk',
    senderEmail: 'admin-tickets@corporate-net-support.work',
    recipientEmail: 'alex.chen@workplace.example',
    subject: 'Scheduled WiFi Certificate Update for Remote Employees',
    preview: 'Notice: Corporate VPN certificates are being re-issued this weekend. Check configuration...',
    body: `Team,

Network engineering will be cycling SSL root authority certificates across all internal and remote employee VPN gateways this Saturday.

To ensure uninterrupted remote desktop access on Monday, please verify that your machine has the updated network profile installed:

Check certificate status:
http://corporate-net-support.work/tools/cert-check

If you experience connection errors, submit a support ticket through standard channels.

Network Infrastructure Operations`,
    timestamp: '2026-09-22T10:30:00Z',
    dateFormatted: 'Yesterday, 10:30 AM',
    isRead: true,
    isStarred: false,
    isTrash: false,
    isSpam: false,
    isBlocked: false,
    isReported: false,
    category: 'Suspicious' as const,
    hasAttachment: false,
  },
  {
    id: 'susp-04',
    senderName: 'Shared Workspace Notification',
    senderEmail: 'notifications@file-transfer-relay.biz',
    recipientEmail: 'alex.chen@workplace.example',
    subject: 'Elena Rostova shared "Q4_Confidential_Strategy.xlsx" with you',
    preview: 'A teammate has shared a spreadsheet with you via secure file relay. Click to view...',
    body: `Hello,

A secure spreadsheet document was transferred to your email address:

Document Name: Q4_Confidential_Strategy.xlsx
Uploaded By: Elena Rostova (elena.rostova@external-consultants.net)
Expires In: 48 Hours

Access Document:
http://file-transfer-relay.biz/files/download?token=7719a0e2

Note: This file transfer server is hosted on external infrastructure and may be subject to audit logs.`,
    timestamp: '2026-09-21T14:45:00Z',
    dateFormatted: 'Sep 21, 2:45 PM',
    isRead: true,
    isStarred: false,
    isTrash: false,
    isSpam: false,
    isBlocked: false,
    isReported: false,
    category: 'Suspicious' as const,
    hasAttachment: false,
  },
  {
    id: 'susp-05',
    senderName: 'Global Travel Concierge',
    senderEmail: 'reservations@travel-booking-portal.cc',
    recipientEmail: 'alex.chen@workplace.example',
    subject: 'Flight Itinerary Confirmation for Tokyo Conference Trip',
    preview: 'Your reservation for flight UA 837 has been held. Review ticket details...',
    body: `Dear Alex,

Your flight reservation request for San Francisco (SFO) to Tokyo Haneda (HND) has been confirmed on hold.

Flight: UA 837
Departure: October 14, 2026 | 11:20 AM
Seat: 14A (Business Class)

Please review passenger passport details and ticketing fare rules before final e-ticket issuance:
http://travel-booking-portal.cc/itinerary/view?booking=TK-99214

If this itinerary was booked in error by your travel manager, please cancel within 24 hours.

Global Travel Services`,
    timestamp: '2026-09-20T19:10:00Z',
    dateFormatted: 'Sep 20, 7:10 PM',
    isRead: true,
    isStarred: false,
    isTrash: false,
    isSpam: false,
    isBlocked: false,
    isReported: false,
    category: 'Suspicious' as const,
    hasAttachment: false,
  },

  // 5. Legitimate Scenarios (Normal workplace, academic, and personal correspondence)
  {
    id: 'legit-01',
    senderName: 'Stanford AI Lab',
    senderEmail: 'seminars@cs.stanford.edu',
    recipientEmail: 'alex.chen@workplace.example',
    subject: 'Colloquium: Robust Machine Learning in Adversarial Environments',
    preview: 'Speaker: Prof. David Blei, Columbia University. Gates Computer Science Building, Room 104...',
    body: `Hi Colleagues,

You are cordially invited to this week's Stanford Computer Science Colloquium.

Speaker: Prof. David Blei
Title: Robust Machine Learning in Adversarial Environments
Location: Gates Computer Science Building, Room 104 & YouTube Livestream
Time: Wednesday, September 24 at 4:15 PM PDT

Abstract:
Modern automated decision systems must operate under distribution shifts and deliberate adversarial manipulation. This talk covers recent progress in Bayesian nonparametrics and certified defensive training for security-critical pipelines.

Light refreshments will be served in the courtyard following the lecture.

Stanford Computer Science Department`,
    timestamp: '2026-09-23T08:45:00Z',
    dateFormatted: 'Today, 8:45 AM',
    isRead: false,
    isStarred: true,
    isTrash: false,
    isSpam: false,
    isBlocked: false,
    isReported: false,
    category: 'Legitimate' as const,
    hasAttachment: false,
  },
  {
    id: 'legit-02',
    senderName: 'Maya Patel (Engineering Lead)',
    senderEmail: 'maya.patel@workplace.example',
    recipientEmail: 'alex.chen@workplace.example',
    subject: 'Sprint 14 Retrospective & Q4 Technical Architecture Review',
    preview: 'Great work on the detection latency improvements! Here are the agenda notes for our retro...',
    body: `Hey Alex,

Huge congrats to you and the team for reducing detection latency by 45% during Sprint 14! The real-time classification metrics look fantastic across the benchmark tests.

For our retrospective tomorrow at 2 PM, let's focus on:
1. Production deployment rollout plan for the new hybrid NLP scoring model
2. Caching layer optimization for high-throughput inboxes
3. Q4 engineering OKR finalization

I've linked the draft retro board on our internal team wiki. Let me know if you want to add any talking points beforehand.

Best,
Maya`,
    timestamp: '2026-09-22T20:10:00Z',
    dateFormatted: 'Yesterday, 8:10 PM',
    isRead: true,
    isStarred: true,
    isTrash: false,
    isSpam: false,
    isBlocked: false,
    isReported: false,
    category: 'Legitimate' as const,
    hasAttachment: false,
  },
  {
    id: 'legit-03',
    senderName: 'David Chen',
    senderEmail: 'david.chen@family-mail.example',
    recipientEmail: 'alex.chen@workplace.example',
    subject: 'Dinner this Sunday for Mom’s birthday + reservation details',
    preview: 'Hey Alex, booked the Italian restaurant downtown for 6:30 PM. Let me know if that works...',
    body: `Hey Alex,

Just wanted to confirm dinner for Mom's birthday this coming Sunday.

I booked a table for 6 people at Trattoria Bella downtown for 6:30 PM. Sarah mentioned she can bring the birthday cake from the bakery nearby.

Let me know if you need a ride from the train station or if you're driving directly.

Talk soon,
David`,
    timestamp: '2026-09-22T12:00:00Z',
    dateFormatted: 'Yesterday, 12:00 PM',
    isRead: true,
    isStarred: false,
    isTrash: false,
    isSpam: false,
    isBlocked: false,
    isReported: false,
    category: 'Legitimate' as const,
    hasAttachment: false,
  },
  {
    id: 'legit-04',
    senderName: 'Sarah Jenkins (Finance Director)',
    senderEmail: 'sarah.jenkins@workplace.example',
    recipientEmail: 'alex.chen@workplace.example',
    subject: 'Approved: Q4 Cybersecurity Software Licenses & Cloud Budget',
    preview: 'Your department request for the ML training compute cluster and sandbox tools has been approved...',
    body: `Hi Alex,

I have reviewed and approved your department's Q4 budget proposal for the machine learning training compute cluster and sandboxing infrastructure.

Budget Allocation:
- Cloud Training GPUs: $18,500
- Threat Intelligence Feeds: $4,200
- Security Audit Compliance: $6,000

The purchase orders have been signed and routed to procurement. The accounts payable team will provide the tracking codes by end of week.

Thanks,
Sarah Jenkins
Director of Financial Planning & Operations`,
    timestamp: '2026-09-21T16:50:00Z',
    dateFormatted: 'Sep 21, 4:50 PM',
    isRead: true,
    isStarred: false,
    isTrash: false,
    isSpam: false,
    isBlocked: false,
    isReported: false,
    category: 'Legitimate' as const,
    hasAttachment: true,
    attachments: [
      {
        filename: 'Q4_Budget_Approval_Signed.pdf',
        fileType: 'application/pdf',
        sizeBytes: 245100,
        riskLevel: 'Safe' as const,
        isSuspiciousExtension: false,
        isExecutable: false,
        hasMacroOrScript: false,
        isDoubleExtension: false,
        reason: 'Signed PDF document with verified internal digital signature.',
      },
    ],
  },
  {
    id: 'legit-05',
    senderName: 'University Registrar',
    senderEmail: 'registrar@academic-council.edu',
    recipientEmail: 'alex.chen@workplace.example',
    subject: 'Official Alumni Transcript Request Confirmation #TR-55421',
    preview: 'Your electronic transcript request has been generated and sent to the specified recipient...',
    body: `Dear Alex Chen,

This email confirms that your official electronic academic transcript order #TR-55421 has been processed by the Office of the University Registrar.

Order Details:
- Degree: B.S. in Computer Science & Information Security
- Conferred: June 2024
- Recipient: Secure Verification Services
- Verification Code: 9942-8821-CS

No further action is required on your part. You may view the tracking status of this transmission at any time using your student alumni ID portal.

Office of the Registrar
University Records & Certification`,
    timestamp: '2026-09-20T11:25:00Z',
    dateFormatted: 'Sep 20, 11:25 AM',
    isRead: true,
    isStarred: false,
    isTrash: false,
    isSpam: false,
    isBlocked: false,
    isReported: false,
    category: 'Legitimate' as const,
    hasAttachment: false,
  },
];

// Pre-compute full AI analysis for all mock emails
export const INITIAL_MOCK_EMAILS: EmailItem[] = RAW_MOCK_EMAILS.map((email) => {
  const analysis = runHybridPhishingAnalysis(
    email.senderName,
    email.senderEmail,
    email.subject,
    email.body,
    email.attachments,
    email.category
  );

  return {
    ...email,
    safetyScore: analysis.safetyScore,
    riskLevel: analysis.riskLevel,
    analysis,
  };
});
