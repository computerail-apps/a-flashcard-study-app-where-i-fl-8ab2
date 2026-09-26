import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Nav, NavLink } from '@/lib/ui/Nav';
import { Container } from '@/lib/ui/Container';
import { Button } from '@/lib/ui/Button';
import { Input } from '@/lib/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/lib/ui/Card';
import { EmptyState } from '@/lib/ui/EmptyState';
import { CenteredSpinner } from '@/lib/ui/Spinner';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { Badge } from '@/lib/ui/Badge';
import { ArrowLeft, Layers, Plus, Play, Pencil, Trash2, X, Check } from 'lucide-react';
import { useStudyStore } from '@/lib/store';
import { formatRelativeTime } from '@/lib/format';
import { useSeedData } from '@/hooks/useSeedData';

export function DeckDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoading, error } = useSeedData();

  const deck = useStudyStore((s) => s.decks.find((d) => d.id === id));
  const cards = useStudyStore((s) => s.cards.filter((c) => c.deck_id === id));
  const addCard = useStudyStore((s) => s.addCard);
  const updateCard = useStudyStore((s) => s.updateCard);
  const deleteCard = useStudyStore((s) => s.deleteCard);

  const [showForm, setShowForm] = useState(false);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFront, setEditFront] = useState('');
  const [editBack, setEditBack] = useState('');

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!front.trim() || !back.trim() || !id) return;
    addCard(id, front.trim(), back.trim());
    setFront('');
    setBack('');
  }

  function startEdit(cardId: string, f: string, b: string) {
    setEditingId(cardId);
    setEditFront(f);
    setEditBack(b);
  }

  function saveEdit(cardId: string) {
    if (!editFront.trim() || !editBack.trim()) return;
    updateCard(cardId, { front: editFront.trim(), back: editBack.trim() });
    setEditingId(null);
  }

  const known = cards.filter((c) => c.status === 'known').length;

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
        <NavLink href="#/" onClick={() => navigate('/')}>
          <ArrowLeft size={14} className="mr-2" />
          All decks
        </NavLink>
      </Nav>
      <main className="py-8">
        <Container>
          {isLoading ? (
            <CenteredSpinner label="Loading deck" />
          ) : error ? (
            <Alert variant="destructive">
              <AlertTitle>Couldn't load deck</AlertTitle>
              <AlertDescription>{(error as Error).message}</AlertDescription>
            </Alert>
          ) : !deck ? (
            <EmptyState
              icon={<Layers size={20} />}
              title="Deck not found"
              description="This deck may have been deleted."
              action={<Button size="sm" onClick={() => navigate('/')}>Back to decks</Button>}
            />
          ) : (
            <>
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="space-y-2">
                  <h1 className="text-display">{deck.name}</h1>
                  {deck.description && (
                    <p className="text-body text-muted-foreground">{deck.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="success">{known} known</Badge>
                    <Badge variant="default">{cards.length - known} learning</Badge>
                    <span className="text-small tabular-nums text-muted-foreground self-center">
                      {cards.length} total cards
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowForm((v) => !v)}>
                    <Plus size={16} />
                    Add card
                  </Button>
                  <Button
                    onClick={() => navigate(`/decks/${deck.id}/study`)}
                    disabled={cards.length === 0}
                  >
                    <Play size={16} />
                    Start studying
                  </Button>
                </div>
              </div>

              {showForm && (
                <Card className="mb-6 animate-slide-up">
                  <CardHeader>
                    <CardTitle>New card</CardTitle>
                    <CardDescription>Enter the question on the front and the answer on the back.</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleAdd}>
                    <CardContent className="space-y-3">
                      <Input
                        placeholder="Front, e.g. What is a closure?"
                        value={front}
                        onChange={(e) => setFront(e.target.value)}
                        autoFocus
                      />
                      <Input
                        placeholder="Back, e.g. A function bound to its lexical scope"
                        value={back}
                        onChange={(e) => setBack(e.target.value)}
                      />
                    </CardContent>
                    <CardFooter className="gap-2">
                      <Button type="submit" disabled={!front.trim() || !back.trim()}>
                        Add card
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                        Cancel
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              )}

              {cards.length === 0 ? (
                <EmptyState
                  icon={<Layers size={20} />}
                  title="No cards yet"
                  description="Add your first card to start building this deck."
                  action={
                    <Button size="sm" onClick={() => setShowForm(true)}>
                      <Plus size={16} />
                      Add card
                    </Button>
                  }
                />
              ) : (
                <Card>
                  <CardContent className="divide-y divide-border p-0">
                    {cards.map((card) => (
                      <div key={card.id} className="px-6 py-4">
                        {editingId === card.id ? (
                          <div className="space-y-3">
                            <Input value={editFront} onChange={(e) => setEditFront(e.target.value)} placeholder="Front" autoFocus />
                            <Input value={editBack} onChange={(e) => setEditBack(e.target.value)} placeholder="Back" />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => saveEdit(card.id)}>
                                <Check size={14} />
                                Save
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                                <X size={14} />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div className="space-y-1">
                              <div className="text-body">{card.front}</div>
                              <div className="text-small text-muted-foreground">{card.back}</div>
                              <div className="text-micro text-muted-foreground">
                                Last reviewed: {formatRelativeTime(card.last_reviewed_at)}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={card.status === 'known' ? 'success' : 'default'}>
                                {card.status === 'known' ? 'Known' : 'Learning'}
                              </Badge>
                              <Button size="sm" variant="ghost" onClick={() => startEdit(card.id, card.front, card.back)} aria-label="Edit card">
                                <Pencil size={14} />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => deleteCard(card.id)} aria-label="Delete card">
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </Container>
      </main>
    </div>
  );
}
