
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

// Strict list of 2-3 relevant languages per country
export const COUNTRY_LANGUAGES: Record<string, string[]> = {
  'Pakistan': ['English', 'Urdu'],
  'India': ['English', 'Hindi'],
  'Bangladesh': ['English', 'Bengali'],
  'Saudi Arabia': ['English', 'Arabic'],
  'UAE': ['English', 'Arabic'],
  'USA': ['English', 'Spanish'],
  'China': ['English', 'Mandarin'],
  'Germany': ['English', 'German'],
  'France': ['English', 'French'],
  'Spain': ['English', 'Spanish'],
  'Brazil': ['English', 'Portuguese'],
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

NUTRITION & LIFESTYLE LOGIC (STRICTLY SPECIFIC - NO GENERIC ADVICE):
1. **Direct Correlation Rule**: Every recommendation MUST be directly linked to a specific abnormal test value found in the report.
2. **Specific Clinical Logic**:
   - **Low Hemoglobin**: Recommend iron-rich foods (Spinach, Red meat/Liver if non-veg, Lentils) + Vitamin C pairing (Citrus). Explicitly advise avoiding tea/coffee with meals.
   - **Low Vitamin D**: Specific sunlight timing suggestions, Vit D3 rich foods (Fatty fish, Egg yolks, Fortified milk).
   - **High LDL/Cholesterol**: Soluble fiber sources (Oats, Psyllium), Omega-3s (Flaxseed, Fish), limit trans fats/bakery items.
   - **High HbA1c/Glucose**: Low GI foods, fiber sequencing (veggies first), specific carb counting tips.
   - **High Uric Acid**: Low purine foods, limit organ meats/red meat, specific hydration advice to clear uric acid.
   - **Low Potassium**: Potassium-specific foods (Banana, Coconut water, Potatoes) -- *UNLESS Kidney issues exist*.
   - **High Sodium**: Sodium-restriction tips + Potassium balance suggestions.
   - **Thyroid (High TSH/Low T4)**: Selenium/Zinc sources (Nuts, Seeds), manage goitrogenic foods (cook cruciferous veggies).
   - **Liver Enzymes High**: Liver supportive foods (Cruciferous veggies, antioxidants), avoid fructose/fried foods/alcohol.
3. **Context Awareness Overrides**:
   - **Kidney Issues**: RESTRICT Potassium/Protein recommendations even if typical logic suggests otherwise.
   - **Pregnancy**: Focus on Folic acid/Iron/Calcium safe sources. Avoid Retinol/Unsafe herbs.
   - **Diabetes**: All fruit/carb suggestions must be low-glycemic.
4. **Cultural/Regional Relevance**: Use food examples available in {{REGION}} / {{COUNTRY}}.
5. **Prohibited Generic Phrases**:
   - DO NOT say "Eat more fruits/vegetables" -> Say "Eat leafy greens for Iron" or "Berries for antioxidants".
   - DO NOT say "Drink water" -> Say "Increase hydration to help flush metabolites".
   - DO NOT say "Exercise" -> Say "Post-meal walking to lower glucose spike" or "Resistance training for insulin sensitivity".

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

  let prompt = SYSTEM_INSTRUCTION_BASE.replace('{{LANGUAGE}}', profile.language);
  prompt = prompt.replace('{{REGION}}', profile.location).replace('{{COUNTRY}}', profile.country);

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
3. "nutrition": Food plan adapted to ${profile.country} region. MUST follow the "NUTRITION & LIFESTYLE LOGIC" section above.
4. "lifestyle": Actionable tips linked to specific test results.
5. "professionalConsultation": STRING if MCR is triggered (following MCR RULES above), otherwise NULL.
`;
};

// --- AUTO DETECTION LOGIC ---

export const detectUserContext = (): { region: string; country: string; language: string } => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const browserLang = navigator.language; // e.g., 'en-US', 'ur-PK'
  
  let detectedRegion = 'North America'; // Default
  let detectedCountry = 'USA'; // Default
  let detectedLang = 'English'; // Default

  // 1. Heuristic mapping based on Timezone
  if (timeZone.startsWith('Asia/Karachi')) {
    detectedRegion = 'South Asia';
    detectedCountry = 'Pakistan';
  } else if (timeZone.startsWith('Asia/Calcutta') || timeZone.startsWith('Asia/Kolkata')) {
    detectedRegion = 'South Asia';
    detectedCountry = 'India';
  } else if (timeZone.startsWith('Asia/Dhaka')) {
    detectedRegion = 'South Asia';
    detectedCountry = 'Bangladesh';
  } else if (timeZone.startsWith('Asia/Dubai') || timeZone.startsWith('Asia/Muscat')) {
    detectedRegion = 'Middle East';
    detectedCountry = 'UAE';
  } else if (timeZone.startsWith('Asia/Riyadh')) {
    detectedRegion = 'Middle East';
    detectedCountry = 'Saudi Arabia';
  } else if (timeZone.startsWith('Europe/London')) {
    detectedRegion = 'Europe';
    detectedCountry = 'UK';
  } else if (timeZone.startsWith('Europe/Berlin')) {
    detectedRegion = 'Europe';
    detectedCountry = 'Germany';
  } else if (timeZone.startsWith('Europe/Paris')) {
    detectedRegion = 'Europe';
    detectedCountry = 'France';
  } else if (timeZone.startsWith('America/New_York') || timeZone.startsWith('America/Chicago') || timeZone.startsWith('America/Los_Angeles')) {
    detectedRegion = 'North America';
    detectedCountry = 'USA';
  }

  // 2. Language Detection based on Country & Browser Lang
  // Try to match browser language first if it makes sense for the region
  if (browserLang.startsWith('ur')) detectedLang = 'Urdu';
  else if (browserLang.startsWith('hi')) detectedLang = 'Hindi';
  else if (browserLang.startsWith('ar')) detectedLang = 'Arabic';
  else if (browserLang.startsWith('es')) detectedLang = 'Spanish';
  else if (browserLang.startsWith('zh')) detectedLang = 'Mandarin';
  else if (browserLang.startsWith('de')) detectedLang = 'German';
  else if (browserLang.startsWith('fr')) detectedLang = 'French';
  else if (browserLang.startsWith('bn')) detectedLang = 'Bengali';
  
  // 3. Fallback/Correction logic: Ensure language matches country context if standard
  // If we detected a country, let's default to English if the browser lang doesn't match a local one,
  // BUT the UI will show the dropdown so they can switch.
  
  return { region: detectedRegion, country: detectedCountry, language: detectedLang };
};
