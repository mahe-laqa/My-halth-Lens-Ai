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
  history: {
    diabetes: boolean;
    highBp: boolean;
    thyroid: boolean;
    kidney: boolean;
    liver: boolean;
    heart: boolean;
    pregnancy: boolean;
  };
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
}

export interface NutritionPlan {
  goal: string;
  recommended: string[];
  avoid: string[];
}

export interface AnalysisResponse {
  summary: string;
  results: LabTestResult[];
  nutrition: NutritionPlan[];
  lifestyle: string[];
  professionalConsultation: string | null;
  disclaimer: string;
}

export enum AppStep {
  Welcome,
  Dashboard, // New Hub
  Profile, // Create/Edit
  Upload,
  Analyzing,
  Results,
  History, // View History
  Settings // Settings View
}