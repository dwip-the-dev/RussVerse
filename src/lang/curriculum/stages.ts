import type { Stage } from "../types";

export const STAGES: Stage[] = [
  { id: 1, name: "Foundations", level: "A1", unitRange: [1, 16], color: "bg-emerald-500", description: "Greetings, Cyrillic, basic actions & core survival structures" },
  { id: 2, name: "A1 Expansion", level: "A1", unitRange: [17, 36], color: "bg-teal-500", description: "Colors, house, professions, hobbies, friends & descriptions" },
  { id: 3, name: "A1 → A2 Grammar", level: "A2", unitRange: [37, 56], color: "bg-amber-500", description: "Adjective genders, pronouns, negation & 6-case introduction" },
  { id: 4, name: "A2 Vocabulary Core", level: "A2", unitRange: [57, 76], color: "bg-yellow-500", description: "Shopping, money, restaurants, Russian food & city transport" },
  { id: 5, name: "A2 Grammar & Declensions", level: "A2", unitRange: [77, 96], color: "bg-orange-500", description: "Deep dive into 6 cases singular & plural, prepositions & animate forms" },
  { id: 6, name: "A2 Verbs & Motion", level: "A2", unitRange: [97, 116], color: "bg-orange-600", description: "Conjugations, reflexive verbs, motion pairs & aspect introduction" },
  { id: 7, name: "A2 Communication", level: "A2", unitRange: [117, 136], color: "bg-rose-500", description: "Making plans, invitations, polite refusals, opinions & comparisons" },
  { id: 8, name: "B1 Grammar & Syntax", level: "B1", unitRange: [137, 156], color: "bg-sky-500", description: "Past/future deep dive, conditional mood, imperatives, clauses & conjunctions" },
  { id: 9, name: "B1 Lexical Mastery", level: "B1", unitRange: [157, 176], color: "bg-blue-600", description: "Health, tech, programming, media, politics, careers & abstract thoughts" },
  { id: 10, name: "B1 Listening & Speaking", level: "B1", unitRange: [177, 192], color: "bg-indigo-600", description: "Fast speech, vowel reduction, telephone calls, stories & debate" },
  { id: 11, name: "B2 Advanced Russian", level: "B2", unitRange: [193, 210], color: "bg-purple-600", description: "Motion prefixes (в-, вы-, при-, у-), passive voice, participles & gerunds" },
  { id: 12, name: "B2/C1 Real Russian & Boss", level: "C1", unitRange: [211, 220], color: "bg-red-600", description: "Authentic news, literature, sarcasm, idioms, slang & РУССКИЙ БОСС" },
];
