import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiInstance: GoogleGenAI | null = null;

function getAi() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing. Please select an API key in the 'Settings > Secrets' panel.");
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ 
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.post("/api/analyze", async (req, res) => {
    try {
      const { transcript, questionText, category } = req.body;

      if (!transcript) {
        return res.status(400).json({ error: "No transcript provided" });
      }

      const ai = getAi();

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `
          作为即兴演讲教练，请分析以下演讲内容。
          题目：${questionText}
          分类：${category}
          演讲内容：${transcript}

          请根据《精英表达：黑天鹅挑战》的逻辑，对演讲进行评分（0-100）。
          并提供以下五个维度的雷达图数据（1-10分）：
          1. 逻辑力 (Logic)
          2. 共情力 (Emotion)
          3. 表达力 (Fluency)
          4. 架构力 (Structure)
          5. 洞察力 (Insight)

          同时提供一段极简的点评（30字以内）。
        `,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              radar: {
                type: Type.OBJECT,
                properties: {
                  logic: { type: Type.NUMBER },
                  emotion: { type: Type.NUMBER },
                  fluency: { type: Type.NUMBER },
                  structure: { type: Type.NUMBER },
                  insight: { type: Type.NUMBER }
                },
                required: ["logic", "emotion", "fluency", "structure", "insight"]
              },
              feedback: { type: Type.STRING }
            },
            required: ["score", "radar", "feedback"]
          }
        }
      });

      const analysis = JSON.parse(response.text || "{}");
      res.json(analysis);
    } catch (error: any) {
      console.error("AI Analysis Error:", error);
      res.status(500).json({ 
        error: "Analysis failed", 
        details: error?.message || String(error)
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
