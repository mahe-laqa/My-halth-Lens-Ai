
import React from 'react';
import { UserProfile, AppStep } from '../types';

interface DashboardProps {
  profile: UserProfile;
  onNavigate: (step: AppStep) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ profile, onNavigate }) => {
  const reportCount = profile.reports?.length || 0;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome Banner - Professional Medical Tone */}
      <div className="relative overflow-hidden bg-white rounded-3xl p-8 border-l-4 border-brand-600 shadow-lg shadow-slate-200/50">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Welcome, {profile.name || 'User'}
          </h1>
          <p className="text-slate-500 text-lg">Your health dashboard is ready.</p>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <div className="flex items-center mb-4 px-2">
           <div className="w-1 h-5 bg-accent rounded-full mr-3"></div>
           <h2 className="text-lg font-bold text-slate-800">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <DashboardCard 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>}
            title="Analyze Report"
            desc="Upload a new lab report for professional analysis."
            onClick={() => onNavigate(AppStep.Upload)}
            primary
          />

          <DashboardCard 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>}
            title="Edit Profile"
            desc="Update medical history or personal details."
            onClick={() => onNavigate(AppStep.Profile)}
          />

          <DashboardCard 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
            title="Report History"
            desc={reportCount > 0 ? `${reportCount} Reports Archived` : "No archives found"}
            onClick={() => onNavigate(AppStep.History)}
            count={reportCount}
          />
        </div>
      </div>

      {/* New Modules: Explore & Learn */}
      <div>
        <div className="flex items-center mb-4 px-2">
           <div className="w-1 h-5 bg-brand-400 rounded-full mr-3"></div>
           <h2 className="text-lg font-bold text-slate-800">Explore & Learn</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <DashboardCard 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>}
            title="Diet Plans"
            desc="General safe food guides for common conditions."
            onClick={() => onNavigate(AppStep.DietPlans)}
          />
          <DashboardCard 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>}
            title="Seasonal Guide"
            desc="Health tips based on current season and region."
            onClick={() => onNavigate(AppStep.SeasonalGuide)}
          />
          <DashboardCard 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
            title="Help Centre"
            desc="FAQs, glossary, and how to use the app."
            onClick={() => onNavigate(AppStep.HelpCentre)}
          />
        </div>
      </div>

      {/* Profile Summary Widget */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
          <h3 className="font-bold text-slate-700 flex items-center">
            <svg className="w-5 h-5 text-brand-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
            Profile Overview
          </h3>
          <span className="text-xs bg-brand-50 text-brand-800 px-3 py-1 rounded-full border border-brand-100 font-semibold">
            {profile.language}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
           <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
             <span className="block text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Region</span>
             <span className="font-bold text-slate-700">{profile.country}</span>
           </div>
           <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
             <span className="block text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Demographics</span>
             <span className="font-bold text-slate-700">{profile.age} Yrs / {profile.gender}</span>
           </div>
           <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
             <span className="block text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Dietary</span>
             <span className="font-bold text-slate-700">{profile.culturalPreference}</span>
           </div>
           <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
             <span className="block text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Medical Factors</span>
             <span className="font-bold text-slate-700">
               {Object.values(profile.history).some(v => v) 
                 ? Object.entries(profile.history).filter(([_,v]) => v).length + ' Active'
                 : 'None Declared'}
             </span>
           </div>
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ icon, title, desc, onClick, primary, count }: any) => (
  <button 
    onClick={onClick}
    className={`text-left p-6 rounded-2xl border transition-all duration-300 hover:shadow-md group relative ${
      primary 
        ? 'bg-brand-50 border-brand-200 shadow-sm' 
        : 'bg-white border-slate-200 hover:border-brand-200'
    }`}
  >
    {typeof count !== 'undefined' && count > 0 && (
       <div className="absolute top-4 right-4 bg-white text-brand-700 text-xs font-bold px-2 py-1 rounded-md border border-brand-100 shadow-sm">
         {count}
       </div>
    )}
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors ${
      primary 
        ? 'bg-white text-brand-600 shadow-sm' 
        : 'bg-slate-50 text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-600'
    }`}>
      {icon}
    </div>
    <h3 className={`font-bold text-base mb-1 ${primary ? 'text-brand-900' : 'text-slate-800'}`}>{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
  </button>
);
