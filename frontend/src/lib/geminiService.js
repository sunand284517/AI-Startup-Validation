import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "" }); 

// Select your fine-tuned model name here via environment variable, otherwise fallback to the base model.
const AI_MODEL = import.meta.env.VITE_GEMINI_MODEL || process.env.GEMINI_MODEL || "gemini-3-flash-preview";

export async function evaluateIdea(title, problem, solution) {
  const prompt = `Evaluate the following startup idea:
  Title: ${title}
  Problem: ${problem}
  Solution: ${solution}
  
  Provide a quality score from 0 to 100, structured feedback, a suggested category, and determine if it's spam or low-effort.`;

  try {
    const response = await ai.models.generateContent({
      model: AI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            feedback: { type: Type.STRING },
            category: { type: Type.STRING },
            isSpam: { type: Type.BOOLEAN },
          },
          required: ["score", "feedback", "category", "isSpam"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return result;
  } catch (error) {
    console.error("AI Evaluation Error:", error);
    return {
      score: 50,
      feedback: "AI evaluation unavailable at the moment.",
      category: "General",
      isSpam: false,
    };
  }
}
