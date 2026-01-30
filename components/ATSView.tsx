
import React from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { evaluateATS } from '../lib/ats-rules';
import { 
  AlertTriangle, CheckCircle, Info, ShieldAlert, Zap, Target, 
  Search, ArrowRight, Sparkles, Activity, ShieldCheck, 
  TrendingUp, BarChart, Gauge, ChevronRight
} from 'lucide-react';
import { Severity } from '../types';

const SeverityBadge = ({ severity }: { severity: Severity }) => {
  const colors = {
    [Severity.LOW]: 'bg-blue-50 text-blue-600 border-blue-100',
    [Severity.MEDIUM]: 'bg-amber-50 text-amber-600 border-amber-100',
    [Severity.HIGH]: 'bg-orange-50 text-orange-600 border-orange-100',
    [Severity.CRITICAL]: 'bg-red-50 text-red-600 border-red-100'
  };
  return <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border ${colors[severity]}`}>{severity}</span>;
};

const ATSView: React.FC = () => {
  const { resumes, currentResumeId, activeVersionId } = useResumeStore();
  const resume = resumes.find(r => r.id === currentResumeId);
  const version = resume?.versions.find(v => v.id === activeVersionId);

  if (!version) return null;

  const report = evaluateATS(version.document, version.settings);
  
  // SVG Math: Center 50, Radius 42, Stroke 8. 
  // Edge of stroke is at 42 + 4 = 46. Viewport is 100. 
  // Leaves 4 units of safety buffer inside the SVG.
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (report.score / 100) * circumference;

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-8 space-y-10 pb-32">
        
        {/* Analytics Hub Header - Optimized for Zero Overlap */}
        <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-8 bg-slate-50/70 p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="text-center lg:text-left min-w-0">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center justify-center lg:justify-start gap-3 uppercase">
              <Gauge className="w-6 h-6 text-blue-600" /> Analytics Hub
            </h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2 flex items-center justify-center lg:justify-start gap-2">
              <ShieldCheck className="w-3 h-3" /> Parser Integrity Simulation
            </p>
            <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-2">
              <span className="bg-white border border-slate-100 px-3 py-1 rounded-full text-[9px] font-black text-slate-500 uppercase">Version 1.0</span>
              <span className="bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full text-[9px] font-black text-emerald-600 uppercase">Ready to Ship</span>
            </div>
          </div>

          {/* Corrected Score Circle with Safety Margin */}
          <div className="relative w-32 h-32 shrink-0 p-1 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
              {/* Background Track */}
              <circle 
                cx="50" cy="50" r={radius} 
                stroke="currentColor" strokeWidth="8" fill="transparent" 
                className="text-slate-200" 
              />
              {/* Progress Stroke */}
              <circle 
                cx="50" cy="50" r={radius} 
                stroke="currentColor" strokeWidth="8" fill="transparent" 
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className={`${report.score > 80 ? 'text-emerald-500' : report.score > 60 ? 'text-blue-500' : 'text-red-500'} transition-all duration-1000 ease-out`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent">
              <span className="font-black text-4xl text-slate-900 leading-none">{report.score}</span>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Global</span>
            </div>
          </div>
        </div>

        {/* Dynamic Breakdown Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(report.breakdown).map(([key, value]: [string, any]) => (
            <div key={key} className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/10 group-hover:bg-blue-500/40 transition-all" />
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">{key}</div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900 leading-none">{value}</span>
                <span className="text-[10px] text-slate-300 font-bold">/40</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
                 <div 
                   className="h-full bg-blue-500 transition-all duration-700" 
                   style={{ width: `${(value/40)*100}%` }} 
                 />
              </div>
            </div>
          ))}
        </div>

        {/* Audit Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-black text-slate-800 flex items-center gap-3 text-[11px] uppercase tracking-widest">
              <Activity className="w-4 h-4 text-blue-600" /> Optimization Feed
            </h3>
            <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
              {report.issues.length} Items Found
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {report.issues.length === 0 ? (
              <div className="p-12 text-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <ShieldCheck className="w-16 h-16 text-emerald-500 mx-auto mb-5 opacity-40" />
                <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight">Zero Errors Detected</h4>
                <p className="text-sm font-medium text-slate-500 max-w-sm mx-auto mt-3">
                  Your document structure meets elite professional standards for automated ingestion.
                </p>
              </div>
            ) : (
              report.issues.map((issue) => (
                <div key={issue.id} className="bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-lg transition-all overflow-hidden group">
                  <div className="p-6 sm:p-8 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl shrink-0 ${issue.severity === Severity.CRITICAL ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                          <ShieldAlert className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-black text-slate-900 text-base tracking-tight leading-tight truncate">{issue.title}</h4>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{issue.impactedSection}</span>
                            <div className="w-1 h-1 rounded-full bg-slate-200" />
                            <SeverityBadge severity={issue.severity} />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-slate-500 font-medium leading-relaxed italic border-l-2 border-slate-100 pl-4">{issue.explanation}</p>
                    
                    <div className="bg-slate-50 rounded-[1.5rem] p-5 relative group/fix border border-slate-100/50">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                            <Sparkles className="w-3 h-3" /> Fix Protocol
                          </p>
                          <p className="text-xs text-slate-700 font-bold leading-relaxed">{issue.suggestedFix}</p>
                        </div>
                        <button className="shrink-0 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 px-5 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-2 active:scale-95 shadow-sm">
                          Navigate <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Job Match Module */}
        <div className="p-8 bg-slate-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-lg uppercase tracking-tight leading-none">Job-Specific Scan</h4>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1">Advanced Contextual Matching</p>
              </div>
            </div>
            <p className="text-sm font-medium leading-relaxed text-slate-400 max-w-lg">
              Attach a job description to activate keyword density matching and gap analysis. We'll identify exactly which technical requirements are missing from your current build.
            </p>
            <button className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
              <Search className="w-4 h-4" /> Upload Job Specification
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ATSView;
