
import React, { useRef, useState, useEffect } from 'react';

interface UploadSectionProps {
  onAnalyze: (file: File | null) => void;
  isAnalyzing: boolean;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onAnalyze, isAnalyzing }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // --- FILE VALIDATION & SETTING ---
  const validateAndSetFile = (selectedFile: File) => {
    // 10MB Limit
    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("File is too large. Please upload a file smaller than 10MB.");
      return;
    }
    setFile(selectedFile);
  };

  // --- FILE UPLOAD HANDLERS ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  // --- CAMERA HANDLERS ---
  const startCamera = async () => {
    setCameraError(null);
    setIsCameraOpen(true);
    setCapturedImage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      // Delay slightly to ensure DOM is ready
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDismissedError') {
         setCameraError("Camera access denied. Please check your browser permissions.");
      } else {
         setCameraError("Unable to access camera. Please use 'Upload File' instead.");
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
    setCapturedImage(null);
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(dataUrl);
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      fetch(capturedImage)
        .then(res => res.blob())
        .then(blob => {
          const newFile = new File([blob], `camera_capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
          validateAndSetFile(newFile);
          stopCamera();
        });
    }
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleSubmit = () => {
    if (!file) return;
    onAnalyze(file);
  };

  // --- CAMERA MODAL UI ---
  if (isCameraOpen) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-fade-in">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/70 to-transparent">
            <button 
              onClick={stopCamera} 
              className="text-white bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md transition"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <span className="text-white font-bold text-lg tracking-wide">
              {capturedImage ? 'Review Photo' : 'Take Photo'}
            </span>
            <div className="w-10"></div>
        </div>

        {/* Viewport */}
        <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
            {cameraError ? (
              <div className="text-white text-center p-6 max-w-sm">
                <p className="mb-4 text-red-400 font-bold">Camera Error</p>
                <p className="mb-6">{cameraError}</p>
                <button onClick={stopCamera} className="bg-white text-black px-6 py-2 rounded-full font-bold">Close</button>
              </div>
            ) : (
              <>
                {!capturedImage ? (
                    <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <img 
                        src={capturedImage} 
                        alt="Captured" 
                        className="w-full h-full object-contain"
                    />
                )}
                <canvas ref={canvasRef} className="hidden" />
              </>
            )}
        </div>

        {/* Controls */}
        <div className="p-8 bg-black/90 backdrop-blur-md pb-12">
            {!capturedImage ? (
                <div className="flex justify-center items-center">
                    <button 
                        onClick={takePhoto}
                        className="group relative"
                        disabled={!!cameraError}
                    >
                       <div className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-transparent transition-transform group-active:scale-95">
                          <div className="w-16 h-16 bg-white rounded-full group-hover:bg-brand-50 transition-colors"></div>
                       </div>
                    </button>
                </div>
            ) : (
                <div className="flex gap-4 max-w-md mx-auto">
                    <button 
                        onClick={retakePhoto}
                        className="flex-1 py-4 bg-white/20 text-white font-bold rounded-2xl hover:bg-white/30 transition backdrop-blur-md"
                    >
                        Retake
                    </button>
                    <button 
                        onClick={confirmPhoto}
                        className="flex-1 py-4 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-500 transition shadow-lg shadow-brand-900/50"
                    >
                        Use Photo
                    </button>
                </div>
            )}
        </div>
      </div>
    );
  }

  // --- MAIN UPLOAD UI ---
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-brand-100/50 border-t-4 border-accent border-l border-r border-b border-brand-50 ring-1 ring-brand-50 overflow-hidden">
        
        <div className="p-8 bg-gradient-to-b from-brand-50/20 to-white">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
              file 
              ? 'border-brand-500 bg-brand-50/50 ring-1 ring-brand-200' 
              : 'border-brand-200 hover:border-brand-400 hover:bg-brand-50/30'
            }`}
          >
            {/* Standard File Input ONLY */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,application/pdf"
              className="hidden"
            />
            
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-sm transition-colors ${file ? 'bg-white text-brand-600 ring-2 ring-brand-100' : 'bg-brand-50 text-brand-400'}`}>
                 {file ? (
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                 ) : (
                   <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                 )}
              </div>
              
              <div className="space-y-1">
                <p className="font-semibold text-slate-800 text-lg">
                  {file ? file.name : 'Upload Medical Report'}
                </p>
                <p className="text-sm text-slate-500">
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Supported formats: JPG, PNG, PDF'}
                </p>
              </div>

              {!file && (
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
                  {/* Option 1: File Picker */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 px-6 py-4 bg-white border border-brand-200 rounded-xl text-sm font-bold text-brand-700 hover:bg-brand-50 hover:border-brand-300 transition shadow-sm hover:shadow flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                    Upload File
                  </button>
                  
                  {/* Option 2: Real Camera Interface */}
                  <button
                    onClick={startCamera}
                    className="flex-1 px-6 py-4 bg-brand-600 border border-transparent rounded-xl text-sm font-bold text-white hover:bg-brand-500 transition shadow-sm hover:shadow flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    Take Photo
                  </button>
                </div>
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

          <div className="mt-8">
            <button
              onClick={handleSubmit}
              disabled={!file || isAnalyzing}
              className={`w-full py-4 px-6 rounded-xl font-bold shadow-md transition-all duration-300 flex items-center justify-center space-x-3 ${
                !file || isAnalyzing
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-brand-600 text-white hover:bg-brand-500 hover:shadow-lg hover:ring-1 hover:ring-accent transform hover:scale-[1.01] shadow-brand-100'
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
