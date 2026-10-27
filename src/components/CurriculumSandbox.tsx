import React, { useState, useEffect } from 'react';
import {
  CEFR_LEVEL_META,
  CEFRLevel,
  CURRICULUM_MODULES,
  LessonModule,
  SKILL_PILLAR_META,
  SkillPillar,
} from '../lib/curriculumData';
import { checkExerciseAnswer } from '../lib/linguisticEngine';
import { Volume2, CheckCircle2, HelpCircle, ArrowRight } from 'lucide-react';

interface CurriculumSandboxProps {
  selectedLevel: CEFRLevel;
  selectedPillarFilter: SkillPillar | 'all';
  completedModuleIds: string[];
  onSelectLevel: (level: CEFRLevel) => void;
  onSelectPillarFilter: (pillar: SkillPillar | 'all') => void;
  onCompleteModule: (moduleId: string, pillar: SkillPillar) => void;
}

export const CurriculumSandbox: React.FC<CurriculumSandboxProps> = ({
  selectedLevel,
  selectedPillarFilter,
  completedModuleIds,
  onSelectLevel,
  onSelectPillarFilter,
  onCompleteModule,
}) => {
  const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  const filteredModules = CURRICULUM_MODULES.filter((m) => {
    const matchesLevel = m.level === selectedLevel;
    const matchesPillar =
      selectedPillarFilter === 'all' || m.pillar === selectedPillarFilter;
    return matchesLevel && matchesPillar;
  });

  const activeModulesList =
    filteredModules.length > 0
      ? filteredModules
      : CURRICULUM_MODULES.filter((m) => m.level === selectedLevel);

  const [activeModuleId, setActiveModuleId] = useState<string>(
    activeModulesList[0]?.id || CURRICULUM_MODULES[0].id
  );
  const [exerciseInputs, setExerciseInputs] = useState<Record<string, string>>({});
  const [exerciseFeedback, setExerciseFeedback] = useState<
    Record<string, { passed: boolean; messageEs: string }>
  >({});
  const [visibleHints, setVisibleHints] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const firstForLevel = CURRICULUM_MODULES.find(
      (m) =>
        m.level === selectedLevel &&
        (selectedPillarFilter === 'all' || m.pillar === selectedPillarFilter)
    );
    if (firstForLevel) {
      setActiveModuleId(firstForLevel.id);
    } else {
      const fallback = CURRICULUM_MODULES.find((m) => m.level === selectedLevel);
      if (fallback) setActiveModuleId(fallback.id);
    }
  }, [selectedLevel, selectedPillarFilter]);

  const currentModule: LessonModule =
    CURRICULUM_MODULES.find((m) => m.id === activeModuleId) || CURRICULUM_MODULES[0];

  const speakEnglish = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-GB';
      utterance.rate = 0.92;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVerifyExercise = (exerciseId: string) => {
    const exercise = currentModule.exercises.find((e) => e.id === exerciseId);
    if (!exercise) return;

    const userInput = exerciseInputs[exerciseId] || '';
    if (!userInput.trim()) {
      setExerciseFeedback((prev) => ({
        ...prev,
        [exerciseId]: {
          passed: false,
          messageEs: '■ Escribe o selecciona una respuesta antes de verificar.',
        },
      }));
      return;
    }

    const isCorrect = checkExerciseAnswer(
      userInput,
      exercise.correctAnswer,
      exercise.acceptedAlternatives
    );

    setExerciseFeedback((prev) => {
      const updated = {
        ...prev,
        [exerciseId]: {
          passed: isCorrect,
          messageEs: isCorrect
            ? `● ¡Correcto! ${exercise.explanationEs}`
            : `■ Respuesta inexacta. Solución esperada: "${exercise.correctAnswer}". ${exercise.explanationEs}`,
        },
      };

      const allPassed = currentModule.exercises.every(
        (ex) => updated[ex.id]?.passed
      );
      if (allPassed) {
        onCompleteModule(currentModule.id, currentModule.pillar);
      }
      return updated;
    });
  };

  const levelMeta = CEFR_LEVEL_META[selectedLevel];
  const isModuleCompleted = completedModuleIds.includes(currentModule.id);

  return (
    <div className="space-y-8">
      {/* Level & Pillar Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500">
            Selección de Nivel MCER / CEFR
          </p>
          <div
            className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg"
            role="tablist"
            aria-label="Niveles de inglés A1 a C2"
          >
            {levels.map((lvl) => {
              const active = selectedLevel === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onSelectLevel(lvl)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Nivel {lvl}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500">
            Filtrar por Pilar Lingüístico
          </p>
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => onSelectPillarFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedPillarFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos
            </button>
            {(['grammar', 'vocabulary', 'speaking', 'writing', 'reading'] as SkillPillar[]).map(
              (pillar) => (
                <button
                  key={pillar}
                  type="button"
                  onClick={() => onSelectPillarFilter(pillar)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedPillarFilter === pillar
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {SKILL_PILLAR_META[pillar].labelEs.split(' ')[0]}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Two-Zone Educational Sandbox Layout (65% Left Interactive Stage / 35% Right Concept Deck) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Zone (65% -> 8 cols): Interactive Lesson & Exercise Stage */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-8">
          {/* Clean Unboxed Metadata Header */}
          <div className="space-y-3 border-b border-slate-200 pb-6">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-sky-700">
                  Nivel {currentModule.level}
                </span>
                <span aria-hidden="true">·</span>
                <span>{currentModule.pillarLabelEs}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{currentModule.durationMin} min</span>
              </div>
              <span
                className={`font-mono font-semibold ${
                  isModuleCompleted ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {isModuleCompleted ? '● MÓDULO COMPLETADO' : '▲ EN CURSO'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              {currentModule.titleEs}
            </h2>
            <p className="text-xs font-mono text-slate-500">{currentModule.titleEn}</p>
            <p className="text-sm text-slate-600 leading-relaxed pt-1">
              {currentModule.summaryEs}
            </p>

            {/* Formula Box */}
            <div className="bg-slate-900 text-slate-100 rounded-lg p-4 mt-4">
              <p className="text-[11px] font-mono text-sky-400">
                ARQUITECTURA SINTÁCTICA / FÓRMULA NUCLEAR
              </p>
              <p className="font-mono text-sm font-medium mt-1">
                {currentModule.syntaxFormula}
              </p>
            </div>
          </div>

          {/* Core Pedagogical Concepts */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Lección Magistral y Ejemplos Pronunciados
            </h3>

            <div className="space-y-4">
              {currentModule.coreConcepts.map((concept) => (
                <div
                  key={concept.headingEs}
                  className="border border-slate-200 rounded-lg p-5 space-y-3 bg-slate-50/40"
                >
                  <h4 className="text-base font-semibold text-slate-900">
                    {concept.headingEs}
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {concept.explanationEs}
                  </p>
                  <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-900">
                        “{concept.exampleEn}”
                      </p>
                      {concept.ipaNote && (
                        <p className="text-xs font-mono text-sky-700">{concept.ipaNote}</p>
                      )}
                      <p className="text-xs text-slate-500">{concept.exampleEs}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => speakEnglish(concept.exampleEn)}
                      aria-label={`Escuchar pronunciación de ${concept.exampleEn}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-sky-700" />
                      <span>Escuchar Audio</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Common Spanish-Speaker Interference Contrast */}
          <div className="border border-slate-200 rounded-lg p-5 space-y-3 bg-slate-50">
            <p className="text-xs font-mono font-semibold text-slate-700">
              CONTRASTE DE INTERFERENCIA HISPANOHABLANTE
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-rose-50/70 border border-rose-200 rounded-lg p-3.5 space-y-1">
                <p className="text-xs font-mono font-semibold text-rose-800">
                  ■ EVITAR (Traducción literal)
                </p>
                <p className="text-sm font-mono text-rose-950 line-through">
                  {currentModule.commonMistakeEs.wrongEn}
                </p>
              </div>
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3.5 space-y-1">
                <p className="text-xs font-mono font-semibold text-emerald-800">
                  ● FORMA NATIVA CORRECTA
                </p>
                <p className="text-sm font-mono font-semibold text-emerald-950">
                  {currentModule.commonMistakeEs.rightEn}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 pt-1">
              {currentModule.commonMistakeEs.whyEs}
            </p>
          </div>

          {/* Interactive Exercises */}
          <div className="space-y-6 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Laboratorio de Práctica Verificada
              </h3>
              <span className="text-xs text-slate-500 font-mono tabular-nums">
                {currentModule.exercises.length} ejercicios interactivos
              </span>
            </div>

            <div className="space-y-6">
              {currentModule.exercises.map((ex, idx) => {
                const feedback = exerciseFeedback[ex.id];
                const currentVal = exerciseInputs[ex.id] || '';

                return (
                  <div
                    key={ex.id}
                    className="border border-slate-200 rounded-lg p-5 space-y-4 bg-white"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono font-semibold text-slate-700">
                        Ejercicio 0{idx + 1} ·{' '}
                        {ex.type === 'multiple_choice'
                          ? 'Selección Múltiple'
                          : ex.type === 'error_correction'
                          ? 'Corrección de Error'
                          : 'Transformación Sintáctica'}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setVisibleHints((prev) => ({
                            ...prev,
                            [ex.id]: !prev[ex.id],
                          }))
                        }
                        className="inline-flex items-center gap-1 text-xs font-medium text-sky-700 hover:text-sky-900 cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{visibleHints[ex.id] ? 'Ocultar Pista' : 'Ver Pista'}</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-600">{ex.instructionEs}</p>
                    <p className="text-sm font-mono font-semibold text-slate-900 bg-slate-50 p-3 rounded border border-slate-200">
                      {ex.promptEn}
                    </p>

                    {visibleHints[ex.id] && (
                      <p className="text-xs text-sky-800 bg-sky-50 border border-sky-200 rounded p-2.5">
                        Pista: {ex.hintEs}
                      </p>
                    )}

                    {ex.type === 'multiple_choice' && ex.options ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {ex.options.map((opt) => {
                          const selected = currentVal === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() =>
                                setExerciseInputs((prev) => ({
                                  ...prev,
                                  [ex.id]: opt,
                                }))
                              }
                              className={`px-3.5 py-2.5 text-xs font-mono font-medium rounded-lg border text-left transition-colors cursor-pointer ${
                                selected
                                  ? 'bg-sky-700 text-white border-sky-700'
                                  : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div>
                        <label htmlFor={`input-${ex.id}`} className="sr-only">
                          Respuesta en inglés para el ejercicio {idx + 1}
                        </label>
                        <input
                          id={`input-${ex.id}`}
                          type="text"
                          value={currentVal}
                          onChange={(e) =>
                            setExerciseInputs((prev) => ({
                              ...prev,
                              [ex.id]: e.target.value,
                            }))
                          }
                          placeholder="Escribe la oración correcta en inglés..."
                          className="w-full px-3.5 py-2.5 text-sm font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => handleVerifyExercise(ex.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verificar Respuesta</span>
                      </button>

                      {!feedback?.passed && (
                        <button
                          type="button"
                          onClick={() => {
                            setExerciseInputs((prev) => ({
                              ...prev,
                              [ex.id]: ex.correctAnswer,
                            }));
                          }}
                          className="text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                          Autocompletar ejemplo
                        </button>
                      )}
                    </div>

                    {feedback && (
                      <div
                        className={`p-3.5 rounded-lg text-xs border ${
                          feedback.passed
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                            : 'bg-rose-50 border-rose-200 text-rose-900'
                        }`}
                      >
                        {feedback.messageEs}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Zone (35% -> 4 cols): Concept & Level Deck */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <p className="text-xs font-mono text-sky-700 font-semibold">
                ESPECIFICACIÓN DEL NIVEL {levelMeta.code}
              </p>
              <h3 className="text-lg font-semibold text-slate-900 mt-0.5">
                {levelMeta.nameEs}
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {levelMeta.subtitleEs}
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-1.5">
              <p className="text-xs font-semibold text-slate-800">
                Competencia Comunicativa (Can-Do):
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {levelMeta.canDoEs}
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-semibold text-slate-900">
              Catálogo Completo de Módulos (A1–C2)
            </h3>
            <div className="space-y-2.5">
              {CURRICULUM_MODULES.map((mod) => {
                const isCurrent = mod.id === currentModule.id;
                const done = completedModuleIds.includes(mod.id);
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => {
                      onSelectLevel(mod.level);
                      setActiveModuleId(mod.id);
                    }}
                    className={`w-full text-left p-3.5 rounded-lg border transition-colors cursor-pointer ${
                      isCurrent
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50/70 text-slate-800 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono opacity-80 mb-1">
                      <span>
                        Nivel {mod.level} · {mod.pillarLabelEs}
                      </span>
                      <span>{done ? '● COMPLETADO' : `${mod.durationMin}m`}</span>
                    </div>
                    <p className="text-xs font-semibold">{mod.titleEs}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Acción Manual de Dominio
            </h3>
            <p className="text-xs text-slate-600">
              Si ya dominas los conceptos teóricos de este módulo, puedes marcarlo como
              completado para actualizar tu radiografía de nivel.
            </p>
            <button
              type="button"
              onClick={() => onCompleteModule(currentModule.id, currentModule.pillar)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-sky-800 bg-sky-50 border border-sky-200 rounded-lg hover:bg-sky-100 transition-colors cursor-pointer"
            >
              <span>
                {isModuleCompleted
                  ? '● Módulo Registrado como Dominado'
                  : 'Marcar Módulo como Dominado'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
