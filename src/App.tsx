import { HashRouter, Routes, Route } from 'react-router-dom';
import { DecksPage } from '@/pages/DecksPage';
import { DeckDetailPage } from '@/pages/DeckDetailPage';
import { StudyPage } from '@/pages/StudyPage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<DecksPage />} />
        <Route path="/decks/:id" element={<DeckDetailPage />} />
        <Route path="/decks/:id/study" element={<StudyPage />} />
      </Routes>
    </HashRouter>
  );
}
