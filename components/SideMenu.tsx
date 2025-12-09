
import React from 'react';
import { UserProfile, AppStep } from '../types';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: UserProfile[];
  currentProfileId: string | null;
  onSwitchProfile: (id: string) => void;
  onAddProfile: () => void;
  onNavigate: (step: AppStep) => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({
  isOpen,
  onClose,
  profiles,
  currentProfileId,
  onSwitchProfile,
  onAddProfile,
  onNavigate,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] transition-opacity"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="fixed top-0 left-0 bottom-0 w-80 bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-out animate-slide-in flex flex-col border-r border-slate-100">
        
        {/* Header */}
        <div className="p-6 bg-brand-700 text-white flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold tracking-tight">MyHealthLens</h2>
            <p className="text-brand-200 text-xs font-medium mt-0.5">Medical Dashboard</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-brand-600 rounded-lg transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="px-4 space-y-2 mb-8">
            <MenuLink 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>} 
              label="Dashboard" 
              onClick={() => { onNavigate(AppStep.Dashboard); onClose(); }} 
            />
            <MenuLink 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>} 
              label="Upload Report" 
              onClick={() => { onNavigate(AppStep.Upload); onClose(); }} 
            />
             <MenuLink 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>} 
              label="Edit Profile" 
              onClick={() => { onNavigate(AppStep.Profile); onClose(); }} 
            />
            <MenuLink 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>} 
              label="Report History" 
              onClick={() => { onNavigate(AppStep.History); onClose(); }} 
            />
            
            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Explore</p>
              <MenuLink 
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>} 
                label="Diet Plans" 
                onClick={() => { onNavigate(AppStep.DietPlans); onClose(); }} 
              />
              <MenuLink 
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>} 
                label="Seasonal Guide" 
                onClick={() => { onNavigate(AppStep.SeasonalGuide); onClose(); }} 
              />
              <MenuLink 
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>} 
                label="Help Centre" 
                onClick={() => { onNavigate(AppStep.HelpCentre); onClose(); }} 
              />
            </div>

            <div className="border-t border-slate-100 pt-2 mt-2">
              <MenuLink 
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>} 
                label="Settings" 
                onClick={() => { onNavigate(AppStep.Settings); onClose(); }} 
              />
            </div>
          </nav>

          {/* Profile Switcher */}
          <div className="px-6 py-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Patient Profiles</h3>
            <div className="space-y-3">
              {profiles.map(profile => (
                <button
                  key={profile.id}
                  onClick={() => { onSwitchProfile(profile.id); onClose(); }}
                  className={`w-full flex items-center p-3 rounded-xl transition-all border ${
                    currentProfileId === profile.id
                      ? 'bg-brand-50 border-brand-200 shadow-sm'
                      : 'hover:bg-slate-50 border-transparent hover:border-slate-200'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mr-3 border ${
                    currentProfileId === profile.id ? 'bg-white text-brand-700 border-brand-100' : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-semibold ${currentProfileId === profile.id ? 'text-brand-900' : 'text-slate-700'}`}>
                      {profile.name || 'User'}
                    </p>
                    <p className="text-xs text-slate-500">{profile.age} yrs • {profile.language}</p>
                  </div>
                  {currentProfileId === profile.id && (
                    <span className="ml-auto text-brand-600">●</span>
                  )}
                </button>
              ))}
              
              <button
                onClick={() => { onAddProfile(); onClose(); }}
                className="w-full flex items-center justify-center p-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50 transition-all text-sm font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                Add New Profile
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 text-center text-xs text-slate-400 border-t border-slate-100 font-medium">
          Professional Edition • v2.1
        </div>
      </div>
    </>
  );
};

const MenuLink = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-700 rounded-lg transition-colors"
  >
    <span className="mr-3 w-6 text-center text-slate-400">{icon}</span>
    {label}
  </button>
);
