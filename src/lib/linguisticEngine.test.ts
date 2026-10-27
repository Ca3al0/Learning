import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateDiagnosticAnswers,
  analyzeEnglishTextDeterministic,
  checkExerciseAnswer,
  calculateNextReview,
} from './linguisticEngine';
import { INITIAL_SRS_CARDS } from './curriculumData';

test('evaluateDiagnosticAnswers assigns C2 when all diagnostic questions are answered correctly', () => {
  const allCorrect: Record<string, number> = {
    'diag-a1': 1,
    'diag-a2': 2,
    'diag-b1': 1,
    'diag-b2': 2,
    'diag-c1': 1,
    'diag-c2': 1,
  };
  const result = evaluateDiagnosticAnswers(allCorrect);
  assert.equal(result.assignedLevel, 'C2');
  assert.equal(result.scorePercentage, 100);
  assert.equal(result.correctCount, 6);
});

test('evaluateDiagnosticAnswers assigns A1 or A2 when only beginner questions are answered', () => {
  const beginnerOnly: Record<string, number> = {
    'diag-a1': 1,
    'diag-a2': 0,
    'diag-b1': 0,
    'diag-b2': 0,
    'diag-c1': 0,
    'diag-c2': 0,
  };
  const result = evaluateDiagnosticAnswers(beginnerOnly);
  assert.equal(result.assignedLevel, 'A1');
  assert.equal(result.correctCount, 1);
});

test('analyzeEnglishTextDeterministic detects Spanish interference patterns and produces corrections', () => {
  const sample =
    'Actually I work in software since three years. Last month the people in my team was worried because our server depended of an old database.';
  const analysis = analyzeEnglishTextDeterministic(sample);

  assert.ok(analysis.issues.length >= 4, 'Should detect at least 4 interference issues');
  assert.ok(
    analysis.correctedVersion.includes('Currently'),
    'Should replace false friend Actually with Currently'
  );
  assert.ok(
    analysis.correctedVersion.includes('depended on'),
    'Should replace depended of with depended on'
  );
  assert.ok(
    analysis.correctedVersion.includes('were'),
    'Should fix people ... was -> were'
  );
  assert.ok(analysis.practiceDrill.correctAnswer.length > 0);
});

test('checkExerciseAnswer normalizes punctuation and casing properly', () => {
  assert.equal(
    checkExerciseAnswer(
      'people are very friendly in this city',
      'People are very friendly in this city.'
    ),
    true
  );
  assert.equal(checkExerciseAnswer('', 'People are very friendly in this city.'), false);
});

test('calculateNextReview updates interval and status according to SM-2 rating', () => {
  const card = INITIAL_SRS_CARDS[0];
  const afterEasy = calculateNextReview(card, 'easy');
  assert.ok(afterEasy.intervalDays >= 4);
  assert.equal(afterEasy.dueStatus, 'mastered');

  const afterHard = calculateNextReview(afterEasy, 'hard');
  assert.equal(afterHard.intervalDays, 1);
  assert.equal(afterHard.dueStatus, 'due');
});
