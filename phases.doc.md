# 🗺️ Product Roadmap & Phases — Smriti-NER
### Chronological Breakdown of Development, Milestones, and Future Horizons
**Project:** Smriti-NER (স্মৃতি-NER)  
**Status:** Phases 1 to 6 Completed | Phase 7 in Planning  

---

## Completed Phases (Production Ready)

### 🟢 Phase 1: Field Research, Empathy Mapping & Senior UI Shell
* **Objective:** Understand the daily routine of geriatric dementia patients in Assam and design a frustration-free, dignified user experience.
* **Key Deliverables:**
  * Persona development: *Koka Bhaben* (early Alzheimer's) & *Aita Nirupama* (sundowning anxiety).
  * High-contrast, warm cultural color palette inspired by Eri silk, Muga gold, and Kaziranga green.
  * Daily Orientation Header (Current Day, Date, Time of Day, and grounding message: *"You are peacefully at home"*).
  * Senior Grid Navigation with large tactile tiles ($\ge 64\text{px}$).

---

### 🟢 Phase 2: Culturally-Grounded Cognitive Games (CST)
* **Objective:** Replace abstract Western brain-training puzzles with authentic North East cultural exercises.
* **Key Deliverables:**
  * **Game 1: স্মৃতি মেলা (Heritage Memory Match):** Paired card flipping featuring traditional instruments (*Pepa*, *Dhol*, *Gogona*, *Japi*, *Gamusa*).
  * **Game 2: চাহ বাগিচা (Tea Leaf Sorter):** Executive categorization sorting tender two-leaves-and-a-bud into bamboo baskets.
  * **Game 3: বাঁহৰ ঢোল (Bamboo Beats):** Auditory rhythm game matching traditional Bihu drum tempos for motor coordination.
  * **Game 4: জনজাতীয় বস্ত্ৰ (Tribal Pattern Spotter):** Pattern recognition identifying Mising, Bodo, and Karbi handloom motifs.
  * **Game 5: দৈনিক সময়ক্ৰম (Daily Routine Sequencer):** Temporal order sequencing from morning prayers to afternoon rest.

---

### 🟢 Phase 3: Daily Adherence & Habit Trackers
* **Objective:** Provide gentle, supportive tracking for essential physical health routines without clinical anxiety.
* **Key Deliverables:**
  * **Hydration Counter:** Visual water glass animation with tap-to-log interaction and an 8-glass daily target.
  * **Medication Adherence Checklist:** Morning, Afternoon, and Evening pill schedules with clear visual badges.
  * **Auditory Praise:** Gentle voice feedback upon marking items (*"ঔষধ খোৱা সম্পূৰ্ণ হ’ল। বৰ ভাল কাম কৰিলে!"*).

---

### 🟢 Phase 4: ASHA Worker & Caregiver Ecosystem
* **Objective:** Bridge the communication gap between rural families, remote caregivers, and local community health workers.
* **Key Deliverables:**
  * Supabase PostgreSQL database schema with Row-Level Security for patient privacy.
  * Remote Caregiver Overview: View real-time medication adherence, hydration count, and CST game participation.
  * One-Tap Emergency SOS: Instant direct dialing to family and primary health center (PHC) contacts.

---

### 🟢 Phase 5: Studio Voice Engine & Strict Bilingual Normalizer
* **Objective:** Eradicate robotic Western speech synthesis and provide 100% authentic, crystal-clear native Assamese pronunciation.
* **Key Deliverables:**
  * 37 High-fidelity studio pre-recorded MP3 voice assets in `public/audio/voices/`.
  * Smart English-to-Assamese Interceptor in `speechService.js` to catch untranslated strings.
  * Multi-engine voice selector: Studio Native Assamese (Default), ElevenLabs AI Studio, and System Device Speech.
  * Strict Female Voice Prioritization (`Microsoft Zira`, `Microsoft Sonia`, `Google Female`) across both web app and desktop browser.

---

### 🟢 Phase 6: PWA Offline Hardening & Cloud CDN Deployment
* **Objective:** Guarantee zero-lag offline usability in flood-prone and rural areas; deploy to high-availability production.
* **Key Deliverables:**
  * Progressive Web App Manifest (`manifest.json`) for full-screen home screen installation.
  * Service Worker `v7` with intelligent offline asset caching.
  * Production deployment to Vercel Edge CDN ([https://smriti-ner-three.vercel.app](https://smriti-ner-three.vercel.app)).

---

## Future Horizons (Phase 7 & Beyond)

### 🔵 Phase 7: Real-World Rural Pilots & Hardware Companion (Post-SIH)
* **Field Trials in Assam:** Pilot deployments in collaboration with district health societies in Kamrup and Jorhat.
* **Low-Cost Smart Pillbox Hardware:** Bluetooth / ESP32-connected physical bamboo pillbox that lights up corresponding compartments and syncs with the Smriti-NER app.
* **Additional Northeast Dialects:** Expanding the studio soundbank to include Bodo (*बड़ो*), Bengali (*বাংলা*), and Mising dialects.
