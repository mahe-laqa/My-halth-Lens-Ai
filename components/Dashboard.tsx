import React from 'react';
import { UserProfile, AppStep } from '../types';

interface DashboardProps {
  profile: UserProfile;
  onNavigate: (step: AppStep) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ profile, onNavigate }) => {
  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-brand-600 to-brand-500 rounded-3xl p-8 text-white shadow-xl shadow-brand-200">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Hello, {profile.name || 'Friend'} 👋</h1>
          <p className="text-brand-100 text-lg">Your health journey is looking bright today.</p>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-4 px-2">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <DashboardCard 
            icon="📸"
            title="Analyze Report"
            desc="Upload a new lab report for instant analysis."
            onClick={() => onNavigate(AppStep.Upload)}
            primary
          />

          <DashboardCard 
            icon="📝"
            title="Edit Profile"
            desc="Update your health history or preferences."
            onClick={() => onNavigate(AppStep.Profile)}
          />

          <DashboardCard 
            icon="📜"
            title="History"
            desc="View your past analyses and trends."
            onClick={() => onNavigate(AppStep.History)}
          />
        </div>
      </div>

      {/* Profile Summary Widget */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-700">Profile Overview</h3>
          <span className="text-xs bg-brand-50 text-brand-700 px-2 py-1 rounded-lg border border-brand-100">
            {profile.language}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
           <div className="bg-slate-50 p-3 rounded-xl">
             <span className="block text-slate-400 text-xs">Location</span>
             <span className="font-semibold text-slate-700">{profile.country}</span>
           </div>
           <div className="bg-slate-50 p-3 rounded-xl">
             <span className="block text-slate-400 text-xs">Age/Gender</span>
             <span className="font-semibold text-slate-700">{profile.age} / {profile.gender}</span>
           </div>
           <div className="bg-slate-50 p-3 rounded-xl">
             <span className="block text-slate-400 text-xs">Diet</span>
             <span className="font-semibold text-slate-700">{profile.culturalPreference}</span>
           </div>
           <div className="bg-slate-50 p-3 rounded-xl">
             <span className="block text-slate-400 text-xs">Conditions</span>
             <span className="font-semibold text-slate-700">
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

const DashboardCard = ({ icon, title, desc, onClick, primary }: any) => (
  <button 
    onClick={onClick}
    className={`text-left p-6 rounded-3xl border transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 ${
      primary 
        ? 'bg-brand-50 border-brand-200 hover:border-brand-300 ring-1 ring-brand-100' 
        : 'bg-white border-slate-100 hover:border-brand-200'
    }`}
  >
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 ${
      primary ? 'bg-brand-500 text-white shadow-md shadow-brand-200' : 'bg-slate-100 text-slate-600'
    }`}>
      {icon}
    </div>
    <h3 className={`font-bold text-lg mb-2 ${primary ? 'text-brand-800' : 'text-slate-800'}`}>{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
  </button>
);
