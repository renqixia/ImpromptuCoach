var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var aiInstance = null;
function getAi() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing. Please select an API key in the 'Settings > Secrets' panel.");
  }
  if (!aiInstance) {
    aiInstance = new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiInstance;
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json({ limit: "10mb" }));
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
          \u4F5C\u4E3A\u5373\u5174\u6F14\u8BB2\u6559\u7EC3\uFF0C\u8BF7\u5206\u6790\u4EE5\u4E0B\u6F14\u8BB2\u5185\u5BB9\u3002
          \u9898\u76EE\uFF1A${questionText}
          \u5206\u7C7B\uFF1A${category}
          \u6F14\u8BB2\u5185\u5BB9\uFF1A${transcript}

          \u8BF7\u6839\u636E\u300A\u7CBE\u82F1\u8868\u8FBE\uFF1A\u9ED1\u5929\u9E45\u6311\u6218\u300B\u7684\u903B\u8F91\uFF0C\u5BF9\u6F14\u8BB2\u8FDB\u884C\u8BC4\u5206\uFF080-100\uFF09\u3002
          \u5E76\u63D0\u4F9B\u4EE5\u4E0B\u4E94\u4E2A\u7EF4\u5EA6\u7684\u96F7\u8FBE\u56FE\u6570\u636E\uFF081-10\u5206\uFF09\uFF1A
          1. \u903B\u8F91\u529B (Logic)
          2. \u5171\u60C5\u529B (Emotion)
          3. \u8868\u8FBE\u529B (Fluency)
          4. \u67B6\u6784\u529B (Structure)
          5. \u6D1E\u5BDF\u529B (Insight)

          \u540C\u65F6\u63D0\u4F9B\u4E00\u6BB5\u6781\u7B80\u7684\u70B9\u8BC4\uFF0830\u5B57\u4EE5\u5185\uFF09\u3002
        `,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: import_genai.Type.OBJECT,
            properties: {
              score: { type: import_genai.Type.NUMBER },
              radar: {
                type: import_genai.Type.OBJECT,
                properties: {
                  logic: { type: import_genai.Type.NUMBER },
                  emotion: { type: import_genai.Type.NUMBER },
                  fluency: { type: import_genai.Type.NUMBER },
                  structure: { type: import_genai.Type.NUMBER },
                  insight: { type: import_genai.Type.NUMBER }
                },
                required: ["logic", "emotion", "fluency", "structure", "insight"]
              },
              feedback: { type: import_genai.Type.STRING }
            },
            required: ["score", "radar", "feedback"]
          }
        }
      });
      const analysis = JSON.parse(response.text || "{}");
      res.json(analysis);
    } catch (error) {
      console.error("AI Analysis Error:", error);
      res.status(500).json({
        error: "Analysis failed",
        details: error?.message || String(error)
      });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
