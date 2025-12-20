
import React, { useState } from 'react';
import { AnalysisResponse, ResultStatus } from '../types';
import { SummaryModal } from './SummaryModal';

interface ReportViewProps {
  data: AnalysisResponse;
  onReset: () => void;
  reportDate?: string; 
  reportImage?: string;
  onAskQuestion?: (q: string) => void;
  userLanguage?: string;
}

const StatusBadge: React.FC<{ status: ResultStatus }> = ({ status }) => {
  let colorClass = 'bg-slate-100 text-slate-700 border-slate-200';
  let icon = '✅';

  switch (status) {
    case ResultStatus.Normal: colorClass = 'bg-brand-50 text-brand-700 border-brand-200 ring-1 ring-brand-100'; icon = '✅'; break;
    case ResultStatus.SlightlyLowHigh: colorClass = 'bg-accent-light/50 text-accent-dark border-accent ring-1 ring-accent/50'; icon = '⚠️'; break;
    case ResultStatus.Borderline: colorClass = 'bg-rose-50 text-rose-700 border-rose-100 ring-1 ring-rose-100'; icon = '🔄'; break;
    case ResultStatus.MCR: colorClass = 'bg-red-50 text-red-700 border-red-200 ring-1 ring-red-100'; icon = '⚡'; break;
    case ResultStatus.CorrelationAlert: colorClass = 'bg-purple-50 text-purple-700 border-purple-200 ring-1 ring-purple-100'; icon = '🚨'; break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${colorClass} print-break-inside-avoid whitespace-nowrap`}>
      <span className="mr-1.5 text-sm">{icon}</span>{status}
    </span>
  );
};

const getReportAgeText = (dateString?: string) => {
  if (!dateString) return null;
  const diffTime = Math.abs(new Date().getTime() - new Date(dateString).getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 2) return "Recently Uploaded";
  if (diffDays < 30) return `${diffDays} days ago`;
  const months = Math.floor(diffDays / 30);
  return `${months} month${months > 1 ? 's' : ''} old`;
};

export const ReportView: React.FC<ReportViewProps> = ({ data, onReset, reportDate, reportImage, onAskQuestion, userLanguage }) => {
  const [showShortSummary, setShowShortSummary] = useState(false);
  const [openTooltipId, setOpenTooltipId] = useState<number | null>(null); 

  // Language alignment logic
  const isRightAlign = ['urdu', 'arabic', 'hindi'].includes((userLanguage || '').toLowerCase());
  const alignClass = isRightAlign ? 'text-right' : 'text-left';
  const flexDirClass = isRightAlign ? 'flex-row-reverse' : 'flex-row';
  const iconMarginClass = isRightAlign ? 'ml-3' : 'mr-3';

  const handleDownloadImage = () => { if (!reportImage) return; const link = document.createElement('a'); link.href = reportImage; link.download = `HealthLens_Original_${new Date().toISOString().split('T')[0]}.png`; document.body.appendChild(link); link.click(); document.body.removeChild(link); };
  const handlePrint = () => window.print();
  const handleSavePDF = () => {
    const element = document.getElementById('report-export-container'); if (!element) return;
    // @ts-ignore
    if (typeof html2pdf === 'undefined') { alert('PDF generation library is loading. Please try again in a moment.'); return; }
    const opt = { margin: [10, 10, 10, 10], filename: `HealthLens_Report_${new Date().toISOString().split('T')[0]}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } };
    // @ts-ignore
    html2pdf().set(opt).from(element).save();
  };

  const reportAge = getReportAgeText(reportDate);

  const toggleMobileTooltip = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    setOpenTooltipId(openTooltipId === idx ? null : idx);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-fade-in-up print:max-w-none print:pb-0 relative" onClick={() => setOpenTooltipId(null)}>
      
      {/* Navigation Header */}
      <div className="flex justify-between items-center mb-6 no-print">
        {reportDate ? (
           <div className="flex flex-col">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Historical Analysis</span>
             <div className="flex items-center gap-2">
               <span className="text-xl font-bold text-slate-800">{new Date(reportDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
               <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">{reportAge}</span>
             </div>
           </div>
        ) : (<div></div>)}
        <button onClick={onReset} className="text-sm text-brand-600 font-semibold hover:underline flex items-center bg-white px-3 py-1.5 rounded-full shadow-sm border border-brand-50 hover:bg-brand-50 transition">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          Back to Dashboard
        </button>
      </div>

      {/* 30-Second Summary Toggle Button */}
      {data.shortSummary && (
        <div className="mb-6 no-print flex justify-end">
           <button 
             onClick={() => setShowShortSummary(true)} 
             className="bg-accent text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-accent-light transition-transform transform hover:scale-105 flex items-center gap-2 text-sm uppercase tracking-wide"
           >
             <span>View 30-Second Summary</span>
           </button>
        </div>
      )}

      {/* Summary Modal */}
      <SummaryModal 
        isOpen={showShortSummary} 
        onClose={() => setShowShortSummary(false)} 
        summaryText={data.shortSummary} 
      />

      <div id="report-export-container">
        
        {/* Original Report */}
        {reportImage && (
          <div className="bg-white rounded-3xl shadow-md border border-brand-50 p-6 mb-8 print:shadow-none print:border-none print:p-0">
            <div className="flex items-center justify-between mb-4 no-print">
                <div className="flex items-center"><div className="w-1 h-5 bg-accent rounded-full mr-3"></div><h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Original Report Reference</h3></div>
                <div className="flex gap-2" data-html2canvas-ignore="true">
                  <button onClick={handleDownloadImage} className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-100 hover:bg-brand-100 transition flex items-center" title="Download Original Image"><svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12"></path></svg></button>
                  <button onClick={handleSavePDF} className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-200 transition flex items-center" title="Save as PDF"><svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg></button>
                  <button onClick={handlePrint} className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-200 transition flex items-center" title="Print Report"><svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg></button>
                </div>
            </div>
            {data.imageQuality && (<div className="mb-4 bg-slate-50 text-slate-600 text-xs px-3 py-2 rounded-lg border border-slate-200 inline-block no-print">📷 Quality Check: {data.imageQuality}</div>)}
            <div className="bg-slate-50 rounded-xl border border-slate-200 print:bg-white print:border-none"><img src={reportImage} alt="Original Lab Report" className="w-full h-auto object-contain block" /></div>
            <p className="text-xs text-slate-400 mt-2 text-center no-print">* This original image is saved for verification and medical consultation.</p>
          </div>
        )}
        
        {/* Header Summary */}
        <div className="bg-white rounded-3xl shadow-xl shadow-brand-100/50 border border-brand-50 p-8 mb-8 relative overflow-hidden print:shadow-none print:border print:border-slate-300 print:rounded-none">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center border-b border-brand-50 pb-4"><span className="mr-3 p-2 bg-brand-100 text-brand-600 rounded-xl print:hidden">⚕️</span> AI Analysis Summary</h2>
            <div className="prose prose-slate max-w-none mb-4"><p className="text-lg text-slate-600 leading-relaxed font-medium">{data.summary}</p></div>
            {data.trendInsight && (<div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 items-start"><span className="text-blue-500 text-xl">📈</span><div><h4 className="font-bold text-blue-800 text-sm">Trend Insight</h4><p className="text-blue-700 text-sm">{data.trendInsight}</p></div></div>)}
            {data.riskFactors && data.riskFactors.length > 0 && (<div className="mt-4 flex gap-2 flex-wrap">{data.riskFactors.map((rf, i) => (<span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full border border-slate-200 flex items-center">{rf.includes('Sleep') ? '💤' : rf.includes('Diet') ? '🥗' : rf.includes('Stress') ? '🧘' : '⚠️'} {rf}</span>))}</div>)}
            {data.medicationNotes && (<div className="mt-4 p-3 bg-purple-50 border border-purple-100 rounded-xl text-xs text-purple-800"><span className="font-bold">💊 Medication Note:</span> {data.medicationNotes}</div>)}
          </div>
        </div>

        {/* Detailed Value Analysis */}
        <div className="bg-white rounded-3xl shadow-xl shadow-brand-100/50 border border-brand-50 overflow-hidden mb-8 print:shadow-none print:border print:border-slate-300 print:rounded-none">
          <div className="p-6 border-b border-brand-50 bg-brand-50/20 flex justify-between items-center print:bg-white print:border-b-slate-300">
            <h3 className="text-lg font-bold text-slate-800">Detailed Value Analysis</h3>
            <span className="text-xs font-medium text-brand-600 bg-white px-3 py-1 rounded-full border border-brand-100 shadow-sm print:hidden">{data.results.length} Tests Analyzed</span>
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-brand-50/40 text-slate-500 font-semibold uppercase tracking-wider text-xs print:bg-slate-100">
                <tr><th className="px-6 py-4">Test Name</th><th className="px-6 py-4">Value</th><th className="px-6 py-4">Range</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 min-w-[250px]">Context</th></tr>
              </thead>
              <tbody className="divide-y divide-brand-50 print:divide-slate-200">
                {data.results.map((result, idx) => (
                  <tr key={idx} className="hover:bg-brand-50/40 transition-colors print:break-inside-avoid">
                    <td className="px-6 py-5">
                      <div className="font-bold text-slate-800">{result.testName}</div>
                      {result.simpleDefinition && (
                        <div className="group relative inline-block mt-1">
                          <span className="text-xs text-brand-400 cursor-help border-b border-dotted border-brand-300">What is this?</span>
                          <div className="hidden group-hover:block absolute z-50 w-48 bg-slate-800 text-white text-xs p-2 rounded-lg shadow-lg -top-1 left-20 pointer-events-none">{result.simpleDefinition}</div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5 font-mono text-slate-700 bg-slate-50/50 rounded-lg print:bg-transparent">{result.value}</td>
                    <td className="px-6 py-5 text-slate-500 text-xs">{result.range}</td>
                    <td className="px-6 py-5"><StatusBadge status={result.status as ResultStatus} /></td>
                    <td className="px-6 py-5">
                      <p className="text-slate-600 leading-snug mb-2">{result.explanation}</p>
                      {result.foodSuggestion && (<div className="text-xs text-green-700 bg-green-50 p-2 rounded-lg border border-green-100"><span className="font-bold mr-1">🍎 Eat:</span> {result.foodSuggestion}</div>)}
                      {result.dailyRoutineTip && (<div className="text-xs text-brand-700 bg-brand-50/50 p-2 rounded-lg border border-brand-100 mt-1"><span className="font-bold mr-1">🎯 Do:</span> {result.dailyRoutineTip}</div>)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD VIEW */}
          <div className="md:hidden">
            <div className="divide-y divide-brand-50">
              {data.results.map((result, idx) => (
                <div key={idx} className="p-5 hover:bg-brand-50/20 transition relative">
                  <div className="flex justify-between items-start mb-4 gap-2">
                    <div>
                      <h4 className="font-bold text-slate-800 text-base">{result.testName}</h4>
                      {result.simpleDefinition && (
                        <div className="relative mt-1">
                          <button onClick={(e) => toggleMobileTooltip(e, idx)} className="flex items-center gap-1 text-[10px] uppercase font-bold text-brand-500 bg-brand-50 px-2 py-1 rounded-full border border-brand-100"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>Meaning</button>
                          {openTooltipId === idx && (
                            <div className="absolute z-20 top-full mt-2 left-0 w-60 bg-slate-800 text-white text-xs p-3 rounded-xl shadow-xl animate-fade-in border border-slate-700">{result.simpleDefinition}<div className="absolute -top-1.5 left-4 w-3 h-3 bg-slate-800 rotate-45 border-t border-l border-slate-700"></div></div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0"><StatusBadge status={result.status as ResultStatus} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                     <div className="bg-slate-50 rounded-xl p-3 border border-slate-100"><p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Value</p><p className="font-mono text-lg font-bold text-slate-800 break-all leading-none">{result.value}</p></div>
                     <div className="bg-slate-50 rounded-xl p-3 border border-slate-100"><p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Range</p><p className="text-sm font-medium text-slate-600 leading-tight">{result.range}</p></div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-brand-50 shadow-sm space-y-2">
                      <div className="flex items-start gap-2"><span className="text-brand-500 mt-0.5 text-xs">💡</span><p className="text-sm text-slate-600 leading-relaxed italic">{result.explanation}</p></div>
                      {result.foodSuggestion && <div className="text-xs text-green-700 bg-green-50 p-2 rounded-lg"><span className="font-bold">🍎 Eat:</span> {result.foodSuggestion}</div>}
                      {result.dailyRoutineTip && <div className="text-xs text-brand-700 bg-brand-50/50 p-2 rounded-lg"><span className="font-bold">🎯 Do:</span> {result.dailyRoutineTip}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- RESPONSIVE LAYOUT CONTAINER --- */}
        <div className="flex flex-col md:flex-row gap-5 items-start mb-8 print:break-inside-avoid">
          
          {/* 1. Personalized Nutrition (Left - 50%) */}
          <div className="w-full md:w-1/2">
             <div className={`flex items-center mb-5 px-2 ${flexDirClass}`}>
               <span className={`text-accent text-xl print:hidden ${isRightAlign ? 'ml-2' : 'mr-2'}`}>🎯</span>
               <h3 className="text-xl font-bold text-slate-800">Personalized Nutrition</h3>
             </div>
             <div className="space-y-6">
                {data.nutrition.map((plan, idx) => (
                  <div key={idx} className={`bg-white rounded-3xl shadow-md border border-brand-50 p-6 flex flex-col hover:shadow-lg transition-shadow print:shadow-none print:border print:border-slate-300 print:rounded-lg print:break-inside-avoid ${alignClass}`}>
                    <h4 className="text-lg font-bold text-brand-700 mb-4 border-b border-brand-50 pb-3">Goal: {plan.goal}</h4>
                    <div className="mb-5">
                      <div className={`flex items-center mb-3 ${flexDirClass}`}>
                         <div className={`w-2 h-2 rounded-full bg-green-500 print:border print:border-black ${isRightAlign ? 'ml-2' : 'mr-2'}`}></div>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Recommended</p>
                      </div>
                      <ul className="space-y-3">
                        {plan.recommended.map((item, i) => (
                          <li key={i} className={`flex items-start text-sm text-slate-700 font-medium bg-green-50/40 p-2 rounded-lg border border-green-50 print:bg-transparent print:border-none print:p-0 ${flexDirClass}`}>
                            <span className={`text-green-600 ${iconMarginClass}`}>✓</span>{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className={`flex items-center mb-3 ${flexDirClass}`}>
                        <div className={`w-2 h-2 rounded-full bg-red-400 print:border print:border-black ${isRightAlign ? 'ml-2' : 'mr-2'}`}></div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Moderate / Avoid</p>
                      </div>
                      <ul className="space-y-2">
                        {plan.avoid.map((item, i) => (
                          <li key={i} className={`flex items-start text-sm text-slate-600 pl-2 ${flexDirClass}`}>
                            <span className={`text-red-400 ${iconMarginClass}`}>•</span>{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* 2. Lifestyle Guidance (Right - 50%) */}
          <div className="w-full md:w-1/2">
             <div className={`flex items-center mb-5 px-2 ${flexDirClass}`}>
               <span className={`w-1 h-5 bg-brand-400 rounded-full print:hidden ${isRightAlign ? 'ml-3' : 'mr-3'}`}></span>
               <h3 className="text-xl font-bold text-slate-800">Lifestyle Guidance</h3>
             </div>
             <div className={`bg-white rounded-3xl shadow-md border border-brand-50 p-8 print:shadow-none print:border print:border-slate-300 print:rounded-lg ${alignClass}`}>
                <ul className="space-y-4">
                  {data.lifestyle.map((tip, idx) => (
                    <li key={idx} className={`flex items-start ${flexDirClass}`}>
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-xs mt-0.5 border border-brand-100 print:border-slate-300 ${iconMarginClass}`}>✓</span>
                      <span className="text-slate-700 text-sm font-medium leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
                
                {data.professionalConsultation && (
                  <div className="mt-8 bg-red-50 rounded-3xl border border-red-100 p-6 print:bg-transparent print:border print:border-red-200">
                    <h3 className={`text-lg font-bold text-red-800 mb-3 flex items-center ${flexDirClass}`}>
                      <span className={`text-2xl print:hidden ${isRightAlign ? 'ml-2' : 'mr-2'}`}>⚕️</span> Professional Consultation
                    </h3>
                    <p className="text-red-800 text-sm leading-relaxed font-medium bg-white/50 p-4 rounded-xl border border-red-100 print:bg-transparent print:p-0 print:border-none">{data.professionalConsultation}</p>
                    <div className="mt-4 text-xs text-red-600 font-semibold opacity-75">* Please schedule an appointment with your healthcare provider.</div>
                  </div>
                )}
             </div>
          </div>

        </div>
        {/* --- END RESPONSIVE CONTAINER --- */}
        
        {/* Next Test */}
        {data.nextTestSuggestion && (<div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-6 mb-8 text-center print:break-inside-avoid"><h4 className="text-sm font-bold text-blue-800 uppercase tracking-wide mb-2">Suggested Next Step</h4><p className="text-blue-700 font-medium">{data.nextTestSuggestion}</p></div>)}

        {/* Follow-Up Questions */}
        {data.followUpQuestions && data.followUpQuestions.length > 0 && (
           <div className="mb-8 no-print">
             <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-3 text-center">Common Follow-up Questions</h4>
             <div className="flex flex-wrap gap-3 justify-center">
               {data.followUpQuestions.map((q, i) => (
                 <button key={i} onClick={() => onAskQuestion && onAskQuestion(q)} className="bg-white border border-brand-200 text-brand-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-brand-50 hover:border-brand-300 transition shadow-sm">💬 {q}</button>
               ))}
             </div>
           </div>
        )}

        {/* Disclaimer */}
        <div className="bg-slate-800 text-slate-300 p-8 rounded-3xl text-xs leading-relaxed text-center shadow-inner border-t-4 border-accent print:bg-transparent print:text-slate-500 print:border-t print:border-slate-300 print:shadow-none print:p-4">
          <p className="font-bold text-white mb-2 uppercase tracking-wide text-[10px] print:text-black">Closing Assurance</p>
          <p className="mb-4 max-w-2xl mx-auto">{data.disclaimer}</p>
          <p className="opacity-60">MyHealthLens AI provides educational guidance and is NOT a substitute for professional medical advice.</p>
        </div>
      </div>
      
      {!reportDate && (<div className="mt-10 text-center no-print"><button onClick={onReset} className="bg-white border border-brand-200 hover:bg-brand-50 text-brand-700 font-bold py-3 px-8 rounded-full transition shadow-sm hover:shadow-md hover:ring-1 hover:ring-brand-200">Analyze Another Report</button></div>)}
    </div>
  );
};
