import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Deck, CardRow, CardStatus } from '@/lib/types';

const DECKS_TABLE = 'a_flashcard_study_ap_decks';
const CARDS_TABLE = 'a_flashcard_study_ap_cards';

export function useDecks() {
  return useQuery({
    queryKey: ['decks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(DECKS_TABLE)
        .select('id,user_id,name,description,created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as Deck[];
    },
  });
}

export function useAllCards() {
  return useQuery({
    queryKey: ['cards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(CARDS_TABLE)
        .select('id,user_id,deck_id,front,back,status,last_reviewed_at,created_at')
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data ?? []) as CardRow[];
    },
  });
}

export function useDeckCards(deckId: string | undefined) {
  return useQuery({
    queryKey: ['cards', deckId],
    enabled: !!deckId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from(CARDS_TABLE)
        .select('id,user_id,deck_id,front,back,status,last_reviewed_at,created_at')
        .eq('deck_id', deckId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data ?? []) as CardRow[];
    },
  });
}

export function useCreateDeck() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, description }: { name: string; description: string }) => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) throw new Error('Not signed in');
      const { error } = await supabase
        .from(DECKS_TABLE)
        .insert({ name, description: description || null, user_id: uid });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['decks'] }),
  });
}

export function useDeleteDeck() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error: cardsErr } = await supabase.from(CARDS_TABLE).delete().eq('deck_id', id);
      if (cardsErr) throw cardsErr;
      const { error } = await supabase.from(DECKS_TABLE).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['decks'] });
      qc.invalidateQueries({ queryKey: ['cards'] });
    },
  });
}

export function useCreateCard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ deckId, front, back }: { deckId: string; front: string; back: string }) => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) throw new Error('Not signed in');
      const { error } = await supabase
        .from(CARDS_TABLE)
        .insert({ deck_id: deckId, front, back, status: 'unknown', user_id: uid });
      if (error) throw error;
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['cards', vars.deckId] });
      qc.invalidateQueries({ queryKey: ['cards'] });
    },
  });
}

export function useUpdateCard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, deckId, patch }: { id: string; deckId: string; patch: Partial<Pick<CardRow, 'front' | 'back'>> }) => {
      const { error } = await supabase.from(CARDS_TABLE).update(patch).eq('id', id);
      if (error) throw error;
      return deckId;
    },
    onSuccess: (deckId) => {
      qc.invalidateQueries({ queryKey: ['cards', deckId] });
      qc.invalidateQueries({ queryKey: ['cards'] });
    },
  });
}

export function useDeleteCard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string; deckId: string }) => {
      const { error } = await supabase.from(CARDS_TABLE).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['cards', vars.deckId] });
      qc.invalidateQueries({ queryKey: ['cards'] });
    },
  });
}

export function useMarkCard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, deckId, status }: { id: string; deckId: string; status: CardStatus }) => {
      const { error } = await supabase
        .from(CARDS_TABLE)
        .update({ status, last_reviewed_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['cards', vars.deckId] });
      qc.invalidateQueries({ queryKey: ['cards'] });
    },
  });
}
