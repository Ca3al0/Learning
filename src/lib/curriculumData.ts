export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type SkillPillar =
  | 'grammar'
  | 'vocabulary'
  | 'listening'
  | 'speaking'
  | 'reading'
  | 'writing';

export interface DiagnosticQuestion {
  id: string;
  level: CEFRLevel;
  pillar: SkillPillar;
  promptEs: string;
  sentenceEn: string;
  options: string[];
  correctIndex: number;
  explanationEs: string;
  grammarRule: string;
}

export interface LessonExercise {
  id: string;
  type: 'multiple_choice' | 'sentence_transform' | 'error_correction';
  instructionEs: string;
  promptEn: string;
  options?: string[];
  correctAnswer: string;
  acceptedAlternatives?: string[];
  hintEs: string;
  explanationEs: string;
}

export interface LessonModule {
  id: string;
  level: CEFRLevel;
  pillar: SkillPillar;
  pillarLabelEs: string;
  titleEn: string;
  titleEs: string;
  durationMin: number;
  summaryEs: string;
  syntaxFormula: string;
  coreConcepts: {
    headingEs: string;
    explanationEs: string;
    exampleEn: string;
    exampleEs: string;
    ipaNote?: string;
  }[];
  commonMistakeEs: {
    wrongEn: string;
    rightEn: string;
    whyEs: string;
  };
  exercises: LessonExercise[];
}

export interface PhoneticMinimalPair {
  id: string;
  level: CEFRLevel;
  categoryEs: string;
  soundA: string;
  soundB: string;
  wordA: string;
  ipaA: string;
  meaningAEs: string;
  wordB: string;
  ipaB: string;
  meaningBEs: string;
  mouthPositionEs: string;
  practiceSentenceEn: string;
  practiceSentenceIpa: string;
}

export interface SRSCard {
  id: string;
  termEn: string;
  ipa: string;
  category: 'Phrasal Verb' | 'Idiom' | 'Academic Collocation' | 'False Friend' | 'Core Vocabulary';
  level: CEFRLevel;
  meaningEs: string;
  exampleEn: string;
  exampleEs: string;
  clozeSentenceEn: string;
  clozeAnswer: string;
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  dueStatus: 'due' | 'learning' | 'mastered';
}

export const CEFR_LEVEL_META: Record<
  CEFRLevel,
  {
    code: CEFRLevel;
    nameEs: string;
    subtitleEs: string;
    targetLexicon: number;
    canDoEs: string;
  }
> = {
  A1: {
    code: 'A1',
    nameEs: 'Acceso · Principiante',
    subtitleEs: 'Supervivencia cotidiana, estructuras nucleares y fonética base',
    targetLexicon: 800,
    canDoEs: 'Presentarse, formular preguntas directas, describir rutinas y comprender habla pausada.',
  },
  A2: {
    code: 'A2',
    nameEs: 'Plataforma · Elemental',
    subtitleEs: 'Narración de experiencias pasadas, planes futuros y conectores',
    targetLexicon: 1600,
    canDoEs: 'Relatar eventos pasados, comparar opciones, desenvolverse en viajes y situaciones laborales simples.',
  },
  B1: {
    code: 'B1',
    nameEs: 'Umbral · Intermedio',
    subtitleEs: 'Autonomía conversacional, condicionales y tiempos perfectos',
    targetLexicon: 3200,
    canDoEs: 'Defender opiniones, conectar argumentos, comprender textos estándar y resolver imprevistos.',
  },
  B2: {
    code: 'B2',
    nameEs: 'Avanzado Funcional · Intermedio Alto',
    subtitleEs: 'Fluidez profesional, voz pasiva, phrasal verbs y matices modales',
    targetLexicon: 5500,
    canDoEs: 'Interactuar con nativos sin esfuerzo, redactar informes claros y analizar textos complejos.',
  },
  C1: {
    code: 'C1',
    nameEs: 'Dominio Operativo Eficaz · Avanzado',
    subtitleEs: 'Inversión estilística, registro académico y colocaciones precisas',
    targetLexicon: 9000,
    canDoEs: 'Expresarse con precisión implícita, estructurar ensayos académicos y negociar en entornos exigentes.',
  },
  C2: {
    code: 'C2',
    nameEs: 'Maestría Bilingüe · Nativo Educado',
    subtitleEs: 'Retórica avanzada, sutileza idiomática y reconstrucción crítica',
    targetLexicon: 15000,
    canDoEs: 'Comprender cualquier matiz sociocultural, ironía o texto especializado y hablar con precisión estilística total.',
  },
};

export const SKILL_PILLAR_META: Record<
  SkillPillar,
  { id: SkillPillar; labelEs: string; labelEn: string; focusEs: string }
> = {
  grammar: {
    id: 'grammar',
    labelEs: 'Gramática y Sintaxis',
    labelEn: 'Grammar & Syntax',
    focusEs: 'Arquitectura verbal, tiempos, condicionales e inversión',
  },
  vocabulary: {
    id: 'vocabulary',
    labelEs: 'Vocabulario y Léxico',
    labelEn: 'Lexicon & Phrasal Verbs',
    focusEs: 'Colocaciones, phrasal verbs, modismos y falsos amigos',
  },
  listening: {
    id: 'listening',
    labelEs: 'Comprensión Auditiva',
    labelEn: 'Listening & Connected Speech',
    focusEs: 'Reducción vocálica, elisión, linking y acentos reales',
  },
  speaking: {
    id: 'speaking',
    labelEs: 'Pronunciación y Fluidez',
    labelEn: 'Phonetics & Speaking',
    focusEs: 'Fonemas IPA, ritmo prosódico y agilidad argumentativa',
  },
  reading: {
    id: 'reading',
    labelEs: 'Lectura Analítica',
    labelEn: 'Reading Comprehension',
    focusEs: 'Inferencia contextual, cohesión y textos técnicos/literarios',
  },
  writing: {
    id: 'writing',
    labelEs: 'Escritura y Registro',
    labelEn: 'Academic & Professional Writing',
    focusEs: 'Coherencia discursiva, registro formal y precisión sintáctica',
  },
};

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 'diag-a1',
    level: 'A1',
    pillar: 'grammar',
    promptEs: 'Selecciona la estructura correcta para expresar la edad en inglés:',
    sentenceEn: 'My sister ___ twenty-four years old and she works in Madrid.',
    options: ['has', 'is', 'have', 'makes'],
    correctIndex: 1,
    explanationEs: 'En inglés la edad es un estado del sujeto (verbo "to be": is/are/am), nunca una posesión con "have".',
    grammarRule: 'Subject + am/is/are + [age] + years old',
  },
  {
    id: 'diag-a2',
    level: 'A2',
    pillar: 'grammar',
    promptEs: 'Identifica la forma correcta para una acción completada en un momento específico del pasado:',
    sentenceEn: 'We ___ the financial report to the client yesterday afternoon.',
    options: ['have sent', 'sended', 'sent', 'were send'],
    correctIndex: 2,
    explanationEs: 'Con marcadores temporales cerrados en el pasado ("yesterday afternoon", "last week", "in 2022") es obligatorio usar Past Simple ("sent"), no Present Perfect.',
    grammarRule: 'Past Simple + finished time marker (yesterday / ago / last)',
  },
  {
    id: 'diag-b1',
    level: 'B1',
    pillar: 'vocabulary',
    promptEs: 'Cuidado con los falsos amigos (False Friends). ¿Cómo se traduce "Actualmente estamos desarrollando un nuevo sistema"?',
    sentenceEn: '___, we are developing a new diagnostic system for students.',
    options: ['Actually', 'Currently', 'Presently at actual', 'In actual fact'],
    correctIndex: 1,
    explanationEs: '"Currently" o "At present" significa "actualmente". "Actually" significa "en realidad / de hecho".',
    grammarRule: 'Currently = en el momento actual | Actually = en realidad',
  },
  {
    id: 'diag-b2',
    level: 'B2',
    pillar: 'grammar',
    promptEs: 'Selecciona la estructura correcta de Tercer Condicional (hipótesis irreal en el pasado):',
    sentenceEn: 'If the team ___ the data earlier, we would have prevented the outage.',
    options: ['analyzed', 'would have analyzed', 'had analyzed', 'has analyzed'],
    correctIndex: 2,
    explanationEs: 'La cláusula "If" en el tercer condicional requiere Past Perfect ("had + participio"), nunca "would have" dentro de la condición.',
    grammarRule: 'If + Subject + had + V3, Subject + would have + V3',
  },
  {
    id: 'diag-c1',
    level: 'C1',
    pillar: 'writing',
    promptEs: 'Elige la inversión negativa correcta para énfasis estilístico formal:',
    sentenceEn: 'Not only ___ the deadline, but they also exceeded every quality benchmark.',
    options: ['they met', 'did they meet', 'had met they', 'they did meet'],
    correctIndex: 1,
    explanationEs: 'Cuando una oración comienza con un adverbio negativo o restrictivo ("Not only", "Never", "Rarely", "Seldom"), se invierte el auxiliar como en una pregunta: "did they meet".',
    grammarRule: 'Negative Adverbial + Auxiliary + Subject + Base Verb',
  },
  {
    id: 'diag-c2',
    level: 'C2',
    pillar: 'vocabulary',
    promptEs: 'Selecciona la colocación y estructura subjuntiva precisa en registro jurídico/académico:',
    sentenceEn: 'The board stipulated that the audit ___ prior to any public disclosure.',
    options: ['is completed', 'be completed', 'was to complete', 'would be completing'],
    correctIndex: 1,
    explanationEs: 'El subjuntivo mandativo en inglés ("stipulate / demand / insist / recommend that...") utiliza la forma base invariable del verbo ("be completed") sin importar el tiempo del verbo principal.',
    grammarRule: 'Mandative Subjunctive: demand/stipulate/insist + that + Subject + bare infinitive',
  },
];

export const CURRICULUM_MODULES: LessonModule[] = [
  {
    id: 'mod-a1-core-be-have',
    level: 'A1',
    pillar: 'grammar',
    pillarLabelEs: 'Gramática y Sintaxis',
    titleEn: 'Foundations: To Be vs. To Have & Personal States',
    titleEs: 'Cimientos: Estado (To Be) frente a Posesión (To Have)',
    durationMin: 12,
    summaryEs: 'Domina la estructura nuclear de la oración inglesa y elimina la traducción literal desde el español en edad, sensaciones físicas y profesiones.',
    syntaxFormula: 'S + am/is/are + Adjective/Noun  |  S + Do/Does + not + Base Verb',
    coreConcepts: [
      {
        headingEs: '1. Sujeto Obligatorio y Estados Físicos',
        explanationEs: 'A diferencia del español, el inglés jamás omite el sujeto ("It is raining", no "Is raining"). Además, los estados como hambre, sed, frío, calor, sueño y edad se expresan con "to be", no con "tener".',
        exampleEn: 'I am twenty-eight years old and I am hungry.',
        exampleEs: 'Tengo veintiocho años y tengo hambre.',
        ipaNote: '/aɪ æm ˈtwɛnti eɪt jɪərz oʊld/',
      },
      {
        headingEs: '2. Profesiones con Artículo Indefinido (a / an)',
        explanationEs: 'En inglés siempre debes colocar "a" (antes de sonido consonántico) o "an" (antes de sonido vocálico) delante de una profesión en singular.',
        exampleEn: 'She is an engineer at a university in London.',
        exampleEs: 'Ella es ingeniera en una universidad en Londres. ("university" empieza con sonido /juː/, por eso usa "a").',
        ipaNote: '/ʃiː ɪz ən ˌɛndʒɪˈnɪər æt ə ˌjuːnɪˈvɜːrsəti/',
      },
    ],
    commonMistakeEs: {
      wrongEn: 'I have cold and my brother is architect.',
      rightEn: 'I am cold and my brother is an architect.',
      whyEs: 'Las sensaciones térmicas usan "to be" (I am cold) y las profesiones singulares exigen artículo indefinido (an architect).',
    },
    exercises: [
      {
        id: 'ex-a1-1',
        type: 'multiple_choice',
        instructionEs: 'Completa la oración seleccionando la opción gramaticalmente correcta:',
        promptEn: 'Carlos ___ thirty years old and he works as ___ honest lawyer.',
        options: ['has / a', 'is / an', 'is / a', 'has / an'],
        correctAnswer: 'is / an',
        hintEs: 'Recuerda: la edad usa "to be" y la "h" de "honest" es muda (/ˈɒnɪst/).',
        explanationEs: 'Usamos "is" para la edad y "an" porque "honest" comienza con sonido vocálico /ɒ/.',
      },
      {
        id: 'ex-a1-2',
        type: 'error_correction',
        instructionEs: 'Corrige el error clásico de interferencia del español escribiendo la oración correcta:',
        promptEn: 'Incorrecto: "People is very friendly in this city." → Escribe la forma correcta:',
        correctAnswer: 'People are very friendly in this city.',
        acceptedAlternatives: [
          'People are very friendly in this city',
          'people are very friendly in this city.',
          'people are very friendly in this city',
        ],
        hintEs: '"People" (gente/personas) es siempre plural en inglés.',
        explanationEs: '"People" es el plural irregular de "person", por lo que siempre concuerda con verbo plural ("People are").',
      },
    ],
  },
  {
    id: 'mod-a2-past-present-perfect',
    level: 'A2',
    pillar: 'grammar',
    pillarLabelEs: 'Gramática y Sintaxis',
    titleEn: 'Time Architecture: Past Simple vs. Present Perfect',
    titleEs: 'Arquitectura del Tiempo: Pasado Cerrado vs. Experiencia Conectada',
    durationMin: 15,
    summaryEs: 'Comprende la frontera exacta entre acciones ancladas en un tiempo terminado (Past Simple) y acciones cuyos resultados o marco temporal siguen abiertos hoy (Present Perfect).',
    syntaxFormula: 'Past: S + V2 (closed time)  |  Perfect: S + have/has + V3 (open time)',
    coreConcepts: [
      {
        headingEs: '1. La Regla del Tiempo Cerrado (Past Simple)',
        explanationEs: 'Si mencionas CUÁNDO ocurrió algo (yesterday, last night, in 2019, two hours ago, when I was a child), la ventana temporal está cerrada. Está prohibido usar Present Perfect.',
        exampleEn: 'I visited Dublin three years ago and met the director.',
        exampleEs: 'Visité Dublín hace tres años y conocí al director.',
        ipaNote: '/aɪ ˈvɪzɪtɪd ˈdʌblɪn θriː jɪərz əˈɡoʊ/',
      },
      {
        headingEs: '2. Conexión con el Presente (Present Perfect)',
        explanationEs: 'Usa "have/has + participio" para experiencias vitales sin fecha ("I have been to Japan"), acciones en un periodo no terminado ("this week", "today") o procesos que empezaron en el pasado y continúan ("for / since").',
        exampleEn: 'We have lived in this apartment since October.',
        exampleEs: 'Vivimos (hemos vivido) en este apartamento desde octubre.',
        ipaNote: '/wiː hæv lɪvd ɪn ðɪs əˈpɑːrtmənt sɪns ɒkˈtoʊbər/',
      },
    ],
    commonMistakeEs: {
      wrongEn: 'I live in Madrid since five years.',
      rightEn: 'I have lived in Madrid for five years.',
      whyEs: 'En español usamos presente ("vivo desde hace 5 años"), pero en inglés una acción que empezó en el pasado y sigue hoy exige Present Perfect + "for" (duración) o "since" (punto de inicio).',
    },
    exercises: [
      {
        id: 'ex-a2-1',
        type: 'multiple_choice',
        instructionEs: 'Elige la combinación verbal correcta según los marcadores de tiempo:',
        promptEn: 'I ___ Maria for ten years; we first ___ at university in 2016.',
        options: ['know / met', 'have known / met', 'have known / have met', 'knew / met'],
        correctAnswer: 'have known / met',
        hintEs: 'La primera parte dura hasta hoy ("for ten years"); la segunda tiene fecha cerrada ("in 2016").',
        explanationEs: '"Have known" expresa una relación que continúa hasta el presente; "met" usa Past Simple porque "in 2016" es un tiempo cerrado.',
      },
      {
        id: 'ex-a2-2',
        type: 'sentence_transform',
        instructionEs: 'Transforma la frase al inglés corrigiendo el tiempo verbal para expresar duración continua hasta hoy:',
        promptEn: 'Traducción precisa: "Ella trabaja aquí desde 2021" (usa "She has worked..."):',
        correctAnswer: 'She has worked here since 2021.',
        acceptedAlternatives: [
          'She has worked here since 2021',
          'She has been working here since 2021.',
          'She has been working here since 2021',
        ],
        hintEs: 'Usa Present Perfect (has worked) + since + año de inicio.',
        explanationEs: 'Para conectar un punto de inicio en el pasado (2021) con el presente usamos "has worked / has been working ... since 2021".',
      },
    ],
  },
  {
    id: 'mod-b1-conditionals-modals',
    level: 'B1',
    pillar: 'speaking',
    pillarLabelEs: 'Pronunciación y Fluidez',
    titleEn: 'Hypothetical Reasoning & Modal Deduction',
    titleEs: 'Razonamiento Hipotético, Condicionales y Deducción Modal',
    durationMin: 18,
    summaryEs: 'Expresa probabilidades, escenarios hipotéticos (First & Second Conditional) y deducciones lógicas con must, might y can’t.',
    syntaxFormula: '2nd Cond: If + Past Simple, S + would/could + Base Verb',
    coreConcepts: [
      {
        headingEs: '1. Segundo Condicional: Escenarios Imaginarios Hoy',
        explanationEs: 'Se usa para situaciones irreales o improbables en el presente/futuro. Con el verbo "to be", el registro cuidado utiliza "If I were" para todas las personas.',
        exampleEn: 'If I had more bandwidth this quarter, I would lead the research initiative.',
        exampleEs: 'Si tuviera más disponibilidad este trimestre, lideraría la iniciativa de investigación.',
        ipaNote: '/ɪf aɪ hæd mɔːr ˈbændwɪdθ ... aɪ wʊd liːd/',
      },
      {
        headingEs: '2. Deducción Lógica (Must vs. Can’t)',
        explanationEs: 'Para deducir que algo es casi seguro usamos "must be". Pero para deducir que algo es IMPOSIBLE, el opuesto no es "mustn’t be", sino "can’t be".',
        exampleEn: 'That report can’t be accurate; the figures don’t match the ledger.',
        exampleEs: 'Ese informe no puede ser exacto; las cifras no coinciden con el libro mayor.',
        ipaNote: '/ðæt rɪˈpɔːrt kænt bi ˈækjərət/',
      },
    ],
    commonMistakeEs: {
      wrongEn: 'If I would have more time, I would study phonetics.',
      rightEn: 'If I had more time, I would study phonetics.',
      whyEs: 'Nunca coloques "would" dentro de la cláusula encabezada por "If" en condicionales estándar.',
    },
    exercises: [
      {
        id: 'ex-b1-1',
        type: 'multiple_choice',
        instructionEs: 'Selecciona el modal de deducción correcto para expresar imposibilidad lógica:',
        promptEn: 'Elena just landed in Tokyo twenty minutes ago, so that ___ be her at the office door.',
        options: ['mustn’t', 'can’t', 'shouldn’t', 'might not to'],
        correctAnswer: 'can’t',
        hintEs: '¿Cuál es el opuesto de "must be" cuando deducimos que algo es imposible?',
        explanationEs: '"Can’t be" expresa certeza negativa (imposibilidad lógica), mientras que "mustn’t" expresa prohibición.',
      },
      {
        id: 'ex-b1-2',
        type: 'error_correction',
        instructionEs: 'Reescribe la oración eliminando el error en la cláusula condicional:',
        promptEn: 'Incorrecto: "If I would be you, I would accept the offer."',
        correctAnswer: 'If I were you, I would accept the offer.',
        acceptedAlternatives: [
          'If I were you, I would accept the offer',
          'If I was you, I would accept the offer.',
        ],
        hintEs: 'Usa el subjuntivo "If I were you...".',
        explanationEs: 'En el segundo condicional, la cláusula "If" lleva Past Simple / Subjunctive ("If I were you"), nunca "would".',
      },
    ],
  },
  {
    id: 'mod-b2-phrasal-prepositions',
    level: 'B2',
    pillar: 'vocabulary',
    pillarLabelEs: 'Vocabulario y Léxico',
    titleEn: 'Dependent Prepositions, Gerunds & High-Frequency Phrasal Verbs',
    titleEs: 'Preposiciones Dependientes, Régimen Preposicional y Phrasal Verbs',
    durationMin: 20,
    summaryEs: 'Supera la barrera intermedia dominando qué preposición exige cada verbo/adjetivo y la regla de oro del gerundio tras preposición.',
    syntaxFormula: 'Verb/Adj + Preposition + V-ing (look forward to doing, depend on)',
    coreConcepts: [
      {
        headingEs: '1. La Regla de Oro: Toda Preposición Exige -ING',
        explanationEs: 'En inglés, siempre que un verbo sigue inmediatamente a una preposición (in, on, at, of, for, about, without, before, after, to como preposición), debe ir en gerundio (-ing), jamás en infinitivo.',
        exampleEn: 'We look forward to hearing from your engineering team soon.',
        exampleEs: 'Esperamos con interés tener noticias de su equipo de ingeniería pronto. (Aquí "to" es preposición, por eso "hearing").',
        ipaNote: '/wiː lʊk ˈfɔːrwərd tə ˈhɪərɪŋ/',
      },
      {
        headingEs: '2. Colocaciones Preposicionales Críticas',
        explanationEs: 'Evita traducir "de" como "of": depend ON (depender de), consist OF (constar de), succeed IN (tener éxito en), married TO (casado con), responsible FOR (responsable de).',
        exampleEn: 'Our quarterly outcome depends on executing the migration without losing data.',
        exampleEs: 'Nuestro resultado trimestral depende de ejecutar la migración sin perder datos.',
      },
    ],
    commonMistakeEs: {
      wrongEn: 'I am thinking in buy a house, but it depends of the bank.',
      rightEn: 'I am thinking of buying a house, but it depends on the bank.',
      whyEs: '"Think of/about" + gerundio ("buying") y "depend on" (nunca "depend of").',
    },
    exercises: [
      {
        id: 'ex-b2-1',
        type: 'multiple_choice',
        instructionEs: 'Completa con la estructura correcta tras la locución preposicional:',
        promptEn: 'In addition to ___ the backend architecture, she is responsible for ___ the new hires.',
        options: ['design / train', 'designing / training', 'designing / train', 'design / training'],
        correctAnswer: 'designing / training',
        hintEs: 'Tanto "to" (en "in addition to") como "for" son preposiciones.',
        explanationEs: 'En "in addition to" y "responsible for", ambas partículas son preposiciones y obligan a usar el verbo en forma -ing.',
      },
      {
        id: 'ex-b2-2',
        type: 'error_correction',
        instructionEs: 'Corrige los dos errores en la siguiente oración profesional:',
        promptEn: 'Incorrecto: "I look forward to meet you and discuss about the contract."',
        correctAnswer: 'I look forward to meeting you and discussing the contract.',
        acceptedAlternatives: [
          'I look forward to meeting you and discussing the contract',
          'I look forward to meeting you to discuss the contract.',
        ],
        hintEs: '1) "look forward to" + -ing. 2) El verbo "discuss" es transitivo directo (no lleva "about").',
        explanationEs: '"Look forward to" exige gerundio ("meeting") y "discuss" jamás lleva la preposición "about" ("discuss the contract").',
      },
    ],
  },
  {
    id: 'mod-c1-inversion-cleft',
    level: 'C1',
    pillar: 'writing',
    pillarLabelEs: 'Escritura y Registro',
    titleEn: 'Stylistic Inversion, Cleft Sentences & Hedging',
    titleEs: 'Inversión Estilística, Oraciones Hendidas y Matización Académica',
    durationMin: 22,
    summaryEs: 'Eleva tu prosa y oratoria al nivel C1 mediante estructuras de focalización retórica, inversiones negativas y lenguaje cauteloso (hedging).',
    syntaxFormula: 'Little did + S + V_base  |  Hardly had + S + V3 + when + S + V2',
    coreConcepts: [
      {
        headingEs: '1. Inversión Negativa y Restrictiva',
        explanationEs: 'Al colocar adverbiales negativos o restrictivos al inicio de la oración (Under no circumstances, Seldom, Little, Not until, Hardly... when), el orden Sujeto-Verbo se invierte usando un auxiliar.',
        exampleEn: 'Under no circumstances should sensitive credentials be stored in plain text.',
        exampleEs: 'Bajo ninguna circunstancia deben almacenarse credenciales sensibles en texto plano.',
        ipaNote: '/ˈʌndər noʊ ˈsɜːrkəmstænsɪz ʃʊd.../',
      },
      {
        headingEs: '2. Oraciones Hendidas (Wh-Cleft & It-Cleft)',
        explanationEs: 'Permiten aislar y enfatizar el foco informativo de un argumento en presentaciones ejecutivas o ensayos.',
        exampleEn: 'What distinguishes fluent speakers is not speed, but collocational precision.',
        exampleEs: 'Lo que distingue a los hablantes fluidos no es la velocidad, sino la precisión en las colocaciones.',
      },
    ],
    commonMistakeEs: {
      wrongEn: 'Not until the audit finished we realized the scope of the issue.',
      rightEn: 'Not until the audit finished did we realize the scope of the issue.',
      whyEs: 'Con "Not until...", la inversión ocurre en la cláusula principal ("did we realize"), no en la subordinada temporal.',
    },
    exercises: [
      {
        id: 'ex-c1-1',
        type: 'multiple_choice',
        instructionEs: 'Selecciona la estructura con inversión estilística C1 correcta:',
        promptEn: 'Hardly ___ the new protocol when latency dropped by forty percent.',
        options: ['we had deployed', 'had we deployed', 'did we deployed', 'we deployed'],
        correctAnswer: 'had we deployed',
        hintEs: 'La estructura correlativa es "Hardly had + Sujeto + Participio ... when ...".',
        explanationEs: '"Hardly / Scarcely ... when" y "No sooner ... than" invierten el auxiliar del Past Perfect: "Hardly had we deployed".',
      },
      {
        id: 'ex-c1-2',
        type: 'sentence_transform',
        instructionEs: 'Reescribe usando inversión al inicio con "Little": "They knew little about the hidden risks."',
        promptEn: 'Comienza con "Little...":',
        correctAnswer: 'Little did they know about the hidden risks.',
        acceptedAlternatives: ['Little did they know about the hidden risks'],
        hintEs: 'Little + auxiliar en pasado (did) + sujeto (they) + verbo base (know)...',
        explanationEs: 'Al anteponer "Little" con valor negativo, invertimos usando "did they know".',
      },
    ],
  },
  {
    id: 'mod-c2-discourse-nuance',
    level: 'C2',
    pillar: 'reading',
    pillarLabelEs: 'Lectura Analítica',
    titleEn: 'Pragmatic Nuance, Nominalization & Subjunctive Mastery',
    titleEs: 'Sutileza Pragmática, Nominalización y Precisión Idiomática C2',
    durationMin: 25,
    summaryEs: 'Domina la densidad léxica de publicaciones científicas y jurídicas, elipsis discursiva, estructuras absolutas y matices pragmáticos.',
    syntaxFormula: 'Participle Clause: Having + V3, S + V  |  Albeit + Adjective/Adverbial',
    coreConcepts: [
      {
        headingEs: '1. Cláusulas Participiales de Perfecto y Concisión',
        explanationEs: 'Sustituyen cláusulas temporales o causales pesadas ("After we had analyzed the dataset...") por construcciones sintéticas de alta densidad.',
        exampleEn: 'Having exhausted every conventional diplomatic channel, the envoy proposed a bilateral truce.',
        exampleEs: 'Habiendo agotado todos los canales diplomáticos convencionales, el enviado propuso una tregua bilateral.',
      },
      {
        headingEs: '2. Conectores de Alta Precisión (Albeit, Notwithstanding, Whereby)',
        explanationEs: '"Albeit" introduce una concesión compacta sin verbo conjugado; "whereby" significa "mediante el cual / por el cual" en procesos o acuerdos.',
        exampleEn: 'The reform yielded measurable gains, albeit at a considerable fiscal cost.',
        exampleEs: 'La reforma produjo avances medibles, si bien a un costo fiscal considerable.',
      },
    ],
    commonMistakeEs: {
      wrongEn: 'Having analyzed the samples, the conclusion was obvious.',
      rightEn: 'Having analyzed the samples, the researchers reached an obvious conclusion.',
      whyEs: 'Evita el "dangling participle" (participio colgante): el sujeto tácito de "Having analyzed" debe coincidir con el sujeto de la cláusula principal ("the researchers", no "the conclusion").',
    },
    exercises: [
      {
        id: 'ex-c2-1',
        type: 'multiple_choice',
        instructionEs: 'Identifica la oración libre de "dangling modifier" (modificador colgante) y con sintaxis C2 impecable:',
        promptEn: 'Walking through the archival vault, ___.',
        options: [
          'several unpublished manuscripts caught the historian’s eye',
          'the historian discovered several unpublished manuscripts',
          'it was obvious that the manuscripts were ancient',
          'there were several manuscripts on the table',
        ],
        correctAnswer: 'the historian discovered several unpublished manuscripts',
        hintEs: '¿Quién estaba caminando por la bóveda del archivo? Ese debe ser el primer sujeto tras la coma.',
        explanationEs: 'El sujeto que realiza la acción de "Walking" ("the historian") debe encabezar la cláusula principal.',
      },
    ],
  },
];

export const PHONETIC_MINIMAL_PAIRS: PhoneticMinimalPair[] = [
  {
    id: 'phon-1',
    level: 'A1',
    categoryEs: 'Tensión y Longitud Vocálica (/ɪ/ vs /iː/)',
    soundA: '/ɪ/ (Vocal corta relajada)',
    soundB: '/iː/ (Vocal larga tensa)',
    wordA: 'ship',
    ipaA: '/ʃɪp/',
    meaningAEs: 'barco',
    wordB: 'sheep',
    ipaB: '/ʃiːp/',
    meaningBEs: 'oveja',
    mouthPositionEs: 'Para /ɪ/, relaja los labios y baja ligeramente la lengua (entre "i" y "e"). Para /iː/, sonríe tensando las comisuras y prolonga el sonido.',
    practiceSentenceEn: 'The little sheep is on the big ship.',
    practiceSentenceIpa: '/ðə ˈlɪtəl ʃiːp ɪz ɒn ðə bɪɡ ʃɪp/',
  },
  {
    id: 'phon-2',
    level: 'A2',
    categoryEs: 'Contraste Labiodental vs Bilabial (/b/ vs /v/)',
    soundA: '/b/ (Ambos labios juntos)',
    soundB: '/v/ (Dientes superiores sobre labio inferior)',
    wordA: 'berry',
    ipaA: '/ˈbɛri/',
    meaningAEs: 'baya / fruto',
    wordB: 'very',
    ipaB: '/ˈvɛri/',
    meaningBEs: 'muy',
    mouthPositionEs: 'En español "b" y "v" suenan igual. En inglés, /v/ se produce apoyando los dientes superiores sobre el labio inferior y haciendo vibrar las cuerdas vocales.',
    practiceSentenceEn: 'Victor bought a very big blue van.',
    practiceSentenceIpa: '/ˈvɪktər bɔːt ə ˈvɛri bɪɡ bluː væn/',
  },
  {
    id: 'phon-3',
    level: 'B1',
    categoryEs: 'El Sonido Rey del Inglés: Schwa /ə/ y Ritmo Acentual',
    soundA: 'Sílaba Tónica (Fuerte y clara)',
    soundB: '/ə/ Schwa (Sílaba átona ultrarreducida)',
    wordA: 'photograph',
    ipaA: '/ˈfoʊtəɡræf/',
    meaningAEs: 'fotografía (acento en 1ª sílaba)',
    wordB: 'photographer',
    ipaB: '/fəˈtɒɡrəfər/',
    meaningBEs: 'fotógrafo (acento en 2ª sílaba, el resto se vuelve /ə/)',
    mouthPositionEs: 'El español es silábico (cada vocal suena igual). El inglés es acentual: las vocales no acentuadas se reducen al sonido neutro central /ə/ (schwa).',
    practiceSentenceEn: 'The photographer took a photograph of London.',
    practiceSentenceIpa: '/ðə fəˈtɒɡrəfər tʊk ə ˈfoʊtəɡræf əv ˈlʌndən/',
  },
  {
    id: 'phon-4',
    level: 'B2',
    categoryEs: 'Terminaciones -ED en Pasado (/t/, /d/, /ɪd/)',
    soundA: '/t/ o /d/ (Sin añadir sílaba extra)',
    soundB: '/ɪd/ (Solo tras sonido /t/ o /d/)',
    wordA: 'worked / lived',
    ipaA: '/wɜːrkt/ · /lɪvd/',
    meaningAEs: 'trabajó (1 sílaba) / vivió (1 sílaba)',
    wordB: 'decided / wanted',
    ipaB: '/dɪˈsaɪdɪd/ · /ˈwɒntɪd/',
    meaningBEs: 'decidió / quiso (sí añade /ɪd/)',
    mouthPositionEs: 'Jamás pronuncies la "e" de "-ed" a menos que el verbo termine en sonido /t/ o /d/. "Worked" suena /wɜːrkt/, nunca "wór-ked".',
    practiceSentenceEn: 'She worked hard, lived abroad, and decided to stay.',
    practiceSentenceIpa: '/ʃiː wɜːrkt hɑːrd, lɪvd əˈbrɔːd, ænd dɪˈsaɪdɪd tə steɪ/',
  },
];

export const INITIAL_SRS_CARDS: SRSCard[] = [
  {
    id: 'srs-1',
    termEn: 'carry out',
    ipa: '/ˈkæri aʊt/',
    category: 'Phrasal Verb',
    level: 'B2',
    meaningEs: 'llevar a cabo, ejecutar (un experimento, auditoría, plan)',
    exampleEn: 'The hospital carried out a comprehensive clinical trial.',
    exampleEs: 'El hospital llevó a cabo un ensayo clínico exhaustivo.',
    clozeSentenceEn: 'Engineers will ___ a full diagnostic test tonight.',
    clozeAnswer: 'carry out',
    intervalDays: 1,
    easeFactor: 2.5,
    repetitions: 1,
    dueStatus: 'due',
  },
  {
    id: 'srs-2',
    termEn: 'sensible vs. sensitive',
    ipa: '/ˈsɛnsəbəl/ · /ˈsɛnsɪtɪv/',
    category: 'False Friend',
    level: 'B1',
    meaningEs: 'sensible = sensato/prudente | sensitive = sensible/delicado',
    exampleEn: 'It was a sensible decision to encrypt the sensitive patient data.',
    exampleEs: 'Fue una decisión sensata cifrar los datos sensibles de los pacientes.',
    clozeSentenceEn: 'Wearing a helmet is a very ___ precaution.',
    clozeAnswer: 'sensible',
    intervalDays: 1,
    easeFactor: 2.5,
    repetitions: 0,
    dueStatus: 'due',
  },
  {
    id: 'srs-3',
    termEn: 'come up with',
    ipa: '/kʌm ʌp wɪð/',
    category: 'Phrasal Verb',
    level: 'B2',
    meaningEs: 'idear, proponer, ocurrírsele (una solución, argumento o plan)',
    exampleEn: 'She came up with an ingenious way to reduce memory overhead.',
    exampleEs: 'A ella se le ocurrió una forma ingeniosa de reducir el consumo de memoria.',
    clozeSentenceEn: 'We need to ___ a viable strategy before Friday.',
    clozeAnswer: 'come up with',
    intervalDays: 3,
    easeFactor: 2.6,
    repetitions: 2,
    dueStatus: 'due',
  },
  {
    id: 'srs-4',
    termEn: 'albeit',
    ipa: '/ɔːlˈbiːɪt/',
    category: 'Academic Collocation',
    level: 'C1',
    meaningEs: 'si bien, aunque (concesivo formal compacto)',
    exampleEn: 'He accepted the post, albeit with some initial hesitation.',
    exampleEs: 'Aceptó el puesto, si bien con cierta vacilación inicial.',
    clozeSentenceEn: 'The prototype works reliably, ___ at a slower speed.',
    clozeAnswer: 'albeit',
    intervalDays: 5,
    easeFactor: 2.7,
    repetitions: 3,
    dueStatus: 'learning',
  },
  {
    id: 'srs-5',
    termEn: 'put off',
    ipa: '/pʊt ɒf/',
    category: 'Phrasal Verb',
    level: 'B1',
    meaningEs: 'posponer, aplazar (postpone)',
    exampleEn: 'Never put off critical security updates until next month.',
    exampleEs: 'Nunca pospongas actualizaciones críticas de seguridad hasta el próximo mes.',
    clozeSentenceEn: 'They decided to ___ the meeting until Tuesday.',
    clozeAnswer: 'put off',
    intervalDays: 2,
    easeFactor: 2.5,
    repetitions: 1,
    dueStatus: 'due',
  },
];

export const IMMERSION_SCENARIOS = [
  {
    id: 'scen-interview',
    titleEs: 'Entrevista Profesional & Liderazgo Técnico',
    levelRange: 'B1–C2',
    promptEn: 'Describe a challenging problem you solved recently, explaining what actions you took and what measurable impact it had.',
    promptEs: 'Describe en inglés un problema complejo que hayas resuelto recientemente, qué acciones tomaste y cuál fue el resultado.',
    sampleDraftEn: 'Actually I work in software since three years. Last month the people in my team was worried because our server depended of an old database. I suggested to migrate the data and we had success.',
  },
  {
    id: 'scen-daily',
    titleEs: 'Presentación Personal, Rutina y Experiencias (A1–B1)',
    levelRange: 'A1–B1',
    promptEn: 'Introduce yourself, your age, your profession, how long you have studied English, and your goals for this year.',
    promptEs: 'Preséntate en inglés: tu edad, profesión, cuánto tiempo llevas estudiando y tus metas para este año.',
    sampleDraftEn: 'Hello, I have 29 years old and I am engineer. I study English since two years because I want travel to London and speak with native people.',
  },
  {
    id: 'scen-academic',
    titleEs: 'Ensayo Argumentativo: Tecnología y Educación (B2–C2)',
    levelRange: 'B2–C2',
    promptEn: 'Write a short analytical paragraph discussing whether artificial intelligence enhances or diminishes critical thinking in higher education.',
    promptEs: 'Redacta un párrafo argumentativo analizando si la tecnología potencia o reduce el pensamiento crítico en la educación superior.',
    sampleDraftEn: 'Not only technology changes how students learn, it also demands new evaluation methods. Despite of the risks, universities look forward to integrate adaptive tools in the classroom.',
  },
];
