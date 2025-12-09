
export interface LabReport {
  id: string;
  timestamp: string; // ISO Date
  summary: string;
  fullAnalysis: AnalysisResponse; // The complete original analysis
  imageData?: string; // Base64 Data URL of the original image (Mandatory for history)
  originalData: {
    text?: string;
  };
}

export interface UserProfile {
  id: string; // Unique identifier for multi-profile
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  location: string; // This will now serve as the Region
  country: string;
  language: string;
  culturalPreference: string;
  allergies: string;
  medications?: string; // Feature: Medication Interaction
  history: {
    diabetes: boolean;
    highBp: boolean;
    thyroid: boolean;
    kidney: boolean;
    liver: boolean;
    heart: boolean;
    pregnancy: boolean;
  };
  reports: LabReport[]; // 2-Year History Storage
  reminderEnabled?: boolean; // Feature: Smart Reminder
}

export enum ResultStatus {
  Normal = 'Normal',
  SlightlyLowHigh = 'Slightly Low/High',
  Borderline = 'Borderline',
  MCR = 'Medical Consultation Recommended',
  CorrelationAlert = 'Correlation Alert',
}

export interface LabTestResult {
  testName: string;
  value: string;
  range: string;
  status: ResultStatus;
  explanation: string;
  simpleDefinition?: string; // Feature: Term Simplifier
  foodSuggestion?: string; // Feature: Nutrition Matcher
  dailyRoutineTip?: string; // Feature: Lifestyle Matcher
}

export interface NutritionPlan {
  goal: string;
  recommended: string[];
  avoid: string[];
}

export interface AnalysisResponse {
  summary: string;
  shortSummary?: string; // Feature: 30-Sec Summary
  results: LabTestResult[];
  nutrition: NutritionPlan[];
  lifestyle: string[];
  professionalConsultation: string | null;
  disclaimer: string;
  trendInsight?: string; // Feature: Trend Insights
  imageQuality?: string; // Feature: Report Quality
  
  // NEW EXTENSIONS
  followUpQuestions?: string[]; // Feature: AI Follow-Up
  nextTestSuggestion?: string; // Feature: Next Relevant Test
  riskFactors?: string[]; // Feature: Soft Risk Flags
  medicationNotes?: string; // Feature: Medication Interaction
}

export enum AppStep {
  Welcome,
  Dashboard, // New Hub
  Profile, // Create/Edit
  Upload,
  Analyzing,
  Results,
  History, // View History
  Settings, // Settings View
  DietPlans, // New Module 1
  SeasonalGuide, // New Module 2
  HelpCentre // New Module 3
}