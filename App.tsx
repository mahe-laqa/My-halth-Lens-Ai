
import React, { useState, useEffect } from 'react';
import { AppStep, UserProfile, AnalysisResponse, LabReport } from './types';
import { ProfileForm } from './components/ProfileForm';
import { ProfilePageView } from './components/ProfilePageView'; // Import new component
import { UploadSection } from './components/UploadSection';
import { ReportView } from './components/ReportView';
import { Dashboard } from './components/Dashboard';
import { SideMenu } from './components/SideMenu';
import { HistoryView } from './components/HistoryView';
import { analyzeLabReport } from './services/geminiService';
import { Logo } from './components/Logo';
import { MiniChat } from './components/MiniChat'; 
import { DietPlansView } from './components/DietPlansView'; 
import { SeasonalGuideView } from './components/SeasonalGuideView'; 
import { HelpCentreView } from './components/HelpCentreView'; 

// Utility to convert file to Data URL for storage/display
const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const App: React.FC = () => {
  // Navigation & Profile State
  const [step, setStep] = useState<AppStep>(AppStep.Welcome);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Analysis State
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [currentReportDate, setCurrentReportDate] = useState<string | undefined>(undefined);
  const [currentReportImage, setCurrentReportImage] = useState<string | undefined>(undefined);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for Chat Interaction (Feature: Follow-Up Questions)
  const [chatInitialQuestion, setChatInitialQuestion] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Disclaimer State
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  // Derived state
  const currentProfile = profiles.find(p => p.id === currentProfileId) || null;

  // Disclaimer Check
  useEffect(() => {
    const hasSeen = localStorage.getItem('hasSeenDisclaimer');
    if (!hasSeen) {
      setShowDisclaimer(true);
    }
  }, []);

  const handleDisclaimerAgree = () => {
    localStorage.setItem('hasSeenDisclaimer', 'true');
    setShowDisclaimer(false);
  };

  // Persistence: Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('myhealthlens_profiles');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setProfiles(parsed);
          if (parsed.length > 0) {
            setCurrentProfileId(parsed[0].id);
            // Only auto-redirect to the Dashboard if the profile has at least one report.
            // Otherwise, stay on AppStep.Welcome so the onboarding/profile flow is visible.
            const firstProfile = parsed[0];
            if (firstProfile.reports && firstProfile.reports.length > 0) {
              setStep(AppStep.Dashboard);
            } else {
              setStep(AppStep.Welcome);
            }
          }
        }
      } catch (e) {
        console.error("Failed to load profiles", e);
      }
    }
  }, []);

  // Persistence: Save to localStorage whenever profiles change
  useEffect(() => {
    if (profiles.length > 0) {
      localStorage.setItem('myhealthlens_profiles', JSON.stringify(profiles));
    }
  }, [profiles]);

  // Font Management
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-urdu', 'font-arabic', 'font-hindi', 'font-chinese', 'font-english');
    
    if (currentProfile?.language) {
      const lang = currentProfile.language.toLowerCase();
      if (lang === 'urdu') root.classList.add('font-urdu');
      else if (lang === 'arabic') root.classList.add('font-arabic');
      else if (lang === 'hindi') root.classList.add('font-hindi');
      else if (['mandarin', 'chinese'].includes(lang)) root.classList.add('font-chinese');
      else if (lang === 'english') root.classList.add('font-english');
    } else {
      // Default to english font if no profile or unknown
      root.classList.add('font-english');
    }
  }, [currentProfile]);

  // Handlers
  const handleProfileSave = (data: UserProfile) => {
    if (currentProfile) {
      setProfiles(prev => prev.map(p => p.id === data.id ? { ...data, reports: p.reports } : p));
      setStep(AppStep.Dashboard);
    } else {
      const newProfile = { ...data, reports: [] };
      setProfiles(prev => [...prev, newProfile]);
      setCurrentProfileId(data.id);
      setStep(AppStep.Dashboard);
    }
    window.scrollTo(0, 0);
  };

  const handleAddProfile = () => {
    setCurrentProfileId(null);
    setStep(AppStep.Profile);
  };

  const handleSwitchProfile = (id: string) => {
    setCurrentProfileId(id);
    setStep(AppStep.Dashboard);
    setAnalysisResult(null);
    setCurrentReportDate(undefined);
    setCurrentReportImage(undefined);
  };

  const handleAnalyze = async (file: File | null) => {
    if (!currentProfile) return;
    
    setIsAnalyzing(true);
    setError(null);
    setStep(AppStep.Analyzing);

    try {
      // 1. Analyze (Updated to pass profile history context internally in service)
      const result = await analyzeLabReport(currentProfile, file);

      // 2. Process Image for Storage (if applicable)
      let imageData: string | undefined = undefined;
      if (file) {
        try {
          imageData = await fileToDataURL(file);
        } catch (e) {
          console.error("Failed to convert image for storage", e);
        }
      }
      
      // 3. Create Persistence Object
      const newReport: LabReport = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        summary: result.summary,
        fullAnalysis: result,
        imageData: imageData, // Save the image permanently
        originalData: {
          text: undefined,
        }
      };

      // 4. Update Profile State with new Report
      setProfiles(prev => prev.map(p => {
        if (p.id === currentProfile.id) {
          return { ...p, reports: [newReport, ...p.reports] }; // Add to top
        }
        return p;
      }));

      // 5. Set current view
      setAnalysisResult(result);
      setCurrentReportImage(imageData); // Pass image to view
      setCurrentReportDate(undefined);
      setStep(AppStep.Results);
      window.scrollTo(0, 0);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during analysis. Please try again.");
      setStep(AppStep.Upload);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setCurrentReportDate(undefined);
    setCurrentReportImage(undefined);
    setStep(AppStep.Dashboard);
    window.scrollTo(0, 0);
  };

  const handleViewReport = (report: LabReport) => {
    setAnalysisResult(report.fullAnalysis);
    setCurrentReportDate(report.timestamp);
    setCurrentReportImage(report.imageData); // Load stored image
    setStep(AppStep.Results);
    window.scrollTo(0, 0);
  };

  const handleLogoClick = () => {
    if (currentProfile) {
      setStep(AppStep.Dashboard);
    } else {
      setStep(AppStep.Welcome);
    }
    setAnalysisResult(null);
    setCurrentReportImage(undefined);
  };
  
  // Feature: Chat Handler
  const handleAskQuestion = (q: string) => {
    setChatInitialQuestion(q);
    setIsChatOpen(true);
  };

  // View Routing
  const renderContent = () => {
    switch (step) {
      case AppStep.Welcome:
        return (
          <div className="text-center max-w-3xl mx-auto mt-8 animate-fade-in-up flex flex-col items-center">
            <div className="inline-flex items-center justify-center mb-10 px-12 py-8 bg-white/95 backdrop-blur rounded-[3rem] shadow-xl shadow-brand-100/50 ring-1 ring-brand-50 border-t border-white">
               <Logo size="lg" layout="horizontal" className="scale-105" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
              Understand Your Labs.<br />
              <span className="text-brand-600 bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-400">Empower Your Health.</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
              Upload your lab report for an instant, clear, and culturally-aware explanation. 
              Get personalized nutrition advice and lifestyle tips without the medical jargon.
            </p>
            <button
              onClick={() => setStep(AppStep.Profile)}
              className="bg-brand-600 hover:bg-brand-500 text-white text-lg font-bold py-5 px-12 rounded-2xl shadow-lg shadow-brand-200/50 transition-all transform hover:scale-[1.02] hover:ring-2 hover:ring-accent hover:ring-offset-2 border-t border-brand-400"
            >
              Start Your Analysis
            </button>
            <div className="mt-16 flex flex-wrap justify-center gap-8 text-slate-500 font-semibold text-sm uppercase tracking-wide">
               <div className="flex items-center"><span className="mr-2 text-brand-500 text-lg">🛡️</span> Private & Secure</div>
               <div className="flex items-center"><span className="mr-2 text-accent text-lg">⚡</span> Instant Analysis</div>
               <div className="flex items-center"><span className="mr-2 text-brand-500 text-lg">🌍</span> Culturally Aware</div>
            </div>
          </div>
        );

      case AppStep.Dashboard:
        return currentProfile ? <Dashboard profile={currentProfile} onNavigate={setStep} /> : null;

      case AppStep.Profile:
        // Original Profile Form for creation
        return (
          <ProfileForm 
            initialData={currentProfile} 
            onComplete={handleProfileSave} 
            isEditing={!!currentProfileId}
          />
        );

      case AppStep.ProfilePage:
        // New Comprehensive Profile Page for Editing
        return currentProfile ? (
          <ProfilePageView 
            profile={currentProfile} 
            onSave={handleProfileSave} 
            onBack={() => setStep(AppStep.Dashboard)} 
          /> 
        ) : null;

      case AppStep.Upload:
      case AppStep.Analyzing:
        return (
          <div className="space-y-6 animate-fade-in">
             <div className="flex items-center text-sm text-slate-500 mb-2">
               <button onClick={() => setStep(AppStep.Dashboard)} className="hover:text-brand-600 transition">Dashboard</button>
               <span className="mx-2">/</span>
               <span className="font-semibold text-brand-600">Upload Report</span>
             </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Upload Your Report</h2>
              <p className="text-slate-500">Take a photo of your lab results or upload an image/PDF.</p>
            </div>
            
            {error && (
              <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-center shadow-sm">
                {error}
              </div>
            )}

            <UploadSection onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
          </div>
        );

      case AppStep.Results:
        return analysisResult ? (
          <ReportView 
            data={analysisResult} 
            onReset={handleReset} 
            reportDate={currentReportDate} 
            reportImage={currentReportImage} 
            onAskQuestion={handleAskQuestion}
            userLanguage={currentProfile?.language}
          />
        ) : null;

      case AppStep.History:
        return currentProfile ? (
          <HistoryView 
            reports={currentProfile.reports || []}
            onViewReport={handleViewReport}
            onBack={() => setStep(AppStep.Dashboard)}
          />
        ) : null;

      case AppStep.Settings:
        // Can optionally redirect to ProfilePage now since preferences are there
        return (
           <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border border-brand-50 shadow-lg animate-fade-in">
             <div className="text-6xl mb-4">⚙️</div>
             <h2 className="text-2xl font-bold text-slate-800 mb-2">Settings</h2>
             <p className="text-slate-500 mb-8">Manage notifications and app preferences.</p>
             <button onClick={() => setStep(AppStep.ProfilePage)} className="text-brand-600 font-semibold hover:underline">Go to Profile Settings</button>
             <div className="mt-4">
                <button onClick={() => setStep(AppStep.Dashboard)} className="text-slate-400 font-semibold text-xs hover:text-slate-600">Back to Dashboard</button>
             </div>
           </div>
        );

      // --- NEW MODULES ---
      case AppStep.DietPlans:
        return currentProfile ? <DietPlansView profile={currentProfile} onBack={() => setStep(AppStep.Dashboard)} /> : null;
      
      case AppStep.SeasonalGuide:
        return currentProfile ? <SeasonalGuideView profile={currentProfile} onBack={() => setStep(AppStep.Dashboard)} /> : null;

      case AppStep.HelpCentre:
        return currentProfile ? <HelpCentreView profile={currentProfile} onBack={() => setStep(AppStep.Dashboard)} /> : null;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-all duration-300">
      <div className="no-print">
        <SideMenu 
          isOpen={isMenuOpen} 
          onClose={() => setIsMenuOpen(false)} 
          profiles={profiles}
          currentProfileId={currentProfileId}
          onSwitchProfile={handleSwitchProfile}
          onAddProfile={handleAddProfile}
          onNavigate={setStep}
        />
      </div>

      <header className="bg-white/80 backdrop-blur-md border-b border-white sticky top-0 z-40 shadow-sm no-print">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {profiles.length > 0 && (
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="p-2 -ml-2 text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </button>
            )}
            <div onClick={handleLogoClick} className="cursor-pointer hover:opacity-80 transition-opacity">
              <Logo />
            </div>
          </div>
          <div className="flex items-center gap-4">
             {currentProfile && (
               <button 
                 onClick={() => setStep(AppStep.Dashboard)}
                 className="p-2 text-slate-400 hover:text-brand-600 transition hidden sm:block"
                 title="Go to Dashboard"
               >
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
               </button>
             )}
             {currentProfile && step !== AppStep.Welcome && (
               <div className="flex items-center gap-2 text-xs font-medium text-brand-700 bg-brand-50 px-3 py-1.5 rounded-full border border-brand-100">
                 <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></div>
                 {currentProfile.name || 'User'}
               </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 md:px-8 py-10 w-full relative">
        {renderContent()}
      </main>

      <footer className="bg-white/50 border-t border-brand-50 py-8 mt-auto no-print">
         <div className="max-w-6xl mx-auto px-4 text-center text-slate-400 text-sm">
           <p className="flex items-center justify-center gap-2">
             <span>&copy; {new Date().getFullYear()} MyHealthLens AI.</span>
             <span className="w-1 h-1 rounded-full bg-brand-300"></span>
             <span>Educational Use Only.</span>
           </p>
         </div>
      </footer>
      
      {currentProfile && (
        <div className="no-print">
          <MiniChat 
            profile={currentProfile} 
            currentReportContext={analysisResult} 
            initialMessage={chatInitialQuestion}
            isOpenExternal={isChatOpen}
            onToggleExternal={setIsChatOpen}
          />
        </div>
      )}

      {/* Feature: First-Time Use Disclaimer Modal */}
      {showDisclaimer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in no-print">
           <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full border-t-8 border-brand-500 relative">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Welcome to MyHealthLens</h2>
              <div className="prose prose-sm text-slate-600 mb-6 bg-brand-50/50 p-4 rounded-xl border border-brand-100">
                <p>MyHealthLens provides general informational guidance based on your uploaded reports.</p>
                <p><strong>It does not give a medical diagnosis and should not replace professional medical care.</strong></p>
                <p>Always consult a qualified doctor for any medical concerns or decisions. AI-generated results may sometimes be incomplete or inaccurate.</p>
                <p className="mb-0">By continuing, you agree to use this app for informational purposes only.</p>
              </div>
              <button 
                onClick={handleDisclaimerAgree} 
                className="w-full py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 shadow-md transition-transform hover:scale-[1.02]"
              >
                I Understand
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
