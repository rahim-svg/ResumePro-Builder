
import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { useResumeStore } from './store/useResumeStore';
import { TEMPLATE_REGISTRY, renderTemplate } from './lib/templates';
import Editor from './components/Editor';
import ATSView from './components/ATSView';
import ExportModal from './components/ExportModal';
import { 
  FileText, LayoutDashboard, Layout, Download, Share2, 
  BarChart3, Plus, Search, ChevronRight, X, Check, 
  ZoomIn, ZoomOut, Palette, Zap, Type, Maximize, Droplets,
  Menu, Eye, FileEdit, Trash2, RefreshCw, Star, ShieldCheck,
  Sparkles, Layers, Wand2, Settings, AlignCenter, AlignLeft,
  StretchHorizontal, Circle
} from 'lucide-react';

const ResumeEditorPage = () => {
  const { resumes, currentResumeId, activeVersionId, selectResume, isSaving, updateSettings } = useResumeStore();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'edit' | 'ats' | 'design'>('edit');
  const [showPreview, setShowPreview] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [zoom, setZoom] = useState(0.8);
  
  const resume = resumes.find(r => r.id === id);
  // Use activeVersionId from the store for the most accurate reference
  const version = resume?.versions.find(v => v.id === activeVersionId);

  useEffect(() => { if (id) selectResume(id); }, [id, selectResume]);

  if (!version) return null;

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden font-inter">
      <header className="h-16 bg-slate-900 text-white px-4 sm:px-6 flex items-center justify-between shrink-0 z-[110] shadow-xl no-print">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl"><LayoutDashboard className="w-5 h-5" /></Link>
          <div className="h-6 w-px bg-slate-800"></div>
          <div className="min-w-0">
            <h1 className="font-black text-[10px] uppercase truncate max-w-[120px] sm:max-w-[200px]">{resume?.title}</h1>
            <div className="flex items-center gap-2 mt-0.5">
               {isSaving ? <span className="text-[8px] font-black text-blue-400 animate-pulse uppercase">Syncing...</span> : <span className="text-[8px] font-black text-emerald-400 uppercase flex items-center gap-1"><Check className="w-2.5 h-2.5" /> Synced</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
           <button onClick={() => setShowPreview(!showPreview)} className="lg:hidden px-4 py-2 bg-slate-800 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
             {showPreview ? <><FileEdit className="w-4 h-4" /> Form</> : <><Eye className="w-4 h-4" /> Preview</>}
           </button>
           <button 
             onClick={() => setShowExportModal(true)}
             className="px-4 py-2 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hidden sm:flex items-center gap-2 hover:bg-blue-500 transition-all"
           >
             <Download className="w-4 h-4" /> Export Build
           </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <aside className="w-16 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-8 gap-8 shrink-0 z-50 no-print">
          <button onClick={() => setActiveTab('edit')} className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${activeTab === 'edit' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-800'}`} title="Editor"><Layout className="w-5 h-5" /></button>
          <button onClick={() => setActiveTab('ats')} className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${activeTab === 'ats' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-800'}`} title="ATS Check"><BarChart3 className="w-5 h-5" /></button>
          <button onClick={() => setActiveTab('design')} className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${activeTab === 'design' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-800'}`} title="Design Engine"><Palette className="w-5 h-5" /></button>
        </aside>

        <div className={`fixed lg:relative inset-y-0 left-16 lg:left-0 z-40 w-[calc(100%-64px)] sm:w-[420px] bg-white border-r border-slate-200 transition-transform duration-300 transform no-print ${showPreview ? '-translate-x-full lg:translate-x-0' : 'translate-x-0 shadow-2xl lg:shadow-none'}`}>
          <div className="h-full flex flex-col overflow-hidden">
             {activeTab === 'edit' && <Editor />}
             {activeTab === 'ats' && <ATSView />}
             {activeTab === 'design' && (
               <div className="p-6 sm:p-8 h-full overflow-y-auto custom-scrollbar space-y-12 pb-24">
                 <div className="flex items-center justify-between">
                   <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Design Engine</h2>
                   <Wand2 className="w-5 h-5 text-blue-500" />
                 </div>
                 
                 <div className="space-y-6">
                    <div className="flex items-center gap-2 text-slate-400"><Layers className="w-4 h-4" /><span className="text-[10px] font-black uppercase tracking-widest">Master Architecture</span></div>
                    <div className="grid grid-cols-1 gap-3">
                       {TEMPLATE_REGISTRY.map(tpl => (
                         <button 
                           key={tpl.id} 
                           onClick={() => updateSettings({ templateId: tpl.id })} 
                           className={`group relative w-full text-left p-5 border-2 rounded-2xl transition-all hover:shadow-lg ${version.settings.templateId === tpl.id ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 bg-slate-50/30 hover:border-slate-200'}`}
                         >
                           <div className="flex justify-between items-start mb-2">
                             <div className="flex flex-col">
                               <span className={`font-black text-[11px] uppercase ${version.settings.templateId === tpl.id ? 'text-blue-700' : 'text-slate-700'}`}>{tpl.name}</span>
                               <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{tpl.category}</span>
                             </div>
                             {version.settings.templateId === tpl.id && <Check className="w-4 h-4 text-blue-600" />}
                           </div>
                           <div className="flex flex-wrap gap-1">
                             {tpl.tags.map(tag => (
                               <span key={tag} className="text-[7px] font-black text-slate-400 uppercase tracking-tighter bg-white px-1.5 py-0.5 rounded border border-slate-100">{tag}</span>
                             ))}
                           </div>
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-8 pt-10 border-t border-slate-100">
                   <div className="flex items-center gap-2 text-indigo-600"><Type className="w-4 h-4" /><span className="text-[10px] font-black uppercase tracking-widest">Typography Calibration</span></div>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Font Family</label>
                        <select value={version.settings.fontFamily} onChange={(e) => updateSettings({ fontFamily: e.target.value as any })} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black outline-none focus:border-indigo-500 cursor-pointer">
                           <option value="sans">Inter (Modern)</option>
                           <option value="montserrat">Montserrat (Bold)</option>
                           <option value="open-sans">Open Sans (Clean)</option>
                           <option value="serif">Playfair (Classic)</option>
                           <option value="merriweather">Merriweather (Soft)</option>
                           <option value="mono">Roboto Mono (Tech)</option>
                        </select>
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Density</label>
                        <select value={version.settings.fontSize} onChange={(e) => updateSettings({ fontSize: e.target.value as any })} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black outline-none focus:border-indigo-500 cursor-pointer">
                           <option value="small">Compact (11px)</option>
                           <option value="medium">Standard (13px)</option>
                           <option value="large">Spacious (15px)</option>
                        </select>
                     </div>
                   </div>
                 </div>

                 <div className="space-y-8 pt-10 border-t border-slate-100">
                   <div className="flex items-center gap-2 text-emerald-600"><Maximize className="w-4 h-4" /><span className="text-[10px] font-black uppercase tracking-widest">Layout Dynamics</span></div>
                   <div className="grid grid-cols-3 gap-2">
                      <button onClick={() => updateSettings({ headerLayout: 'left' })} className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${version.settings.headerLayout === 'left' ? 'bg-emerald-50 text-emerald-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`} style={{ borderColor: version.settings.headerLayout === 'left' ? version.settings.accentColor : '' }}>
                        <AlignLeft className="w-4 h-4" /><span className="text-[8px] font-black uppercase">Left</span>
                      </button>
                      <button onClick={() => updateSettings({ headerLayout: 'centered' })} className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${version.settings.headerLayout === 'centered' ? 'bg-emerald-50 text-emerald-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`} style={{ borderColor: version.settings.headerLayout === 'centered' ? version.settings.accentColor : '' }}>
                        <AlignCenter className="w-4 h-4" /><span className="text-[8px] font-black uppercase">Center</span>
                      </button>
                      <button onClick={() => updateSettings({ headerLayout: 'split' })} className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${version.settings.headerLayout === 'split' ? 'bg-emerald-50 text-emerald-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`} style={{ borderColor: version.settings.headerLayout === 'split' ? version.settings.accentColor : '' }}>
                        <StretchHorizontal className="w-4 h-4" /><span className="text-[8px] font-black uppercase">Split</span>
                      </button>
                   </div>
                   <div className="space-y-1.5 pt-4">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Section Style</label>
                      <div className="grid grid-cols-2 gap-3">
                         {['standard', 'underlined', 'minimalist', 'caps'].map(s => (
                           <button key={s} onClick={() => updateSettings({ sectionStyle: s as any })} className={`p-3 rounded-xl border-2 text-[9px] font-black uppercase tracking-widest transition-all ${version.settings.sectionStyle === s ? 'bg-emerald-50 text-emerald-600 font-black' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`} style={{ borderColor: version.settings.sectionStyle === s ? version.settings.accentColor : '' }}>
                             {s}
                           </button>
                         ))}
                      </div>
                   </div>
                 </div>

                 <div className="space-y-6 pt-10 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-blue-600"><Droplets className="w-4 h-4" /><span className="text-[10px] font-black uppercase tracking-widest">Palette & Finish</span></div>
                    <div className="flex flex-wrap gap-3">
                      {['#2563eb', '#1e293b', '#059669', '#dc2626', '#7c3aed', '#db2777', '#f59e0b', '#0ea5e9', '#000000'].map(c => (
                        <button key={c} onClick={() => updateSettings({ accentColor: c })} style={{ backgroundColor: c }} className={`w-9 h-9 rounded-full border-4 transition-all hover:scale-110 shadow-sm ${version.settings.accentColor === c ? 'border-white ring-2 ring-blue-500 scale-110' : 'border-transparent'}`} />
                      ))}
                    </div>
                    <div className="space-y-1.5 pt-4">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Corner Radius</label>
                       <div className="flex gap-2">
                          {['none', 'small', 'full'].map(r => (
                            <button key={r} onClick={() => updateSettings({ borderRadius: r as any })} className={`flex-1 p-3 rounded-xl border-2 text-[9px] font-black uppercase transition-all ${version.settings.borderRadius === r ? 'bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`} style={{ borderColor: version.settings.borderRadius === r ? version.settings.accentColor : '' }}>
                              {r}
                            </button>
                          ))}
                       </div>
                    </div>
                 </div>
               </div>
             )}
          </div>
        </div>

        <main className={`flex-1 bg-slate-100 relative overflow-hidden flex flex-col items-center transition-opacity duration-300 ${!showPreview && 'opacity-0 lg:opacity-100 hidden lg:flex'}`}>
          <div className="absolute top-6 right-6 flex items-center bg-white rounded-xl shadow-xl p-1 z-50 border zoom-controls no-print">
            <button onClick={() => setZoom(z => Math.max(0.3, z - 0.1))} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><ZoomOut className="w-4 h-4" /></button>
            <div className="w-14 text-center text-[10px] font-black text-slate-700">{Math.round(zoom * 100)}%</div>
            <button onClick={() => setZoom(z => Math.min(1.5, z + 0.1))} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><ZoomIn className="w-4 h-4" /></button>
          </div>
          <div className="w-full h-full flex justify-center pt-16 pb-40 overflow-auto no-scrollbar scroll-smooth p-6">
             <div className="transition-transform duration-500 origin-top mb-40" style={{ transform: `scale(${zoom})`, minHeight: 'fit-content' }}>
               <div className="resume-preview shadow-2xl ring-1 ring-slate-200">
                 {renderTemplate(version.document, version.settings)}
               </div>
             </div>
          </div>
        </main>
      </div>

      {showExportModal && (
        <ExportModal version={version} onClose={() => setShowExportModal(false)} />
      )}
    </div>
  );
};

const Dashboard = () => {
  const { resumes, addResume, deleteResume, resetStore, selectResume } = useResumeStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('My New CV');
  const [selectedTemplate, setSelectedTemplate] = useState('minimalist');

  const filteredResumes = useMemo(() => {
    return resumes.filter(r => r.title.toLowerCase().includes(search.toLowerCase()));
  }, [resumes, search]);

  const handleFinalCreate = () => {
    const newId = addResume(newTitle, selectedTemplate);
    if (newId) {
      setShowCreateModal(false);
      navigate(`/editor/${newId}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-inter">
      <nav className="h-16 bg-slate-900 text-white px-6 flex items-center justify-between sticky top-0 z-[100] shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <span className="text-lg font-black uppercase tracking-tighter">ResumePro <span className="text-blue-400">Elite</span></span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={resetStore} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all">
            <RefreshCw className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-black">AR</div>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl mx-auto w-full p-6 space-y-10">
        <section className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none">Assemble Your <br /><span className="text-blue-600">Legacy Document.</span></h1>
            <p className="text-slate-500 font-medium text-lg">You have {resumes.length} optimized documents ready for deployment.</p>
            <button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl transition-all flex items-center gap-3">
              <Plus className="w-5 h-5" /> Start New Build
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResumes.map(resume => (
            <div key={resume.id} className="group bg-white border border-slate-200 hover:border-blue-500 rounded-3xl p-8 transition-all relative flex flex-col justify-between h-64 shadow-sm hover:shadow-xl">
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <FileText className="w-7 h-7" />
                </div>
                <button onClick={() => deleteResume(resume.id)} className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 truncate">{resume.title}</h3>
                <div className="flex items-center justify-between">
                  <button onClick={() => { selectResume(resume.id); navigate(`/editor/${resume.id}`); }} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all">Launch Editor</button>
                  <span className="text-[10px] font-black text-slate-300 uppercase">{new Date(resume.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-lg p-10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-200 relative overflow-y-auto max-h-[90vh]">
            <button onClick={() => setShowCreateModal(false)} className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-full text-slate-400"><X className="w-6 h-6" /></button>
            <h2 className="text-3xl font-black text-slate-900 uppercase">New CV Build</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Title</label>
                <input className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black outline-none focus:border-blue-500 transition-all" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Template</label>
                <div className="grid grid-cols-2 gap-3">
                  {TEMPLATE_REGISTRY.map(tpl => (
                    <button key={tpl.id} onClick={() => setSelectedTemplate(tpl.id)} className={`p-4 rounded-2xl border-2 text-[10px] font-black uppercase transition-all ${selectedTemplate === tpl.id ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 bg-slate-50 text-slate-400'}`}>{tpl.name}</button>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={handleFinalCreate} className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all">Create Document</button>
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/editor/:id" element={<ResumeEditorPage />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
