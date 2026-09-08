# 🎨 Cultural Design System & UI/UX Guide — Smriti-NER
### Human-Centered Design for Geriatric Cognition in Northeast India
**Project:** Smriti-NER (স্মৃতি-NER)  
**Design Philosophy:** Dignity, Warmth, Cultural Resonance, and Zero Cognitive Friction  

---

## 1. Design Philosophy: Healing Through Familiarity

Most modern healthcare applications are designed like sterile hospital dashboards: clinical blues, cold grays, tiny text, and sharp notification banners. For an elder living with dementia, this aesthetic induces anxiety, confusion, and fear of making a mistake.

**Smriti-NER takes the exact opposite approach.** Our visual and tactile system is grounded in the warm, tactile materials of an Assamese home:
* **Eri & Muga Silk:** Warm golden hues and soft cream undertones reminiscent of festive *Bihu* attire.
* **Tea Gardens of the Brahmaputra Valley:** Rich, soothing emerald greens that convey peace, rest, and natural balance.
* **Traditional Handlooms:** Motifs inspired by Mising, Bodo, and Karbi textiles that trigger deep autobiographical memory recall.

---

## 2. Color Palette & Emotional Intent

```
+-------------------+--------------------+---------------------------------------+
| Token Name        | Hex Code / Class   | Emotional Intent & Usage              |
+-------------------+--------------------+---------------------------------------+
| Eri Silk Ivory    | #fffbeb (amber-50) | Main background; soft paper feel,     |
|                   |                    | prevents screen glare and eye fatigue |
+-------------------+--------------------+---------------------------------------+
| Muga Gold         | #f59e0b (amber-500)| Warmth, cognitive stimulation, active  |
|                   | #d97706 (amber-600)| navigation items, and celebration     |
+-------------------+--------------------+---------------------------------------+
| Kaziranga Emerald | #059669 (emerald-6)| Health, hydration, completed actions,  |
|                   | #047857 (emerald-7)| positive praise without loud buzzers  |
+-------------------+--------------------+---------------------------------------+
| Mising Textile Red| #e11d48 (rose-600) | Vital medication alerts, SOS button,  |
|                   | #be123c (rose-700) | and prominent elder action cards      |
+-------------------+--------------------+---------------------------------------+
| Brahmaputra Slate | #0f172a (slate-900)| Maximum readable typography, high-    |
|                   | #1e293b (slate-800)| contrast labels (WCAG AAA compliant)  |
+-------------------+--------------------+---------------------------------------+
```

---

## 3. Typography & Multi-Script Harmony

Elderly seniors with mild cognitive impairment often suffer from cataracts, macular degeneration, or blurred vision. Our typographic rules guarantee immediate legibility:

### Latin Script (English Mode)
* **Font Family:** `Plus Jakarta Sans`, `system-ui`, `-apple-system`, `sans-serif`
* **Characteristics:** High x-height, generous letter spacing, open counters that prevent characters like 'c', 'o', 'e' from blurring together.

### Eastern Nagari Script (Assamese Mode)
* **Font Family:** `Noto Sans Bengali`, `Hind Siliguri`, `sans-serif`
* **Characteristics:** Carefully balanced conjuncts (*juktakkhor* / যুক্তাক্ষৰ) with prominent vowel marks (*kar* / কাৰ) so words remain distinct even at large font sizes.

### Type Scale Hierarchy
* **Screen Titles / Greetings:** `text-2xl` to `text-3xl` (24px – 30px), font weight `800` (Extra Bold).
* **Game & Card Headings:** `text-lg` to `text-xl` (18px – 20px), font weight `700` (Bold).
* **Instructional Body Text:** `text-base` (16px), line-height `relaxed` (1.625).
* **Sub-labels & Badges:** Never below `text-xs` (12px), font weight `700`.

---

## 4. Tactile & Auditory Ergonomics

### A. Touch Targets (Motor Tremor Protection)
* **Minimum Clickable Area:** Every primary button is minimum **$56\text{px}$** high with at least **$16\text{px}$** horizontal padding.
* **Card Separation:** Cards on the senior grid hub have a generous gap (`gap-4` / 16px) to prevent accidental double-touches.
* **No Swipe-Only Gestures:** All actions can be performed via simple direct taps. No complex pinching, dragging, or long-pressing is required.

### B. Auditory Feedback (Dementia-Safe Sounds)
* **Singing Bowl Chime:** Played during voice activation and state transitions to gently draw attention without startling.
* **Bamboo Clapper / Card Flip:** Gentle organic wooden click on interactive cards.
* **Praise Tones:** Melodic rising chime on completing games, logging water, or taking medication.
