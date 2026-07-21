import { FlagRU, FlagTJ, FlagUK } from "@/components/icons";

// Labels are written in each language, as in the Figma.
export const LANGS = [
  { code: "RU", label: "Русский", Flag: FlagRU },
  { code: "EN", label: "English", Flag: FlagUK },
  { code: "TJ", label: "Тоҷикӣ", Flag: FlagTJ },
] as const;

export type LangCode = (typeof LANGS)[number]["code"];
