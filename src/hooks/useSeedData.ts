import { useEffect } from 'react';
import { useAppData } from '@/lib/data';
import { useStudyStore, type Deck, type CardItem } from '@/lib/store';
import { mockDecks, mockCards } from '@/lib/mockData';

export function useSeedData() {
  const seeded = useStudyStore((s) => s.seeded);
  const seed = useStudyStore((s) => s.seed);

  const decksQuery = useAppData<Deck[]>({
    key: 'decks',
    mock: mockDecks,
    fetchLive: async () => {
      throw new Error('not wired yet');
    },
  });

  const cardsQuery = useAppData<CardItem[]>({
    key: 'cards',
    mock: mockCards,
    fetchLive: async () => {
      throw new Error('not wired yet');
    },
  });

  useEffect(() => {
    if (!seeded && decksQuery.data && cardsQuery.data) {
      seed(decksQuery.data, cardsQuery.data);
    }
  }, [seeded, decksQuery.data, cardsQuery.data, seed]);

  return {
    isLoading: decksQuery.isLoading || cardsQuery.isLoading,
    error: decksQuery.error || cardsQuery.error,
  };
}
