import React, { useState } from 'react';
import {
  CEFR_LEVEL_META,
  CEFRLevel,
  DIAGNOSTIC_QUESTIONS,
  SKILL_PILLAR_META,
  SkillPillar,
} from '../lib/curriculumData';
import {
  DiagnosticEvaluation,
  evaluateDiagnosticAnswers,
} from '../lib/linguisticEngine';
import { CheckCircle2, ArrowRight, RotateCcw, BookOpen, Sparkles } from 'lucide-react';

interface DiagnosticDashboardProps {
  currentLevel: CEFRLevel;
  pillarScores: Record<SkillPillar, number>;
  completedModuleIds: string[];
  totalModules: number;
  masteredCardsCount: number;
  totalCardsCount: number;
  onApplyDiagnostic: (evaluation: DiagnosticEvaluation) => void;
  onNavigateToCurriculum: (level: CEFRLevel, pillar?: SkillPillar) => void;
  onNavigateToAnalyzer: () => void;
  showDiagnosticModalInit?: boolean;
}

export const DiagnosticDashboard: React.FC<DiagnosticDashboardProps> = ({
  currentLevel,
  pillarScores,
  completedModuleIds,
  totalModules,
  masteredCardsCount,
  totalCardsCount,
  onApplyDiagnostic,
  onNavigateToCurriculum,
  onNavigateToAnalyzer,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({
    'diag-a1': 1,
    'diag-a2': 2,
    'diag-b1': 1,
  });
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticEvaluation | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const levelMeta = CEFR_LEVEL_META[currentLevel];
  const averageMastery = Math.round(
    Object.values(pillarScores).reduce((acc, v) => acc + v, 0) / 6
  );

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    setValidationMessage(null);
  };

  const handleRunDiagnostic = (e: React.FormEvent) => {
    e.preventDefault();
    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount === 0) {
      setValidationMessage(
        'Selecciona al menos una respuesta en el test diagnóstico para calcular tu perfil.'
      );
      return;
    }
    const evaluation = evaluateDiagnosticAnswers(selectedAnswers);
    setDiagnosticResult(evaluation);
    onApplyDiagnostic(evaluation);
  };

  const handleLoadFullC1Sample = () => {
    const sample: Record<string, number> = {
      'diag-a1': 1,
      'diag-a2': 2,
      'diag-b1': 1,
      'diag-b2': 2,
      'diag-c1': 1,
      'diag-c2': 0,
    };
    setSelectedAnswers(sample);
    const evaluation = evaluateDiagnosticAnswers(sample);
    setDiagnosticResult(evaluation);
    onApplyDiagnostic(evaluation);
  };

  const handleResetDiagnostic = () => {
    setSelectedAnswers({});
    setDiagnosticResult(null);
    setValidationMessage(null);
  };

  const getPillarStatusLabel = (score: number) => {
    if (score >= 80) {
      return { text: '● DOMINADO', colorClass: 'text-emerald-700' };
    }
    if (score >= 60) {
      return { text: '▲ EN PRÁCTICA', colorClass: 'text-amber-700' };
    }
    return { text: '■ PRIORIDAD', colorClass: 'text-rose-700' };
  };

  return (
    <div className="space-y-10">
      {/* Hero Split Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white border border-slate-200 rounded-xl p-6 lg:p-8">
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span>Marco Común Europeo (MCER / CEFR)</span>
              <span aria-hidden="true">·</span>
              <span>Ruta Integral A1 a C2</span>
              <span aria-hidden="true">·</span>
              <span>Diagnóstico Continuo</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              Domina el inglés en su totalidad con análisis lingüístico adaptativo.
            </h1>
            <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
              Albion evalúa tu precisión gramatical, riqueza léxica, pronunciación IPA y
              comprensión real para enseñarte desde las bases estructurales (A1) hasta la
              maestría estilística bilingüe (C2).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigateToCurriculum(currentLevel)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-sky-700 rounded-lg hover:bg-sky-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Estudiar Nivel {currentLevel}</span>
            </button>
            <button
              type="button"
              onClick={onNavigateToAnalyzer}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-800 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-sky-700" />
              <span>Analizar mi Inglés Escrito</span>
            </button>
          </div>
        </div>

        {/* Right Column: Current CEFR Profile Card */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-lg p-6 flex flex-col justify-between space-y-5">
          <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <p className="text-xs font-medium text-slate-500">
                Nivel Diagnosticado Actual
              </p>
              <h2 className="text-2xl font-bold text-slate-900 mt-0.5">
                {levelMeta.code} — {levelMeta.nameEs}
              </h2>
            </div>
            <span className="font-mono text-2xl font-semibold text-sky-700 tabular-nums">
              {averageMastery}%
            </span>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            {levelMeta.canDoEs}
          </p>

          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-200 text-left">
            <div>
              <p className="text-xs text-slate-500">Meta Léxica</p>
              <p className="font-mono text-base font-semibold text-slate-900 tabular-nums mt-0.5">
                {levelMeta.targetLexicon.toLocaleString()} pal.
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Módulos</p>
              <p className="font-mono text-base font-semibold text-slate-900 tabular-nums mt-0.5">
                {completedModuleIds.length} / {totalModules}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Vocabulario SRS</p>
              <p className="font-mono text-base font-semibold text-slate-900 tabular-nums mt-0.5">
                {masteredCardsCount} / {totalCardsCount}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Pillars Linguistic Breakdown */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Radiografía de Competencias Lingüísticas (6 Pilares)
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Haz clic en cualquier competencia para abrir sus módulos prácticos correspondientes.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-slate-600">
            <span className="text-emerald-700">● DOMINADO (&ge;80%)</span>
            <span>·</span>
            <span className="text-amber-700">▲ EN PRÁCTICA (60–79%)</span>
            <span>·</span>
            <span className="text-rose-700">■ PRIORIDAD (&lt;60%)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(Object.keys(SKILL_PILLAR_META) as SkillPillar[]).map((pillarKey) => {
            const meta = SKILL_PILLAR_META[pillarKey];
            const score = pillarScores[pillarKey] ?? 50;
            const status = getPillarStatusLabel(score);

            return (
              <div
                key={pillarKey}
                className="border border-slate-200 rounded-lg p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-medium text-slate-500">
                      {meta.labelEn}
                    </span>
                    <span className={`text-xs font-mono font-semibold ${status.colorClass}`}>
                      {status.text}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {meta.labelEs}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {meta.focusEs}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Índice de dominio</span>
                    <span className="font-mono font-semibold text-slate-900 tabular-nums">
                      {score}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-transform duration-200 ${
                        score >= 80
                          ? 'bg-emerald-600'
                          : score >= 60
                          ? 'bg-sky-600'
                          : 'bg-amber-600'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(8, score))}%` }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigateToCurriculum(currentLevel, pillarKey)}
                    className="w-full inline-flex items-center justify-between text-xs font-semibold text-sky-700 hover:text-sky-900 pt-1 cursor-pointer"
                  >
                    <span>Practicar este pilar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Adaptive Placement Evaluation (A1 to C2) */}
      <section
        id="diagnostic-test-section"
        className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Evaluación Calibrada</span>
              <span aria-hidden="true">·</span>
              <span>6 Niveles Progresivos (A1 → C2)</span>
            </div>
            <h2 className="text-xl font-semibold text-slate-900">
              Test de Diagnóstico y Nivelación Gramatical / Léxica
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadFullC1Sample}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Simular Perfil Avanzado (C1)
            </button>
            <button
              type="button"
              onClick={handleResetDiagnostic}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar Respuestas</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleRunDiagnostic} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {DIAGNOSTIC_QUESTIONS.map((q, index) => {
              const chosenIndex = selectedAnswers[q.id];
              const isSubmitted = diagnosticResult !== null;
              const isCorrect = chosenIndex === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className="border border-slate-200 rounded-lg p-5 space-y-4 bg-slate-50/50"
                >
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                    <span className="font-mono font-semibold text-slate-800">
                      0{index + 1}. Nivel {q.level}
                    </span>
                    <span>{SKILL_PILLAR_META[q.pillar].labelEs}</span>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-slate-600">{q.promptEs}</p>
                    <p className="text-sm font-semibold text-slate-900 font-mono bg-white p-3 rounded border border-slate-200">
                      {q.sentenceEn}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5" role="radiogroup" aria-label={q.promptEs}>
                    {q.options.map((option, optIdx) => {
                      const isSelected = chosenIndex === optIdx;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          aria-pressed={isSelected}
                          className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-sky-700 text-white border-sky-700'
                              : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  {isSubmitted && (
                    <div
                      className={`p-3 rounded-lg text-xs space-y-1 border ${
                        isCorrect
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-amber-50 border-amber-200 text-amber-900'
                      }`}
                    >
                      <p className="font-semibold font-mono">
                        {isCorrect
                          ? '● CORRECTO'
                          : `■ REVISAR — Respuesta correcta: "${q.options[q.correctIndex]}"`}
                      </p>
                      <p>{q.explanationEs}</p>
                      <p className="font-mono text-[11px] opacity-80">
                        Fórmula: {q.grammarRule}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {validationMessage && (
            <p role="alert" className="text-xs font-medium text-rose-700">
              ■ {validationMessage}
            </p>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              Respondidas: <span className="font-mono font-semibold tabular-nums">{Object.keys(selectedAnswers).length} / {DIAGNOSTIC_QUESTIONS.length}</span> preguntas de calibración.
            </p>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Calcular Diagnóstico y Actualizar Nivel</span>
            </button>
          </div>
        </form>

        {diagnosticResult && (
          <div
            data-testid="diagnostic-result-banner"
            className="bg-slate-900 text-white rounded-xl p-6 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <p className="text-xs font-mono text-sky-400">
                  RESULTADO DEL DIAGNÓSTICO ADAPTATIVO
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  Nivel Asignado: {diagnosticResult.assignedLevel} ({CEFR_LEVEL_META[diagnosticResult.assignedLevel].nameEs})
                </h3>
              </div>
              <div className="text-left sm:text-right font-mono">
                <p className="text-xs text-slate-400">Precisión en Prueba</p>
                <p className="text-2xl font-bold text-emerald-400 tabular-nums">
                  {diagnosticResult.correctCount} / {diagnosticResult.totalQuestions} ({diagnosticResult.scorePercentage}%)
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed">
              {diagnosticResult.feedbackSummaryEs}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="text-xs text-slate-300">
                <span>Áreas prioritarias detectadas: </span>
                <span className="font-semibold text-white">
                  {diagnosticResult.weakPillars
                    .map((p) => SKILL_PILLAR_META[p].labelEs)
                    .join(' · ')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToCurriculum(diagnosticResult.recommendedModuleLevel)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-900 bg-white rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Ir a Módulos de Nivel {diagnosticResult.recommendedModuleLevel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
