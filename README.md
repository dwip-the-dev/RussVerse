# 🇷🇺 RussVerse — Offline-First Russian Language Mastery Platform

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Demo-russverse.vercel.app-d9381e?style=for-the-badge&logo=vercel&logoColor=white)](https://russverse.vercel.app)
[![React 19](https://img.shields.io/badge/React%2019-v19.2-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![TanStack Router](https://img.shields.io/badge/TanStack%20Router-v1.170-ff4154?style=for-the-badge&logo=tanstack&logoColor=white)](https://tanstack.com/router)
[![PWA Ready](https://img.shields.io/badge/PWA-100%25%20Offline%20Ready-success?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

**An offline-first, CEFR-aligned (A1–C1) Russian learning ecosystem with 220 scaffolded units, 6,000+ interactive drills, Cyrillic oral speech recognition, case conjugation engines, and SuperMemo SM-2 spaced repetition.**

[Explore Curriculum (220 Units)](https://russverse.vercel.app/learn) • [Cyrillic Speech Gym](https://russverse.vercel.app/practice) • [SRS Review Deck](https://russverse.vercel.app/review) • [Russian Brain Map](https://russverse.vercel.app/progress)

</div>

---

## 📸 Overview

RussVerse is designed to teach hardened, natural, conversational Russian without reliance on external server connections. Everything is stored locally on your device, powered by a deterministic cognitive mastery engine.

```
                    ┌──────────────────────────────────────────────────────────┐
                    │                      RUSSVERSE ENGINE                    │
                    └─────────────────────────────┬────────────────────────────┘
                                                  │
         ┌─────────────────────────┬──────────────┴────────────┬─────────────────────────┐
         ▼                         ▼                           ▼                         ▼
┌──────────────────┐      ┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│  220-Unit CEFR   │      │ Cyrillic Speech  │       │  SuperMemo SM-2  │       │  Item Mastery &  │
│  Curriculum      │      │ Soundboard & Gym │       │  Spaced Rep (SRS)│       │  Leech Attack    │
├──────────────────┤      ├──────────────────┤       ├──────────────────┤       ├──────────────────┤
│ • 12 CEFR Stages │      │ • 33 Letter TTS  │       │ • E-Factor Calc  │       │ • Word Tracking  │
│ • A1 → C1 Roadmap│      │ • Oral Speech Rec│       │ • 7-Day Cycle    │       │ • Grammar Cases  │
│ • 6,000+ Drills  │      │ • Speed 0.75-1.5x│       │ • Active Recall  │       │ • Mistake Logs   │
│ • Verb Motion/Asp│      │ • Accent Training│       │ • Missed Vault   │       │ • Devoicing Rules│
└──────────────────┘      └──────────────────┘       └──────────────────┘       └──────────────────┘
```

---

## ✨ Key Features

### 📚 1. Massive 220-Unit Scaffolded Curriculum
- **12 Progressive CEFR Stages** from absolute beginner to advanced fluency:
  - **Stage 1 (Units 1–16)**: Foundations, Cyrillic alphabet, essential nouns, accusative direct objects, prepositional location.
  - **Stage 2 (Units 17–32)**: Daily life, genitive possession, dative recipients, instrumental company.
  - **Stage 3 (Units 33–50)**: Time, dates, numbers, complex plurals, motion verbs (*идти/ходить*, *ехать/ездить*).
  - **Stage 4 (Units 51–70)**: Past and future tenses, verb aspects (*Imperfective vs. Perfective*).
  - **Stage 5 (Units 71–90)**: Prefixed motion verbs (*прийти*, *уйти*, *зайти*, *дойти*), conditional mood.
  - **Stages 6–12 (Units 91–220)**: Participles, gerunds, idiomatic expressions, business Russian, Russian literature, and political discourse.
- **Dynamic Exercise Pool**: 20–40 interactive exercises per unit (Multiple choice, Fill-in-the-blank, Sentence Builders, Audio Dictations, Oral Speaking Drills).

---

### 🎙️ 2. Cyrillic Soundboard & Oral Pronunciation Gym
- **33 Cyrillic Letters Interactive Soundboard**: Native pronunciation samples, phonetic breakdowns, hard/soft sign explanations, and vowel reduction rules.
- **Microphone Oral Evaluation**: Speak Russian phrases into your browser and receive real-time speech recognition matching and pronunciation feedback.
- **Variable Playback Speed**: Toggle audio between `0.75×`, `1×`, `1.25×`, and `1.5×` speeds.
- **Audio Dictations**: Listen to natural Russian speech and type what you hear with instant spelling error diagnostics.

---

### 🧠 3. SuperMemo SM-2 Spaced Repetition System (SRS)
- **Scientific Memory Scheduling**: Calculates cognitive ease factors ($EF$), interval progression, and repetition counts per item.
- **Missed Flashcards Deck**: Mistakes in lessons are automatically captured into your review deck.
- **7-Day Mastery Graduation**: Complete 3 consecutive successful reviews over 7 days to graduate cards into permanent long-term memory.

---

### ⚡ 4. Granular Item-Level Mastery & Leech Attack
- **Item-Level Tracking**: Tracks individual word IDs (`w:101`), grammar rules (`g:acc_fem_singular`), and phonetic markers (`p:devoicing`).
- **Leech Detection**: Flags items missed 3+ times as active "Leeches".
- **Targeted Leech Workouts**: Generate adaptive workouts specifically targeting your weakest items.
- **Diagnostic Mistake Analysis**: Compares your input vs. expected answer and explains root linguistic causes (e.g. vowel reduction confusion, accusative inanimate ending).

---

### 📲 5. 100% Offline-First PWA & 24h Delta Sync
- **Zero Internet Required**: All 220 units, 6,000+ drills, Cyrillic soundboard audio synthesis, and dictionary are precached locally on your device.
- **24-Hour Delta Update Check**: Evaluates update freshness on app launch and foreground return; downloads only changed assets with HTTP 304 conditional validation.
- **Installable**: Full standalone app experience on iOS Safari, Android Chrome, and Desktop (macOS/Windows/Linux).

---

### 📦 6. Universal Account Backup & Migration Hub
- **1-Click Export**: Save your entire learning profile into a structured, timestamped JSON backup.
- **Universal Schema Migration**: Restores backups across different schema versions and automatically backfills granular item records.
- **Live Preview Dialog**: Inspect total XP, units completed, vocabulary count, and tracked items before confirming restoration.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) + [TanStack Start](https://tanstack.com/start) / [TanStack Router](https://tanstack.com/router) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) (Neo-Brutalist High-Energy Design System) |
| **State & Storage** | Local-First React Context + `localStorage` + Universal Schema Migration |
| **Audio & Speech** | Web Audio API (Synthesizer Chimes) + Web Speech API (Offline Russian TTS & Speech Recognition) |
| **PWA & Offline** | Service Worker Cache Storage + Periodic Background Sync API |
| **SEO & Schema** | Dynamic SSR Head Metadata, Open Graph Social Cards, 225-URL XML Sitemap, Schema.org JSON-LD |

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v20.0.0` or higher
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/dwip-the-dev/RussVerse.git

# Navigate into the project directory
cd RussVerse

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🏗️ Available Scripts

```bash
# Start development server
npm run dev

# Run TypeScript typechecks
npm run typecheck

# Generate XML sitemap and build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🗺️ 220-Unit Curriculum Roadmap

<details>
<summary><b>Click to expand the complete 12-Stage Curriculum Overview</b></summary>

- **Stage 1 — Foundations / A1 (Units 1–16)**: Greetings, Cyrillic sounds, Gender, Accusative direct objects, Prepositional location, Numbers 1–100.
- **Stage 2 — Everyday Life / A2 (Units 17–32)**: Genitive possession, Dative indirect objects, Instrumental case, Adjective agreements, Time expressions.
- **Stage 3 — Travel & Movement / A2+ (Units 33–50)**: Unidirectional vs. Multidirectional verbs of motion, Imperatives, Comparatives & Superlatives.
- **Stage 4 — Deep Grammar / B1 (Units 51–70)**: Aspectual pairs (*НСВ vs. СВ*), Conditional sentences, Complex numbers & declensions.
- **Stage 5 — Conversational Fluency / B1+ (Units 71–90)**: Prefixed motion verbs, Reflexive verbs (*-ся*), Colloquial idioms, Subjunctive mood.
- **Stage 6 — Intermediate Mastery / B2 (Units 91–110)**: Active and passive participles, Verbal adverbs (gerunds), Complex conjunctions.
- **Stage 7 — Professional & Business Russian / B2+ (Units 111–130)**: Formal correspondence, Negotiations, Economics, Legal terminology.
- **Stage 8 — Culture & Media / B2–C1 (Units 131–155)**: Russian news, Film analysis, History, Art terminology, Social debates.
- **Stage 9 — Russian Literature & Rhetoric / C1 (Units 156–175)**: Pushkin, Tolstoy, Dostoevsky, Chekhov, Stylistic registers, Poetic syntax.
- **Stage 10 — Science, Tech & Philosophy / C1 (Units 176–195)**: Academic Russian, Scientific discourse, Philosophical treatises.
- **Stage 11 — Colloquial & Regional Slang / C1+ (Units 196–210)**: Modern internet slang, Diminutives, Expressive particles, Dialects.
- **Stage 12 — Russian Virtuoso Mastery / C1–C2 (Units 211–220)**: Archaisms, Phraseology, Advanced debate rhetoric, Native fluency capstone.

</details>

---

## 👤 Author & Contact

**Dwip Dey** ([@dwip-the-dev](https://github.com/dwip-the-dev))
- 🌐 Website / Portfolio: [dwip.me](https://dwip.me)
- 🐙 GitHub: [github.com/dwip-the-dev](https://github.com/dwip-the-dev)
- ✉️ Email: [dwip@dwip.dedyn.io](mailto:dwip@dwip.dedyn.io)
- 🚀 RussVerse Live: [https://russverse.vercel.app](https://russverse.vercel.app)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
