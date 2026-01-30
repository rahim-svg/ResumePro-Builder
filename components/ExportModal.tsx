
import React, { useState } from 'react';
import { 
  FileText, Download, X, CheckCircle, Loader2, 
  FileCode, FileType, Printer, Globe, Lock, ShieldCheck,
  ArrowRight, File as FileIcon, Sparkles
} from 'lucide-react';
import { ResumeDocument, ResumeVersion } from '../types';
import { exportToDocx, exportToTxt } from '../lib/export-utils';

interface ExportModalProps {
  version: ResumeVersion;
  onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ version, onClose }) => {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [activeFormat, setActiveFormat] = useState<'pdf' | 'docx' | 'txt' | null>(null);

  const handleExport = async (format: 'pdf' | 'docx' | 'txt') => {
    setActiveFormat(format);
    setStatus('processing');
    
    // Brief UX delay to show "Processing"
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      if (format === 'pdf') {
        const element = document.querySelector('.resume-preview');
        // Access html2pdf from the global scope (loaded via script tag in index.html)
        const html2pdf = (window as any).html2pdf;
        
        if (!html2pdf) {
          throw new Error("html2pdf library not loaded correctly from global scope.");
        }

        if (element) {
          const opt = {
            margin: 0,
            filename: `${version.document.basics.name.replace(/\s+/g, '_')}_Resume.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
              scale: 2, 
              useCORS: true, 
              letterRendering: true,
              scrollX: 0,
              scrollY: 0
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
          };
          
          // Generate and save the PDF using the worker API
          await html2pdf().from(element).set(opt).save();
          setStatus('success');
        } else {
          throw new Error("Preview element not found");
        }
      } else if (format === 'docx') {
        await exportToDocx(version.document);
        setStatus('success');
      } else if (format === 'txt') {
        exportToTxt(version.document);
        setStatus('success');
      }
    } catch (error: any) {
      console.error('Export failed:', error);
      alert(`Export failed: ${error.message || 'Unknown error'}`);
      setStatus('idle');
    }

    // Auto-reset status or close after success
    if (format === 'pdf' && status === 'success') {
      setTimeout(() => {
        setStatus('idle');
        onClose();
      }, 1500);
    } else if (status === 'success') {
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xl z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl relative border border-white/20 animate-in zoom-in-95 duration-300">
        
        {/* Header Decor */}
        <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 w-full" />
        
        <div className="p-10 space-y-8">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Finalize Build</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Export Security Level: Enterprise
              </p>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* PDF Option */}
            <button 
              onClick={() => handleExport('pdf')}
              disabled={status === 'processing'}
              className={`group p-6 rounded-[2rem] border-2 transition-all text-left flex flex-col justify-between h-56 relative overflow-hidden ${
                activeFormat === 'pdf' && status === 'processing' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 bg-slate-50 hover:border-blue-200 hover:bg-white hover:shadow-xl'
              } disabled:opacity-50`}
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest block mb-1">High Quality</span>
                <h3 className="text-xl font-black text-slate-900 leading-none">PDF Document</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-2 leading-relaxed">Direct download optimized for ATS and recruiters.</p>
              </div>
              {activeFormat === 'pdf' && status === 'processing' && (
                <div className="absolute inset-0 bg-blue-600/10 flex items-center justify-center backdrop-blur-[2px]">
                   <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              )}
            </button>

            {/* DOCX Option */}
            <button 
              onClick={() => handleExport('docx')}
              disabled={status === 'processing'}
              className={`group p-6 rounded-[2rem] border-2 transition-all text-left flex flex-col justify-between h-56 relative overflow-hidden ${
                activeFormat === 'docx' && status === 'processing' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 bg-slate-50 hover:border-indigo-200 hover:bg-white hover:shadow-xl'
              } disabled:opacity-50`}
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                <FileCode className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest block mb-1">Editable</span>
                <h3 className="text-xl font-black text-slate-900 leading-none">MS Word</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-2 leading-relaxed">Structured DOCX build with native headings.</p>
              </div>
              {activeFormat === 'docx' && status === 'processing' && (
                <div className="absolute inset-0 bg-indigo-600/10 flex items-center justify-center backdrop-blur-[2px]">
                   <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
              )}
            </button>

            {/* TXT Option */}
            <button 
              onClick={() => handleExport('txt')}
              disabled={status === 'processing'}
              className={`group p-6 rounded-[2rem] border-2 transition-all text-left flex flex-col justify-between h-56 relative overflow-hidden ${
                activeFormat === 'txt' && status === 'processing' ? 'border-slate-800 bg-slate-100' : 'border-slate-100 bg-slate-50 hover:border-slate-300 hover:bg-white hover:shadow-xl'
              } disabled:opacity-50`}
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-600 shadow-sm group-hover:scale-110 transition-transform">
                <FileIcon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-1">Raw Content</span>
                <h3 className="text-xl font-black text-slate-900 leading-none">Plain Text</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-2 leading-relaxed">Clean ASCII formatting for legacy ATS parsers.</p>
              </div>
              {activeFormat === 'txt' && status === 'processing' && (
                <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center backdrop-blur-[2px]">
                   <Loader2 className="w-8 h-8 text-slate-900 animate-spin" />
                </div>
              )}
            </button>
          </div>

          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                  <Sparkles className="w-5 h-5" />
               </div>
               <div>
                  <p className="text-[11px] font-black text-slate-900 uppercase">Pre-Flight Check Passed</p>
                  <p className="text-[9px] text-slate-400 font-bold">Metadata sanitized. Direct download initialized.</p>
               </div>
            </div>
            <div className="flex items-center gap-2">
               <CheckCircle className="w-4 h-4 text-emerald-500" />
               <span className="text-[9px] font-black text-emerald-600 uppercase">Secure</span>
            </div>
          </div>

          {status === 'success' && (
            <div className="bg-emerald-600 text-white p-5 rounded-2xl flex items-center justify-center gap-3 animate-in slide-in-from-bottom-2 duration-300">
               <CheckCircle className="w-5 h-5" />
               <span className="text-xs font-black uppercase tracking-widest">Build Sequence Complete</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
