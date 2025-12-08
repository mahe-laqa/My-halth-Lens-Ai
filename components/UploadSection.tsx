import React, { useRef, useState } from 'react';

interface UploadSectionProps {
  onAnalyze: (file: File | null, text: string) => void;
  isAnalyzing: boolean;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onAnalyze, isAnalyzing }) => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [tab, setTab] = useState<'upload' | 'text'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!file && !text.trim()) return;
    onAnalyze(file, text);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-white ring-1 ring-slate-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setTab('upload')}
            className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${
              tab === 'upload' ? 'text-brand-700 bg-brand-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            {tab === 'upload' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-500 rounded-t-full mx-12"></div>}
            📷 Upload Image
          </button>
          <button
            onClick={() => setTab('text')}
            className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${
              tab === 'text' ? 'text-brand-700 bg-brand-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
             {tab === 'text' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-500 rounded-t-full mx-12"></div>}
            📝 Enter Text
          </button>
        </div>

        <div className="p-8">
          {tab === 'upload' ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
                file 
                ? 'border-brand-500 bg-brand-50' 
                : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,.pdf"
                className="hidden"
              />
              
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-sm transition-colors ${file ? 'bg-white text-brand-600' : 'bg-brand-100 text-brand-600'}`}>
                   {file ? (
                     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                   ) : (
                     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                   )}
                </div>
                
                <div className="space-y-1">
                  <p className="font-semibold text-slate-800 text-lg">
                    {file ? file.name : 'Click or Drag & Drop'}
                  </p>
                  <p className="text-sm text-slate-500">
                    {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Supports JPG, PNG, PDF'}
                  </p>
                </div>

                {!file && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition shadow-sm"
                  >
                    Select File
                  </button>
                )}
                
                {file && (
                  <button
                    onClick={() => setFile(null)}
                    className="text-sm font-medium text-red-500 hover:text-red-600 hover:underline"
                  >
                    Remove File
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
               <textarea
                className="w-full h-56 p-5 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition text-sm text-slate-700 leading-relaxed bg-slate-50 focus:bg-white"
                placeholder="Paste your lab results here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <p className="text-xs text-slate-400 text-center">
                Example: "Glucose: 110 mg/dL, Cholesterol: 200, HDL: 40"
              </p>
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={handleSubmit}
              disabled={(!file && !text.trim()) || isAnalyzing}
              className={`w-full py-4 px-6 rounded-xl font-bold shadow-lg transition-all duration-200 flex items-center justify-center space-x-3 ${
                (!file && !text.trim()) || isAnalyzing
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white transform hover:scale-[1.01] shadow-brand-200'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing Report...</span>
                </>
              ) : (
                <>
                  <span className="text-lg">Analyze Results</span>
                  <span className="bg-white/20 rounded-full p-1">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
