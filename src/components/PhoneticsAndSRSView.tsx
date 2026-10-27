import React, { useState } from 'react';
import {
  CEFRLevel,
  PHONETIC_MINIMAL_PAIRS,
  PhoneticMinimalPair,
  SRSCard,
} from '../lib/curriculumData';
import { calculateNextReview, checkExerciseAnswer } from '../lib/linguisticEngine';
import { Volume2, Plus, CheckCircle2, Ear } from 'lucide-react';

interface PhoneticsAndSRSViewProps {
  srsCards: SRSCard[];
  onUpdateSRSCard: (updated: SRSCard) => void;
  onAddSRSCard: (newCard: SRSCard) => void;
}

export const PhoneticsAndSRSView: React.FC<PhoneticsAndSRSViewProps> = ({
  srsCards,
  onUpdateSRSCard,
  onAddSRSCard,
}) => {
  const [selectedPairId, setSelectedPairId] = useState<string>(
    PHONETIC_MINIMAL_PAIRS[0].id
  );
  const [earQuizSelection, setEarQuizSelection] = useState<'A' | 'B' | null>(null);
  const [earQuizTarget, setEarQuizTarget] = useState<'A' | 'B'>('A');

  // SRS active card & cloze check
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [clozeInput, setClozeInput] = useState<string>('');
  const [clozeVerified, setClozeVerified] = useState<boolean | null>(null);
  const [showCardBack, setShowCardBack] = useState<boolean>(false);

  // Add new custom SRS card form
  const [newTermEn, setNewTermEn] = useState<string>('');
  const [newMeaningEs, setNewMeaningEs] = useState<string>('');
  const [newExampleEn, setNewExampleEn] = useState<string>('');
  const [newLevel, setNewLevel] = useState<CEFRLevel>('B2');
  const [formError, setFormError] = useState<string | null>(null);

  const currentPair: PhoneticMinimalPair =
    PHONETIC_MINIMAL_PAIRS.find((p) => p.id === selectedPairId) ||
    PHONETIC_MINIMAL_PAIRS[0];

  const currentCard: SRSCard | undefined =
    srsCards[activeCardIndex] || srsCards[0];

  const speakWord = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-GB';
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePlayMysteryWord = () => {
    const nextTarget: 'A' | 'B' = earQuizTarget === 'A' ? 'B' : 'A';
    setEarQuizTarget(nextTarget);
    setEarQuizSelection(null);
    speakWord(nextTarget === 'A' ? currentPair.wordA : currentPair.wordB);
  };

  const handleRateCard = (rating: 'hard' | 'good' | 'easy') => {
    if (!currentCard) return;
    const updated = calculateNextReview(currentCard, rating);
    onUpdateSRSCard(updated);
    setClozeInput('');
    setClozeVerified(null);
    setShowCardBack(false);
    setActiveCardIndex((prev) => (prev + 1) % srsCards.length);
  };

  const handleCheckCloze = () => {
    if (!currentCard) return;
    const isRight = checkExerciseAnswer(clozeInput, currentCard.clozeAnswer);
    setClozeVerified(isRight);
    setShowCardBack(true);
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTermEn.trim() || !newMeaningEs.trim()) {
      setFormError(
        'Completa tanto el término en inglés como su significado en español.'
      );
      return;
    }

    const example =
      newExampleEn.trim() || `We need to master the expression "${newTermEn.trim()}".`;

    const knownIpa: Record<string, string> = {
      'figure out': '/ˈfɪɡjər aʊt/',
      'bring up': '/brɪŋ ʌp/',
      thorough: '/ˈθʌrə/',
      'look into': '/lʊk ˈɪntuː/',
    };
    const normalizedTerm = newTermEn.trim().toLowerCase();

    const created: SRSCard = {
      id: `srs-user-${Date.now()}`,
      termEn: newTermEn.trim(),
      ipa: knownIpa[normalizedTerm] || 'Síntesis de voz IPA activa',
      category: 'Phrasal Verb',
      level: newLevel,
      meaningEs: newMeaningEs.trim(),
      exampleEn: example,
      exampleEs: 'Ejemplo personalizado añadido a tu mazo.',
      clozeSentenceEn: `Practice using: ___ (${newMeaningEs.trim()})`,
      clozeAnswer: newTermEn.trim(),
      intervalDays: 1,
      easeFactor: 2.5,
      repetitions: 0,
      dueStatus: 'due',
    };

    onAddSRSCard(created);
    setNewTermEn('');
    setNewMeaningEs('');
    setNewExampleEn('');
    setFormError(null);
  };

  return (
    <div className="space-y-10">
      {/* Section 1: Phonetics & IPA Lab */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Alfabeto Fonético Internacional (IPA)</span>
              <span aria-hidden="true">·</span>
              <span>Acústica Contrastiva para Hispanohablantes</span>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Laboratorio de Fonética, Pares Mínimos y Connected Speech
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
            {PHONETIC_MINIMAL_PAIRS.map((pair, idx) => (
              <button
                key={pair.id}
                type="button"
                onClick={() => {
                  setSelectedPairId(pair.id);
                  setEarQuizSelection(null);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedPairId === pair.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                0{idx + 1}. Nivel {pair.level}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-5">
            <h3 className="text-lg font-semibold text-slate-900">
              {currentPair.categoryEs}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Sound A Card */}
              <div className="border border-slate-200 rounded-lg p-5 space-y-3 bg-slate-50/60">
                <p className="text-xs font-mono font-semibold text-sky-800">
                  SONIDO A · {currentPair.soundA}
                </p>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-slate-900">
                    {currentPair.wordA}
                  </span>
                  <span className="font-mono text-sm text-sky-700">
                    {currentPair.ipaA}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Significado: <strong>{currentPair.meaningAEs}</strong>
                </p>
                <button
                  type="button"
                  onClick={() => speakWord(currentPair.wordA)}
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-sky-700" />
                  <span>Escuchar “{currentPair.wordA}”</span>
                </button>
              </div>

              {/* Sound B Card */}
              <div className="border border-slate-200 rounded-lg p-5 space-y-3 bg-slate-50/60">
                <p className="text-xs font-mono font-semibold text-emerald-800">
                  SONIDO B · {currentPair.soundB}
                </p>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-slate-900">
                    {currentPair.wordB}
                  </span>
                  <span className="font-mono text-sm text-emerald-700">
                    {currentPair.ipaB}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Significado: <strong>{currentPair.meaningBEs}</strong>
                </p>
                <button
                  type="button"
                  onClick={() => speakWord(currentPair.wordB)}
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Escuchar “{currentPair.wordB}”</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
              <p className="text-xs font-semibold text-slate-900">
                Biomecánica Artulatoria (Lengua y Labios):
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {currentPair.mouthPositionEs}
              </p>
            </div>
          </div>

          {/* Right 5 Cols: Connected Speech & Ear Discrimination Drill */}
          <div className="lg:col-span-5 bg-slate-900 text-white rounded-xl p-6 space-y-5">
            <div className="space-y-2 border-b border-slate-800 pb-4">
              <p className="text-xs font-mono text-sky-400">
                PRÁCTICA EN CONTEXTO (CONNECTED SPEECH)
              </p>
              <p className="text-base font-semibold">
                “{currentPair.practiceSentenceEn}”
              </p>
              <p className="text-xs font-mono text-slate-300">
                {currentPair.practiceSentenceIpa}
              </p>
              <button
                type="button"
                onClick={() => speakWord(currentPair.practiceSentenceEn)}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-900 bg-white rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Escuchar Oración Completa</span>
              </button>
            </div>

            {/* Interactive Auditory Discrimination Test */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-400">
                  ENTRENAMIENTO DE OÍDO FONÉTICO
                </span>
                <button
                  type="button"
                  onClick={handlePlayMysteryWord}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-300 hover:text-white cursor-pointer"
                >
                  <Ear className="w-3.5 h-3.5" />
                  <span>Reproducir Sonido Incógnito</span>
                </button>
              </div>
              <p className="text-xs text-slate-300">
                Escucha la palabra incógnita e identifica cuál de los dos fonemas se
                pronunció:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setEarQuizSelection('A')}
                  className={`py-2 px-3 rounded-lg text-xs font-mono font-semibold border transition-colors cursor-pointer ${
                    earQuizSelection === 'A'
                      ? 'bg-sky-600 text-white border-sky-500'
                      : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  A: {currentPair.wordA} ({currentPair.ipaA})
                </button>
                <button
                  type="button"
                  onClick={() => setEarQuizSelection('B')}
                  className={`py-2 px-3 rounded-lg text-xs font-mono font-semibold border transition-colors cursor-pointer ${
                    earQuizSelection === 'B'
                      ? 'bg-sky-600 text-white border-sky-500'
                      : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  B: {currentPair.wordB} ({currentPair.ipaB})
                </button>
              </div>
              {earQuizSelection && (
                <p className="text-xs font-mono pt-1 text-emerald-300">
                  {earQuizSelection === earQuizTarget
                    ? `● ¡Correcto! Identificaste "${
                        earQuizTarget === 'A' ? currentPair.wordA : currentPair.wordB
                      }".`
                    : `■ Era la opción ${earQuizTarget} ("${
                        earQuizTarget === 'A' ? currentPair.wordA : currentPair.wordB
                      }").`}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Spaced Repetition System (SRS) & Phrasal Verbs Deck */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: Active SRS Flashcard Trainer */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <p className="text-xs text-slate-500">
                Algoritmo de Retención a Largo Plazo (SM-2)
              </p>
              <h2 className="text-xl font-semibold text-slate-900">
                Repetición Espaciada: Phrasal Verbs, Colocaciones y Falsos Amigos
              </h2>
            </div>
            <span className="font-mono text-xs font-semibold text-slate-700 tabular-nums whitespace-nowrap shrink-0">
              Tarjeta {(activeCardIndex % srsCards.length) + 1} / {srsCards.length}
            </span>
          </div>

          {currentCard && (
            <div className="border border-slate-200 rounded-xl p-6 space-y-5 bg-slate-50/50">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-sky-700">
                    Nivel {currentCard.level}
                  </span>
                  <span>·</span>
                  <span>{currentCard.category}</span>
                </div>
                <span className="font-mono">
                  Intervalo actual: {currentCard.intervalDays}d ·{' '}
                  {currentCard.dueStatus === 'mastered'
                    ? '● DOMINADA'
                    : currentCard.dueStatus === 'learning'
                    ? '▲ EN APRENDIZAJE'
                    : '■ PENDIENTE HOY'}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-900">
                    {currentCard.termEn}
                  </h3>
                  <button
                    type="button"
                    onClick={() => speakWord(currentCard.termEn)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-sky-700" />
                    <span>Pronunciar</span>
                  </button>
                </div>
                <p className="text-xs font-mono text-slate-500">{currentCard.ipa}</p>
              </div>

              {/* Active Recall Cloze Input */}
              <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
                <p className="text-xs font-medium text-slate-500">
                  Completa el contexto (Active Recall):
                </p>
                <p className="text-sm font-mono font-semibold text-slate-900">
                  {currentCard.clozeSentenceEn}
                </p>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <label htmlFor="srs-cloze-input" className="sr-only">
                    Respuesta para completar la oración de la tarjeta
                  </label>
                  <input
                    id="srs-cloze-input"
                    type="text"
                    value={clozeInput}
                    onChange={(e) => setClozeInput(e.target.value)}
                    placeholder="Escribe el término exacto en inglés..."
                    className="flex-1 px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                  />
                  <button
                    type="button"
                    onClick={handleCheckCloze}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Revelar y Comprobar</span>
                  </button>
                </div>
              </div>

              {(showCardBack || clozeVerified !== null) && (
                <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2">
                  {clozeVerified !== null && (
                    <p
                      className={`text-xs font-mono font-semibold ${
                        clozeVerified ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {clozeVerified
                        ? '● Respuesta exacta verificada'
                        : `■ Solución: "${currentCard.clozeAnswer}"`}
                    </p>
                  )}
                  <p className="text-sm font-semibold text-slate-900">
                    Significado: {currentCard.meaningEs}
                  </p>
                  <p className="text-xs text-slate-700 font-mono">
                    “{currentCard.exampleEn}”
                  </p>
                  <p className="text-xs text-slate-500">{currentCard.exampleEs}</p>
                </div>
              )}

              {/* SM-2 Rating Buttons */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <p className="text-xs text-slate-500">
                  Califica tu retención para programar el próximo repaso:
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleRateCard('hard')}
                    className="py-2.5 px-3 text-xs font-semibold text-rose-800 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    Difícil · Repetir (1d)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRateCard('good')}
                    className="py-2.5 px-3 text-xs font-semibold text-sky-800 bg-sky-50 border border-sky-200 rounded-lg hover:bg-sky-100 transition-colors cursor-pointer"
                  >
                    Bien · Consolidar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRateCard('easy')}
                    className="py-2.5 px-3 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    Fácil · Dominada
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 5 Cols: Add Custom Vocabulary Form & Deck Overview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-semibold text-slate-900">
              Añadir Término o Phrasal Verb a mi Mazo
            </h3>
            <form onSubmit={handleCreateCard} className="space-y-3.5">
              <div>
                <label
                  htmlFor="new-term-en"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Expresión o Phrasal Verb (Inglés)
                </label>
                <input
                  id="new-term-en"
                  type="text"
                  value={newTermEn}
                  onChange={(e) => {
                    setNewTermEn(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  placeholder="Ej. figure out, thorough, bring up..."
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div>
                <label
                  htmlFor="new-meaning-es"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Significado y Matiz (Español)
                </label>
                <input
                  id="new-meaning-es"
                  type="text"
                  value={newMeaningEs}
                  onChange={(e) => {
                    setNewMeaningEs(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  placeholder="Ej. resolver / descifrar un problema complejo"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="new-example-en"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Oración de Ejemplo (Opcional)
                  </label>
                  <input
                    id="new-example-en"
                    type="text"
                    value={newExampleEn}
                    onChange={(e) => setNewExampleEn(e.target.value)}
                    placeholder="Ej. We figured out the root cause."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                  />
                </div>
                <div>
                  <label
                    htmlFor="new-level-select"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Nivel CEFR
                  </label>
                  <select
                    id="new-level-select"
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value as CEFRLevel)}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg bg-white"
                  >
                    {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CEFRLevel[]).map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {formError && (
                <p role="alert" className="text-xs font-medium text-rose-700">
                  ■ {formError}
                </p>
              )}

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-sky-700 rounded-lg hover:bg-sky-800 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Guardar Tarjeta en Repetición Espaciada</span>
              </button>
            </form>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                Inventario del Mazo ({srsCards.length} tarjetas)
              </h3>
              <span className="text-xs font-mono text-emerald-700 tabular-nums">
                {srsCards.filter((c) => c.dueStatus === 'mastered').length} dominadas
              </span>
            </div>
            <div className="divide-y divide-slate-200 max-h-64 overflow-y-auto">
              {srsCards.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setActiveCardIndex(i);
                    setShowCardBack(false);
                    setClozeVerified(null);
                  }}
                  className="w-full py-2.5 text-left flex items-center justify-between gap-2 hover:bg-slate-50 px-2 rounded transition-colors cursor-pointer"
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-900 font-mono">
                      {c.termEn}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate max-w-[220px]">
                      {c.meaningEs}
                    </p>
                  </div>
                  <span
                    className={`text-[11px] font-mono font-semibold whitespace-nowrap ${
                      c.dueStatus === 'mastered'
                        ? 'text-emerald-700'
                        : c.dueStatus === 'learning'
                        ? 'text-amber-700'
                        : 'text-sky-700'
                    }`}
                  >
                    {c.level} · {c.intervalDays}d
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
