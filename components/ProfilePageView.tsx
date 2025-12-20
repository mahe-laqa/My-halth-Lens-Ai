
import React, { useState, useMemo } from 'react';
import { UserProfile } from '../types';
import { REGION_DATA, COMMON_LANGUAGES, COUNTRY_LANGUAGES } from '../constants';

interface ProfilePageProps {
  profile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
  onBack: () => void;
}

export const ProfilePageView: React.FC<ProfilePageProps> = ({ profile, onSave, onBack }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);

  // Helper for RTL detection
  const isRTL = ['urdu', 'arabic'].includes(formData.language.toLowerCase());

  // Helper for Languages based on country
  const availableLanguages = useMemo(() => {
    if (formData.country && COUNTRY_LANGUAGES[formData.country]) {
      return COUNTRY_LANGUAGES[formData.country];
    }
    const regionInfo = REGION_DATA[formData.location];
    const countryLang = regionInfo?.langMap?.[formData.country];
    const defaultLang = regionInfo?.defaultLang || 'English';
    const priority = new Set<string>();
    priority.add('English');
    if (defaultLang) priority.add(defaultLang);
    if (countryLang) priority.add(countryLang);
    const others = COMMON_LANGUAGES.filter(l => !priority.has(l));
    return [...Array.from(priority), ...others];
  }, [formData.location, formData.country]);

  const handleHistoryToggle = (key: keyof UserProfile['history']) => {
    setFormData(prev => ({
      ...prev,
      history: {
        ...prev.history,
        [key]: !prev.history[key]
      }
    }));
  };

  const handleNoneHistory = () => {
    setFormData(prev => ({
      ...prev,
      history: {
        diabetes: false, highBp: false, thyroid: false, kidney: false, liver: false, heart: false, pregnancy: false
      }
    }));
  };

  const isAnyHistorySelected = Object.values(formData.history).some(v => v);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in-up">
      
      {/* SECTION 1: HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 relative inline-block pb-2">
          Your Profile
          <span className="absolute bottom-0 left-0 w-full h-1 bg-[#D7F5F5] rounded-full"></span>
        </h1>
        <p className="text-slate-500 mt-2">Manage your information and app preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* SECTION 2: PERSONAL INFORMATION CARD */}
        <div className="bg-white rounded-xl shadow-sm border border-[#D9C98A] p-6 md:p-7 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-800">Personal Information</h3>
            <button 
              onClick={() => setIsEditingPersonal(!isEditingPersonal)}
              className="text-sm font-semibold text-[#7ECBA1] hover:text-[#5db887] transition"
            >
              {isEditingPersonal ? 'Done' : 'Edit'}
            </button>
          </div>
          <div className="space-y-4 flex-1">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Full Name</label>
              {isEditingPersonal ? (
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full border-b border-slate-300 py-1 focus:border-[#7ECBA1] focus:outline-none text-slate-700"
                />
              ) : (
                <p className="text-slate-700 font-medium text-lg">{formData.name || 'Not Set'}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Age</label>
                {isEditingPersonal ? (
                  <input 
                    type="number" 
                    value={formData.age} 
                    onChange={e => setFormData({...formData, age: parseInt(e.target.value) || 0})}
                    className="w-full border-b border-slate-300 py-1 focus:border-[#7ECBA1] focus:outline-none text-slate-700"
                  />
                ) : (
                  <p className="text-slate-700 font-medium text-lg">{formData.age}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Gender</label>
                {isEditingPersonal ? (
                  <select 
                    value={formData.gender} 
                    onChange={e => setFormData({...formData, gender: e.target.value as any})}
                    className="w-full border-b border-slate-300 py-1 focus:border-[#7ECBA1] focus:outline-none text-slate-700 bg-transparent"
                  >
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                ) : (
                  <p className="text-slate-700 font-medium text-lg">{formData.gender}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Health ID</label>
              <p className="text-slate-500 font-mono text-sm tracking-wider">HL-{formData.id.substring(0,8).toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* SECTION 3: LOCATION & LANGUAGE CARD */}
        <div className="bg-white rounded-xl shadow-sm border border-[#D9C98A] p-6 md:p-7 h-full flex flex-col">
          <h3 className="font-bold text-lg text-slate-800 mb-6">Location & Language</h3>
          <div className="space-y-5 flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Region</label>
                <div className="px-3 py-2 bg-[#D7F5F5] bg-opacity-30 rounded-lg border border-transparent text-slate-700 font-medium text-sm">
                  {formData.location}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Country</label>
                <div className="px-3 py-2 bg-[#D7F5F5] bg-opacity-30 rounded-lg border border-transparent text-slate-700 font-medium text-sm">
                  {formData.country}
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Preferred Language</label>
              <div className="relative">
                <select
                  value={formData.language}
                  onChange={e => setFormData({...formData, language: e.target.value})}
                  className={`w-full p-3 rounded-lg border border-slate-200 focus:border-[#7ECBA1] focus:outline-none appearance-none bg-white text-slate-700 font-medium ${isRTL ? 'text-right font-urdu text-lg' : ''}`}
                >
                  {availableLanguages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
                <div className={`pointer-events-none absolute inset-y-0 ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center text-slate-400`}>
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Time Zone</label>
              <p className="text-slate-500 text-sm">{Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
            </div>
          </div>
        </div>

        {/* SECTION 4: MEDICAL BACKGROUND CARD */}
        <div className="bg-white rounded-xl shadow-sm border border-[#D9C98A] p-6 md:p-7 md:col-span-2">
          <h3 className="font-bold text-lg text-slate-800 mb-2">Medical Background</h3>
          <p className="text-slate-400 text-sm mb-6">Select conditions to help AI personalize your analysis.</p>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleNoneHistory}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!isAnyHistorySelected ? 'bg-[#7ECBA1] text-white shadow-md' : 'bg-white border border-slate-300 text-slate-600 hover:border-[#7ECBA1]'}`}
            >
              None
            </button>
            {[
              { k: 'diabetes', l: 'Diabetes' },
              { k: 'highBp', l: 'Hypertension' },
              { k: 'thyroid', l: 'Thyroid' },
              { k: 'liver', l: 'Liver Issues' },
              { k: 'kidney', l: 'Kidney Issues' },
              { k: 'heart', l: 'Heart Condition' }
            ].map(item => (
              <button
                key={item.k}
                onClick={() => handleHistoryToggle(item.k as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  formData.history[item.k as keyof UserProfile['history']]
                    ? 'bg-[#7ECBA1] text-white shadow-md'
                    : 'bg-white border border-slate-300 text-slate-600 hover:border-[#7ECBA1]'
                }`}
              >
                {item.l}
              </button>
            ))}
            {formData.gender === 'Female' && (
              <button
                onClick={() => handleHistoryToggle('pregnancy')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  formData.history.pregnancy
                    ? 'bg-[#7ECBA1] text-white shadow-md'
                    : 'bg-white border border-slate-300 text-slate-600 hover:border-[#7ECBA1]'
                }`}
              >
                Pregnancy
              </button>
            )}
          </div>
          
          <div className="mt-6">
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Known Allergies</label>
            <input 
              type="text"
              value={formData.allergies}
              onChange={e => setFormData({...formData, allergies: e.target.value})}
              placeholder="e.g. Peanuts, Penicillin"
              className="w-full md:w-1/2 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:border-[#7ECBA1] focus:outline-none"
            />
          </div>
        </div>

        {/* SECTION 5: APP PREFERENCES CARD */}
        <div className="bg-white rounded-xl shadow-sm border border-[#D9C98A] p-6 md:p-7">
          <h3 className="font-bold text-lg text-slate-800 mb-6">App Preferences</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={true} readOnly />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7ECBA1]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Font Size</span>
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button className="px-3 py-1 text-xs font-medium rounded text-slate-500 hover:text-slate-800">Small</button>
                <button className="px-3 py-1 text-xs font-bold rounded bg-white text-slate-800 shadow-sm">Normal</button>
                <button className="px-3 py-1 text-xs font-medium rounded text-slate-500 hover:text-slate-800">Large</button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Layout Direction</span>
              <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                Auto ({isRTL ? 'RTL' : 'LTR'})
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 6: ACCOUNT SECURITY CARD */}
        <div className="bg-white rounded-xl shadow-sm border border-[#D9C98A] p-6 md:p-7">
          <h3 className="font-bold text-lg text-slate-800 mb-6">Account Security</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Email</label>
              <div className="flex items-center justify-between">
                <span className="text-slate-700 text-sm">user@example.com</span>
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Verified</span>
              </div>
            </div>
            
            <button className="w-full text-left text-sm font-medium text-[#7ECBA1] hover:underline">
              Change Password
            </button>

            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-medium text-slate-700">Two-step Verification</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7ECBA1]"></div>
              </label>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button className="text-xs font-semibold text-red-500 hover:text-red-700 hover:underline">
                Delete Account
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 7: ACTION BUTTONS */}
      <div className="mt-10 flex flex-col items-center gap-4 pb-12">
        <button 
          onClick={() => onSave(formData)}
          className="bg-[#7ECBA1] hover:bg-[#68b58b] text-white text-lg font-bold py-3.5 px-12 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95"
        >
          Save Changes
        </button>
        <button 
          onClick={onBack}
          className="text-slate-500 font-medium hover:text-slate-700 text-sm transition"
        >
          Return to Dashboard
        </button>
      </div>

    </div>
  );
};
