import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile } from '../types';
import { REGION_DATA, COMMON_LANGUAGES, COUNTRY_LANGUAGES, MOCK_DIETS, detectUserContext } from '../constants';

interface ProfileFormProps {
  initialData?: UserProfile | null;
  onComplete: (profile: UserProfile) => void;
  isEditing?: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ initialData, onComplete, isEditing = false }) => {
  // State for auto-detection flow
  const [showAutoDetectConfirm, setShowAutoDetectConfirm] = useState(!isEditing); // Show only on create
  const [detectedValues, setDetectedValues] = useState<{ region: string; country: string; language: string } | null>(null);

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
    medications: '', // Feature: Meds
    reminderEnabled: false, // Feature: Smart Reminder
    history: {
      diabetes: false,
      highBp: false,
      thyroid: false,
      kidney: false,
      liver: false,
      heart: false,
      pregnancy: false,
    },
    reports: [], // Initialize empty reports array
  });

  // Load initial data
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Run detection on mount if creating new profile
  useEffect(() => {
    if (!isEditing && !initialData) {
      const detected = detectUserContext();
      setDetectedValues(detected);
      // Pre-fill form with detected values
      setFormData(prev => ({
        ...prev,
        location: detected.region,
        country: detected.country,
        language: detected.language
      }));
    }
  }, [isEditing, initialData]);

  // Helper to determine specific languages for a country
  const getCountryLanguages = (country: string) => {
    if (COUNTRY_LANGUAGES[country]) {
      return COUNTRY_LANGUAGES[country];
    }
    // Fallback if country not in short list
    return ['English']; 
  };

  // Helper to prioritize languages based on country (for manual selection list)
  const availableLanguages = useMemo(() => {
    if (formData.country && COUNTRY_LANGUAGES[formData.country]) {
      return COUNTRY_LANGUAGES[formData.country];
    }

    if (!formData.location || !formData.country) return COMMON_LANGUAGES;

    const regionInfo = REGION_DATA[formData.location];
    const countryLang = regionInfo?.langMap?.[formData.country];
    const defaultLang = regionInfo?.defaultLang || 'English';
    
    // Create a set of prioritized languages
    const priority = new Set<string>();
    priority.add('English'); // Always top
    if (defaultLang) priority.add(defaultLang);
    if (countryLang) priority.add(countryLang);

    // Filter rest
    const others = COMMON_LANGUAGES.filter(l => !priority.has(l));
    
    return [...Array.from(priority), ...others];
  }, [formData.location, formData.country]);

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

  const isAnyConditionSelected = Object.values(formData.history).some(val => val);

  const handleNoneSelection = () => {
    setFormData(prev => ({
      ...prev,
      history: {
        diabetes: false,
        highBp: false,
        thyroid: false,
        kidney: false,
        liver: false,
        heart: false,
        pregnancy: false,
      }
    }));
  };

  const handleConfirmDetection = () => {
    setShowAutoDetectConfirm(false);
    // Values are already in formData, proceed to main form
  };

  const handleRejectDetection = () => {
    setShowAutoDetectConfirm(false);
    setDetectedValues(null); // Clear this so manual logic takes over
    // Reset to empty to force manual selection
    setFormData(prev => ({
      ...prev,
      location: '',
      country: '',
      language: 'English'
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

  // --- CONFIRMATION VIEW ---
  if (showAutoDetectConfirm && detectedValues) {
    return (
      <div className="max-w-xl mx-auto mt-10 animate-fade-in-up">
        <div className="bg-white rounded-3xl shadow-xl shadow-brand-100/50 border border-brand-50 overflow-hidden">
          <div className="bg-gradient-to-r from-brand-600 to-brand-500 p-8 text-white text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              🌍
            </div>
            <h2 className="text-2xl font-bold mb-2">Smart Detection</h2>
            <p className="text-brand-50">We detected your region to personalize your health experience.</p>
          </div>
          
          <div className="p-8">
             <div className="space-y-4 mb-8">
               <div className="flex items-center justify-between p-4 bg-brand-50/50 rounded-xl border border-brand-100">
                 <span className="text-slate-500 font-medium">Region</span>
                 <span className="text-lg font-bold text-slate-800">{detectedValues.region}</span>
               </div>
               <div className="flex items-center justify-between p-4 bg-brand-50/50 rounded-xl border border-brand-100">
                 <span className="text-slate-500 font-medium">Country</span>
                 <span className="text-lg font-bold text-slate-800">{detectedValues.country}</span>
               </div>
               
               {/* PREFERRED LANGUAGE SELECTION IN AUTO-DETECT SCREEN */}
               <div className="p-4 bg-brand-50/50 rounded-xl border border-brand-100">
                 <label className="block text-sm font-semibold text-slate-700 mb-2">Preferred Language</label>
                 <div className="relative">
                    <select
                      className="w-full px-4 py-3 border border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition bg-white appearance-none accent-brand-600 font-medium text-brand-900"
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    >
                      {getCountryLanguages(detectedValues.country).map((lang) => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                      {!COUNTRY_LANGUAGES[detectedValues.country] && COMMON_LANGUAGES.map((lang) => (
                         <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-500">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                    </div>
                 </div>
                 <p className="text-xs text-slate-500 mt-2">You can switch this anytime.</p>
               </div>
             </div>

             <div className="text-center mb-6">
               <p className="text-slate-600 font-medium">Is this location correct?</p>
             </div>

             <div className="flex gap-4">
               <button 
                 onClick={handleRejectDetection}
                 className="flex-1 py-3 px-6 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition"
               >
                 No, Change
               </button>
               <button 
                 onClick={handleConfirmDetection}
                 className="flex-1 py-3 px-6 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-500 shadow-md shadow-brand-200 transition"
               >
                 Yes, Continue
               </button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN FORM ---
  return (
    <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl shadow-brand-100/50 border border-white ring-1 ring-brand-50 overflow-hidden animate-fade-in-up">
      {/* Header with Gold Accent */}
      <div className="bg-brand-600 px-8 py-6 border-b-4 border-accent">
        <h2 className="text-2xl font-bold text-white mb-1 flex items-center">
          {isEditing ? 'Edit Profile' : 'Complete Profile'}
        </h2>
        <p className="text-brand-50 text-sm opacity-90">
          {detectedValues ? 'Verified location settings.' : 'Update your information for personalized, safe analysis.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-10">
        
        {/* Section 1: Basic Info */}
        <section>
          <div className="flex items-center mb-4">
             <div className="w-1 h-5 bg-accent rounded-full mr-3"></div>
             <h3 className="text-sm font-bold text-brand-700 uppercase tracking-wider">Basic Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition bg-white"
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
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition bg-white"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Gender</label>
              <div className="flex bg-brand-50/50 p-1 rounded-xl border border-brand-100">
                {['Male', 'Female'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: g as any })}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      formData.gender === g
                        ? 'bg-white text-brand-700 shadow-sm ring-1 ring-brand-100'
                        : 'text-slate-500 hover:text-brand-600 hover:bg-white/50'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Location & Language */}
        <section>
          <div className="flex items-center mb-4">
             <div className="w-1 h-5 bg-accent rounded-full mr-3"></div>
             <h3 className="text-sm font-bold text-brand-700 uppercase tracking-wider">Region & Language</h3>
          </div>
          
          {detectedValues ? (
             <div className="bg-brand-50/30 border border-brand-100 rounded-xl p-5">
                <div className="flex flex-col gap-4">
                   {/* Verified Location Information */}
                   <div className="flex items-center justify-between border-b border-brand-100 pb-4">
                     <div className="flex gap-8">
                       <div>
                          <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Region</span>
                          <span className="font-bold text-brand-900 flex items-center">
                            {formData.location} <span className="ml-1 text-green-500 text-xs">✓</span>
                          </span>
                       </div>
                       <div>
                          <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Country</span>
                          <span className="font-bold text-brand-900 flex items-center">
                            {formData.country} <span className="ml-1 text-green-500 text-xs">✓</span>
                          </span>
                       </div>
                     </div>
                     <button type="button" onClick={handleRejectDetection} className="text-xs font-bold text-brand-600 hover:text-brand-700 border border-brand-200 hover:bg-white px-3 py-1.5 rounded-lg transition">
                       Change Location
                     </button>
                   </div>

                   {/* Language Selector (Always Editable) */}
                   <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Preferred Language <span className="text-xs font-normal text-slate-400">(for reports & UI)</span>
                      </label>
                      <div className="relative">
                        <select
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition bg-white appearance-none accent-brand-600 font-medium text-slate-700"
                          value={formData.language}
                          onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                        >
                          {getCountryLanguages(formData.country).map((lang) => (
                            <option key={lang} value={lang}>{lang}</option>
                          ))}
                          {!COUNTRY_LANGUAGES[formData.country] && availableLanguages.map((lang) => (
                            <option key={lang} value={lang}>{lang}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-500">
                          <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                        </div>
                      </div>
                   </div>
                </div>
             </div>
          ) : (
            <div className="space-y-6">
              {/* Manual Selection: Region Tiles */}
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
                          ? 'bg-brand-600 text-white border-brand-600 shadow-md ring-1 ring-accent/50'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700'
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>

              {/* Manual Selection: Country & Language */}
              {formData.location && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Country</label>
                    <div className="relative">
                      <select
                        required
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition bg-white appearance-none accent-brand-600"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        style={{ backgroundColor: 'white' }}
                      >
                        <option value="">Select Country</option>
                        {REGION_DATA[formData.location].countries.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-500">
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
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition bg-white appearance-none accent-brand-600"
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      >
                        {availableLanguages.map((lang) => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-500">
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Section 3: Health & Diet + NEW MEDICATION FIELD */}
        <section>
          <div className="flex items-center mb-4">
             <div className="w-1 h-5 bg-accent rounded-full mr-3"></div>
             <h3 className="text-sm font-bold text-brand-700 uppercase tracking-wider">Health Profile</h3>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Dietary Preference</label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition bg-white appearance-none accent-brand-600"
                    value={formData.culturalPreference}
                    onChange={(e) => setFormData({ ...formData, culturalPreference: e.target.value })}
                  >
                    {MOCK_DIETS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-500">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Food Allergies</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition bg-white"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  placeholder="e.g., Peanuts, Gluten"
                />
              </div>
            </div>

            {/* Feature: Medication Interaction Notes (New Field) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Current Medications (Optional)</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 transition bg-white"
                value={formData.medications || ''}
                onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                placeholder="e.g., Metformin, Aspirin, Supplements"
              />
              <p className="text-xs text-slate-400 mt-1">We will check for general interactions in your report.</p>
            </div>

            <div className="bg-brand-50/40 p-6 rounded-2xl border border-brand-100/50">
              <label className="block text-sm font-bold text-brand-800 mb-4">Existing Conditions (Select all that apply)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {/* None Option */}
                <label className={`flex items-center space-x-3 p-3 rounded-xl transition cursor-pointer border ${
                  !isAnyConditionSelected
                    ? 'bg-white border-brand-300 shadow-sm ring-1 ring-brand-100'
                    : 'hover:bg-white border-transparent hover:border-brand-100'
                }`}>
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-brand-600 rounded border-slate-300 focus:ring-brand-500"
                    checked={!isAnyConditionSelected}
                    onChange={handleNoneSelection}
                  />
                  <span className={`text-sm ${!isAnyConditionSelected ? 'text-brand-900 font-bold' : 'text-slate-600'}`}>None</span>
                </label>

                {[
                  { key: 'diabetes', label: 'Diabetes' },
                  { key: 'highBp', label: 'High BP' },
                  { key: 'thyroid', label: 'Thyroid' },
                  { key: 'kidney', label: 'Kidney Issues' },
                  { key: 'liver', label: 'Liver Issues' },
                  { key: 'heart', label: 'Heart Disease' },
                ].map((item) => (
                  <label key={item.key} className={`flex items-center space-x-3 p-3 rounded-xl transition cursor-pointer border ${
                    formData.history[item.key as keyof UserProfile['history']]
                      ? 'bg-white border-brand-300 shadow-sm ring-1 ring-brand-100'
                      : 'hover:bg-white border-transparent hover:border-brand-100'
                  }`}>
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-brand-600 rounded border-slate-300 focus:ring-brand-500"
                      checked={formData.history[item.key as keyof UserProfile['history']]}
                      onChange={() => handleHistoryChange(item.key as keyof UserProfile['history'])}
                    />
                    <span className={`text-sm ${formData.history[item.key as keyof UserProfile['history']] ? 'text-brand-900 font-medium' : 'text-slate-600'}`}>{item.label}</span>
                  </label>
                ))}
                
                {/* Pregnancy - Only for Female */}
                {formData.gender === 'Female' && (
                  <label className={`flex items-center space-x-3 p-3 rounded-xl transition cursor-pointer border ${formData.history.pregnancy ? 'bg-white border-brand-300 shadow-sm ring-1 ring-brand-100' : 'hover:bg-white border-transparent hover:border-brand-100'}`}>
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-brand-600 rounded border-slate-300 focus:ring-brand-500"
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

        {/* Section 4: Preferences (Feature: Smart Reminder) */}
        <section className="pt-2 border-t border-slate-100">
           <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl">
             <div>
               <span className="block font-bold text-slate-700">Smart Reminders</span>
               <span className="text-xs text-slate-500">Get notified when your next test is likely due.</span>
             </div>
             <label className="relative inline-flex items-center cursor-pointer">
               <input 
                 type="checkbox" 
                 className="sr-only peer"
                 checked={formData.reminderEnabled || false}
                 onChange={(e) => setFormData({...formData, reminderEnabled: e.target.checked})} 
               />
               <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
             </label>
           </div>
        </section>

        {/* Footer Action */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-brand-600 text-white font-bold py-4 px-6 rounded-xl shadow-md shadow-brand-100 transition-all duration-300 hover:bg-brand-500 hover:shadow-lg hover:ring-1 hover:ring-accent transform hover:scale-[1.005]"
          >
            {isEditing ? 'Save Changes' : 'Create Profile & Continue'}
          </button>
        </div>
      </form>
    </div>
  );
};