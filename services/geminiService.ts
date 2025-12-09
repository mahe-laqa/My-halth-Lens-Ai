
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
    shortSummary: {
      type: Type.STRING,
      description: "A very concise 4-5 line summary of the entire report for quick reading (30-second summary).",
    },
    trendInsight: {
      type: Type.STRING,
      description: "A short non-technical observation comparing current results to past history context (if provided).",
    },
    imageQuality: {
      type: Type.STRING,
      description: "Evaluation of image clarity (e.g., 'Image is clear' or 'Slightly blurry but readable').",
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
          simpleDefinition: { type: Type.STRING, description: "One line simple definition of what the test is." },
          foodSuggestion: { type: Type.STRING, description: "Specific food tip based on the result value." },
          dailyRoutineTip: { type: Type.STRING, description: "One simple daily routine habit change based on this result." },
        },
        required: ["testName", "value", "range", "status", "explanation", "simpleDefinition", "foodSuggestion", "dailyRoutineTip"],
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
    // NEW FIELDS
    followUpQuestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "2 simple questions the user might want to ask next.",
    },
    nextTestSuggestion: {
      type: Type.STRING,
      description: "One line suggesting a relevant future test (if needed).",
    },
    riskFactors: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of soft risk keywords detected: 'Sleep', 'Diet', 'Stress', 'Hydration'.",
    },
    medicationNotes: {
      type: Type.STRING,
      description: "General non-diagnostic note on how declared medications might interact with these tests.",
    },
  },
  required: ["summary", "shortSummary", "results", "nutrition", "lifestyle", "disclaimer", "followUpQuestions", "riskFactors"],
};

export const analyzeLabReport = async (
  profile: UserProfile,
  file: File | null
): Promise<AnalysisResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  if (!file) {
    throw new Error("Please upload a report image or PDF.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = constructSystemPrompt(profile);

  // augment system instruction with new feature requirements
  const augmentedInstruction = `
    ${systemInstruction}
    
    ADDITIONAL ANALYSIS REQUIREMENTS:
    1. Trend Insight: If previous reports exist in context, briefly mention improvements or patterns.
    2. Image Quality: Briefly state if the image is clear.
    3. Simple Definitions: For every test, provide a 1-line "what is this" definition (Medical Term Simplifier).
    4. Food Suggestions: For every test, provide a specific food action (Nutrition Matcher).
    5. Daily Routine Tip: For every test, provide a small lifestyle habit change (Lifestyle Matcher).
    6. Follow-up Questions: Generate 2 questions the user might be thinking.
    7. Next Test: Suggest one relevant follow-up test.
    8. Risk Flags: Identify if 'Sleep', 'Stress', or 'Diet' seem to be root causes.
    9. Medications: If user listed medications (${profile.medications || 'None'}), mention general interactions non-diagnostically.
    10. Short Summary: Create a 30-second read summary (4-5 lines).
  `;

  const parts: any[] = [];

  const base64Data = await fileToGenerativePart(file);
  parts.push({
    inlineData: {
      data: base64Data,
      mimeType: file.type,
    },
  });
  
  // Pass history context if available (for Trend Insights)
  if (profile.reports && profile.reports.length > 0) {
    const historySummary = profile.reports.slice(0, 3).map(r => 
      `Date: ${r.timestamp}, Summary: ${r.summary}`
    ).join('\n');
    parts.push({
      text: `User's Previous History Context:\n${historySummary}`
    });
  }

  // Use gemini-2.5-flash for efficiency
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: {
      role: "user",
      parts: parts
    },
    config: {
      systemInstruction: augmentedInstruction,
      responseMimeType: "application/json",
      responseSchema: analysisSchema,
      temperature: 0.3,
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

export const chatWithHealthAssistant = async (
  profile: UserProfile,
  message: string,
  currentReportContext?: AnalysisResponse | null
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");
  const ai = new GoogleGenAI({ apiKey });

  let contextString = "";
  if (currentReportContext) {
    contextString = `Current Report Context: ${JSON.stringify(currentReportContext.results)}`;
  }

  const prompt = `
    You are a helpful, non-diagnostic health assistant.
    User Language: ${profile.language}
    User Region: ${profile.country}
    Context: ${contextString}
    
    User Question: "${message}"
    
    Answer in 2-3 short, clear sentences. Use everyday language.
    Do NOT diagnose. If serious, suggest a doctor.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  
  return response.text || "I'm sorry, I couldn't process that.";
};
