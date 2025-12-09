
import React from 'react';
import { LabReport } from '../types';

interface HistoryViewProps {
  reports: LabReport[];
  onViewReport: (report: LabReport) => void;
  onBack: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ reports, onViewReport, onBack }) => {
  // Sort by date descending (newest first)
  const sortedReports = [...reports].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Feature: One-Glance Health Summary
  const totalReports = sortedReports.length;
  const abnormalCount = sortedReports.reduce((acc, r) => acc + (r.fullAnalysis.results.some(res => res.status !== 'Normal') ? 1 : 0), 0);
  const normalCount = totalReports - abnormalCount;

  // Feature: Health Timeline Grouping
  const groupedReports: Record<string, LabReport[]> = {};
  sortedReports.forEach(report => {
    const date = new Date(report.timestamp);
    const key = date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    if (!groupedReports[key]) groupedReports[key] = [];
    groupedReports[key].push(report);
  });

  // Feature: Report Age Helper
  const getAgeText = (dateStr: string) => {
    const diffDays = Math.ceil(Math.abs(new Date().getTime() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 2) return "New";
    if (diffDays < 30) return `${diffDays}d ago`;
    const months = Math.floor(diffDays / 30);
    return `${months}mo ago`;
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
           <h2 className="text-3xl font-bold text-slate-800">History</h2>
           <p className="text-slate-500">Your health journey timeline.</p>
        </div>
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-white border border-brand-200 text-brand-700 font-semibold rounded-xl hover:bg-brand-50 transition"
        >
          Back to Dashboard
        </button>
      </div>

      {totalReports > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-green-50 border border-green-100 p-4 rounded-2xl flex flex-col items-center">
             <span className="text-2xl font-bold text-green-700">{normalCount}</span>
             <span className="text-xs font-bold text-green-600 uppercase tracking-wide">Normal Reports</span>
          </div>
          <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-2xl flex flex-col items-center">
             <span className="text-2xl font-bold text-yellow-700">{abnormalCount}</span>
             <span className="text-xs font-bold text-yellow-600 uppercase tracking-wide">Attention Needed</span>
          </div>
        </div>
      )}

      {totalReports === 0 ? (
        <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border border-brand-50 shadow-lg">
          <div className="text-6xl mb-6 opacity-50">📂</div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">No Reports Saved Yet</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-8">
            Once you analyze a lab report, it will be securely stored here for at least 2 years.
          </p>
        </div>
      ) : (
        <div className="space-y-10 relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-brand-100 hidden md:block"></div>

          {Object.entries(groupedReports).map(([monthYear, monthReports]) => (
             <div key={monthYear} className="relative">
                <div className="flex items-center mb-4 md:ml-8">
                   <div className="bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-brand-200 z-10">
                     {monthYear}
                   </div>
                </div>
                
                <div className="space-y-6 md:ml-8">
                  {monthReports.map((report) => {
                    const date = new Date(report.timestamp);
                    const formattedDate = date.toLocaleDateString(undefined, { 
                      weekday: 'long', 
                      day: 'numeric' 
                    });
                    
                    return (
                      <div 
                        key={report.id} 
                        className="bg-white rounded-3xl p-6 shadow-md shadow-brand-100/30 border border-brand-50 hover:shadow-lg transition-all duration-300 group"
                      >
                        <div className="flex flex-col md:flex-row justify-between md:items-start gap-6">
                          {/* Image Thumbnail */}
                          <div className="flex-shrink-0 w-full md:w-32 h-32 bg-slate-50 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center p-2">
                            {report.imageData ? (
                              <img 
                                src={report.imageData} 
                                alt="Report Thumbnail" 
                                className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition" 
                              />
                            ) : (
                              <span className="text-2xl opacity-20">📄</span>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                               <span className="text-xs font-bold text-slate-600">
                                 {formattedDate}
                               </span>
                               {/* Feature: Report Age */}
                               <span className="text-xs bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full border border-slate-200">
                                 {getAgeText(report.timestamp)}
                               </span>
                            </div>
                            <p className="text-lg font-bold text-slate-800 mb-2">
                              Analysis Report
                            </p>
                            <p className="text-slate-600 leading-relaxed text-sm line-clamp-3">
                              {report.summary}
                            </p>
                          </div>

                          <div className="flex flex-col items-end justify-center min-w-[140px] pt-2 md:pt-0">
                            <button
                              onClick={() => onViewReport(report)}
                              className="w-full py-3 px-5 bg-white border border-brand-200 text-brand-700 font-bold rounded-xl shadow-sm hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all flex items-center justify-center group-hover:ring-1 group-hover:ring-brand-200"
                            >
                              <span>View Full Report</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
             </div>
          ))}
        </div>
      )}
    </div>
  );
};
