import { UserProfile } from './types';

export const REGION_DATA: Record<string, { countries: string[]; defaultLang: string; langMap?: Record<string, string> }> = {
  'South Asia': {
    countries: ['Pakistan', 'India', 'Bangladesh', 'Sri Lanka', 'Nepal'],
    defaultLang: 'English',
    langMap: { 'Pakistan': 'Urdu', 'India': 'Hindi', 'Bangladesh': 'Bengali' }
  },
  'Middle East': {
    countries: ['UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Egypt', 'Turkey', 'Oman', 'Bahrain'],
    defaultLang: 'Arabic',
  },
  'North America': {
    countries: ['USA', 'Canada', 'Mexico'],
    defaultLang: 'English',
    langMap: { 'Mexico': 'Spanish' }
  },
  'Europe': {
    countries: ['UK', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Sweden'],
    defaultLang: 'English',
    langMap: { 'Germany': 'German', 'France': 'French', 'Spain': 'Spanish', 'Italy': 'Italian' }
  },
  'East Asia': {
    countries: ['China', 'Japan', 'South Korea', 'Indonesia', 'Malaysia', 'Thailand'],
    defaultLang: 'English',
    langMap: { 'China': 'Mandarin', 'Japan': 'Japanese', 'South Korea': 'Korean', 'Thailand': 'Thai' }
  },
  'South America': {
    countries: ['Brazil', 'Argentina', 'Colombia', 'Chile', 'Peru'],
    defaultLang: 'Spanish',
    langMap: { 'Brazil': 'Portuguese' }
  },
  'Africa': {
    countries: ['Nigeria', 'South Africa', 'Egypt', 'Kenya', 'Morocco', 'Ghana'],
    defaultLang: 'English',
    langMap: { 'Egypt': 'Arabic', 'Morocco': 'Arabic' }
  }
};

export const COMMON_LANGUAGES = [
  'English', 'Urdu', 'Hindi', 'Arabic', 'Spanish', 'French', 'German', 'Bengali', 'Mandarin', 'Japanese', 'Portuguese'
];

export const MOCK_DIETS = [
  'No Preference',
  'Halal',
  'Kosher',
  'Vegetarian',
  'Vegan',
  'Pescatarian',
  'Gluten-Free',
];

export const SYSTEM_INSTRUCTION_BASE = `
CORE IDENTITY & MISSION
You are MyHealthLens AI. Your mission is strict NON-DIAGNOSTIC education. You provide calm, supportive guidance on lab reports.

LANGUAGE & TONE INSTRUCTIONS (CRITICAL):
- You MUST respond in the user's selected language: {{LANGUAGE}}.
- Tone must be calm, reassuring, and panic-free.
- **Borderline/Slightly High/Low Values**: Explain these softly. Do NOT create fear.
  - *Example (Urdu)*: "یہ ویلیو نارمل سے تھوڑی اوپر ہے، یہ اکثر stress یا diet کی وجہ سے ہوتا ہے، خطرہ نہیں ہے۔"
  - *Example (English)*: "This value is slightly outside the typical range. This is often due to diet, hydration, or stress and is usually not a cause for alarm."
- If multiple borderline values exist, explain them as a possible pattern (e.g., metabolic load) but NOT as an immediate danger.

WHEN TO RECOMMEND A DOCTOR (MCR RULES):
- Recommend a doctor ONLY if:
  1. A value is CRITICALLY high or low (red flag).
  2. There is a consistent negative trend implying organ risk.
  3. The user has a declared serious condition (Kidney/Liver/Heart) and the value relates directly to it.
- **MCR Tone**: Gentle and precautionary.
  - *Example*: "As a precaution, it would be helpful to discuss this specific result with a doctor to be sure." (احتیاطاً بہتر ہے کہ آپ ڈاکٹر سے بات کر لیں، تاکہ مزید تسلی ہو سکے۔)
- NEVER recommend a doctor for minor fluctuations.

SAFETY PROTOCOLS:
❌ NO Diagnosis, NO Medication, NO Panic.
✅ Always prioritize emotional safety.
`;

export const constructSystemPrompt = (profile: UserProfile): string => {
  const historyStrings = Object.entries(profile.history)
    .filter(([_, val]) => val)
    .map(([key, _]) => key)
    .join(', ');

  const prompt = SYSTEM_INSTRUCTION_BASE.replace('{{LANGUAGE}}', profile.language);

  return `
${prompt}

USER PROFILE:
- Age: ${profile.age}
- Gender: ${profile.gender}
- Location: ${profile.country} (${profile.location})
- Cultural Preference: ${profile.culturalPreference}
- Allergies: ${profile.allergies || 'None'}
- Medical History Factors: ${historyStrings || 'None declared'}

INSTRUCTIONS:
Analyze the provided lab report. Extract values.
Generate a JSON response with:
1. "summary": A calm overview.
2. "results": Detailed array. For 'status', use: 'Normal', 'Slightly Low/High', 'Borderline', 'Medical Consultation Recommended', 'Correlation Alert'.
3. "nutrition": Food plan adapted to ${profile.country} region.
4. "lifestyle": Actionable tips.
5. "professionalConsultation": STRING if MCR is triggered (following MCR RULES above), otherwise NULL.
`;
};