# 📜 Engineering & AI Rules — Smriti-NER
### Non-Negotiable Standards, AI Guardrails, and Implementation Conventions
**Target:** Developers, Contributors & AI Agents (Antigravity, Cursor, Claude)  
**Last Updated:** September 2026  

---

## 1. Voice & Speech Synthesis Rules (CRITICAL)

### Rule 1.1: The Lady Voice Priority (Female Voice Enforcement)
* **Rationale:** Clinical gerontology research demonstrates that anxious, agitated dementia patients respond significantly better to higher-register, warm, feminine voices. Deep, abrupt male voices frequently trigger intimidation or disorientation.
* **Implementation Standard:**
  * In `src/i18n/speechService.js`, the voice selection engine MUST prioritize recognized female voice profiles:
    * **Windows Offline:** `Microsoft Zira Desktop - English (United States)`
    * **Cloud / Edge Online:** `Microsoft Sonia Online (Natural)`, `Microsoft Neerja Online`, `Microsoft Jenny Online`
    * **Android / Mobile:** `Google UK English Female`, `Google US English Female`, `en-*-female`
    * **Apple macOS/iOS:** `Samantha`, `Karen`, `Victoria`, `Veena`
  * **Strict Male Rejection:** All AI agents and code edits MUST pass voices through `isExplicitlyMaleVoice()`. Voices containing `David`, `Mark`, `George`, `Guy`, `Male`, `James`, or `Rahul` must NEVER be automatically selected as the default speaker.
  * **Pitch Modulation:** English utterance pitch must remain at `1.05` for bright, friendly feminine vocal warmth.

### Rule 1.2: The Inviolable Assamese Normalizer
* **Rationale:** If an elder selected **অসমীয়া (Assamese)**, the app must NEVER speak raw English, even if a component accidentally passes untranslated English strings.
* **Implementation Standard:**
  * Any call to `speechService.speak(text, 'as')` must pass through `translateEnglishToAssamese()` using `ENGLISH_TO_ASSAMESE_MAP`.
  * If new English phrases are added to the UI, their native Assamese equivalent MUST be registered in `ENGLISH_TO_ASSAMESE_MAP` in `speechService.js`.

### Rule 1.3: No External Audio Scraping / CORS Endpoints
* **Rationale:** Browsers (Chrome, Edge, Safari) strictly block client-side streaming from `translate.google.com` with `NotSupportedError` due to CORS and media source policies.
* **Implementation Standard:** Never attempt `new Audio("https://translate.google.com/...")`. All native Assamese prompts must be loaded as local static assets from `/audio/voices/*.mp3`.

---

## 2. Senior-First Ergonomics & Accessibility (WCAG AAA)

* **Touch Target Size:** Every interactive button, card, or toggle MUST have a minimum clickable area of **$48 \times 48\text{ px}$** (preferably with generous padding `p-3.5` or `p-4`) to accommodate essential tremors and arthritic fingers.
* **Typography & Contrast:**
  * Body text must never be smaller than `text-sm` (14px) and preferably `text-base` (16px) or larger.
  * Contrast ratio must exceed **7:1** against the background. Use `text-slate-900` or `text-slate-800` on warm ivory (`bg-amber-50/40`) or pure white (`bg-white`).
  * Never use faint gray (`text-slate-400`) for critical instructions or medication schedules.
* **Calm Motion Guidelines:**
  * Avoid fast, flashing, or unexpected micro-animations.
  * Never show aggressive red countdown clocks or ticking timers during cognitive games. Dementia patients experience acute stress under artificial urgency.
  * Provide gentle auditory feedback (singing bowl, wooden click) on card flips and completions.

---

## 3. PWA & Offline Engine Integrity

* **Service Worker Cache Bumping:** Whenever new audio assets, scripts, or styles are updated, the `CACHE_NAME` in `public/sw.js` MUST be incremented (e.g., `smriti-ner-v7` -> `smriti-ner-v8`) to prevent users from remaining stuck on stale bundles.
* **Zero Network Blocking:** Components must render immediately using optimistic state or `localStorage`. Never render a blank white screen while waiting for an API call to finish.

---

## 4. Boundaries of AI (What AI Can & Cannot Do)

* ✅ **AI May:** Refactor UI components for higher contrast, add cultural Assamese translations, expand cognitive CST games, improve offline caching, and optimize speech latency.
* ❌ **AI Must Never:**
  * Invent or hallucinate clinical medical advice, dosage modifications, or diagnostic claims.
  * Delete or modify the 37 studio MP3 audio files in `public/audio/voices/`.
  * Remove the Assamese phonetic transliteration or female voice filters.
  * Add external tracking scripts or advertising SDKs.

---

## 5. Code Style & Conventions

* **Framework:** React 19 functional components with standard React Hooks (`useState`, `useEffect`, `useMemo`, `useCallback`).
* **Styling:** Tailwind CSS utility classes exclusively. Keep styling co-located with JSX elements.
* **State Management:** React Context API (`src/context/`) for global session, language, and user profile state.
* **Icons:** `lucide-react` icons exclusively with explicit `size` attributes.
