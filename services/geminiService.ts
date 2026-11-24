import { GoogleGenAI } from "@google/genai";
import { PROFILE } from '../data/profile';
import { SKILL_CATEGORIES } from '../data/skills';
import { EXPERIENCES } from '../data/experience';
import { PROJECTS } from '../data/projects';
import { INITIATIVES } from '../data/leadership';
import { ACHIEVEMENTS, EDUCATION, CERTIFICATIONS, CURRENTLY_BUILDING } from '../data/achievements';

let genAI: GoogleGenAI | null = null;

if (process.env.API_KEY) {
  genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const askGemini = async (question: string): Promise<string> => {
  if (!genAI) {
    return "NAVEEN_OS AI: Interface offline. API_KEY not configured in environment.";
  }

  const context = `
You are NAVEEN_OS AI Assistant, embedded in a CLI-style developer portfolio for Naveen S.

PROFILE:
Name: ${PROFILE.name}
Title: ${PROFILE.title}
Headline: ${PROFILE.headline}
Location: ${PROFILE.location}
Summary: ${PROFILE.summary}

SKILLS:
${SKILL_CATEGORIES.map(c => `${c.name}: ${c.items.join(', ')}`).join('\n')}

EXPERIENCE:
${EXPERIENCES.map(e => `${e.position} at ${e.company} (${e.duration}): ${e.highlights.join('; ')}`).join('\n')}

PROJECTS:
${Object.values(PROJECTS).map(p => `${p.fullName}: ${p.description} [${p.tech.join(', ')}]`).join('\n')}

LEADERSHIP & INITIATIVES:
${Object.values(INITIATIVES).map(i => `${i.name} - ${i.position}: ${i.description}`).join('\n')}

ACHIEVEMENTS:
${ACHIEVEMENTS.map(a => `${a.title}: ${a.detail}`).join('\n')}

EDUCATION:
${EDUCATION.map(e => `${e.degree} - ${e.institution} (${e.duration}) ${e.score}`).join('\n')}

CERTIFICATIONS:
${CERTIFICATIONS.map(c => `${c.name} - ${c.issuer}`).join('\n')}

CURRENTLY BUILDING:
${CURRENTLY_BUILDING.map(c => `${c.name}: ${c.description} [${c.status}]`).join('\n')}

User Question: "${question}"

Instructions:
- Answer as NAVEEN_OS AI Assistant, the portfolio's built-in intelligence.
- Keep answers concise (under 120 words).
- Use technical but accessible language.
- Reference actual portfolio data when relevant.
- If the question is unrelated, politely redirect to Naveen's work and capabilities.
- Do not mention you are Gemini or Google AI.
`;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: context,
    });
    return response.text || "NAVEEN_OS AI: No response data received.";
  } catch (error: any) {
    console.error("AI Error:", error);
    return "NAVEEN_OS AI: Connection error. Please try again later.";
  }
};
