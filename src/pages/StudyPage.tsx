import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Nav, NavLink } from '@/lib/ui/Nav';
import { Container } from '@/lib/ui/Container';
import { Button } from '@/lib/ui/Button';
import { Card, CardContent } from '@/lib/ui/Card';
import { EmptyState } from '@/lib/ui/EmptyState';
import { CenteredSpinner } from '@/lib/ui/Spinner';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { Badge } from '@/lib/ui/Badge';
import { cn } from '@/lib/cn';
import { ArrowLeft, Layers, RotateCcw, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { useStudyStore } from '@/lib/store';
import { useSeedData } from '@/hooks/useSeedData';

export function StudyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoading, error } = useSeedData();

  const deck = useStudyStore((s) => s.decks.find((d) => d.id === id));
  const allCards = useStudyStore((s) => s.cards.filter((c) => c.deck_id === id));
  const markCard = useStudyStore((s) => s.markCard);

  // Snapshot the study queue once when entering the session.
  const [queue] = useState(() => allCards.map((c) => c.id));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionResults, setSessionResults] = useState<Record<string, 'known' | 'unknown'>>({});

  const currentCard = useMemo(() => {
    const cardId = queue[index];
    return allCards.find((c) => c.id === cardId) ?? null;
  }, [queue, index, allCards]);

  const isFinished = index >= queue.length;

  function handleFlip() {
    if (!flipped) setFlipped(true);
  }

  function handleMark(status: 'known' | 'unknown') {
    if (!currentCard) return;
    markCard(currentCard.id, status);
    setSessionResults((prev) => ({ ...prev, [currentCard.id]: status }));
    setFlipped(false);
    setIndex((i) => i + 1);
  }

  function restart() {
    setIndex(0);
    setFlipped(false);
    setSessionResults({});
  }

  const knownCount = Object.values(sessionResults).filter((v) => v === 'known').length;
  const unknownCount = Object.values(sessionResults).filter((v) => v === 'unknown').length;

  return (
    <div className="min-h-screen">
      <Nav
        brand={
          <span className="inline-flex items-center gap-2">
            <Layers size={18} />
            Recall
          </span>
        }
      >
        <NavLink href="#" onClick={() => navigate(deck ? `/decks/${deck.id}` : '/')}>
          <ArrowLeft size={14} className="mr-2" />
          Back to deck
        </NavLink>
      </Nav>
      <main className="py-8">
        <Container className="max-w-2xl">
          {isLoading ? (
            <CenteredSpinner label="Loading study session" />
          ) : error ? (
            <Alert variant="destructive">
              <AlertTitle>Couldn't load this deck</AlertTitle>
              <AlertDescription>{(error as Error).message}</AlertDescription>
            </Alert>
          ) : !deck ? (
            <EmptyState
              icon={<Layers size={20} />}
              title="Deck not found"
              description="This deck may have been deleted."
              action={<Button size="sm" onClick={() => navigate('/')}>Back to decks</Button>}
            />
          ) : queue.length === 0 ? (
            <EmptyState
              icon={<Sparkles size={20} />}
              title="Nothing to study"
              description="Add some cards to this deck first."
              action={<Button size="sm" onClick={() => navigate(`/decks/${deck.id}`)}>Go to deck</Button>}
            />
          ) : isFinished ? (
            <div className="animate-in">
              <Card>
                <CardContent className="flex flex-col items-center gap-6 py-12 text-center">
                  <Sparkles size={40} className="text-primary" />
                  <div className="space-y-2">
                    <h1 className="text-h1">Session complete</h1>
                    <p className="text-body text-muted-foreground">
                      You reviewed {queue.length} card{queue.length === 1 ? '' : 's'} in {deck.name}.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Badge variant="success">{knownCount} known</Badge>
                    <Badge variant="default">{unknownCount} still learning</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={restart}>
                      <RotateCcw size={16} />
                      Study again
                    </Button>
                    <Button onClick={() => navigate(`/decks/${deck.id}`)}>Back to deck</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : currentCard ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-small text-muted-foreground">
                <span className="tabular-nums">
                  Card {index + 1} of {queue.length}
                </span>
                <span className="tabular-nums">{deck.name}</span>
              </div>

              <button
                type="button"
                onClick={handleFlip}
                className={cn(
                  'w-full rounded-xl border border-border bg-surface-elevated p-10 text-center shadow-elev-2 transition-all duration-150 ease-out',
                  'min-h-[280px] flex items-center justify-center',
                  !flipped && 'hover:shadow-elev-3 cursor-pointer',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                )}
              >
                <div className="space-y-4">
                  <span className="text-micro uppercase tracking-wide text-muted-foreground">
                    {flipped ? 'Answer' : 'Question · click to reveal'}
                  </span>
                  <p className="text-h2">{flipped ? currentCard.back : currentCard.front}</p>
                </div>
              </button>

              {flipped ? (
                <div className="flex flex-col gap-3 sm:flex-row animate-in">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleMark('unknown')}
                  >
                    <XCircle size={16} />
                    Still learning
                  </Button>
                  <Button className="flex-1" onClick={() => handleMark('known')}>
                    <CheckCircle2 size={16} />
                    Known
                  </Button>
                </div>
              ) : (
                <p className="text-center text-small text-muted-foreground">
                  Click the card to reveal the answer
                </p>
              )}
            </div>
          ) : null}
        </Container>
      </main>
    </div>
  );
}
