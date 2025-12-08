import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, AnalysisResponse } from "../types";
import { constructSystemPrompt } from "../constants";

// Define the expected JSON schema for the output
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A calm, reassuring paragraph summarizing overall health status and mentioning any correlation alerts.",
    },
    results: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          testName: { type: Type.STRING },
          value: { type: Type.STRING },
          range: { type: Type.STRING },
          status: {
            type: Type.STRING,
            enum: ['Normal', 'Slightly Low/High', 'Borderline', 'Medical Consultation Recommended', 'Correlation Alert']
          },
          explanation: { type: Type.STRING, description: "Simple, non-medical explanation." },
        },
        required: ["testName", "value", "range", "status", "explanation"],
      },
    },
    nutrition: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          goal: { type: Type.STRING },
          recommended: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3-4 culturally appropriate options",
          },
          avoid: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "2-3 items to limit",
          },
        },
        required: ["goal", "recommended", "avoid"],
      },
    },
    lifestyle: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Specific, actionable lifestyle suggestions.",
    },
    professionalConsultation: {
      type: Type.STRING,
      description: "Recommendation string if MCR classifications exist, otherwise null or empty string.",
      nullable: true,
    },
    disclaimer: {
      type: Type.STRING,
      description: "Closing assurance and legal disclaimer.",
    },
  },
  required: ["summary", "results", "nutrition", "lifestyle", "disclaimer"],
};

export const analyzeLabReport = async (
  profile: UserProfile,
  file: File | null,
  textInput: string
): Promise<AnalysisResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = constructSystemPrompt(profile);

  const parts: any[] = [];

  // Add text input if exists
  if (textInput.trim()) {
    parts.push({ text: `Lab Report Text Data: ${textInput}` });
  }

  // Add image if exists
  if (file) {
    const base64Data = await fileToGenerativePart(file);
    parts.push({
      inlineData: {
        data: base64Data,
        mimeType: file.type,
      },
    });
  }

  if (parts.length === 0) {
    throw new Error("Please provide an image or text input.");
  }

  // Use gemini-2.5-flash for efficiency and good reasoning capabilities with the specific system prompt
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: {
      role: "user",
      parts: parts
    },
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: analysisSchema,
      temperature: 0.3, // Lower temperature for more consistent/safe medical explanations
    },
  });

  const responseText = response.text;
  if (!responseText) throw new Error("No response from AI");

  try {
    return JSON.parse(responseText) as AnalysisResponse;
  } catch (e) {
    console.error("Failed to parse JSON", e);
    throw new Error("Failed to parse analysis results.");
  }
};

const fileToGenerativePart = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(",")[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
