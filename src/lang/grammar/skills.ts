import type { SkillId } from "../types";

export const SKILLS: { id: SkillId; label: string; iconName: string; desc: string }[] = [
  { id: "vocabulary", label: "Vocabulary", iconName: "BookOpen", desc: "Core high-frequency lexical bank" },
  { id: "gender", label: "Noun Gender", iconName: "Layers", desc: "Masculine, feminine, neuter agreements" },
  { id: "verbs", label: "Conjugations", iconName: "Zap", desc: "Present, past, future & motion verbs" },
  { id: "cases", label: "Case System", iconName: "Grid", desc: "6 Russian grammatical cases & endings" },
  { id: "syntax", label: "Sentence Syntax", iconName: "MoveHorizontal", desc: "Word order & conversational patterns" },
  { id: "listening", label: "Listening Lab", iconName: "Headphones", desc: "Phonetics, vowel reduction & speech" },
];
