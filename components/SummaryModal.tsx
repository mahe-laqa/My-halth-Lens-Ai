import React, { useEffect } from 'react';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  summaryText?: string;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({ isOpen, onClose, summaryText }) => {
  // Lock body scroll when modal is open to prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in no-print"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col border-4 border-brand-50 relative overflow-hidden ring-1 ring-brand-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-brand-50 bg-brand-50/20">
           <h3 className="font-bold text-2xl text-brand-800 tracking-tight">30-Second Summary</h3>
           <button 
             onClick={onClose}
             className="text-slate-400 hover:text-brand-600 hover:bg-brand-50 p-2 rounded-full transition-colors"
             aria-label="Close modal"
           >
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
           </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-8 overflow-y-auto">
           {summaryText ? (
             <p className="text-xl leading-loose text-slate-700 font-medium text-justify">
               {summaryText}
             </p>
           ) : (
             <div className="flex flex-col items-center justify-center py-12">
               <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-brand-600 mb-4"></div>
               <p className="text-slate-500 font-medium">Generating summary...</p>
             </div>
           )}
        </div>
        
        {/* Footer */}
        <div className="p-5 border-t border-brand-50 bg-slate-50 flex justify-end">
           <button 
             onClick={onClose} 
             className="px-8 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition shadow-md text-lg"
           >
             Close
           </button>
        </div>
      </div>
    </div>
  );
};