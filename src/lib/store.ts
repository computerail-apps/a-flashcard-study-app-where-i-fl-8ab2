import { create } from 'zustand';

export type CardStatus = 'known' | 'unknown';

export interface Deck {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface CardItem {
  id: string;
  deck_id: string;
  front: string;
  back: string;
  status: CardStatus;
  last_reviewed_at: string | null;
  created_at: string;
}

interface StudyState {
  decks: Deck[];
  cards: CardItem[];
  seeded: boolean;
  seed: (decks: Deck[], cards: CardItem[]) => void;
  addDeck: (name: string, description: string) => Deck;
  updateDeck: (id: string, patch: Partial<Pick<Deck, 'name' | 'description'>>) => void;
  deleteDeck: (id: string) => void;
  addCard: (deckId: string, front: string, back: string) => CardItem;
  updateCard: (id: string, patch: Partial<Pick<CardItem, 'front' | 'back'>>) => void;
  deleteCard: (id: string) => void;
  markCard: (id: string, status: CardStatus) => void;
  resetDeckProgress: (deckId: string) => void;
}

export const useStudyStore = create<StudyState>((set) => ({
  decks: [],
  cards: [],
  seeded: false,
  seed: (decks, cards) =>
    set((state) => (state.seeded ? state : { decks, cards, seeded: true })),
  addDeck: (name, description) => {
    const deck: Deck = {
      id: crypto.randomUUID(),
      name,
      description: description || null,
      created_at: new Date().toISOString(),
    };
    set((s) => ({ decks: [deck, ...s.decks] }));
    return deck;
  },
  updateDeck: (id, patch) =>
    set((s) => ({ decks: s.decks.map((d) => (d.id === id ? { ...d, ...patch } : d)) })),
  deleteDeck: (id) =>
    set((s) => ({
      decks: s.decks.filter((d) => d.id !== id),
      cards: s.cards.filter((c) => c.deck_id !== id),
    })),
  addCard: (deckId, front, back) => {
    const card: CardItem = {
      id: crypto.randomUUID(),
      deck_id: deckId,
      front,
      back,
      status: 'unknown',
      last_reviewed_at: null,
      created_at: new Date().toISOString(),
    };
    set((s) => ({ cards: [...s.cards, card] }));
    return card;
  },
  updateCard: (id, patch) =>
    set((s) => ({ cards: s.cards.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
  deleteCard: (id) => set((s) => ({ cards: s.cards.filter((c) => c.id !== id) })),
  markCard: (id, status) =>
    set((s) => ({
      cards: s.cards.map((c) =>
        c.id === id ? { ...c, status, last_reviewed_at: new Date().toISOString() } : c
      ),
    })),
  resetDeckProgress: (deckId) =>
    set((s) => ({
      cards: s.cards.map((c) =>
        c.deck_id === deckId ? { ...c, status: 'unknown', last_reviewed_at: null } : c
      ),
    })),
}));
