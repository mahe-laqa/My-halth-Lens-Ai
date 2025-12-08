import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { REGION_DATA, COMMON_LANGUAGES, MOCK_DIETS } from '../constants';

interface ProfileFormProps {
  initialData?: UserProfile | null;
  onComplete: (profile: UserProfile) => void;
  isEditing?: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ initialData, onComplete, isEditing = false }) => {
  const [formData, setFormData] = useState<UserProfile>({
    id: Date.now().toString(),
    name: '',
    age: 30,
    gender: 'Male',
    location: '',
    country: '',
    language: 'English',
    culturalPreference: MOCK_DIETS[0],
    allergies: '',
    history: {
      diabetes: false,
      highBp: false,
      thyroid: false,
      kidney: false,
      liver: false,
      heart: false,
      pregnancy: false,
    },
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Auto-suggest language when country changes (only if creating new)
  useEffect(() => {
    if (!isEditing && formData.location && formData.country) {
      const regionInfo = REGION_DATA[formData.location];
      let suggestedLang = regionInfo.defaultLang;
      if (regionInfo.langMap && regionInfo.langMap[formData.country]) {
        suggestedLang = regionInfo.langMap[formData.country];
      }
      setFormData(prev => ({ ...prev, language: suggestedLang }));
    }
  }, [formData.country, formData.location, isEditing]);

  const handleRegionSelect = (region: string) => {
    setFormData(prev => ({
      ...prev,
      location: region,
      country: '', 
    }));
  };

  const handleHistoryChange = (key: keyof UserProfile['history']) => {
    setFormData((prev) => ({
      ...prev,
      history: {
        ...prev.history,
        [key]: !prev.history[key],
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.location || !formData.country) {
      alert("Please select your region and country.");
      return;
    }
    onComplete(formData);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-white ring-1 ring-slate-100 overflow-hidden animate-fade-in-up">
      <div className="bg-brand-600 px-8 py-6">
        <h2 className="text-2xl font-bold text-white mb-1">{isEditing ? 'Edit Profile' : 'Create Profile'}</h2>
        <p className="text-brand-100 text-sm">Update your information for personalized, safe analysis.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-10">
        
        {/* Section 1: Basic Info */}
        <section>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">1. Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition bg-slate-50 focus:bg-white"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Age</label>
              <input
                type="number"
                required
                min="1"
                max="120"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition bg-slate-50 focus:bg-white"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Gender</label>
              <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                {['Male', 'Female'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: g as any })}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      formData.gender === g
                        ? 'bg-white text-brand-700 shadow-sm ring-1 ring-slate-100'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Smart Location Flow */}
        <section>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">2. Region & Language</h3>
          <div className="space-y-6">
            
            {/* Step 1: Region Tiles */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Select Region</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Object.keys(REGION_DATA).map((region) => (
                  <button
                    key={region}
                    type="button"
                    onClick={() => handleRegionSelect(region)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border text-center ${
                      formData.location === region
                        ? 'bg-brand-600 text-white border-brand-600 shadow-md transform scale-[1.02]'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300 hover:bg-brand-50'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2 & 3: Country & Language (Conditional) */}
            {formData.location && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Country</label>
                  <div className="relative">
                    <select
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition bg-slate-50 focus:bg-white appearance-none"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    >
                      <option value="">Select Country</option>
                      {REGION_DATA[formData.location].countries.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Language <span className="text-xs font-normal text-slate-400">(UI & Report)</span>
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition bg-slate-50 focus:bg-white appearance-none"
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    >
                      {COMMON_LANGUAGES.map((lang) => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Section 3: Health & Diet */}
        <section>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">3. Health Profile</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Dietary Preference</label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition bg-slate-50 focus:bg-white appearance-none"
                    value={formData.culturalPreference}
                    onChange={(e) => setFormData({ ...formData, culturalPreference: e.target.value })}
                  >
                    {MOCK_DIETS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Food Allergies</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition bg-slate-50 focus:bg-white"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  placeholder="e.g., Peanuts, Gluten"
                />
              </div>
            </div>

            <div className="bg-brand-50/50 p-6 rounded-2xl border border-brand-100">
              <label className="block text-sm font-bold text-brand-800 mb-4">Existing Conditions (Select all that apply)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { key: 'diabetes', label: 'Diabetes' },
                  { key: 'highBp', label: 'High BP' },
                  { key: 'thyroid', label: 'Thyroid' },
                  { key: 'kidney', label: 'Kidney Issues' },
                  { key: 'liver', label: 'Liver Issues' },
                  { key: 'heart', label: 'Heart Disease' },
                ].map((item) => (
                  <label key={item.key} className={`flex items-center space-x-3 p-3 rounded-xl transition cursor-pointer border ${formData.history[item.key as keyof UserProfile['history']] ? 'bg-white border-brand-200 shadow-sm' : 'hover:bg-white border-transparent'}`}>
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                      checked={formData.history[item.key as keyof UserProfile['history']]}
                      onChange={() => handleHistoryChange(item.key as keyof UserProfile['history'])}
                    />
                    <span className={`text-sm ${formData.history[item.key as keyof UserProfile['history']] ? 'text-brand-900 font-medium' : 'text-slate-600'}`}>{item.label}</span>
                  </label>
                ))}
                
                {/* Pregnancy - Only for Female */}
                {formData.gender === 'Female' && (
                  <label className={`flex items-center space-x-3 p-3 rounded-xl transition cursor-pointer border ${formData.history.pregnancy ? 'bg-white border-brand-200 shadow-sm' : 'hover:bg-white border-transparent'}`}>
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                      checked={formData.history.pregnancy}
                      onChange={() => handleHistoryChange('pregnancy')}
                    />
                    <span className={`text-sm ${formData.history.pregnancy ? 'text-brand-900 font-medium' : 'text-slate-600'}`}>Pregnant</span>
                  </label>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Footer Action */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-brand-200 transition-all duration-200 transform hover:scale-[1.01]"
          >
            {isEditing ? 'Save Changes' : 'Create Profile & Continue'}
          </button>
        </div>
      </form>
    </div>
  );
};
