# 📋 Product Requirement Document (PRD) — Smriti-NER
### Culturally-Anchored AI Cognitive Care & Memory Companion for Northeast India
**Project Codename:** Smriti-NER (স্মৃতি-NER)  
**Target Event:** Smart India Hackathon (SIH 2026)  
**Author:** Team Innov8trs  
**Status:** Live Prototype Deployed (`v7`)  

---

## 1. Why We Built This (The Human Problem)

In Assam and across the Northeast Indian states, dementia is not just an under-diagnosed medical condition—it is an intensely isolating human experience. When elderly grandparents (*Koka* and *Aita*) begin to lose their short-term memory or struggle with daily time-space orientation:

1. **Language is Comfort, Not Just Syntax:** When confusion strikes a 75-year-old elder in Dibrugarh or Tezpur, hearing a clinical English or robotic Hindi synthesized voice causes agitation. They seek the calming, rhythmic lilt of their mother tongue—Assamese (*অসমীয়া*).
2. **Standard Brain Games Feel Foreign:** Western cognitive apps ask seniors to spot skyscrapers or solve complex mathematical grids. These cause frustration. What triggers genuine neuro-reminiscence are familiar cultural touchstones: sorting tender tea leaves, the rhythm of a Bihu drum (*Dhol*), spotting handloom motifs from Mising or Bodo weavers, and hearing folklore tales from *Burhi Aair Xadhu*.
3. **The Silent Burden on Caregivers & ASHA Workers:** Adult children work away from home, and rural ASHA community healthcare workers cover vast geographic beats on foot. Neither has an easy way to verify if an elder took their morning blood pressure tablet or drank enough water during humid summer days.

**Smriti-NER was designed to bridge this gap with dignity, cultural pride, and zero friction.**

---

## 2. Who We Are Building For (Target Personas)

### Persona A: Koka Bhaben (The Primary User)
* **Age & Location:** 78 years old, lives in a joint family in Nagaon, Assam.
* **Condition:** Mild Cognitive Impairment (Early-stage Alzheimer's).
* **Behaviors:** Independent for basic walking and eating, but constantly forgets whether he took his 8:00 AM hypertension tablet. Struggles to read small newspaper print.
* **Linguistic Preference:** Monolingual Assamese speaker. Gets startled by rapid or deep unfamiliar voices.
* **Needs:** A friendly voice reminding him of his routine, clear time-of-day grounding, and easy tactile interaction that doesn't feel like a hospital test.

### Persona B: Aita Nirupama (The Calming Seeker)
* **Age & Location:** 73 years old, Jorhat, Assam.
* **Condition:** Moderate Memory Loss with evening sun-downing anxiety.
* **Behaviors:** Gets agitated around sunset; asks repeatedly where her children are and whether she is in her own house.
* **Needs:** Immediate reassurance ("*Aita, you are safely at home in Jorhat*"), soothing Bihu melodies, and simple matching games that bring back fond memories of village festivities.

### Persona C: Jonali (The Caregiver Daughter & ASHA Link)
* **Age & Location:** 36 years old, works in Guwahati while parents reside in Tezpur.
* **Needs:** A non-intrusive dashboard to see if Koka has logged his morning water and medications, with an automated emergency SOS trigger if an anomaly occurs.

---

## 3. Core Product Pillars & Capabilities

| Pillar | Requirement | Implementation in Smriti-NER |
|---|---|---|
| **🌸 Mother Tongue Audio** | Must speak fluent, empathetic Assamese with zero pronunciation errors. | Hybrid speech engine: 37 Studio-recorded native Assamese sound files + Web Speech API + phonetic transliteration. |
| **👩 Warm Emotional Tone** | Voice must never sound harsh or intimidating to anxious elders. | High-pitch female priority engine (`Microsoft Zira`, `Microsoft Sonia`, `Google UK Female`). |
| **🎮 Cultural CST Games** | Cognitive stimulation therapy adapted to local North East heritage. | 5 interactive games: *Smriti Mela*, *Tea Leaf Sorter*, *Bamboo Beats*, *Tribal Pattern Spotter*, *Daily Routine Sequencer*. |
| **💧 Physical Adherence** | Simple habit logging for hydration and critical geriatric medicines. | One-tap water glass tracker (8-glass goal) and visual Morning/Noon/Night pill checklist. |
| **⚡ Monsoon-Proof Offline** | Must function seamlessly without active internet in flood/power outage scenarios. | PWA Service Worker v7 with complete local asset pre-caching. |
| **🩺 Caregiver Oversight** | Remote monitoring for family and community ASHA workers. | Supabase PostgreSQL backend with secure adherence records and emergency SOS routing. |

---

## 4. Success Metrics (What Matters to Us)

* **Zero-Panic Daily Orientation:** An elder should be able to open the app and within 2 seconds know: *What day it is, what time of day it is, and that they are safe at home.*
* **Frictionless Audio:** < 50ms response time for Assamese greetings and game audio cues.
* **Elder-Tested Ergonomics:** Touch targets strictly $\ge 48	ext{px}$, body text $\ge 16	ext{px}$, warm high-contrast palettes that pass WCAG AAA standards for low-vision seniors.
* **Adherence Completion:** $\ge 85\%$ daily water and medication tracking rate achieved through gentle voice encouragement rather than punitive alert tones.
