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
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] transition-opacity"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="fixed top-0 left-0 bottom-0 w-80 bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-out animate-slide-in flex flex-col border-r border-brand-100">
        
        {/* Header */}
        <div className="p-6 bg-brand-600 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">MyHealthLens</h2>
            <p className="text-brand-100 text-xs mt-1">Menu & Profiles</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-brand-700 rounded-full transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-4 space-y-1 mb-8">
            <MenuLink 
              icon="🏠" 
              label="Dashboard" 
              onClick={() => { onNavigate(AppStep.Dashboard); onClose(); }} 
            />
            <MenuLink 
              icon="📸" 
              label="Upload New Report" 
              onClick={() => { onNavigate(AppStep.Upload); onClose(); }} 
            />
             <MenuLink 
              icon="📝" 
              label="Edit Current Profile" 
              onClick={() => { onNavigate(AppStep.Profile); onClose(); }} 
            />
            <MenuLink 
              icon="📜" 
              label="History" 
              onClick={() => { onNavigate(AppStep.History); onClose(); }} 
            />
            <MenuLink 
              icon="⚙️" 
              label="Settings" 
              onClick={() => { onNavigate(AppStep.Settings); onClose(); }} 
            />
          </nav>

          {/* Profile Switcher */}
          <div className="px-6 py-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Switch Profile</h3>
            <div className="space-y-3">
              {profiles.map(profile => (
                <button
                  key={profile.id}
                  onClick={() => { onSwitchProfile(profile.id); onClose(); }}
                  className={`w-full flex items-center p-3 rounded-xl transition-all border ${
                    currentProfileId === profile.id
                      ? 'bg-brand-50 border-brand-200 shadow-sm'
                      : 'hover:bg-slate-50 border-transparent hover:border-slate-100'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                    currentProfileId === profile.id ? 'bg-brand-200 text-brand-800' : 'bg-slate-200 text-slate-600'
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
                <span className="mr-2">+</span> Add New Profile
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 text-center text-xs text-slate-400 border-t border-slate-100">
          v2.1 • Educational Use Only
        </div>
      </div>
    </>
  );
};

const MenuLink = ({ icon, label, onClick }: { icon: string, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center px-4 py-3 text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 rounded-xl transition-colors"
  >
    <span className="mr-3 text-lg w-6 text-center">{icon}</span>
    {label}
  </button>
);
