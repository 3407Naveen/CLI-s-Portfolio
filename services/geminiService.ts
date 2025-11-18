import { GoogleGenAI } from "@google/genai";
import { PROJECTS, SKILLS, TIMELINE } from '../constants';

let genAI: GoogleGenAI | null = null;

// Initialize Gemini safely
if (process.env.API_KEY) {
  genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const askGemini = async (question: string): Promise<string> => {
  if (!genAI) {
    return "Error: AI Interface Offline. API_KEY missing in environment.";
  }

  // Construct a context string from our portfolio data
  const context = `
    You are an AI assistant embedded in a CLI portfolio for a Creative Developer.
    
    Here is the developer's data:
    
    SKILLS:
    ${JSON.stringify(SKILLS.map(s => `${s.name} (${s.level}/100): ${s.description}`))}
    
    PROJECTS:
    ${JSON.stringify(Object.values(PROJECTS).map(p => ({ name: p.name, desc: p.description, tech: p.tech })))}
    
    CAREER TIMELINE:
    ${JSON.stringify(TIMELINE)}

    User Question: "${question}"

    Instructions:
    - Answer as if you are the system interface or a helpful holographic assistant.
    - Keep the answer concise (under 100 words).
    - Use technical but accessible language.
    - Do not mention you are Gemini or Google AI. You are "DevCLI AI".
    - If the question is unrelated to the portfolio, politely redirect to the developer's work.
  `;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: context,
    });

    return response.text || "System: No response data received.";
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return "System Error: Connection to Neural Link failed. Please try again later.";
  }
};
