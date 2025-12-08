import React, { useState, useEffect } from 'react';
import { AppStep, UserProfile, AnalysisResponse } from './types';
import { ProfileForm } from './components/ProfileForm';
import { UploadSection } from './components/UploadSection';
import { ReportView } from './components/ReportView';
import { Dashboard } from './components/Dashboard';
import { SideMenu } from './components/SideMenu';
import { analyzeLabReport } from './services/geminiService';
import { Logo } from './components/Logo';

const App: React.FC = () => {
  // Navigation & Profile State
  const [step, setStep] = useState<AppStep>(AppStep.Welcome);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Analysis State
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Derived state
  const currentProfile = profiles.find(p => p.id === currentProfileId) || null;

  // Font Management
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-urdu', 'font-arabic', 'font-hindi', 'font-chinese');
    
    if (currentProfile?.language) {
      const lang = currentProfile.language.toLowerCase();
      if (lang === 'urdu') root.classList.add('font-urdu');
      else if (lang === 'arabic') root.classList.add('font-arabic');
      else if (lang === 'hindi') root.classList.add('font-hindi');
      else if (['mandarin', 'chinese'].includes(lang)) root.classList.add('font-chinese');
    }
  }, [currentProfile]);

  // Handlers
  const handleProfileSave = (data: UserProfile) => {
    if (currentProfile) {
      // Edit mode
      setProfiles(prev => prev.map(p => p.id === data.id ? data : p));
      setStep(AppStep.Dashboard);
    } else {
      // Create mode
      setProfiles(prev => [...prev, data]);
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
    setAnalysisResult(null); // Clear previous analysis when switching
  };

  const handleAnalyze = async (file: File | null, text: string) => {
    if (!currentProfile) return;
    
    setIsAnalyzing(true);
    setError(null);
    setStep(AppStep.Analyzing);

    try {
      const result = await analyzeLabReport(currentProfile, file, text);
      setAnalysisResult(result);
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
    setStep(AppStep.Dashboard);
    window.scrollTo(0, 0);
  };

  const handleLogoClick = () => {
    if (currentProfile) {
      setStep(AppStep.Dashboard);
    } else {
      setStep(AppStep.Welcome);
    }
    setAnalysisResult(null);
  };

  // View Routing
  const renderContent = () => {
    switch (step) {
      case AppStep.Welcome:
        return (
          <div className="text-center max-w-3xl mx-auto mt-12 animate-fade-in-up">
            <div className="inline-block mb-6 p-4 bg-brand-50 rounded-full shadow-inner">
               <Logo size="lg" className="scale-125" />
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
              Understand Your Labs.<br />
              <span className="text-brand-600">Empower Your Health.</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Upload your lab report for an instant, clear, and culturally-aware explanation. 
              Get personalized nutrition advice and lifestyle tips without the medical jargon.
            </p>
            <button
              onClick={() => setStep(AppStep.Profile)}
              className="bg-brand-600 hover:bg-brand-700 text-white text-lg font-semibold py-4 px-12 rounded-full shadow-lg shadow-brand-200 transition-all transform hover:scale-[1.02] hover:shadow-brand-300 ring-4 ring-transparent hover:ring-brand-100"
            >
              Start Your Analysis
            </button>
            <div className="mt-16 flex flex-wrap justify-center gap-8 text-slate-500 font-medium">
               <div className="flex items-center"><span className="mr-2 text-brand-500">🛡️</span> Private & Secure</div>
               <div className="flex items-center"><span className="mr-2 text-accent">⚡</span> Instant Analysis</div>
               <div className="flex items-center"><span className="mr-2 text-brand-500">🌍</span> Culturally Aware</div>
            </div>
          </div>
        );

      case AppStep.Dashboard:
        return currentProfile ? <Dashboard profile={currentProfile} onNavigate={setStep} /> : null;

      case AppStep.Profile:
        return (
          <ProfileForm 
            initialData={currentProfile} // If editing, pass current
            onComplete={handleProfileSave} 
            isEditing={!!currentProfileId}
          />
        );

      case AppStep.Upload:
      case AppStep.Analyzing:
        return (
          <div className="space-y-6 animate-fade-in">
             {/* Breadcrumb / Header Label */}
             <div className="flex items-center text-sm text-slate-500 mb-2">
               <button onClick={() => setStep(AppStep.Dashboard)} className="hover:text-brand-600 transition">Dashboard</button>
               <span className="mx-2">/</span>
               <span className="font-semibold text-brand-600">Upload Report</span>
             </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Upload Your Report</h2>
              <p className="text-slate-500">Take a photo of your lab results or paste the text.</p>
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
        return analysisResult ? <ReportView data={analysisResult} onReset={handleReset} /> : null;

      case AppStep.History:
        return (
           <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm animate-fade-in">
             <div className="text-6xl mb-4">📜</div>
             <h2 className="text-2xl font-bold text-slate-800 mb-2">Analysis History</h2>
             <p className="text-slate-500 mb-8">Your past reports will appear here.</p>
             <button onClick={() => setStep(AppStep.Dashboard)} className="text-brand-600 font-semibold hover:underline">Return to Dashboard</button>
           </div>
        );

      case AppStep.Settings:
        return (
           <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm animate-fade-in">
             <div className="text-6xl mb-4">⚙️</div>
             <h2 className="text-2xl font-bold text-slate-800 mb-2">Settings</h2>
             <p className="text-slate-500 mb-8">Manage notifications and app preferences.</p>
             <button onClick={() => setStep(AppStep.Dashboard)} className="text-brand-600 font-semibold hover:underline">Return to Dashboard</button>
           </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans transition-all duration-300">
      
      {/* Side Menu */}
      <SideMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        profiles={profiles}
        currentProfileId={currentProfileId}
        onSwitchProfile={handleSwitchProfile}
        onAddProfile={handleAddProfile}
        onNavigate={setStep}
      />

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-brand-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
          
          <div className="flex items-center gap-4">
            {/* Hamburger Button (only if profile exists) */}
            {profiles.length > 0 && (
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="p-2 -ml-2 text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </button>
            )}

            {/* Logo (Clickable) */}
            <div onClick={handleLogoClick} className="cursor-pointer">
              <Logo />
            </div>
          </div>

          <div className="flex items-center gap-4">
             {/* Home Icon (Dashboard Link) */}
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

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 md:px-8 py-10 w-full relative">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-8 mt-auto">
         <div className="max-w-6xl mx-auto px-4 text-center text-slate-400 text-sm">
           <p className="flex items-center justify-center gap-2">
             <span>&copy; {new Date().getFullYear()} MyHealthLens AI.</span>
             <span className="w-1 h-1 rounded-full bg-slate-300"></span>
             <span>Educational Use Only.</span>
           </p>
         </div>
      </footer>
    </div>
  );
};

export default App;
