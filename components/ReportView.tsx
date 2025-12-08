import React from 'react';
import { AnalysisResponse, ResultStatus } from '../types';

interface ReportViewProps {
  data: AnalysisResponse;
  onReset: () => void;
}

const StatusBadge: React.FC<{ status: ResultStatus }> = ({ status }) => {
  let colorClass = 'bg-slate-100 text-slate-700 border-slate-200';
  let icon = '✅';

  switch (status) {
    case ResultStatus.Normal:
      colorClass = 'bg-brand-50 text-brand-700 border-brand-200 ring-1 ring-brand-100';
      icon = '✅';
      break;
    case ResultStatus.SlightlyLowHigh:
      colorClass = 'bg-accent-light/30 text-yellow-800 border-yellow-200 ring-1 ring-yellow-100';
      icon = '⚠️';
      break;
    case ResultStatus.Borderline:
      colorClass = 'bg-orange-50 text-orange-800 border-orange-200 ring-1 ring-orange-100';
      icon = '🔄';
      break;
    case ResultStatus.MCR:
      colorClass = 'bg-red-50 text-red-700 border-red-200 ring-1 ring-red-100';
      icon = '⚡';
      break;
    case ResultStatus.CorrelationAlert:
      colorClass = 'bg-purple-50 text-purple-700 border-purple-200 ring-1 ring-purple-100';
      icon = '🚨';
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${colorClass}`}>
      <span className="mr-1.5 text-sm">{icon}</span>
      {status}
    </span>
  );
};

export const ReportView: React.FC<ReportViewProps> = ({ data, onReset }) => {
  return (
    <div className="max-w-4xl mx-auto pb-20 animate-fade-in-up">
      
      <div className="flex justify-end mb-4">
        <button onClick={onReset} className="text-sm text-brand-600 font-semibold hover:underline flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Dashboard
        </button>
      </div>
      
      {/* Header Summary */}
      <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-white ring-1 ring-slate-100 p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-full -mr-8 -mt-8 z-0 opacity-50"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
             <span className="mr-3 p-2 bg-brand-100 text-brand-600 rounded-xl">⚕️</span> 
             Your Personalized Analysis
          </h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 leading-relaxed font-medium">{data.summary}</p>
          </div>
        </div>
      </div>

      {/* Lab Values Table */}
      <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-white ring-1 ring-slate-100 overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Detailed Value Analysis</h3>
          <span className="text-xs font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
            {data.results.length} Tests Analyzed
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">Test Name</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4">Range</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 min-w-[250px]">Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.results.map((result, idx) => (
                <tr key={idx} className="hover:bg-brand-50/30 transition-colors">
                  <td className="px-6 py-5 font-bold text-slate-800">{result.testName}</td>
                  <td className="px-6 py-5 font-mono text-slate-700">{result.value}</td>
                  <td className="px-6 py-5 text-slate-500 text-xs">{result.range}</td>
                  <td className="px-6 py-5">
                    <StatusBadge status={result.status as ResultStatus} />
                  </td>
                  <td className="px-6 py-5 text-slate-600 leading-snug">{result.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Nutrition Cards */}
      <div className="mb-8">
         <h3 className="text-xl font-bold text-slate-800 mb-5 px-2 flex items-center">
           <span className="text-accent mr-2">🎯</span> Personalized Nutrition Plan
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {data.nutrition.map((plan, idx) => (
             <div key={idx} className="bg-white rounded-3xl shadow-md border border-slate-100 p-6 flex flex-col h-full hover:shadow-lg transition-shadow">
               <h4 className="text-lg font-bold text-brand-700 mb-4 border-b border-brand-50 pb-3">
                 Goal: {plan.goal}
               </h4>
               
               <div className="mb-5 flex-1">
                 <div className="flex items-center mb-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Recommended</p>
                 </div>
                 <ul className="space-y-3">
                   {plan.recommended.map((item, i) => (
                     <li key={i} className="flex items-start text-sm text-slate-700 font-medium bg-green-50/50 p-2 rounded-lg">
                       <span className="text-green-600 mr-2">✓</span>
                       {item}
                     </li>
                   ))}
                 </ul>
               </div>

               <div>
                 <div className="flex items-center mb-3">
                    <div className="w-2 h-2 rounded-full bg-red-400 mr-2"></div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Moderate / Avoid</p>
                 </div>
                 <ul className="space-y-2">
                   {plan.avoid.map((item, i) => (
                     <li key={i} className="flex items-start text-sm text-slate-600 pl-2">
                       <span className="text-red-400 mr-2">•</span>
                       {item}
                     </li>
                   ))}
                 </ul>
               </div>
             </div>
           ))}
         </div>
      </div>

      {/* Lifestyle & Professional Consult */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-8">
          <h3 className="text-lg font-bold text-slate-800 mb-5">Lifestyle Guidance</h3>
          <ul className="space-y-4">
            {data.lifestyle.map((tip, idx) => (
              <li key={idx} className="flex items-start">
                 <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xs mr-3 mt-0.5">✓</span>
                 <span className="text-slate-700 text-sm font-medium leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Conditional MCR Box */}
        {data.professionalConsultation && (
           <div className="bg-red-50 rounded-3xl border border-red-100 p-8 flex flex-col justify-center">
             <h3 className="text-lg font-bold text-red-800 mb-3 flex items-center">
               <span className="mr-2 text-2xl">⚕️</span> Professional Consultation
             </h3>
             <p className="text-red-800 text-sm leading-relaxed font-medium bg-white/50 p-4 rounded-xl border border-red-100">
               {data.professionalConsultation}
             </p>
             <div className="mt-4 text-xs text-red-600 font-semibold opacity-75">
               * Please schedule an appointment with your healthcare provider.
             </div>
           </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="bg-slate-800 text-slate-300 p-8 rounded-3xl text-xs leading-relaxed text-center shadow-inner">
        <p className="font-bold text-white mb-2 uppercase tracking-wide text-[10px]">Closing Assurance</p>
        <p className="mb-4 max-w-2xl mx-auto">{data.disclaimer}</p>
        <p className="opacity-60">MyHealthLens AI provides educational guidance and is NOT a substitute for professional medical advice.</p>
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={onReset}
          className="bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-bold py-3 px-8 rounded-full transition shadow-sm hover:shadow-md"
        >
          Analyze Another Report
        </button>
      </div>
    </div>
  );
};
