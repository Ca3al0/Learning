import React, { useState } from 'react';
import {
  IMMERSION_SCENARIOS,
  SRSCard,
} from '../lib/curriculumData';
import {
  analyzeEnglishTextDeterministic,
  checkExerciseAnswer,
  TextAnalysisResult,
} from '../lib/linguisticEngine';
import { Sparkles, Volume2, PlusCircle, CheckCircle2, FileText } from 'lucide-react';

interface LinguisticAnalyzerLabProps {
  onAddSRSCard: (card: SRSCard) => void;
  onAnalysisCompleted: (result: TextAnalysisResult) => void;
}

export const LinguisticAnalyzerLab: React.FC<LinguisticAnalyzerLabProps> = ({
  onAddSRSCard,
  onAnalysisCompleted,
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    IMMERSION_SCENARIOS[0].id
  );
  const [inputText, setInputText] = useState<string>(
    IMMERSION_SCENARIOS[0].sampleDraftEn
  );
  const [analysis, setAnalysis] = useState<TextAnalysisResult>(() =>
    analyzeEnglishTextDeterministic(IMMERSION_SCENARIOS[0].sampleDraftEn)
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [addedRuleIds, setAddedRuleIds] = useState<string[]>([]);

  // Interactive micro-drill state
  const [drillInput, setDrillInput] = useState<string>('');
  const [drillFeedback, setDrillFeedback] = useState<{
    passed: boolean;
    text: string;
  } | null>(null);

  const currentScenario =
    IMMERSION_SCENARIOS.find((s) => s.id === selectedScenarioId) ||
    IMMERSION_SCENARIOS[0];

  const handleSelectScenario = (scenarioId: string) => {
    const found = IMMERSION_SCENARIOS.find((s) => s.id === scenarioId);
    if (!found) return;
    setSelectedScenarioId(scenarioId);
    setInputText(found.sampleDraftEn);
    setErrorMsg(null);
    setDrillInput('');
    setDrillFeedback(null);
    const immediate = analyzeEnglishTextDeterministic(found.sampleDraftEn);
    setAnalysis(immediate);
    onAnalysisCompleted(immediate);
  };

  const handleAnalyzeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (trimmed.length < 5) {
      setErrorMsg(
        'Por favor escribe al menos una oración completa en inglés (mínimo 5 caracteres) para ejecutar el análisis lingüístico.'
      );
      return;
    }

    setErrorMsg(null);
    setIsAnalyzing(true);
    setDrillInput('');
    setDrillFeedback(null);

    try {
      const response = await fetch('/api/analyze-english', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed }),
      });

      if (response.ok) {
        const data: TextAnalysisResult = await response.json();
        setAnalysis(data);
        onAnalysisCompleted(data);
      } else {
        const fallback = analyzeEnglishTextDeterministic(trimmed);
        setAnalysis(fallback);
        onAnalysisCompleted(fallback);
      }
    } catch {
      const fallback = analyzeEnglishTextDeterministic(trimmed);
      setAnalysis(fallback);
      onAnalysisCompleted(fallback);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.94;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVerifyDrill = () => {
    if (!drillInput.trim()) {
      setDrillFeedback({
        passed: false,
        text: '■ Escribe tu respuesta antes de comprobar el ejercicio.',
      });
      return;
    }
    const passed = checkExerciseAnswer(
      drillInput,
      analysis.practiceDrill.correctAnswer
    );
    setDrillFeedback({
      passed,
      text: passed
        ? `● ¡Excelente! Has corregido el patrón: "${analysis.practiceDrill.correctAnswer}".`
        : `■ Respuesta esperada: "${analysis.practiceDrill.correctAnswer}". ${analysis.practiceDrill.explanationEs}`,
    });
  };

  const handleSaveIssueToSRS = (issueId: string, original: string, correction: string, explanationEs: string) => {
    if (addedRuleIds.includes(issueId)) return;
    const newCard: SRSCard = {
      id: `srs-custom-${Date.now()}`,
      termEn: correction,
      ipa: `Evitar: "${original}"`,
      category: 'Core Vocabulary',
      level: analysis.estimatedLevel,
      meaningEs: explanationEs,
      exampleEn: analysis.correctedVersion,
      exampleEs: 'Oración corregida generada en tu laboratorio de análisis.',
      clozeSentenceEn: `Correct form: ${correction}`,
      clozeAnswer: correction,
      intervalDays: 1,
      easeFactor: 2.5,
      repetitions: 0,
      dueStatus: 'due',
    };
    onAddSRSCard(newCard);
    setAddedRuleIds((prev) => [...prev, issueId]);
  };

  return (
    <div className="space-y-8">
      {/* Scenario Selector & Prompt Input Stage */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Diagnóstico Morfosintáctico y Estilístico</span>
              <span aria-hidden="true">·</span>
              <span>Detección de Interferencias del Español</span>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Analizador Lingüístico y Entrenador de Escritura / Conversación
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
            {IMMERSION_SCENARIOS.map((scen) => (
              <button
                key={scen.id}
                type="button"
                onClick={() => handleSelectScenario(scen.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedScenarioId === scen.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {scen.titleEs.split(' ')[0]} ({scen.levelRange})
              </button>
            ))}
          </div>
        </div>

        {/* Active Prompt Context */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-800">
              Consigna activa: {currentScenario.titleEs}
            </span>
            <span className="font-mono whitespace-nowrap shrink-0">Rango sugerido: {currentScenario.levelRange}</span>
          </div>
          <p className="text-sm font-medium text-slate-900">{currentScenario.promptEn}</p>
          <p className="text-xs text-slate-600">{currentScenario.promptEs}</p>
        </div>

        {/* Form to submit English text for analysis */}
        <form onSubmit={handleAnalyzeSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="english-analyzer-textarea"
                className="text-xs font-semibold text-slate-800"
              >
                Escribe o pega tu texto / transcripción en inglés para analizar:
              </label>
              <button
                type="button"
                onClick={() => {
                  setInputText('');
                  setErrorMsg(null);
                }}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Limpiar texto
              </button>
            </div>
            <textarea
              id="english-analyzer-textarea"
              rows={4}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="Write your response in English here to analyze your grammar, vocabulary, prepositions, and CEFR level..."
              className="w-full p-4 text-sm font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 leading-relaxed"
            />
          </div>

          {errorMsg && (
            <p role="alert" className="text-xs font-medium text-rose-700">
              ■ {errorMsg}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs text-slate-500 font-mono tabular-nums">
              <span>Palabras: {analysis.wordCount}</span>
              <span>·</span>
              <span>Oraciones: {analysis.sentenceCount}</span>
            </div>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-sky-700 rounded-lg hover:bg-sky-800 disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {isAnalyzing ? 'Analizando Estructura...' : 'Analizar mi Inglés Ahora'}
              </span>
            </button>
          </div>
        </form>
      </section>

      {/* Analysis Telemetry & Corrections Output */}
      <div
        data-testid="analysis-results-panel"
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* Left 8 Cols: Corrections & Error Breakdown */}
        <div className="lg:col-span-8 space-y-6">
          {/* Side-by-side Corrected vs C1 Elevated */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <h3 className="text-lg font-semibold text-slate-900">
              Reconstrucción y Elevación Estilística
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="border border-emerald-200 bg-emerald-50/40 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-emerald-800">
                    ● VERSIÓN CORREGIDA NATURAL
                  </span>
                  <button
                    type="button"
                    onClick={() => speakText(analysis.correctedVersion)}
                    aria-label="Escuchar versión corregida"
                    className="inline-flex items-center gap-1 text-xs font-medium text-emerald-800 hover:text-emerald-950 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Audio</span>
                  </button>
                </div>
                <p className="text-sm font-medium text-slate-900 leading-relaxed">
                  {analysis.correctedVersion}
                </p>
              </div>

              <div className="border border-sky-200 bg-sky-50/40 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-sky-800">
                    ▲ REGISTRO ELEVADO (C1 / EJECUTIVO)
                  </span>
                  <button
                    type="button"
                    onClick={() => speakText(analysis.c1ElevatedVersion)}
                    aria-label="Escuchar versión elevada C1"
                    className="inline-flex items-center gap-1 text-xs font-medium text-sky-800 hover:text-sky-950 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Audio</span>
                  </button>
                </div>
                <p className="text-sm font-medium text-slate-900 leading-relaxed">
                  {analysis.c1ElevatedVersion}
                </p>
              </div>
            </div>
          </div>

          {/* Granular Error & Interference Log */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-semibold text-slate-900">
                Diagnóstico de Errores y Patrones Detectados ({analysis.issues.length})
              </h3>
              <span className="text-xs font-mono text-slate-500">
                Explicación contrastiva ES → EN
              </span>
            </div>

            {analysis.issues.length === 0 ? (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-900">
                ● No se detectaron errores gramaticales ni falsos amigos en tu muestra.
                Observa a la derecha las sugerencias para elevar tu vocabulario al nivel C2.
              </div>
            ) : (
              <div className="space-y-4">
                {analysis.issues.map((issue) => {
                  const isSaved = addedRuleIds.includes(issue.id);
                  return (
                    <div
                      key={issue.id}
                      className="border border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50/50"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs font-mono">
                          <span
                            className={`font-semibold ${
                              issue.severity === 'critical'
                                ? 'text-rose-700'
                                : 'text-amber-700'
                            }`}
                          >
                            {issue.severity === 'critical'
                              ? '■ ERROR ESTRUCTURAL'
                              : '▲ AJUSTE DE PRECISIÓN'}
                          </span>
                          <span>·</span>
                          <span className="text-slate-600">{issue.category}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleSaveIssueToSRS(
                              issue.id,
                              issue.originalSnippet,
                              issue.correction,
                              issue.explanationEs
                            )
                          }
                          disabled={isSaved}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-900 disabled:text-emerald-700 cursor-pointer"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>
                            {isSaved
                              ? 'Guardado en Repetición Espaciada'
                              : 'Guardar en mi Mazo SRS'}
                          </span>
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-sm font-mono">
                        <span className="px-2.5 py-1 bg-rose-50 text-rose-900 border border-rose-200 rounded line-through">
                          {issue.originalSnippet}
                        </span>
                        <span className="text-slate-400">→</span>
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded font-semibold">
                          {issue.correction}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed">
                        {issue.explanationEs}
                      </p>
                      <p className="text-[11px] font-mono text-slate-500">
                        Regla: {issue.ruleFormula}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Targeted Remediation Drill */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">
                Micro-Ejercicio Correctivo Personalizado
              </h3>
              <span className="text-xs font-mono text-sky-700">
                Generado a partir de tu texto
              </span>
            </div>
            <p className="text-xs text-slate-600">
              {analysis.practiceDrill.questionEs}
            </p>
            <p className="text-sm font-mono font-semibold text-slate-900 bg-slate-50 p-3 rounded border border-slate-200">
              {analysis.practiceDrill.promptEn}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <label htmlFor="remediation-drill-input" className="sr-only">
                Respuesta al micro-ejercicio correctivo
              </label>
              <input
                id="remediation-drill-input"
                type="text"
                value={drillInput}
                onChange={(e) => setDrillInput(e.target.value)}
                placeholder="Escribe la corrección aquí..."
                className="flex-1 px-3.5 py-2 text-sm font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
              />
              <button
                type="button"
                onClick={handleVerifyDrill}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Comprobar Corrección</span>
              </button>
            </div>

            {drillFeedback && (
              <div
                className={`p-3 rounded-lg text-xs border ${
                  drillFeedback.passed
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                {drillFeedback.text}
              </div>
            )}
          </div>
        </div>

        {/* Right 4 Cols: Quantitative Metrics & Lexical Upgrades */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 text-white rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <p className="text-xs font-mono text-sky-400">NIVEL ESTIMADO DE MUESTRA</p>
                <p className="text-3xl font-bold mt-1">{analysis.estimatedLevel}</p>
              </div>
              <div className="text-right font-mono">
                <p className="text-xs text-slate-400">Índice Global</p>
                <p className="text-3xl font-bold text-emerald-400 tabular-nums">
                  {analysis.overallScore}/100
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {[
                {
                  label: 'Precisión Gramatical',
                  val: analysis.metrics.grammarAccuracy,
                },
                {
                  label: 'Sofisticación Léxica',
                  val: analysis.metrics.lexicalSophistication,
                },
                {
                  label: 'Cohesión y Sintaxis',
                  val: analysis.metrics.cohesionAndSyntax,
                },
                {
                  label: 'Naturalidad Idiomática',
                  val: analysis.metrics.idiomaticNaturalness,
                },
              ].map((m) => (
                <div key={m.label} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-300">{m.label}</span>
                    <span className="font-mono font-semibold tabular-nums">
                      {m.val}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-400 rounded-full"
                      style={{ width: `${m.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-1.5">
              <p className="text-xs font-mono text-sky-400">SIGUIENTE PASO RECOMENDADO</p>
              <p className="text-xs text-slate-200 leading-relaxed">
                {analysis.nextFocusEs}
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-700" />
              <h3 className="text-base font-semibold text-slate-900">
                Enriquecimiento Léxico (B2 → C2)
              </h3>
            </div>
            <div className="space-y-3">
              {analysis.lexicalUpgrades.map((upg) => (
                <div
                  key={upg.basicWord}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5"
                >
                  <p className="text-xs font-mono text-slate-500">
                    En lugar de: <span className="text-slate-800 font-semibold">{upg.basicWord}</span>
                  </p>
                  <p className="text-xs font-mono font-semibold text-sky-800">
                    Usa: {upg.advancedAlternatives.join(' · ')}
                  </p>
                  <p className="text-xs text-slate-600">{upg.contextNoteEs}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
