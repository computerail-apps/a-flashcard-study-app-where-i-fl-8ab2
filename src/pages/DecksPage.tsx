import { useState } from 'react';
import { Nav } from '@/lib/ui/Nav';
import { Container } from '@/lib/ui/Container';
import { Button } from '@/lib/ui/Button';
import { Input } from '@/lib/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/lib/ui/Card';
import { EmptyState } from '@/lib/ui/EmptyState';
import { CenteredSpinner } from '@/lib/ui/Spinner';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { Badge } from '@/lib/ui/Badge';
import { Layers, Plus, BookOpen, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStudyStore } from '@/lib/store';
import { useSeedData } from '@/hooks/useSeedData';

export function DecksPage() {
  const { isLoading, error } = useSeedData();
  const decks = useStudyStore((s) => s.decks);
  const cards = useStudyStore((s) => s.cards);
  const addDeck = useStudyStore((s) => s.addDeck);
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const deck = addDeck(name.trim(), description.trim());
    setName('');
    setDescription('');
    setShowForm(false);
    navigate(`/decks/${deck.id}`);
  }

  return (
    <div className="min-h-screen">
      <Nav
        brand={
          <span className="inline-flex items-center gap-2">
            <Layers size={18} />
            Recall
          </span>
        }
        actions={
          <Button size="sm" onClick={() => setShowForm((v) => !v)}>
            <Plus size={16} />
            New deck
          </Button>
        }
      />
      <main className="py-8">
        <Container>
          <div className="mb-8 space-y-2">
            <h1 className="text-display">Your decks</h1>
            <p className="text-body text-muted-foreground">
              Create a deck, add cards, then run a focused study session to build mastery over time.
            </p>
          </div>

          {showForm && (
            <Card className="mb-6 animate-slide-up">
              <CardHeader>
                <CardTitle>New deck</CardTitle>
                <CardDescription>Give it a name and an optional description.</CardDescription>
              </CardHeader>
              <form onSubmit={handleCreate}>
                <CardContent className="space-y-3">
                  <Input
                    placeholder="Deck name, e.g. French Verbs"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                  />
                  <Input
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </CardContent>
                <CardFooter className="gap-2">
                  <Button type="submit" disabled={!name.trim()}>
                    Create deck
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {isLoading ? (
            <CenteredSpinner label="Loading decks" />
          ) : error ? (
            <Alert variant="destructive">
              <AlertTitle>Couldn't load decks</AlertTitle>
              <AlertDescription>{(error as Error).message}</AlertDescription>
            </Alert>
          ) : decks.length === 0 ? (
            <EmptyState
              icon={<BookOpen size={20} />}
              title="No decks yet"
              description="Create your first deck to start adding flashcards."
              action={
                <Button size="sm" onClick={() => setShowForm(true)}>
                  <Plus size={16} />
                  New deck
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {decks.map((deck) => {
                const deckCards = cards.filter((c) => c.deck_id === deck.id);
                const known = deckCards.filter((c) => c.status === 'known').length;
                const unknown = deckCards.length - known;
                return (
                  <Card key={deck.id} className="flex flex-col transition-all duration-150 hover:shadow-elev-2">
                    <CardHeader>
                      <CardTitle>{deck.name}</CardTitle>
                      <CardDescription>{deck.description || 'No description'}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-3">
                      <div className="flex items-center gap-2 text-small text-muted-foreground">
                        <span className="tabular-nums">{deckCards.length} cards</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="success">{known} known</Badge>
                        <Badge variant="default">{unknown} learning</Badge>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" onClick={() => navigate(`/decks/${deck.id}`)}>
                        Open deck
                        <ArrowRight size={16} />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
