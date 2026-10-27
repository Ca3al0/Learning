import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import {
  analyzeEnglishTextDeterministic,
  TextAnalysisResult,
} from './src/lib/linguisticEngine';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '1mb' }));

  app.post('/api/analyze-english', async (req, res) => {
    const { text } = req.body as { text?: string };
    if (!text || typeof text !== 'string' || text.trim().length < 3) {
      res.status(400).json({
        error: 'Por favor escribe al menos una oración en inglés para analizar.',
      });
      return;
    }

    const deterministicBaseline = analyzeEnglishTextDeterministic(text);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.json({
        ...deterministicBaseline,
        engineSource: 'deterministic',
      });
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Analyze the following English text written by a Spanish speaker learning English.
Provide a rigorous linguistic diagnosis in Spanish (with English examples/corrections).
Text to analyze: """${text.trim()}"""`,
        config: {
          systemInstruction:
            'You are a Cambridge C2 English linguistics professor specialized in teaching Spanish speakers. Identify false friends, preposition errors, tense mistakes, and syntax issues. Explain rules clearly in Spanish.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              estimatedLevel: {
                type: Type.STRING,
                description: 'CEFR level: A1, A2, B1, B2, C1, or C2',
              },
              overallScore: {
                type: Type.INTEGER,
                description: 'Score from 0 to 100',
              },
              correctedVersion: {
                type: Type.STRING,
                description: 'Grammatically correct natural version of the user text',
              },
              c1ElevatedVersion: {
                type: Type.STRING,
                description: 'C1/C2 academic or professional elevated rewrite of the text',
              },
              nextFocusEs: {
                type: Type.STRING,
                description: 'Concrete next learning priority in Spanish',
              },
            },
            required: [
              'estimatedLevel',
              'overallScore',
              'correctedVersion',
              'c1ElevatedVersion',
              'nextFocusEs',
            ],
          },
        },
      });

      const rawJson = response.text?.trim();
      if (rawJson) {
        const parsed = JSON.parse(rawJson);
        const validLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        const merged: TextAnalysisResult = {
          ...deterministicBaseline,
          estimatedLevel: validLevels.includes(parsed.estimatedLevel)
            ? parsed.estimatedLevel
            : deterministicBaseline.estimatedLevel,
          overallScore:
            typeof parsed.overallScore === 'number'
              ? Math.max(20, Math.min(100, parsed.overallScore))
              : deterministicBaseline.overallScore,
          correctedVersion:
            parsed.correctedVersion || deterministicBaseline.correctedVersion,
          c1ElevatedVersion:
            parsed.c1ElevatedVersion || deterministicBaseline.c1ElevatedVersion,
          nextFocusEs: parsed.nextFocusEs || deterministicBaseline.nextFocusEs,
        };
        res.json({ ...merged, engineSource: 'gemini-hybrid' });
        return;
      }
    } catch {
      // Fall back cleanly to deterministic linguistic analysis when offline or quota-limited
    }

    res.json({
      ...deterministicBaseline,
      engineSource: 'deterministic',
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*all', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
