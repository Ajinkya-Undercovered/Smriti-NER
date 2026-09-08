# 🏛️ System Architecture — Smriti-NER
### High-Level Technical Architecture, Data Flows, and System Design
**Project:** Smriti-NER (স্মৃতি-NER)  
**Version:** 7.0 (Production)  

---

## 1. System Overview & Design Philosophy

Smriti-NER is built as an **offline-first, client-resilient Progressive Web Application (PWA)** backed by modern serverless infrastructure. Because geriatric healthcare solutions in semi-rural Northeast India operate under unreliable network conditions, the system follows three architectural axioms:

1. **Zero External Latency Dependency:** Core user interactions (speech feedback, cognitive games, orientation reminders) must never block on a network request. All essential assets live on the device.
2. **Graceful Fallback Cascades:** If the primary audio synthesis fails or lacks an internet connection, the system automatically cascades to offline device soundbanks without throwing runtime exceptions.
3. **Optimistic Local State with Eventual Sync:** Medication and hydration logs write to `localStorage` immediately, then reconcile with the remote Supabase database when connectivity resumes.

---

## 2. High-Level Architecture Diagram

```
+-------------------------------------------------------------------------+
|                              CLIENT DEVICE                              |
|                                                                         |
|  +-------------------------------------------------------------------+  |
|  |                    Presentation Layer (React 19)                  |  |
|  |  +-------------------+  +--------------------+  +--------------+  |  |
|  |  | Daily Orientation |  |  5 Cognitive Games |  | Med/Hydration|  |  |
|  |  +-------------------+  +--------------------+  +--------------+  |  |
|  |           |                        |                    |         |  |
|  |  +-------------------------------------------------------------+  |  |
|  |  |             Shared Senior UI Components (Tailwind v4)       |  |  |
|  |  +-------------------------------------------------------------+  |  |
|  +-----------------------------------|-------------------------------+  |
|                                      |                                  |
|  +-----------------------------------v-------------------------------+  |
|  |                    Bilingual Audio Engine Pipeline                |  |
|  |                                                                   |  |
|  |   [Input Text] ---> [Language Interceptor]                        |  |
|  |                            |                                      |  |
|  |           +----------------+----------------+                     |  |
|  |           |                                 |                     |  |
|  |    (Assamese Mode)                   (English Mode)               |  |
|  |           |                                 |                     |  |
|  |   Tier 1: Pre-recorded Studio       Tier 1: Web Speech Synth      |  |
|  |   MP3 Bank (/audio/voices/*.mp3)    (Female: MS Zira / Sonia)     |  |
|  |           | (if custom)                     | (fallback)          |  |
|  |   Tier 2: ElevenLabs API            Tier 2: High-Pitch Warm       |  |
|  |           | (if offline)            utterance.pitch = 1.05        |  |
|  |   Tier 3: Transliterated SpeechSynth        |                     |  |
|  +---------------------------------------------|---------------------+  |
|                                                |                        |
|  +---------------------------------------------v---------------------+  |
|  |               PWA Service Worker Engine (v7)                      |  |
|  |   - Pre-caches Shell (HTML, CSS, JS bundles)                      |  |
|  |   - Pre-caches 37 Studio Audio Files in CacheStorage              |  |
|  |   - 600ms Network-Race with instant Cache Fallback                |  |
|  +-------------------------------------------------------------------+  |
+--------------------------------------|----------------------------------+
                                       | HTTPS (Sync when Online)
                                       v
+-------------------------------------------------------------------------+
|                           CLOUD SERVICES LAYER                          |
|                                                                         |
|  +------------------------+  +------------------+  +-----------------+  |
|  |   Vercel Edge CDN      |  | Supabase Auth    |  | Supabase DB     |  |
|  |   (Static Hosting)     |  | (Caregiver/ASHA) |  | (PostgreSQL+RLS)|  |
|  +------------------------+  +------------------+  +-----------------+  |
+-------------------------------------------------------------------------+
```

---

## 3. Detailed Component Breakdown

### A. The Bilingual Speech Engine (`src/i18n/speechService.js`)
* **The Problem It Solves:** Standard browser `speechSynthesis` does not support Assamese (`as-IN`) natively on Windows or Android. Streaming directly from Google Translate's unofficial endpoints is blocked by Chrome/Edge CORS security policies.
* **The Architecture:**
  1. **Studio Soundbank Matching:** The engine checks regex patterns against a pre-compiled registry of 37 native studio-recorded Assamese MP3s (`as_game1.mp3`, `as_med_taken.mp3`, `as_home_greeting.mp3`, etc.).
  2. **Strict Text Normalizer:** Intercepts any incoming English strings (e.g. `"Opening Cognitive Games..."`) and dynamically translates them to native Assamese before invoking synthesis.
  3. **Lady Voice Priority:** For English and fallback system voices, queries the registry tokens to strictly reject male voices (`David`, `Mark`, `George`) and prioritize gentle female voices (`Microsoft Zira Desktop`, `Microsoft Sonia Online`, `Google UK English Female`).

### B. Offline PWA & Cache Architecture (`public/sw.js`)
* **Cache Namespace:** `smriti-ner-v7`
* **Pre-cached Shell Assets:** `index.html`, `manifest.json`, bundle scripts, SVG icons, and core Assamese voice MP3s.
* **Cache Invalidation:** The Service Worker listens to the `activate` event, inspects `caches.keys()`, and purges legacy cache buckets (e.g., `smriti-ner-v6`), immediately taking control of all open client tabs via `self.clients.claim()`.

### C. Data Persistence Layer (`supabase_schema.sql`)
* **Database Engine:** PostgreSQL hosted on Supabase.
* **Core Schemas:**
  * `patient_profiles`: Stores patient metadata, caregiver links, primary language mode (`as`, `en`, `dual`), and preferred voice pace.
  * `medication_logs`: Records pill adherence events with timestamp, pill name, dosage, and status (`taken`, `missed`, `skipped`).
  * `hydration_logs`: Tracks daily glass count with timestamps.
  * `cognitive_sessions`: Logs CST game engagement (completion time, accuracy, game type) for caregiver progress review.
* **Security:** Row-Level Security (RLS) policies restrict data access exclusively to authenticated caregivers and authorized ASHA workers.

---

## 4. Directory Structure & Key Files

```text
Smriti-NER/
├── PRD.md                     # Product Requirements Document
├── architecture.md            # This System Architecture Document
├── rules.md                   # Engineering & AI Guardrails
├── phases.doc.md              # Project Development Roadmap
├── design.md                  # Design System & Cultural UI Tokens
├── memory.md                  # Development History & Solved Challenges
├── supabase_schema.sql        # Database schema definitions
├── public/
│   ├── audio/voices/          # 37 Studio-recorded native Assamese voice clips
│   ├── manifest.json          # PWA installation manifest
│   └── sw.js                  # Service Worker v7 offline engine
└── src/
    ├── ai/                    # ElevenLabs neural studio integration
    ├── components/
    │   ├── common/            # DualAudioToggle, VoiceAssistantModal, AudioHeader
    │   ├── games/             # 5 Cultural Cognitive Stimulation Therapy Games
    │   ├── home/              # Senior Grid Hub & Navigation
    │   ├── reminiscence/      # Folklore, photo albums & soothing sounds
    │   └── reminders/         # Hydration & Medication Adherence Timelines
    ├── context/               # Global Application State (Language, Auth)
    └── i18n/                  # Speech synthesis, phonetics, and dictionaries
```
