import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ConditionsViewProps {
  profile: UserProfile;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ConditionsView: React.FC<ConditionsViewProps> = ({ profile, onUpdateProfile, onNext, onBack }) => {
  const [conditions, setConditions] = useState(profile.history);

  const handleConditionChange = (condition: keyof typeof conditions, value: boolean) => {
    setConditions(prev => ({ ...prev, [condition]: value }));
  };

  const handleNext = () => {
    const updatedProfile = { ...profile, history: conditions };
    onUpdateProfile(updatedProfile);
    onNext();
  };

  const conditionOptions = [
    { key: 'diabetes' as const, label: 'Diabetes', description: 'High blood sugar levels' },
    { key: 'highBp' as const, label: 'High Blood Pressure', description: 'Hypertension' },
    { key: 'thyroid' as const, label: 'Thyroid Issues', description: 'Thyroid disorders' },
    { key: 'kidney' as const, label: 'Kidney Problems', description: 'Kidney disease' },
    { key: 'liver' as const, label: 'Liver Issues', description: 'Liver conditions' },
    { key: 'heart' as const, label: 'Heart Conditions', description: 'Cardiovascular diseases' },
    { key: 'pregnancy' as const, label: 'Pregnancy', description: 'Currently pregnant' },
  ];

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Health Conditions</h2>
        <p className="text-slate-500">Please select any existing health conditions to help us provide better analysis.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-brand-50 p-8">
        <div className="space-y-4">
          {conditionOptions.map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <h3 className="font-semibold text-slate-800">{label}</h3>
                <p className="text-sm text-slate-500">{description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={conditions[key]}
                  onChange={(e) => handleConditionChange(key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
              </label>
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={onBack}
            className="flex-1 py-3 px-6 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-3 px-6 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-500 transition"
          >
            Next: Upload Report
          </button>
        </div>
      </div>
    </div>
  );
};