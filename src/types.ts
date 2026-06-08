/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum CardCategory {
  NOUN = 'Noun',
  ADJECTIVE = 'Adjective',
  ADVERB = 'Adverb',
  VERB = 'Verb',
  PHRASE = 'Phrase',
}

export enum Gender {
  MASCULINE = 'M',
  FEMININE = 'F',
  NEUTER = 'N',
}

export interface ExampleSentence {
  it: string;
  en: string;
  fa?: string;
}

export interface MicroDialog {
  sender: 'user' | 'ai';
  it: string;
  en: string;
  fa?: string;
}

export interface FlashcardData {
  id: string;
  word_it: string;
  article?: string;
  gender?: Gender;
  phonetic: string;
  translation_fa?: string;
  translation_en: string; // The blurred one
  category: CardCategory;
  media_url?: string; // Image or GIF
  audio_url?: string;
  
  // Specific for Nouns
  gender_info_fa?: string; 
  gender_info_en?: string;
  
  // Specific for Adjectives/Adverbs (Declensions)
  declensions?: {
    label: string;
    value: string;
  }[];

  synonyms?: string[];
  antonyms?: string[];
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  tags: string[];
  examples: ExampleSentence[];
  story_it: string; // 3-line story
  story_fa?: string;
  story_en?: string;
  dialogs: MicroDialog[];
}

export type SRSLevel = 'easy' | 'good' | 'hard' | 'again';

export interface DailyGoal {
  cardTarget: number;
  cardsReviewedToday: number;
}

export interface ThemeColors {
  name: string;
  gradient: string;
  accent: string;
  glow: string;
  ambientSoundUrl: string;
  haloEffect: string;
  mode: 'light' | 'dark';
  cardGlassClass?: string;
  navGlassClass?: string;
  bgTexture?: string;
  textClass?: string;
}
