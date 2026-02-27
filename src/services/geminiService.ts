import { GoogleGenAI, Type } from "@google/genai";
import { Job, StudentSkill, Project, AIFeedback } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function calculateMatch(job: Job, studentProfile: {
  skills: StudentSkill[],
  projects: Project[],
  qualification: string
}): Promise<AIFeedback> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Compare the following Job Requirements with the Student's Profile and calculate a match percentage.
    
    Job Requirements:
    Role: ${job.role}
    Type: ${job.type}
    Skills Needed: ${job.requirements.map(r => `${r.skill} (Level: ${r.level}/5, Weight: ${r.weight}/5)`).join(', ')}
    Description: ${job.description}
    
    Student Profile:
    Qualification: ${studentProfile.qualification}
    Skills: ${studentProfile.skills.map(s => `${s.skill} (Level: ${s.level}/5)`).join(', ')}
    Projects: ${studentProfile.projects.map(p => `${p.title} (Skills: ${p.skills.join(', ')})`).join('; ')}
    
    Return a JSON object with:
    - percentage: number (0-100)
    - explanation: string (brief overview)
    - matchedSkills: string[] (skills that meet or exceed requirements)
    - missingSkills: string[] (skills that are below requirement or missing)
    - suggestions: string[] (how to improve)
    - isShortlisted: boolean (true if percentage >= 70)
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          percentage: { type: Type.NUMBER },
          explanation: { type: Type.STRING },
          matchedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
          missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          isShortlisted: { type: Type.BOOLEAN },
        },
        required: ["percentage", "explanation", "matchedSkills", "missingSkills", "suggestions", "isShortlisted"]
      }
    }
  });

  return JSON.parse(response.text);
}
