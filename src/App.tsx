import React, { useState } from 'react';
import {
  CEFRLevel,
  CURRICULUM_MODULES,
  INITIAL_SRS_CARDS,
  SkillPillar,
  SRSCard,
} from './lib/curriculumData';
import {
  DiagnosticEvaluation,
  TextAnalysisResult,
} from './lib/linguisticEngine';
import { DiagnosticDashboard } from './components/DiagnosticDashboard';
import { CurriculumSandbox } from './components/CurriculumSandbox';
import { LinguisticAnalyzerLab } from './components/LinguisticAnalyzerLab';
import { PhoneticsAndSRSView } from './components/PhoneticsAndSRSView';

type ActiveSection = 'dashboard' | 'curriculum' | 'analyzer' | 'phonetics';

export function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [currentLevel, setCurrentLevel] = useState<CEFRLevel>('B1');
  const [selectedPillarFilter, setSelectedPillarFilter] = useState<
    SkillPillar | 'all'
  >('all');
  const [completedModuleIds, setCompletedModuleIds] = useState<string[]>([
    'mod-a1-core-be-have',
  ]);
  const [srsCards, setSrsCards] = useState<SRSCard[]>(INITIAL_SRS_CARDS);

  const [pillarScores, setPillarScores] = useState<Record<SkillPillar, number>>({
    grammar: 68,
    vocabulary: 62,
    listening: 70,
    speaking: 58,
    reading: 76,
    writing: 55,
  });

  const handleApplyDiagnostic = (evaluation: DiagnosticEvaluation) => {
    setCurrentLevel(evaluation.assignedLevel);
    setPillarScores(evaluation.pillarScores);
  };

  const handleNavigateToCurriculum = (
    level: CEFRLevel,
    pillar?: SkillPillar
  ) => {
    setCurrentLevel(level);
    setSelectedPillarFilter(pillar || 'all');
    setActiveSection('curriculum');
  };

  const handleCompleteModule = (moduleId: string, pillar: SkillPillar) => {
    setCompletedModuleIds((prev) =>
      prev.includes(moduleId) ? prev : [...prev, moduleId]
    );
    setPillarScores((prev) => ({
      ...prev,
      [pillar]: Math.min(100, (prev[pillar] || 60) + 8),
    }));
  };

  const handleAnalysisCompleted = (result: TextAnalysisResult) => {
    setPillarScores((prev) => ({
      ...prev,
      writing: result.metrics.cohesionAndSyntax,
      grammar: result.metrics.grammarAccuracy,
      vocabulary: result.metrics.lexicalSophistication,
    }));
  };

  const handleUpdateSRSCard = (updated: SRSCard) => {
    setSrsCards((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  };

  const handleAddSRSCard = (newCard: SRSCard) => {
    setSrsCards((prev) => [newCard, ...prev]);
  };

  const masteredCardsCount = srsCards.filter(
    (c) => c.dueStatus === 'mastered'
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      {/* Strict Top Bar Contract: 1 row, 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveSection('dashboard');
            }}
            className="font-display text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            Albion Academy
          </a>

          {/* Zone 2: 4 clean single-line text navigation links */}
          <nav
            aria-label="Navegación principal"
            className="flex items-center gap-6 text-sm font-medium text-slate-600 overflow-x-auto"
          >
            <button
              type="button"
              onClick={() => setActiveSection('dashboard')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                activeSection === 'dashboard'
                  ? 'text-slate-900 border-sky-700 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Diagnóstico y Panel
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('curriculum')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                activeSection === 'curriculum'
                  ? 'text-slate-900 border-sky-700 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Currículo A1–C2
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('analyzer')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                activeSection === 'analyzer'
                  ? 'text-slate-900 border-sky-700 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Analizador Lingüístico
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('phonetics')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                activeSection === 'phonetics'
                  ? 'text-slate-900 border-sky-700 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Fonética y Vocabulario
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => {
                setActiveSection('dashboard');
                setTimeout(() => {
                  document
                    .getElementById('diagnostic-test-section')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Evaluar mi Nivel
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {activeSection === 'dashboard' && (
          <DiagnosticDashboard
            currentLevel={currentLevel}
            pillarScores={pillarScores}
            completedModuleIds={completedModuleIds}
            totalModules={CURRICULUM_MODULES.length}
            masteredCardsCount={masteredCardsCount}
            totalCardsCount={srsCards.length}
            onApplyDiagnostic={handleApplyDiagnostic}
            onNavigateToCurriculum={handleNavigateToCurriculum}
            onNavigateToAnalyzer={() => setActiveSection('analyzer')}
          />
        )}

        {activeSection === 'curriculum' && (
          <CurriculumSandbox
            selectedLevel={currentLevel}
            selectedPillarFilter={selectedPillarFilter}
            completedModuleIds={completedModuleIds}
            onSelectLevel={setCurrentLevel}
            onSelectPillarFilter={setSelectedPillarFilter}
            onCompleteModule={handleCompleteModule}
          />
        )}

        {activeSection === 'analyzer' && (
          <LinguisticAnalyzerLab
            onAddSRSCard={handleAddSRSCard}
            onAnalysisCompleted={handleAnalysisCompleted}
          />
        )}

        {activeSection === 'phonetics' && (
          <PhoneticsAndSRSView
            srsCards={srsCards}
            onUpdateSRSCard={handleUpdateSRSCard}
            onAddSRSCard={handleAddSRSCard}
          />
        )}
      </main>

      {/* Clean Editorial Footer */}
      <footer className="border-t border-slate-200 bg-white mt-16">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            Albion Academy · Sistema Integral de Enseñanza y Diagnóstico del Idioma
            Inglés (Niveles MCER A1–C2)
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveSection('curriculum')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Mapa Curricular
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveSection('analyzer')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Laboratorio Sintáctico
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveSection('phonetics')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Fonética IPA
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default App;
