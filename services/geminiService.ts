/// <reference types="vite/client" />

import { UserProfile, AnalysisResponse } from "../types";
import { constructSystemPrompt } from "../constants";

export const analyzeLabReport = async (
  profile: UserProfile,
  file: File | null
): Promise<AnalysisResponse> => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("API Key not found. Please set VITE_OPENROUTER_API_KEY in .env.local");

  if (!file) {
    throw new Error("Please upload a report image or PDF.");
  }

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

    CRITICAL INSTRUCTIONS:
    1. Analyze the uploaded lab report image and extract ALL test names, values, and reference ranges.
    2. Return ONLY a valid JSON object with this EXACT structure:
    {
      "summary": "Brief overall summary string",
      "shortSummary": "4-5 line summary string",
      "results": [
        {
          "testName": "Test name string",
          "value": "Value string",
          "range": "Reference range string",
          "status": "Normal|Slightly Low/High|Borderline|Medical Consultation Recommended|Correlation Alert",
          "explanation": "Detailed explanation string",
          "simpleDefinition": "One-line definition string",
          "foodSuggestion": "Specific food recommendation string",
          "dailyRoutineTip": "Lifestyle tip string"
        }
      ],
      "nutrition": [
        {
          "goal": "Nutrition goal string",
          "recommended": ["food1", "food2"],
          "avoid": ["food1", "food2"]
        }
      ],
      "lifestyle": ["tip1", "tip2", "tip3"],
      "professionalConsultation": "Consultation advice or null",
      "disclaimer": "Standard disclaimer text",
      "trendInsight": "Trend analysis string",
      "imageQuality": "Image quality assessment",
      "followUpQuestions": ["question1", "question2"],
      "nextTestSuggestion": "Suggested next test",
      "riskFactors": ["factor1", "factor2"],
      "medicationNotes": "Medication interaction notes"
    }
    3. IMPORTANT:
       - "results" MUST be an array of objects (one per test found)
       - "nutrition" MUST be an array of objects with goal/recommended/avoid
       - "lifestyle" MUST be an array of strings
       - "followUpQuestions" MUST be an array of strings
       - "riskFactors" MUST be an array of strings
       - Do NOT return objects where arrays are expected
       - Include ALL tests visible in the report image
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

  let messageContent: any[] = [
    {
      type: "image_url",
      image_url: {
        url: `data:${file.type};base64,${base64Data}`
      }
    },
    {
      type: "text",
      text: textContent
    }
  ];

  // Call OpenRouter API
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": window.location.origin,
      "X-Title": "MyHealthLens",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o",
      messages: [
        {
          role: "system",
          content: augmentedInstruction,
        },
        {
          role: "user",
          content: messageContent,
        },
      ],
      response_format: {"type": "json_object"},
      temperature: 0.1,
      max_tokens: 2500,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenRouter API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  const responseText = data.choices?.[0]?.message?.content;

  console.log('AI Response Text:', responseText);

  if (!responseText) throw new Error("No response from AI");

  try {
    const parsed = JSON.parse(responseText) as AnalysisResponse;
    console.log('Parsed Analysis:', parsed);
    console.log('Results:', parsed.results);

    // Normalize fields to ensure they are arrays
    if (!Array.isArray(parsed.nutrition)) parsed.nutrition = [];
    if (!Array.isArray(parsed.lifestyle)) parsed.lifestyle = [];
    if (!Array.isArray(parsed.results)) parsed.results = [];
    if (!Array.isArray(parsed.followUpQuestions)) parsed.followUpQuestions = [];
    if (!Array.isArray(parsed.riskFactors)) parsed.riskFactors = [];

    return parsed;
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
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
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

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": window.location.origin,
      "X-Title": "MyHealthLens",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: augmentedInstruction,
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenRouter API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that.";
};
