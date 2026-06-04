/// <reference types="vite/client" />

import { UserProfile, AnalysisResponse } from "../types";
import { constructSystemPrompt } from "../constants";

const getApiKey = (): string => {
  // Vite exposes env vars prefixed with VITE_ on the client side.
  // On Vercel serverless deployments the variable may be injected without the prefix.
  // Fall back to a plain environment variable if the VITE version is undefined.
  return import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
};

const fetchWithFallbackAndRetry = async (
  body: any
): Promise<Response> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API Key not found. Set VITE_GEMINI_API_KEY in .env.local or GEMINI_API_KEY in Vercel env.");
  }
  // Models and their corresponding API version prefixes.
  const modelConfigs = [
    { model: "gemini-2.5-flash", version: "v1" },
    { model: "gemini-2.0-flash", version: "v1" }
  ];
  let lastError: Error | null = null;

  for (const { model, version } of modelConfigs) {
    let retries = 2;
    while (retries > 0) {
      try {
        const url = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          return res;
        }

        const errorData = await res.json().catch(() => ({}));
        const errMsg = errorData.error?.message || res.statusText || "Unknown error";
        
        const isRetryable = 
          res.status === 429 || 
          res.status >= 500 || 
          errMsg.toLowerCase().includes("high demand") || 
          errMsg.toLowerCase().includes("limit") || 
          errMsg.toLowerCase().includes("overloaded") ||
          errMsg.toLowerCase().includes("capacity");

        if (!isRetryable) {
          throw new Error(errMsg);
        }

        lastError = new Error(errMsg);
      } catch (err: any) {
        lastError = err;
      }

      retries--;
      if (retries > 0) {
        // Wait 1.5 seconds before retrying
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }
  }

  throw lastError || new Error("Failed to contact Gemini API after multiple retries");
};

export const analyzeLabReport = async (
  profile: UserProfile,
  file: File | null
): Promise<AnalysisResponse> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key not found. Set VITE_GEMINI_API_KEY in .env.local or GEMINI_API_KEY in Vercel env.");

  if (!file) {
    throw new Error("Please upload a report image or PDF.");
  }

  const systemInstruction = constructSystemPrompt(profile);

  // augment system instruction with enhanced feature requirements
  const augmentedInstruction = `
    ${systemInstruction}

    ENHANCED ANALYSIS REQUIREMENTS:
    1. Trend Insight: If previous reports exist in context, briefly mention improvements or patterns (1-2 sentences).
    2. Image Quality: Briefly assess if the image is clear and readable (1 sentence).
    3. Simple Definitions: For every test, provide a 1-line "what is this" definition.
    4. Food Suggestions: For every test, provide a specific, actionable food recommendation.
    5. Daily Routine Tip: For every test, provide a small, practical lifestyle habit change.
    6. Follow-up Questions: Generate exactly 2 questions the user might be thinking.
    7. Next Test: Suggest one relevant follow-up test based on findings.
    8. Risk Flags: Identify if 'Sleep', 'Stress', or 'Diet' seem to be root causes (list as array).
    9. Medications: If user listed medications (${profile.medications || 'None'}), mention general interactions non-diagnostically (1-2 sentences).
    10. Short Summary: Create a concise 4-5 line summary readable in 30 seconds.

    CRITICAL INSTRUCTIONS:
    1. Carefully analyze the uploaded lab report image and extract ALL visible test names, values, and reference ranges.
    2. Determine status for each test: "Normal", "Slightly Low/High", "Borderline", "Medical Consultation Recommended", or "Correlation Alert".
    3. Be concise in explanations to fit within response limits.
    4. Return ONLY a valid JSON object with this EXACT structure (no extra fields or text):
    {
      "summary": "Brief overall summary (1-2 sentences)",
      "shortSummary": "4-5 line summary",
      "results": [
        {
          "testName": "string",
          "value": "string",
          "range": "string",
          "status": "string",
          "explanation": "1-2 sentence explanation",
          "simpleDefinition": "1-line definition",
          "foodSuggestion": "specific food action",
          "dailyRoutineTip": "small habit change"
        }
      ],
      "nutrition": [
        {
          "goal": "string",
          "recommended": ["string"],
          "avoid": ["string"]
        }
      ],
      "lifestyle": ["string"],
      "professionalConsultation": "string or null",
      "disclaimer": "Standard medical disclaimer",
      "trendInsight": "string",
      "imageQuality": "string",
      "followUpQuestions": ["string", "string"],
      "nextTestSuggestion": "string",
      "riskFactors": ["string"],
      "medicationNotes": "string"
    }
    5. IMPORTANT CONSTRAINTS:
       - "results" MUST be an array of objects (one per test).
       - "nutrition" MUST be an array of objects.
       - "lifestyle", "followUpQuestions", "riskFactors" MUST be arrays of strings.
       - Include ALL tests from the report image.
       - Do NOT return objects where arrays are expected.
       - Ensure the entire response is valid JSON and fits within token limits.
   `;

  const base64Data = await fileToGenerativePart(file);

  // Build message content
  let textContent = "Please analyze this lab report and provide detailed health insights.";
  if (profile.reports && profile.reports.length > 0) {
    const historySummary = profile.reports.slice(0, 3).map(r =>
      `Date: ${r.timestamp}, Summary: ${r.summary}`
    ).join('\n');
    textContent += `\n\nUser's Previous History Context:\n${historySummary}`;
  }

  // Call Gemini API with automatic fallback and retry
  const response = await fetchWithFallbackAndRetry({
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: file.type,
              data: base64Data,
            },
          },
          {
            text: textContent,
          },
        ],
      },
    ],
    systemInstruction: {
      parts: [
        {
          text: augmentedInstruction,
        },
      ],
    },
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.1,
      maxOutputTokens: 8192,
    },
  });

  const data = await response.json();
  const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  console.log('AI Response Text:', responseText);

  if (!responseText) throw new Error("No response from AI");

  try {
    let cleanText = responseText.trim();
    if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/, "");
    }
    cleanText = cleanText.trim();

    let parsed: any;
    try {
      parsed = JSON.parse(cleanText);
    } catch (e) {
      const startIdx = cleanText.indexOf("{");
      const endIdx = cleanText.lastIndexOf("}");
      if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        parsed = JSON.parse(cleanText.substring(startIdx, endIdx + 1));
      } else {
        throw e;
      }
    }

    console.log('Parsed Analysis:', parsed);
    console.log('Results:', parsed.results);

    // Normalize fields to ensure they are arrays
    if (!Array.isArray(parsed.nutrition)) parsed.nutrition = [];
    if (!Array.isArray(parsed.lifestyle)) parsed.lifestyle = [];
    if (!Array.isArray(parsed.results)) parsed.results = [];
    if (!Array.isArray(parsed.followUpQuestions)) parsed.followUpQuestions = [];
    if (!Array.isArray(parsed.riskFactors)) parsed.riskFactors = [];

    return parsed as AnalysisResponse;
  } catch (e) {
    console.error("Failed to parse JSON", e);
    console.error("Response Text:", responseText);
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
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key not found. Set VITE_GEMINI_API_KEY in .env.local or GEMINI_API_KEY in Vercel env.");

  const systemInstruction = constructSystemPrompt(profile);

  let contextInfo = '';
  if (currentReportContext) {
    contextInfo = `

CURRENT REPORT ANALYSIS CONTEXT:
${JSON.stringify(currentReportContext, null, 2)}

IMPORTANT: You have access to the user's recently analyzed lab report. Use this data to answer questions about their specific test results, values, and recommendations. Reference the actual numbers and findings from their report.`;
  }

  const augmentedInstruction = `
    ${systemInstruction}${contextInfo}

    ADDITIONAL ANALYSIS REQUIREMENTS:
    1. Trend Insight: If previous reports exist in context, briefly mention improvements or patterns.
    2. Image Quality: Briefly state if the image is clear.
    3. Simple Definitions: For every test, provide a 1-line "what is this" definition.
    4. Food Suggestions: For every test, provide a specific food action.
    5. Daily Routine Tip: For every test, provide a small lifestyle habit change.
    6. Follow-up Questions: Generate 2 questions the user might be thinking.
    7. Next Test: Suggest one relevant follow-up test.
    8. Risk Flags: Identify if 'Sleep', 'Stress', or 'Diet' seem to be root causes.
    9. Medications: If user listed medications (${profile.medications || 'None'}), mention general interactions non-diagnostically.
    10. Short Summary: Create a 30-second read summary (4-5 lines).

    IMPORTANT: Respond helpfully and in the user's language.
  `;

  // Call Gemini API with automatic fallback and retry
  const response = await fetchWithFallbackAndRetry({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: message,
          },
        ],
      },
    ],
    systemInstruction: {
      parts: [
        {
          text: augmentedInstruction,
        },
      ],
    },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  });

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that.";
};
