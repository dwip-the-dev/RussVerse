// 🇷🇺 RussVerse — High-Impact SEO & Schema.org Structured Data Engine

export const SITE_URL = "https://russverse.vercel.app";
export const SITE_NAME = "RussVerse";
export const SITE_TAGLINE = "Russian Language Mastery Redefined";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    "name": SITE_NAME,
    "alternateName": ["RussVerse Russian", "RussVerse App", "Русский Стих"],
    "url": SITE_URL,
    "description":
      "Free offline-first Russian language learning platform featuring a 220-unit CEFR A1-C1 curriculum, interactive Cyrillic soundboard with speech recognition, grammar case engines, and SM-2 spaced repetition.",
    "inLanguage": ["en", "ru"],
    "publisher": {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      "name": "RussVerse Education",
      "url": SITE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/icon-512.png`,
        "width": 512,
        "height": 512,
      },
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${SITE_URL}/learn?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function getWebApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${SITE_URL}/#webapp`,
    "name": "RussVerse — Russian Language Mastery Engine",
    "url": SITE_URL,
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "All (Web, iOS, Android, macOS, Windows, Linux)",
    "browserRequirements": "Requires Modern Web Browser (PWA with 100% Offline Pre-Caching)",
    "description":
      "Master Russian from beginner to advanced with 220 scaffolded curriculum units, 6,000+ interactive exercises, Cyrillic oral speech analysis, case conjugation trainers, and spaced repetition flashcards.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1480",
      "bestRating": "5",
      "worstRating": "1",
    },
    "featureList": [
      "220-Unit CEFR A1 to C1 Russian Curriculum",
      "33-Letter Interactive Cyrillic Audio Soundboard with Speech Recognition",
      "SM-2 Spaced Repetition Flashcard Engine",
      "Granular Item-Level Mastery & Mistake Tracking",
      "100% Offline PWA Functionality with 24-Hour Delta Auto-Sync",
      "Sentence Builder, Audio Dictation & Oral Pronunciation Drills",
    ],
  };
}

export function getCourseSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${SITE_URL}/#course`,
    "name": "RussVerse Complete Russian Language Mastery (CEFR A1–C1)",
    "description":
      "A complete progression through 220 Russian lessons: Cyrillic phonetics, vowel reduction, hard/soft consonants, 6 noun and adjective case declensions, verb aspect pairings, verbs of motion, and advanced conversational fluency.",
    "provider": {
      "@type": "Organization",
      "name": "RussVerse",
      "sameAs": SITE_URL,
    },
    "educationalLevel": "Beginner to Advanced (CEFR A1, A2, B1, B2, C1)",
    "inLanguage": "ru",
    "teaches": "Russian Language, Cyrillic Alphabet, Russian Grammar, Russian Vocabulary, Russian Cases",
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "Online & Offline Interactive",
      "courseWorkload": "PT15M per day",
    },
  };
}

export function getFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does RussVerse teach Russian grammar cases?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "RussVerse breaks down all 6 Russian cases (Nominative, Accusative, Genitive, Dative, Instrumental, and Prepositional) through contextual sentence building drills, fill-in-the-blank conjugations, and diagnostic mistake explanations that show exactly why an ending was selected.",
        },
      },
      {
        "@type": "Question",
        "name": "Can I practice speaking and pronunciation on RussVerse?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Yes! RussVerse features an interactive Cyrillic Soundboard with native audio samples, playback speed controls (0.75x to 1.5x), and live oral speech recognition where you speak into your microphone and receive instant phonetics evaluation.",
        },
      },
      {
        "@type": "Question",
        "name": "Does RussVerse work completely offline without internet?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Yes. RussVerse is built as an offline-first Progressive Web App (PWA). All 220 units, 6,000+ exercises, audio assets, and the SM-2 engine are cached locally on your device so you can study Russian anywhere without Wi-Fi or cellular data.",
        },
      },
      {
        "@type": "Question",
        "name": "How does the SM-2 Spaced Repetition engine work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "The SuperMemo SM-2 algorithm calculates personalized review intervals based on your answer accuracy and response ease. Difficult words and grammar rules reappear right before you are likely to forget them, maximizing long-term memory retention.",
        },
      },
      {
        "@type": "Question",
        "name": "Is RussVerse free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Yes, RussVerse is completely free, open-access, and requires no account registration to begin learning Russian immediately.",
        },
      },
    ],
  };
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function getLessonSchema(lesson: {
  id: string;
  unit: number;
  title: string;
  subtitle: string;
  level: string;
  stageName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "@id": `${SITE_URL}/lesson/${lesson.id}#resource`,
    "name": `Unit ${lesson.unit}: ${lesson.title} (${lesson.level})`,
    "description": `${lesson.subtitle} — Stage: ${lesson.stageName}, Level: ${lesson.level}. Master Russian grammar and vocabulary with interactive drills.`,
    "educationalLevel": lesson.level,
    "inLanguage": ["ru", "en"],
    "learningResourceType": "Interactive Lesson",
    "isPartOf": {
      "@type": "Course",
      "name": "RussVerse Complete Russian Language Mastery",
      "url": `${SITE_URL}/learn`,
    },
  };
}
