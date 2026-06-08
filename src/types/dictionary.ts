export interface Example {
  italian: string;
  persian: string;
}

export interface Definition {
  text: string;
  synonyms: string[];
  antonyms: string[];
  examples: Example[];
}

export interface PartOfSpeechSection {
  type: string;
  definitions: Definition[];
}

export interface Phrase {
  italian: string;
  persian: string;
}

export interface EssentialWord {
  italian: string;
  persian: string;
}

export interface DictionaryItem {
  id: string;
  italian: string;
  english: string;
  altMeanings: string[];
  synonyms: string[];
  antonyms: string[];
}

export interface WordEntry {
  id: string;
  word: string;
  ipa: string;
  parts: PartOfSpeechSection[];
  grammarNote?: string;
  phrases: Phrase[];
  nearbyWords: string[];
}
