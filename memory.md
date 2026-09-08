# 🧠 Engineering Memory & Decisions Log — Smriti-NER
### Historical Record of Architecture Choices, Bugs Solved, and Technical Evolution
**Project:** Smriti-NER (স্মৃতি-NER)  
**Maintained by:** Team Innov8trs  

---

## 📌 Active System State (September 2026)

* **Production URL:** [https://smriti-ner-three.vercel.app](https://smriti-ner-three.vercel.app)
* **Vercel Deployment ID:** `dpl_5LrVWerNpPjiJa45u56B1yrQmYFH` (Status: `READY`)
* **Active Production JS Bundle:** `index-DNsSaC-0.js`
* **Active Production CSS Bundle:** `index-BRqI_3dG.css`
* **PWA Service Worker Cache:** `smriti-ner-v7` (Automatic purge of legacy `v6` cache)
* **Soundbank:** 37 Pre-recorded studio MP3 files in `public/audio/voices/` (HTTP 200 on CDN)

---

## 🛠️ Hard-Won Technical Breakthroughs & Lessons Learned

### 1. The CORS Audio Trap & The Studio Soundbank Pivot
* **The Problem:** We initially attempted to stream dynamic Assamese speech on the client side using Google Translate's audio endpoint. While it worked in certain Node.js test scripts, modern browsers (Chrome and Edge) strictly blocked it with `NotSupportedError: Failed to load because no supported source was found` due to cross-origin media security policies. When playback failed silently, the browser fell back to the default English synthesizer.
* **The Solution:** We eliminated external streaming entirely. We generated and bundled a dedicated library of **37 high-fidelity studio MP3 voice assets** directly into `public/audio/voices/`. When a user plays *Smriti Mela*, drinks water, or receives a morning orientation, the audio plays instantly from local same-origin assets with **0ms latency** and **100% offline reliability**.

### 2. The "Guy on Web App vs. Lady on Website" Mystery
* **The Problem:** When visiting `smriti-ner-three.vercel.app` in a desktop Edge browser tab, the English voice spoke with a gentle lady's voice (`Microsoft Sonia Online`). However, when the app was installed as a PWA / Web App or run offline, it suddenly switched to a harsh American male voice (`Microsoft David`).
* **The Root Cause:** In full browser tabs, Edge connects to Microsoft's cloud neural voice servers, making `Microsoft Sonia Online` available. But when launched in standalone PWA mode or offline, cloud voices are not immediately available; the browser only sees the two offline voices registered in Windows SAPI:
  1. `Microsoft David Desktop - English (United States)` *(Male)*
  2. `Microsoft Zira Desktop - English (United States)` *(Female)*
  Because `David` is listed first in the Windows registry, the previous fallback matched David first.
* **The Solution:** We engineered `isExplicitlyMaleVoice()` and updated `getBestVoice()` in `src/i18n/speechService.js` to strictly reject male voices (`David`, `Mark`, `George`) and explicitly prioritize `Microsoft Zira Desktop` as the primary offline Windows fallback. Now, both the website and the installed app speak consistently in a warm lady's voice.

### 3. The Windows OneDrive Vercel CLI Path Glitch
* **The Problem:** Running `vercel --prod` inside `C:\Users\ajink\OneDrive\Desktop\Smriti-NER` repeatedly crashed with:
  ```text
  Error: Support for single file deployments has been removed.
  ```
  Vercel CLI 59 on Windows misparsed paths containing spaces and OneDrive folder hierarchies.
* **The Solution:** Rather than relying on the buggy local CLI wrapper, we wrote an automated deployment pipeline directly connecting to the **Vercel REST API v13** (`POST /v13/deployments`) using authenticated tokens. This bypasses local OS path quirks and reliably triggers production builds directly from GitHub.

### 4. PWA Service Worker Cache Bumping
* **The Problem:** Because Service Workers aggressively cache JavaScript bundles and media files for offline resilience, pushing a new build often left returning users on stale code unless they manually cleared site storage.
* **The Solution:** Established a strict cache versioning policy in `public/sw.js` (currently `smriti-ner-v7`). Upon receiving an updated worker, `activate` immediately sweeps the cache registry, deletes outdated cache buckets, and claims all active client tabs with `self.clients.claim()`.

---

## 🎯 Next Focus Areas
1. Conduct real-world elder usability feedback sessions with local community partners in Assam.
2. Prototype the Bluetooth smart pillbox integration for physical hardware tracking.
3. Prepare the final pitch deck and live demonstration script for Smart India Hackathon 2026.
