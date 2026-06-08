/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CardCategory, FlashcardData, Gender } from '../types';

export const MOCK_FLASHCARDS: FlashcardData[] = [
  {
    id: '1',
    word_it: 'Libro',
    article: 'il',
    gender: Gender.MASCULINE,
    phonetic: '[il ˈli.bro]',
    translation_fa: 'book',
    translation_en: 'book',
    category: CardCategory.NOUN,
    level: 'A1',
    media_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
    audio_url: '#',
    gender_info_fa: 'Masculine Noun',
    gender_info_en: 'Masculine Noun',
    tags: ['Basic', 'Objects', 'Essential'],
    examples: [
      { it: 'Leggo un libro ogni settimana.', en: 'I read a book every week.' },
      { it: 'Questo libro è molto interessante.', en: 'This book is very interesting.' }
    ],
    story_it: 'C\'era un vecchio libro in biblioteca. Marco lo ha aperto e ha trovato una mappa. La mappa portava a un tesoro nascosto.',
    story_fa: 'There was an old book in the library. Marco opened it and found a map. The map led to a hidden treasure.',
    story_en: 'There was an old book in the library. Marco opened it and found a map. The map led to a hidden treasure.',
    dialogs: [
      { sender: 'user', it: 'Hai visto il mio libro?', en: 'Did you see my book?' },
      { sender: 'ai', it: 'Sì, è sul tavolo in cucina.', en: 'Yes, it is on the table in the kitchen.' }
    ],
    synonyms: ['volume', 'opera'],
    antonyms: []
  },
  {
    id: '2',
    word_it: 'Mela',
    article: 'la',
    gender: Gender.FEMININE,
    phonetic: '[la ˈmela]',
    translation_fa: 'apple',
    translation_en: 'apple',
    category: CardCategory.NOUN,
    level: 'A1',
    media_url: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=400&q=80',
    audio_url: '#',
    gender_info_fa: 'Feminine Noun',
    gender_info_en: 'Feminine Noun',
    tags: ['Food', 'Fruit', 'Basic'],
    examples: [
      { it: 'Mangio una mela rossa.', en: 'I eat a red apple.' }
    ],
    story_it: 'La mela è un frutto salutare. Contiene molte vitamine. Gli esperti dicono che una mela al giorno toglie il medico di torno.',
    story_fa: 'The apple is a healthy fruit. It contains many vitamins. Experts say that an apple a day keeps the doctor away.',
    story_en: 'The apple is a healthy fruit. It contains many vitamins. Experts say that an apple a day keeps the doctor away.',
    dialogs: [
      { sender: 'user', it: 'Vuoi una mela?', en: 'Do you want an apple?' },
      { sender: 'ai', it: 'No grazie, preferisco una pera.', en: 'No thanks, I prefer a pear.' }
    ],
    synonyms: [],
    antonyms: []
  },
  {
    id: '3',
    word_it: 'Bellissimo',
    phonetic: '[belˈlis.si.mo]',
    translation_fa: 'wonderful',
    translation_en: 'wonderful',
    category: CardCategory.ADJECTIVE,
    level: 'A1',
    media_url: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=400&q=80',
    audio_url: '#',
    declensions: [
      { label: 'MS', value: 'Bellissimo' },
      { label: 'FS', value: 'Bellissima' },
      { label: 'MP', value: 'Bellissimi' },
      { label: 'FP', value: 'Bellissime' }
    ],
    tags: ['Description', 'Common', 'Intense'],
    examples: [
      { it: 'Venezia è un posto bellissimo.', en: 'Venice is a very beautiful place.' }
    ],
    story_it: 'Oggi il tempo è bellissimo. Il sole splende e l\'aria è fresca. Andiamo a fare una passeggiata nel parco?',
    story_fa: 'Today the weather is beautiful. The sun is shining and the air is fresh. Shall we go for a walk in the park?',
    story_en: 'Today the weather is beautiful. The sun is shining and the air is fresh. Shall we go for a walk in the park?',
    dialogs: [
      { sender: 'user', it: 'Ti piace questo vestito?', en: 'Do you like this dress?' },
      { sender: 'ai', it: 'Sì, è bellissimo! Ti sta molto bene.', en: 'Yes, it is beautiful! It looks very good on you.' }
    ],
    synonyms: ['stupendo', 'meraviglioso'],
    antonyms: ['bruttissimo', 'orribile']
  }
];
