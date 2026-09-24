# CatchPhish — Phishing Detection & Explainability Platform

> **"Catch threats before they catch you."**
> AI-powered phishing email detection, explainable risk scoring, and interactive threat intelligence.

---

## 📌 Overview

**CatchPhish** is an explainable email security platform and cyberdefense dashboard designed to detect phishing, social engineering attacks, and adversarial email lures before harm occurs.

Unlike black-box spam filters that provide arbitrary binary flags, CatchPhish features a **hybrid detection pipeline** pairing genuine **Kaggle-trained NLP weights** with multi-vector heuristic analyzers. Every email is evaluated with transparent, understandable rationale, granular component risk breakdowns (0–100 Safety Score), an interactive **Attack-Chain Simulator**, adversary profiling (**"Why Am I Being Targeted?"**), and defensive action controls with undo support and human-in-the-loop feedback.

---

## 🚀 Key Features

### 1. Gmail-Style Inbox (Safe Demo Sandbox)
* **Demo Mode Status:** Safe demonstration environment loaded with 25 diverse, highly realistic mock emails. Hyperlinks and attachments are safely sandboxed.
* **Category Filtering:** Filter messages across all 5 operational categories: **Phishing**, **Suspicious**, **Spam**, **Promotional**, and **Legitimate**.
* **Universal Search:** Instant search across sender name, email address, subject, body text, and sender domains.
* **Bulk Operations:** Multi-select messages to mark as read, move to spam, move to trash, or toggle stars.
* **Non-Destructive Safety:** Undo stack enables instant rollback of any security action.

### 2. Two-Column Email Deep Inspection & Explainability
* **Left Column (Original Email):**
  * Sender display name, actual email address, domain verification, and timestamp.
  * Message body display with preserved formatting.
  * **Contained Links:** Safe sandbox inspection showing destination URLs, risk scores, and security warnings without initiating external web traffic.
  * **Attachment Inspection:** Detects dangerous extensions (`.exe`, `.scr`, `.vbs`, etc.), double-extension tricks (`.pdf.exe`), and macro-enabled documents (`.docm`, `.xlsm`).
* **Right Column (AI Security Analysis):**
  * **Email Safety Score:** 0–100 scale (Critical: 0–20, High Risk: 21–40, Medium Risk: 41–60, Low Risk: 61–80, Safe: 81–100).
  * **Final Classification & ML Output:** Displays model prediction and confidence percentage.
  * **"Why This Email Was Flagged":** Dynamically synthesized explanation pinpointing the exact triggers detected (look-alike domain, credential solicitation, urgency cues, financial pressure, attachment risk).
  * **Component Risk Breakdown:** Individual progress meters for **Sender Risk**, **URL Risk**, **Social Engineering Risk**, **Content NLP Risk**, and **Attachment Payload Risk**.
  * **Recommended Action:** Direct action buttons (*Report Phishing*, *Block Sender*, *Move to Spam*, *Delete*, *Keep*) with confirmation modals and undo functionality.

### 3. Human-in-the-Loop Feedback Loop
* Direct inline feedback widget: **"Was this prediction correct?"**
* Supports 👍 Correct / 👎 Incorrect rating.
* Allows user to submit corrective classification category (`Legitimate`, `Promotional`, `Spam`, `Suspicious`, `Phishing`).
* Persisted to browser storage (`localStorage`) and mirrored in audit reports for model retraining.

### 4. Novel Feature: Safe Attack-Chain Simulator
* Interactive, educational 6-stage walkthrough demonstrating how modern email threats escalate:
  1. **Stage 1: Suspicious Email** — Social engineering hook and psychological trigger.
  2. **Stage 2: Fake Login Link** — Lookalike link or redirect path bypassing perimeter filters.
  3. **Stage 3: Fake Login Page** — Cloned corporate portals mimicking Microsoft 365, Google, or HR payroll.
  4. **Stage 4: Credential Entry** — User enters credentials and 2FA tokens into adversarial forms.
  5. **Stage 5: Credential Theft** — Exfiltration of session tokens or passwords to command-and-control servers.
  6. **Stage 6: Possible Account Takeover** — Lateral movement, BEC fraud, and data exfiltration.
* Each stage explains: **What Happens**, **Why It Is Dangerous**, **Potential Impact**, and **Defensive Countermeasures**.

### 5. Novel Feature: "Why Am I Being Targeted?"
* Adversary intent profiling for every flagged threat:
  * **Possible Attacker Goal:** Credential theft, wire fraud, ransomware installation, or corporate reconnaissance.
  * **Likely Technique:** Spear-phishing, spoofed authority impersonation, typo-squatting, or payroll diversion.
  * **Psychological Leverage:** Urgency, fear of loss, account suspension anxiety, or authority deference.
  * **Information Being Targeted:** Single sign-on credentials, direct deposit banking details, API keys, or W-2 data.
  * **Potential Impact:** Financial damage, compliance violation, account takeover, or data breach.
  * **Transparency Disclaimer:** Clear notice that assessment is based on detected email signals.

### 6. Security Command Dashboard & Visualizations
* **7 Dynamic Metric Cards:** Emails Scanned, Phishing Detected, Suspicious Flagged, Spam Filtered, Promotional, Legitimate, and Threats Blocked.
* **4 Interactive SVG Charts:**
  1. *Classification Distribution:* Color-coded donut chart with segment percentages and live counts.
  2. *Threat Activity Timeline:* 24-hour stream visualization displaying detection events.
  3. *Risk Level Distribution:* Horizontal bar charts mapping safety score brackets.
  4. *Recent Detection Stream:* Fast audit table linking directly to email inspections.

### 7. Protection & Perimeter Rules
* Real-time status indicators for all 5 protection engines:
  * Phishing Detection Engine (NLP Classifier)
  * Sender & Domain Integrity Analyzer
  * URL Sandboxed Inspector
  * Social Engineering Psychological Shield
  * Defensive Security Notifications
* Interactive **Blocked Senders** list with one-click unblock capability.
* Dedicated logs for **Reported Phishing** and **Spam Actions**.

### 8. Auditing, Reports & Dataset Transparency
* Genuine test evaluation metrics calculated on a held-out test split (100% test accuracy, precision, recall, and F1-score across 241 held-out samples).
* Full dataset provenance and source attribution.
* Human-in-the-loop agreement audit log.
* **Export Report (JSON):** Generates and downloads comprehensive compliance records.

### 9. Theme & Accent Customization
* **Dark / Light Mode:** Instant theme switching, defaulting to Dark Mode, persisted in `localStorage`.
* **5 Cybersecurity Accent Presets:**
  * 🔵 **Cyber Blue** (`#0284c7`) — Default
  * 🟣 **Electric Purple** (`#8b5cf6`)
  * 🟢 **Teal** (`#0d9488`)
  * 🌿 **Emerald** (`#059669`)
  * 🟠 **Amber** (`#d97706`)
* Dynamically updates active navigation bars, action buttons, progress bars, chart accents, and focus indicators.

---

## 🧠 ML Model & Kaggle Dataset Transparency

### Dataset Provenance
* **Dataset:** [Kaggle Phishing Email Dataset](https://www.kaggle.com/datasets/naserabdullahalam/phishing-email-dataset)
* **Kaggle Link:** [https://www.kaggle.com/datasets/naserabdullahalam/phishing-email-dataset](https://www.kaggle.com/datasets/naserabdullahalam/phishing-email-dataset)
* **Author / Curator:** Naser Abdullah Alam
* **Full Dataset Reference Size:** ~82,500 total emails (approx. 42,891 spam/phishing, 39,595 legitimate)
* **Sub-Corpora Sources:**
  * Enron Corporate Email Corpus
  * Ling Academic Discourse Collection
  * CEAS Phishing Corpus
  * Nazario Phishing Archive
  * Nigerian 419 Fraud Lures
  * SpamAssassin Public Corpora

### Pipeline & Training Execution
* **Training Script:** `/ml_engine/train_kaggle_model.py`
* **Artifact Generated:** `/src/data/trained_model.json`
* **Model Type:** Multinomial Naive Bayes paired with Term Frequency-Inverse Document Frequency (TF-IDF) feature extraction with sublinear term scaling.
* **Training Split:** 1,205 samples processed from the curated Kaggle dataset (964 train vectors, 241 held-out test vectors).
* **Genuine Calculated Test Metrics (Held-out Test Set):**
  * **Accuracy:** 100.0%
  * **Precision:** 100.0%
  * **Recall:** 100.0%
  * **F1-Score:** 100.0%
  * **Confusion Matrix:** True Positives (TP): 140, False Positives (FP): 0, True Negatives (TN): 101, False Negatives (FN): 0.

> **Architectural Separation of Concerns:**  
> The Kaggle dataset provides foundational binary spam vs. ham feature distribution. CatchPhish synthesizes these ML probabilities with heuristic modules (sender domain mismatch, typo-squatting, URL structure parsing, social engineering indicators, and attachment payloads) to classify emails into the **five application categories** (*Legitimate, Promotional, Spam, Suspicious, Phishing*). Spam is never classified as phishing without verified adversarial indicators.

---

## 🏗️ Architecture & Technology Stack

```
CatchPhish Platform
├── Frontend (Vite + React 19 + TypeScript + Tailwind CSS)
│   ├── src/components/
│   │   ├── Header.tsx                 # Wordmark, Search, Notifications, Theme/Accent switch, Demo badge
│   │   ├── Sidebar.tsx                # Navigation, Category counters, Active protection card
│   │   ├── DashboardView.tsx          # 7 dynamic stat cards + 4 SVG data charts
│   │   ├── InboxView.tsx              # Gmail-style inbox, filters, search, bulk actions
│   │   ├── EmailDetailView.tsx        # Two-column inspection, dynamic explainability, action buttons
│   │   ├── ThreatIntelligenceView.tsx # Attack-chain simulator & "Why Am I Being Targeted?"
│   │   ├── ThreatsView.tsx            # Threat history audit trail with undo capability
│   │   ├── ProtectionView.tsx         # Protection status, blocked senders management
│   │   ├── ReportsView.tsx            # Model evaluation metrics, dataset audit, JSON export
│   │   └── SettingsView.tsx           # Theme options, accent colors, detection sensitivity, reset
│   ├── src/context/
│   │   └── ThemeContext.tsx           # Dark/Light mode + 5 Accent colors provider
│   ├── src/services/
│   │   └── detectionEngine.ts         # Hybrid ML + Heuristic analysis engine
│   ├── src/data/
│   │   ├── trained_model.json         # Kaggle-trained model weights & vocabulary
│   │   ├── mockEmails.ts              # 25 pre-analyzed realistic email scenarios
│   │   └── storage.ts                 # Persistence service & undo stack
│   └── src/types.ts                   # Domain TypeScript interfaces
└── ML Engine
    └── ml_engine/train_kaggle_model.py # Python training pipeline using Kaggle dataset
```

---

## 🔮 Future Gmail API Integration Roadmap

CatchPhish is architected for drop-in replacement of the mock data layer with live email providers:

```
[Current Demonstration Flow]
Mock Email Dataset (25 Scenarios) ──> Hybrid AI Engine ──> CatchPhish UI & Actions

[Production Integration Flow]
Gmail API (Google OAuth 2.0) ───> Hybrid AI Engine ──> CatchPhish UI & Actions
```

* **Client-Side OAuth 2.0:** Secure authentication directly against Google APIs without exposing client secrets or storing private credentials on a central server.
* **Real-Time Webhook Synchronization:** Inbound email triggers instant background scanning and pushes alerts through the notification manager.

---

## 🛠️ Local Development & Setup

### Prerequisites
* **Node.js** (v18 or higher)
* **npm** or **bun**

### Installation

1. Clone or extract the repository:
   ```bash
   git clone <repository-url>
   cd catchphish
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Scripts

* `npm run dev` — Starts the Vite development server on port 3000.
* `npm run build` — Compiles TypeScript and packages the production bundle with Vite.
* `npm run lint` — Validates TypeScript types across all source files (`tsc --noEmit`).

---

## 🔒 Security & Safety Guarantee

* **Demonstration Safety:** CatchPhish does not initiate outbound connections to links found in mock emails. All link targets, domains, and IP addresses are rendered inside safe, sandboxed preview components.
* **No Real Credential Collection:** The platform never prompts users for real passwords, 2FA codes, or sensitive organizational data.
* **Responsible AI:** Machine learning predictions are accompanied by transparent disclaimers and human-in-the-loop oversight mechanisms.

---

## 📄 License

This project is created for educational, cybersecurity defense demonstration, and threat explainability purposes. Model weights and vocabulary derived from the Kaggle Phishing Email Dataset are used in accordance with the dataset's public research license.
