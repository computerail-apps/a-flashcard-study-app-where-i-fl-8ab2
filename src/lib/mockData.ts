import type { Deck, CardItem } from '@/lib/store';

const now = Date.now();
const hoursAgo = (h: number) => new Date(now - h * 3600 * 1000).toISOString();

export const mockDecks: Deck[] = [
  {
    id: 'deck-spanish',
    name: 'Spanish Vocabulary',
    description: 'Everyday words and phrases for conversational Spanish.',
    created_at: hoursAgo(240),
  },
  {
    id: 'deck-js',
    name: 'JavaScript Interview Prep',
    description: 'Core concepts that come up in frontend interviews.',
    created_at: hoursAgo(120),
  },
  {
    id: 'deck-capitals',
    name: 'World Capitals',
    description: 'Countries and their capital cities.',
    created_at: hoursAgo(48),
  },
  {
    id: 'deck-biology',
    name: 'Cell Biology Basics',
    description: null,
    created_at: hoursAgo(6),
  },
];

export const mockCards: CardItem[] = [
  { id: 'c1', deck_id: 'deck-spanish', front: 'Hello', back: 'Hola', status: 'known', last_reviewed_at: hoursAgo(20), created_at: hoursAgo(240) },
  { id: 'c2', deck_id: 'deck-spanish', front: 'Goodbye', back: 'Adios', status: 'known', last_reviewed_at: hoursAgo(20), created_at: hoursAgo(240) },
  { id: 'c3', deck_id: 'deck-spanish', front: 'Please', back: 'Por favor', status: 'unknown', last_reviewed_at: hoursAgo(19), created_at: hoursAgo(239) },
  { id: 'c4', deck_id: 'deck-spanish', front: 'Thank you', back: 'Gracias', status: 'known', last_reviewed_at: hoursAgo(19), created_at: hoursAgo(239) },
  { id: 'c5', deck_id: 'deck-spanish', front: 'Where is the bathroom?', back: 'Donde esta el bano?', status: 'unknown', last_reviewed_at: null, created_at: hoursAgo(238) },
  { id: 'c6', deck_id: 'deck-spanish', front: 'How much does it cost?', back: 'Cuanto cuesta?', status: 'unknown', last_reviewed_at: hoursAgo(18), created_at: hoursAgo(238) },

  { id: 'c7', deck_id: 'deck-js', front: 'What is a closure?', back: 'A function that retains access to its lexical scope even when executed outside that scope.', status: 'known', last_reviewed_at: hoursAgo(10), created_at: hoursAgo(120) },
  { id: 'c8', deck_id: 'deck-js', front: 'What does === check that == does not?', back: 'It checks type equality in addition to value equality, without coercion.', status: 'known', last_reviewed_at: hoursAgo(10), created_at: hoursAgo(120) },
  { id: 'c9', deck_id: 'deck-js', front: 'What is the event loop?', back: 'The mechanism that lets JS handle async callbacks by processing the call stack and task queues.', status: 'unknown', last_reviewed_at: hoursAgo(9), created_at: hoursAgo(119) },
  { id: 'c10', deck_id: 'deck-js', front: 'Difference between let and var?', back: 'let is block scoped and not hoisted the same way; var is function scoped and hoisted.', status: 'unknown', last_reviewed_at: null, created_at: hoursAgo(118) },
  { id: 'c11', deck_id: 'deck-js', front: 'What is a Promise?', back: 'An object representing eventual completion or failure of an async operation.', status: 'known', last_reviewed_at: hoursAgo(9), created_at: hoursAgo(118) },

  { id: 'c12', deck_id: 'deck-capitals', front: 'France', back: 'Paris', status: 'known', last_reviewed_at: hoursAgo(40), created_at: hoursAgo(48) },
  { id: 'c13', deck_id: 'deck-capitals', front: 'Japan', back: 'Tokyo', status: 'known', last_reviewed_at: hoursAgo(40), created_at: hoursAgo(48) },
  { id: 'c14', deck_id: 'deck-capitals', front: 'Australia', back: 'Canberra', status: 'unknown', last_reviewed_at: hoursAgo(39), created_at: hoursAgo(47) },
  { id: 'c15', deck_id: 'deck-capitals', front: 'Brazil', back: 'Brasilia', status: 'unknown', last_reviewed_at: null, created_at: hoursAgo(47) },
  { id: 'c16', deck_id: 'deck-capitals', front: 'Canada', back: 'Ottawa', status: 'unknown', last_reviewed_at: null, created_at: hoursAgo(46) },

  { id: 'c17', deck_id: 'deck-biology', front: 'What is the mitochondria?', back: 'The organelle that generates ATP through cellular respiration.', status: 'unknown', last_reviewed_at: null, created_at: hoursAgo(6) },
  { id: 'c18', deck_id: 'deck-biology', front: 'What is the function of ribosomes?', back: 'They synthesize proteins by translating mRNA.', status: 'unknown', last_reviewed_at: null, created_at: hoursAgo(6) },
  { id: 'c19', deck_id: 'deck-biology', front: 'What is the cell membrane made of?', back: 'A phospholipid bilayer with embedded proteins.', status: 'unknown', last_reviewed_at: null, created_at: hoursAgo(6) },
];
