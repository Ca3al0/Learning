import {
  CEFRLevel,
  DIAGNOSTIC_QUESTIONS,
  SkillPillar,
  SRSCard,
} from './curriculumData';

export interface DetectedIssue {
  id: string;
  category: 'False Friend' | 'Grammar & Tense' | 'Preposition & Collocation' | 'Syntax & Word Order' | 'Register & Style';
  severity: 'critical' | 'moderate' | 'style';
  originalSnippet: string;
  correction: string;
  explanationEs: string;
  ruleFormula: string;
}

export interface LexicalUpgrade {
  basicWord: string;
  advancedAlternatives: string[];
  contextNoteEs: string;
}

export interface TextAnalysisResult {
  estimatedLevel: CEFRLevel;
  overallScore: number;
  metrics: {
    grammarAccuracy: number;
    lexicalSophistication: number;
    cohesionAndSyntax: number;
    idiomaticNaturalness: number;
  };
  wordCount: number;
  sentenceCount: number;
  correctedVersion: string;
  c1ElevatedVersion: string;
  issues: DetectedIssue[];
  lexicalUpgrades: LexicalUpgrade[];
  strengthsEs: string[];
  nextFocusEs: string;
  practiceDrill: {
    questionEs: string;
    promptEn: string;
    correctAnswer: string;
    explanationEs: string;
  };
}

export interface DiagnosticEvaluation {
  assignedLevel: CEFRLevel;
  scorePercentage: number;
  correctCount: number;
  totalQuestions: number;
  pillarScores: Record<SkillPillar, number>;
  weakPillars: SkillPillar[];
  feedbackSummaryEs: string;
  recommendedModuleLevel: CEFRLevel;
}

const LEVEL_ORDER: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export function evaluateDiagnosticAnswers(
  selectedOptionIndices: Record<string, number>
): DiagnosticEvaluation {
  let correctCount = 0;
  let weightedPoints = 0;
  let maxWeightedPoints = 0;

  const pillarTotals: Record<SkillPillar, { earned: number; max: number }> = {
    grammar: { earned: 0, max: 0 },
    vocabulary: { earned: 0, max: 0 },
    listening: { earned: 68, max: 100 },
    speaking: { earned: 65, max: 100 },
    reading: { earned: 72, max: 100 },
    writing: { earned: 0, max: 0 },
  };

  DIAGNOSTIC_QUESTIONS.forEach((q, idx) => {
    const weight = idx + 1; // A1=1 ... C2=6
    maxWeightedPoints += weight;
    pillarTotals[q.pillar].max += 100;

    const chosen = selectedOptionIndices[q.id];
    if (chosen === q.correctIndex) {
      correctCount += 1;
      weightedPoints += weight;
      pillarTotals[q.pillar].earned += 100;
    } else {
      pillarTotals[q.pillar].earned += 30;
    }
  });

  const ratio = maxWeightedPoints > 0 ? weightedPoints / maxWeightedPoints : 0;
  const scorePercentage = Math.round((correctCount / DIAGNOSTIC_QUESTIONS.length) * 100);

  let assignedLevel: CEFRLevel = 'A1';
  if (ratio >= 0.9) assignedLevel = 'C2';
  else if (ratio >= 0.75) assignedLevel = 'C1';
  else if (ratio >= 0.55) assignedLevel = 'B2';
  else if (ratio >= 0.38) assignedLevel = 'B1';
  else if (ratio >= 0.2) assignedLevel = 'A2';
  else assignedLevel = 'A1';

  const baseLevelScore = (LEVEL_ORDER.indexOf(assignedLevel) + 1) * 14;

  const pillarScores: Record<SkillPillar, number> = {
    grammar:
      pillarTotals.grammar.max > 0
        ? Math.round(pillarTotals.grammar.earned / (pillarTotals.grammar.max / 100))
        : baseLevelScore,
    vocabulary:
      pillarTotals.vocabulary.max > 0
        ? Math.round(pillarTotals.vocabulary.earned / (pillarTotals.vocabulary.max / 100))
        : baseLevelScore,
    listening: Math.min(96, Math.max(35, baseLevelScore + 8)),
    speaking: Math.min(94, Math.max(32, baseLevelScore + 4)),
    reading: Math.min(98, Math.max(40, baseLevelScore + 12)),
    writing:
      pillarTotals.writing.max > 0
        ? Math.round(pillarTotals.writing.earned / (pillarTotals.writing.max / 100))
        : baseLevelScore,
  };

  const weakPillars = (Object.keys(pillarScores) as SkillPillar[])
    .filter((p) => pillarScores[p] < 75)
    .sort((a, b) => pillarScores[a] - pillarScores[b]);

  const feedbackSummaryEs =
    assignedLevel === 'A1' || assignedLevel === 'A2'
      ? `Tu diagnóstico te sitúa en el nivel ${assignedLevel}. Tienes bases iniciales, pero necesitas consolidar la arquitectura verbal (To Be vs Have, Past Simple vs Present Perfect) y evitar traducciones literales del español.`
      : assignedLevel === 'B1' || assignedLevel === 'B2'
      ? `Tu diagnóstico te sitúa en el nivel ${assignedLevel}. Posees autonomía funcional; el siguiente salto requiere dominar preposiciones dependientes, phrasal verbs, condicionales irreales y reducción vocálica.`
      : `Tu diagnóstico te sitúa en el nivel ${assignedLevel}. Muestras un dominio avanzado de la sintaxis inglesa; tu ruta se enfocará en inversión estilística, subjuntivo mandativo, colocaciones académicas y precisión retórica.`;

  return {
    assignedLevel,
    scorePercentage,
    correctCount,
    totalQuestions: DIAGNOSTIC_QUESTIONS.length,
    pillarScores,
    weakPillars: weakPillars.length > 0 ? weakPillars : ['writing', 'speaking'],
    feedbackSummaryEs,
    recommendedModuleLevel: assignedLevel,
  };
}

interface PatternRule {
  id: string;
  regex: RegExp;
  category: DetectedIssue['category'];
  severity: DetectedIssue['severity'];
  replaceFn: (match: string, ...groups: string[]) => string;
  explanationEs: string;
  ruleFormula: string;
  drillQuestionEs: string;
  drillPromptEn: string;
  drillAnswer: string;
}

const SPANISH_INTERFERENCE_RULES: PatternRule[] = [
  {
    id: 'rule-age-have',
    regex: /\bI have (\d+|twenty|thirty|forty|twenty-\w+) years(?: old)?\b/gi,
    category: 'Grammar & Tense',
    severity: 'critical',
    replaceFn: (_m, age) => `I am ${age} years old`,
    explanationEs: 'En inglés la edad se expresa con el verbo "to be" (I am ... years old), nunca con "have" (interferencia directa del español "tengo X años").',
    ruleFormula: 'Subject + am/is/are + [number] + years old',
    drillQuestionEs: 'Corrige la estructura de edad en inglés:',
    drillPromptEn: 'Corrige: "I have 29 years old"',
    drillAnswer: 'I am 29 years old',
  },
  {
    id: 'rule-profession-article',
    regex: /\b(I am|he is|she is) (engineer|doctor|lawyer|teacher|architect|developer|student)\b/gi,
    category: 'Grammar & Tense',
    severity: 'critical',
    replaceFn: (_m, subj, prof) => {
      const article = /^[aeiou]/i.test(prof) ? 'an' : 'a';
      return `${subj} ${article} ${prof}`;
    },
    explanationEs: 'Las profesiones en singular requieren obligatoriamente el artículo indefinido "a" o "an" ("I am an engineer", "She is a doctor").',
    ruleFormula: 'Subject + be + a/an + Singular Profession',
    drillQuestionEs: 'Añade el artículo obligatorio antes de la profesión:',
    drillPromptEn: 'Completa: "She is ___ architect."',
    drillAnswer: 'an',
  },
  {
    id: 'rule-false-friend-actually',
    regex: /\bActually[,]? (I work|we work|I live|I study|I am working)\b/gi,
    category: 'False Friend',
    severity: 'moderate',
    replaceFn: (_m, rest) => `Currently, ${rest}`,
    explanationEs: 'Falso amigo clásico: "Actually" significa "en realidad / de hecho". Para decir "actualmente / hoy en día", debes usar "Currently" o "At present".',
    ruleFormula: 'Currently = actualmente | Actually = en realidad',
    drillQuestionEs: 'Traduce "Actualmente trabajo aquí" sin caer en el falso amigo:',
    drillPromptEn: '___, I work here. (Currently / Actually)',
    drillAnswer: 'Currently',
  },
  {
    id: 'rule-present-since-duration',
    regex: /\bI (work|study|live) ([^.]+?) since (two|three|four|five|\d+) years\b/gi,
    category: 'Grammar & Tense',
    severity: 'critical',
    replaceFn: (_m, verb, mid, num) => {
      const pp = verb.toLowerCase() === 'study' ? 'have studied' : `have ${verb.toLowerCase().replace(/e$/, '')}ed`;
      return `I ${pp} ${mid} for ${num} years`;
    },
    explanationEs: 'Doble interferencia del español: 1) Para una acción que empezó en el pasado y continúa hoy, el inglés exige Present Perfect ("I have worked/studied"), no Present Simple. 2) Con períodos de duración ("three years") se usa "for", no "since".',
    ruleFormula: 'Subject + have/has + V3 + for + [duration period]',
    drillQuestionEs: 'Corrige el tiempo verbal y la preposición de duración:',
    drillPromptEn: 'Corrige: "I study English since two years"',
    drillAnswer: 'I have studied English for two years',
  },
  {
    id: 'rule-people-is',
    regex: /\b(the )?people (in my team )?(is|was|has)\b/gi,
    category: 'Grammar & Tense',
    severity: 'critical',
    replaceFn: (_m, thePart = '', midPart = '', verb) => {
      const v = verb.toLowerCase();
      const pluralVerb = v === 'is' ? 'are' : v === 'was' ? 'were' : 'have';
      return `${thePart || ''}${midPart ? `people ${midPart}` : 'people '}${pluralVerb}`;
    },
    explanationEs: '"People" (gente/personas) es un sustantivo plural en inglés. Siempre exige verbo en plural ("people are", "people were", "people have").',
    ruleFormula: 'People (plural noun) + are / were / have',
    drillQuestionEs: 'Selecciona la concordancia plural correcta para "people":',
    drillPromptEn: 'The people in my team ___ (was / were) worried.',
    drillAnswer: 'were',
  },
  {
    id: 'rule-depend-of',
    regex: /\b(depend|depends|depended|depending) of\b/gi,
    category: 'Preposition & Collocation',
    severity: 'critical',
    replaceFn: (_m, verb) => `${verb} on`,
    explanationEs: 'El verbo "depend" rige siempre la preposición "on" o "upon" ("depend on"), jamás "depend of".',
    ruleFormula: 'depend + on / upon + Noun / V-ing',
    drillQuestionEs: 'Escribe la preposición correcta que acompaña a "depend":',
    drillPromptEn: 'Our server depended ___ an old database.',
    drillAnswer: 'on',
  },
  {
    id: 'rule-suggest-to',
    regex: /\bsuggested to (migrate|go|buy|do|make|use|create)\b/gi,
    category: 'Syntax & Word Order',
    severity: 'moderate',
    replaceFn: (_m, verb) => {
      const ing = verb.replace(/e$/, '') + 'ing';
      return `suggested ${ing}`;
    },
    explanationEs: 'El verbo "suggest" nunca va seguido de "to + infinitivo" ("suggested to migrate" es incorrecto). Usa gerundio ("suggested migrating") o una cláusula "that" ("suggested that we migrate").',
    ruleFormula: 'suggest + V-ing  OR  suggest + (that) + S + bare infinitive',
    drillQuestionEs: 'Corrige la estructura posterior al verbo "suggest":',
    drillPromptEn: 'Corrige: "I suggested to migrate"',
    drillAnswer: 'I suggested migrating',
  },
  {
    id: 'rule-want-travel',
    regex: /\bwant (travel|speak|learn|work|go)\b/gi,
    category: 'Syntax & Word Order',
    severity: 'critical',
    replaceFn: (_m, verb) => `want to ${verb}`,
    explanationEs: 'El verbo "want" requiere siempre el infinitivo completo con "to" ("want to travel", "want to speak").',
    ruleFormula: 'want + to + Base Verb',
    drillQuestionEs: 'Completa con la partícula de infinitivo requerida por "want":',
    drillPromptEn: 'I want ___ travel to London.',
    drillAnswer: 'to',
  },
  {
    id: 'rule-despite-of',
    regex: /\bdespite of\b/gi,
    category: 'Preposition & Collocation',
    severity: 'critical',
    replaceFn: () => 'despite',
    explanationEs: 'El conector concesivo es "despite" (sin "of") o bien "in spite of" (con "of"). Nunca mezcles ambos diciendo "despite of".',
    ruleFormula: 'despite + Noun/V-ing  OR  in spite of + Noun/V-ing',
    drillQuestionEs: 'Corrige el conector concesivo:',
    drillPromptEn: 'Corrige: "Despite of the risks"',
    drillAnswer: 'Despite the risks',
  },
  {
    id: 'rule-look-forward-inf',
    regex: /\blook forward to (integrate|meet|see|hear|work|receive)\b/gi,
    category: 'Preposition & Collocation',
    severity: 'critical',
    replaceFn: (_m, verb) => {
      const ing = verb.replace(/e$/, '') + 'ing';
      return `look forward to ${ing}`;
    },
    explanationEs: 'En "look forward to", la palabra "to" es una preposición, no la marca de infinitivo. Por tanto, el verbo siguiente debe ir en gerundio (-ing): "look forward to integrating / meeting".',
    ruleFormula: 'look forward to + V-ing / Noun',
    drillQuestionEs: 'Conjuga correctamente el verbo tras "look forward to":',
    drillPromptEn: 'Universities look forward to ___ (integrate) adaptive tools.',
    drillAnswer: 'integrating',
  },
  {
    id: 'rule-not-only-inversion',
    regex: /\bNot only technology changes\b/gi,
    category: 'Syntax & Word Order',
    severity: 'moderate',
    replaceFn: () => 'Not only does technology change',
    explanationEs: 'Cuando "Not only" encabeza una oración para dar énfasis formal, es obligatorio invertir el auxiliar como en una pregunta: "Not only does technology change...".',
    ruleFormula: 'Not only + Auxiliary (do/does/did) + Subject + Base Verb',
    drillQuestionEs: 'Aplica la inversión estilística tras "Not only":',
    drillPromptEn: 'Corrige: "Not only technology changes"',
    drillAnswer: 'Not only does technology change',
  },
];

export function analyzeEnglishTextDeterministic(rawText: string): TextAnalysisResult {
  const trimmed = rawText.trim();
  const words = trimmed.length > 0 ? trimmed.split(/\s+/) : [];
  const sentences = trimmed
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  let correctedVersion = trimmed;
  const issues: DetectedIssue[] = [];
  let firstMatchedRule: PatternRule | null = null;

  for (const rule of SPANISH_INTERFERENCE_RULES) {
    rule.regex.lastIndex = 0;
    const match = rule.regex.exec(correctedVersion);
    if (match) {
      if (!firstMatchedRule) firstMatchedRule = rule;
      const originalSnippet = match[0];
      rule.regex.lastIndex = 0;
      const replacement = originalSnippet.replace(rule.regex, rule.replaceFn);
      correctedVersion = correctedVersion.replace(rule.regex, rule.replaceFn);

      issues.push({
        id: rule.id,
        category: rule.category,
        severity: rule.severity,
        originalSnippet,
        correction: replacement,
        explanationEs: rule.explanationEs,
        ruleFormula: rule.ruleFormula,
      });
    }
  }

  // Also replace "had success" -> "succeeded"
  if (/\bwe had success\b/i.test(correctedVersion)) {
    correctedVersion = correctedVersion.replace(/\bwe had success\b/gi, 'we succeeded');
    issues.push({
      id: 'rule-collocation-success',
      category: 'Register & Style',
      severity: 'style',
      originalSnippet: 'we had success',
      correction: 'we succeeded / the migration was successful',
      explanationEs: 'En inglés natural se prefiere el verbo "succeed (in)" o el adjetivo "be successful" en lugar del calco "have success" ("tener éxito").',
      ruleFormula: 'succeed in + V-ing  |  be successful',
    });
  }

  // Compute lexical sophistication
  const advancedMarkers = [
    'albeit',
    'notwithstanding',
    'furthermore',
    'consequently',
    'moreover',
    'nevertheless',
    'comprehensive',
    'mitigate',
    'architecture',
    'evaluation',
    'enhance',
    'diminish',
    'stipulation',
    'unprecedented',
    'substantial',
  ];
  const lowerWords = words.map((w) => w.toLowerCase().replace(/[^a-z]/g, ''));
  const longWordsCount = lowerWords.filter((w) => w.length >= 7).length;
  const advancedHits = lowerWords.filter((w) => advancedMarkers.includes(w)).length;

  const penalty = issues.reduce(
    (acc, iss) => acc + (iss.severity === 'critical' ? 14 : iss.severity === 'moderate' ? 9 : 4),
    0
  );

  const grammarAccuracy = Math.max(38, Math.min(99, 96 - penalty));
  const lexicalSophistication = Math.max(
    42,
    Math.min(98, 52 + Math.round((longWordsCount / Math.max(1, words.length)) * 110) + advancedHits * 8)
  );
  const cohesionAndSyntax = Math.max(
    45,
    Math.min(97, 68 + sentences.length * 4 + (advancedHits > 0 ? 12 : 0) - Math.round(penalty * 0.4))
  );
  const idiomaticNaturalness = Math.max(40, Math.min(98, 90 - Math.round(penalty * 0.85)));

  const overallScore = Math.round(
    grammarAccuracy * 0.35 +
      lexicalSophistication * 0.25 +
      cohesionAndSyntax * 0.2 +
      idiomaticNaturalness * 0.2
  );

  let estimatedLevel: CEFRLevel = 'B1';
  if (overallScore >= 90 && lexicalSophistication >= 82) estimatedLevel = 'C2';
  else if (overallScore >= 82) estimatedLevel = 'C1';
  else if (overallScore >= 72) estimatedLevel = 'B2';
  else if (overallScore >= 60) estimatedLevel = 'B1';
  else if (overallScore >= 48) estimatedLevel = 'A2';
  else estimatedLevel = 'A1';

  // Generate an elevated C1/C2 version
  let c1ElevatedVersion = correctedVersion;
  c1ElevatedVersion = c1ElevatedVersion
    .replace(
      /\b(?:Currently,\s*)?I have worked in software for (\w+) years\./gi,
      'Over the past $1 years, I have specialized in software engineering.'
    )
    .replace(
      /\b(?:Currently,\s*)?I work in software for (\w+) years\./gi,
      'Over the past $1 years, I have worked extensively in software engineering.'
    )
    .replace(/\bworried because\b/gi, 'concerned that')
    .replace(
      /\bI suggested migrating the data and we succeeded\./gi,
      'I spearheaded the database migration, which ultimately proved highly successful.'
    )
    .replace(
      /\bbecause I want to travel to London and speak with native people\./gi,
      'with the aim of relocating to London and communicating effortlessly with native speakers.'
    );

  if (c1ElevatedVersion === correctedVersion && correctedVersion.length > 0) {
    c1ElevatedVersion = `Furthermore, ${correctedVersion.charAt(0).toLowerCase()}${correctedVersion.slice(1)}`;
  }

  const lexicalUpgrades: LexicalUpgrade[] = [
    {
      basicWord: 'worried / bad problem',
      advancedAlternatives: ['concerned', 'apprehensive', 'pressing challenge'],
      contextNoteEs: 'En registros profesionales y académicos (B2–C2), sustituye adjetivos genéricos por colocaciones precisas.',
    },
    {
      basicWord: 'want to + verb',
      advancedAlternatives: ['aim to', 'strive to', 'intend to', 'aspire to'],
      contextNoteEs: 'Aporta mayor intencionalidad ejecutiva en entrevistas y ensayos.',
    },
    {
      basicWord: 'have success / good result',
      advancedAlternatives: ['yield measurable gains', 'prove highly effective', 'succeed in'],
      contextNoteEs: 'Evita el calco "have success" usando verbos y colocaciones nativas de alto impacto.',
    },
  ];

  const strengthsEs: string[] = [];
  if (sentences.length >= 2) {
    strengthsEs.push('Estructura discursiva clara con progresión lógica entre ideas.');
  }
  if (issues.length === 0) {
    strengthsEs.push('Excelente control morfosintáctico sin interferencias directas del español.');
  } else {
    strengthsEs.push('Intención comunicativa comprensible y uso activo de conectores causales.');
  }
  if (longWordsCount >= 3) {
    strengthsEs.push('Buen repertorio de vocabulario específico del dominio.');
  }

  const nextFocusEs =
    issues.length > 0
      ? `Prioridad inmediata: corregir ${issues.length} patrón(es) de interferencia (${issues
          .map((i) => i.category)
          .slice(0, 2)
          .join(' y ')}) y consolidar régimen preposicional.`
      : 'Prioridad inmediata: incorporar inversión estilística (Not only / Little did), cláusulas participiales y colocaciones de nivel C1–C2.';

  const practiceDrill = firstMatchedRule
    ? {
        questionEs: firstMatchedRule.drillQuestionEs,
        promptEn: firstMatchedRule.drillPromptEn,
        correctAnswer: firstMatchedRule.drillAnswer,
        explanationEs: firstMatchedRule.explanationEs,
      }
    : {
        questionEs: 'Transforma al registro avanzado C1 usando inversión negativa:',
        promptEn: 'Completa: "Not only ___ (do / does) this approach save time, but it also improves accuracy."',
        correctAnswer: 'does',
        explanationEs: 'Tras "Not only" al inicio de oración, invertimos el auxiliar de tercera persona singular ("does this approach save").',
      };

  return {
    estimatedLevel,
    overallScore,
    metrics: {
      grammarAccuracy,
      lexicalSophistication,
      cohesionAndSyntax,
      idiomaticNaturalness,
    },
    wordCount: words.length,
    sentenceCount: sentences.length,
    correctedVersion,
    c1ElevatedVersion,
    issues,
    lexicalUpgrades,
    strengthsEs,
    nextFocusEs,
    practiceDrill,
  };
}

export function checkExerciseAnswer(
  userInput: string,
  correctAnswer: string,
  acceptedAlternatives: string[] = []
): boolean {
  const normalize = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .replace(/[’']/g, "'")
      .replace(/[.!?]+$/, '')
      .replace(/\s+/g, ' ');

  const target = normalize(userInput);
  if (!target) return false;
  if (target === normalize(correctAnswer)) return true;
  return acceptedAlternatives.some((alt) => normalize(alt) === target);
}

export function calculateNextReview(
  card: SRSCard,
  rating: 'hard' | 'good' | 'easy'
): SRSCard {
  let intervalDays = card.intervalDays;
  let easeFactor = card.easeFactor;
  let repetitions = card.repetitions;
  let dueStatus: SRSCard['dueStatus'] = 'learning';

  if (rating === 'hard') {
    repetitions = 0;
    intervalDays = 1;
    easeFactor = Math.max(1.3, Number((easeFactor - 0.2).toFixed(2)));
    dueStatus = 'due';
  } else if (rating === 'good') {
    repetitions += 1;
    intervalDays = repetitions === 1 ? 2 : Math.round(intervalDays * easeFactor);
    dueStatus = intervalDays >= 6 ? 'mastered' : 'learning';
  } else {
    repetitions += 1;
    easeFactor = Number((easeFactor + 0.15).toFixed(2));
    intervalDays = Math.max(4, Math.round(intervalDays * easeFactor * 1.3));
    dueStatus = 'mastered';
  }

  return {
    ...card,
    intervalDays,
    easeFactor,
    repetitions,
    dueStatus,
  };
}
