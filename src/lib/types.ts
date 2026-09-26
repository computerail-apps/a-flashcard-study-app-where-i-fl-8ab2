export type CardStatus = 'known' | 'unknown';

export interface Deck {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface CardRow {
  id: string;
  user_id: string;
  deck_id: string;
  front: string;
  back: string;
  status: CardStatus;
  last_reviewed_at: string | null;
  created_at: string;
}
