
import React, { useState } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { 
  User, Briefcase, GraduationCap, Code, Plus, Trash2, 
  ChevronDown, ChevronUp, GripVertical, Eye, EyeOff, 
  Copy, Award, BookOpen, Globe, FolderKanban, Star, 
  MessageSquare, Layers, Settings2, Palette, Zap, CheckCircle,
  FileText, Link as LinkIcon, Target, Search, Scissors,
  Type as TypeIcon, AlignLeft, Maximize, Minus, AlignCenter, Layout,
  Microscope, Users, X, Sparkles, Wand2, Activity, Lightbulb,
  ShieldCheck, Terminal, Book, PenTool, Hash, Edit3
} from 'lucide-react';
import { SectionType } from '../types';

const SectionWrapper = ({ 
  id, title, type, icon: Icon, isVisible, isOpen, onToggleOpen, onToggleVisible, onRemove, onAddMore, itemCount, onUpdateTitle, 
  children, draggable, onDragStart, onDragOver, onDrop, isDragging 
}: any) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);

  const handleTitleSubmit = () => {
    onUpdateTitle(tempTitle);
    setIsEditingTitle(false);
  };

  return (
    <div 
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`mb-4 transition-all duration-300 ${isOpen ? 'mx-0' : 'mx-2'} ${isDragging ? 'opacity-30 scale-95' : 'opacity-100'}`}
    >
      <div 
        className={`group relative overflow-hidden rounded-[1.5rem] border transition-all duration-500 ${
          isOpen 
            ? 'bg-white border-blue-200 shadow-xl shadow-blue-500/5 ring-4 ring-blue-500/5' 
            : 'bg-white/70 border-slate-100 hover:border-slate-300 hover:bg-white shadow-sm'
        }`}
      >
        <div 
          className={`flex items-center gap-2 p-3 sm:p-5 cursor-pointer select-none`} 
          onClick={onToggleOpen}
        >
          {draggable && (
            <div className="p-2 cursor-grab active:cursor-grabbing text-slate-300 hover:text-blue-500 transition-colors">
              <GripVertical className="w-4 h-4" />
            </div>
          )}
          
          <div className="relative">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
              isOpen ? 'bg-blue-600 text-white rotate-0' : 'bg-slate-100 text-slate-400 -rotate-3 group-hover:rotate-0'
            }`}>
              <Icon className="w-5 h-5" />
            </div>
            {!isVisible && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-slate-400 border-2 border-white rounded-full flex items-center justify-center">
                <EyeOff className="w-2 h-2 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {isEditingTitle && type !== 'basics' ? (
              <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                <input 
                  autoFocus
                  className="bg-slate-50 border border-blue-300 rounded-lg px-2 py-1 text-sm font-black uppercase tracking-widest text-slate-900 w-full outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={tempTitle}
                  onChange={e => setTempTitle(e.target.value)}
                  onBlur={handleTitleSubmit}
                  onKeyDown={e => e.key === 'Enter' && handleTitleSubmit()}
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 group/title">
                <h3 className={`text-sm font-black uppercase tracking-widest truncate ${isOpen ? 'text-slate-900' : 'text-slate-600'}`}>
                  {title}
                </h3>
                {type !== 'basics' && isOpen && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsEditingTitle(true); }}
                    className="p-1 text-slate-300 hover:text-blue-500 opacity-0 group-hover/title:opacity-100 transition-opacity"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                )}
                {itemCount !== undefined && itemCount > 0 && (
                  <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-colors ${
                    isOpen ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {itemCount}
                  </span>
                )}
              </div>
            )}
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">
              {type === 'basics' ? 'Identity & Contact' : `${type.replace(/([A-Z])/g, ' $1')} Blueprint`}
            </p>
          </div>

          <div className="flex items-center gap-1 sm:gap-3" onClick={e => e.stopPropagation()}>
            <div className="hidden sm:flex items-center gap-1.5 px-2">
              <button 
                onClick={onToggleVisible} 
                className={`p-2 rounded-xl transition-all ${
                  isVisible ? 'text-blue-500 hover:bg-blue-50' : 'text-slate-300 hover:bg-slate-100'
                }`}
                title={isVisible ? "Visible in Build" : "Hidden from Build"}
              >
                {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              {type !== 'basics' && (
                <button 
                  onClick={onRemove} 
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  title="Deconstruct Block"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className={`p-2 rounded-full transition-transform duration-500 ${isOpen ? 'rotate-180 bg-blue-50 text-blue-600' : 'text-slate-300'}`}>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="p-4 sm:p-6 pt-2 space-y-8 bg-slate-50/50 border-t border-slate-100">
            {children}
            {onAddMore && (
              <button 
                onClick={onAddMore} 
                className="group/btn w-full py-5 bg-white border-2 border-dashed border-slate-200 rounded-[1.25rem] text-slate-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-300 font-black text-[10px] flex items-center justify-center gap-3 uppercase tracking-[0.2em]"
              >
                <Plus className="w-4 h-4" /> Expand {title}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const InputGroup = ({ label, children, fullWidth = false }: any) => (
  <div className={`space-y-2 ${fullWidth ? 'col-span-1 sm:col-span-2' : 'col-span-1'}`}>
    <div className="flex items-center justify-between px-1">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">{label}</label>
    </div>
    <div className="relative group">
      {children}
    </div>
  </div>
);

const SkillTagInput = ({ sectionId, categoryId, skills }: { sectionId: string, categoryId: string, skills: string[] }) => {
  const { updateItem } = useResumeStore();
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      updateItem(sectionId, categoryId, { skills: [...skills, inputValue.trim()] });
      setInputValue('');
    }
  };

  const removeSkill = (index: number) => {
    updateItem(sectionId, categoryId, { skills: skills.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {skills?.map((skill, i) => (
          <span key={i} className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-[10px] font-black text-slate-700 flex items-center gap-2 hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm">
            {skill}
            <X className="w-3 h-3 cursor-pointer text-slate-300 hover:text-red-500" onClick={() => removeSkill(i)} />
          </span>
        ))}
      </div>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Zap className="w-3.5 h-3.5 text-blue-500/50" />
        </div>
        <input 
          className="w-full text-[11px] font-bold p-3.5 pl-10 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 outline-none transition-all placeholder:text-slate-300"
          placeholder="Inject skill (Enter to push)..."
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

const Editor: React.FC = () => {
  const { 
    resumes, currentResumeId, activeVersionId, updateDocumentBasics, addSection, removeSection, updateSectionTitle,
    toggleSectionVisibility, addItem, removeItem, duplicateItem, updateItem, addBullet, removeBullet, 
    updateBullet, addCustomField, removeCustomField, updateCustomField, reorderSections, reorderItems
  } = useResumeStore();
  
  const resume = resumes.find(r => r.id === currentResumeId);
  const version = resume?.versions.find(v => v.id === activeVersionId);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ basics: true });
  const [showAddSection, setShowAddSection] = useState(false);
  const [draggedSectionIndex, setDraggedSectionIndex] = useState<number | null>(null);
  const [draggedItemIndex, setDraggedItemIndex] = useState<{ sectionId: string, index: number } | null>(null);

  if (!version) return null;
  const doc = version.document;
  const toggleOpen = (id: string) => setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));

  // --- Drag & Drop Handlers for Sections ---
  const handleSectionDragStart = (e: React.DragEvent, index: number) => {
    setDraggedSectionIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleSectionDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedSectionIndex !== null && draggedSectionIndex !== targetIndex) {
      reorderSections(draggedSectionIndex, targetIndex);
    }
    setDraggedSectionIndex(null);
  };

  // --- Drag & Drop Handlers for Items ---
  const handleItemDragStart = (e: React.DragEvent, sectionId: string, index: number) => {
    setDraggedItemIndex({ sectionId, index });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleItemDrop = (e: React.DragEvent, sectionId: string, targetIndex: number) => {
    e.preventDefault();
    if (draggedItemIndex && draggedItemIndex.sectionId === sectionId && draggedItemIndex.index !== targetIndex) {
      reorderItems(sectionId, draggedItemIndex.index, targetIndex);
    }
    setDraggedItemIndex(null);
  };

  const renderSectionItems = (section: any) => {
    return (
      <div className="space-y-6">
        {section.items.map((item: any, idx: number) => (
          <div 
            key={item.id} 
            draggable
            onDragStart={(e) => handleItemDragStart(e, section.id, idx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleItemDrop(e, section.id, idx)}
            className={`p-4 sm:p-6 border border-slate-100 rounded-[2rem] bg-white shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-300 relative group/item ${
              draggedItemIndex?.index === idx && draggedItemIndex?.sectionId === section.id ? 'opacity-30' : 'opacity-100'
            }`}
          >
            <div className="absolute top-4 right-4 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover/item:opacity-100 transition-all z-10">
              <button onClick={() => duplicateItem(section.id, item.id)} className="p-2 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all shadow-sm border border-slate-100"><Copy className="w-3 h-3" /></button>
              <button onClick={() => removeItem(section.id, item.id)} className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all shadow-sm border border-slate-100"><Trash2 className="w-3 h-3" /></button>
            </div>

            <div className="absolute top-4 left-4 p-2 cursor-grab active:cursor-grabbing text-slate-200 group-hover/item:text-slate-400 transition-all z-10">
              <GripVertical className="w-3.5 h-3.5" />
            </div>

            <div className="space-y-6 pt-4">
              {section.type === 'custom' && (
                <div className="space-y-6">
                  <InputGroup label="Entry Grouping" fullWidth>
                    <input 
                      className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 outline-none transition-all shadow-inner" 
                      placeholder="e.g. Major Achievement"
                      value={item.title || ''} 
                      onChange={e => updateItem(section.id, item.id, { title: e.target.value })} 
                    />
                  </InputGroup>
                  
                  <div className="space-y-4">
                    <label className="text-[9px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5" /> Static Data Fields
                    </label>
                    <div className="space-y-4">
                      {item.fields?.map((field: any) => (
                        <div key={field.id} className="flex flex-col gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 relative group/field">
                          <input 
                            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-400" 
                            placeholder="Label (e.g. Impact)"
                            value={field.label}
                            onChange={e => updateCustomField(section.id, item.id, field.id, { label: e.target.value })}
                          />
                          <div className="flex gap-2">
                            <input 
                              className="flex-1 p-3 bg-white border border-slate-200 rounded-xl text-[11px] font-bold outline-none focus:border-blue-400" 
                              placeholder="Value (e.g. High)"
                              value={field.value}
                              onChange={e => updateCustomField(section.id, item.id, field.id, { value: e.target.value })}
                            />
                            <button 
                              onClick={() => removeCustomField(section.id, item.id, field.id)}
                              className="p-3 text-slate-300 hover:text-red-500 transition-all bg-white border border-slate-200 rounded-xl"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => addCustomField(section.id, item.id)}
                      className="w-full py-4 bg-white border-2 border-dashed border-slate-200 text-slate-400 rounded-xl font-black text-[9px] uppercase tracking-widest hover:border-blue-200 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-3.5 h-3.5" /> Map New Data Field
                    </button>
                  </div>
                </div>
              )}

              {['experience', 'research', 'volunteering', 'leadership'].includes(section.type) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  <InputGroup label="Enterprise / Entity" fullWidth>
                    <input className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 outline-none transition-all shadow-inner" value={item.company || item.organization || ''} onChange={e => updateItem(section.id, item.id, { [section.type === 'experience' ? 'company' : 'organization']: e.target.value })} />
                  </InputGroup>
                  <InputGroup label="Capacity / Role">
                    <input className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 outline-none transition-all shadow-inner" value={item.role || ''} onChange={e => updateItem(section.id, item.id, { role: e.target.value })} />
                  </InputGroup>
                  <InputGroup label="Region / Geo">
                    <input className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 outline-none transition-all shadow-inner" value={item.location || ''} onChange={e => updateItem(section.id, item.id, { location: e.target.value })} />
                  </InputGroup>
                  <InputGroup label="Start">
                    <input className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 outline-none transition-all shadow-inner" value={item.startDate || ''} onChange={e => updateItem(section.id, item.id, { startDate: e.target.value })} />
                  </InputGroup>
                  <InputGroup label="End">
                    <input className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 outline-none transition-all shadow-inner" value={item.endDate || ''} placeholder={item.current ? 'Present' : 'MM/YYYY'} onChange={e => updateItem(section.id, item.id, { endDate: e.target.value })} />
                  </InputGroup>
                </div>
              )}

              {section.type === 'education' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  <InputGroup label="Academy / Uni" fullWidth>
                    <input className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 outline-none transition-all" value={item.institution || ''} onChange={e => updateItem(section.id, item.id, { institution: e.target.value })} />
                  </InputGroup>
                  <InputGroup label="Degree Scope">
                    <input className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold" value={item.degree || ''} onChange={e => updateItem(section.id, item.id, { degree: e.target.value })} />
                  </InputGroup>
                  <InputGroup label="Field / Major">
                    <input className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold" value={item.field || ''} onChange={e => updateItem(section.id, item.id, { field: e.target.value })} />
                  </InputGroup>
                  <InputGroup label="Conferred Date">
                    <input className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold" value={item.endDate || ''} onChange={e => updateItem(section.id, item.id, { endDate: e.target.value })} />
                  </InputGroup>
                </div>
              )}

              {section.type === 'skills' && (
                <div className="space-y-6">
                  <InputGroup label="Domain Header">
                    <input className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black" value={item.name || ''} placeholder="e.g. Cloud Arch" onChange={e => updateItem(section.id, item.id, { name: e.target.value })} />
                  </InputGroup>
                  <SkillTagInput sectionId={section.id} categoryId={item.id} skills={item.skills} />
                </div>
              )}

              {['certifications', 'awards', 'patents', 'publications'].includes(section.type) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                   <InputGroup label="Canonical Name" fullWidth>
                    <input className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black" value={item.name || item.title || ''} onChange={e => updateItem(section.id, item.id, { [item.name !== undefined ? 'name' : 'title']: e.target.value })} />
                  </InputGroup>
                  <InputGroup label="Authority">
                    <input className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold" value={item.issuer || item.organization || ''} onChange={e => updateItem(section.id, item.id, { [item.issuer !== undefined ? 'issuer' : 'organization']: e.target.value })} />
                  </InputGroup>
                  <InputGroup label="Conferred">
                    <input className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold" value={item.date || item.endDate || ''} onChange={e => updateItem(section.id, item.id, { [item.date !== undefined ? 'date' : 'endDate']: e.target.value })} />
                  </InputGroup>
                </div>
              )}

              {section.type === 'links' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                   <InputGroup label="Network">
                    <input className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black" value={item.label || ''} placeholder="e.g. LinkedIn" onChange={e => updateItem(section.id, item.id, { label: e.target.value })} />
                  </InputGroup>
                  <InputGroup label="URI">
                    <input className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold" value={item.url || ''} placeholder="https://..." onChange={e => updateItem(section.id, item.id, { url: e.target.value })} />
                  </InputGroup>
                </div>
              )}

              {item.bullets && (
                <div className="space-y-4 pt-6 border-t border-slate-50">
                  <div className="flex items-center justify-between">
                    <label className="text-[9px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5" /> Accomplishment Ledger
                    </label>
                  </div>
                  <div className="space-y-4">
                    {item.bullets.map((b: string, bi: number) => (
                      <div key={bi} className="flex flex-col sm:flex-row gap-2 items-start group/bullet relative">
                        <textarea 
                          rows={2}
                          className="flex-1 w-full p-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-[11px] font-medium leading-relaxed focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-300 outline-none transition-all" 
                          placeholder="Accomplished [X] by [Y] resulting in [Z]..."
                          value={b} 
                          onChange={e => updateBullet(section.id, item.id, bi, e.target.value)} 
                        />
                        <button onClick={() => removeBullet(section.id, item.id, bi)} className="self-end sm:self-center p-2 text-slate-300 hover:text-red-500 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => addBullet(section.id, item.id)} className="w-full py-4 bg-white border-2 border-slate-100 text-blue-600 rounded-xl font-black text-[9px] uppercase tracking-widest hover:border-blue-200 hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                    <Plus className="w-3.5 h-3.5" /> Append Achievement
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white relative">
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 sm:px-6 py-8 pb-40">
        <div className="max-w-3xl mx-auto space-y-2">
          <SectionWrapper 
            id="basics" title="Identity Architecture" type="basics" icon={User} isVisible={true} 
            isOpen={openSections['basics']} onToggleOpen={() => toggleOpen('basics')}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
              <InputGroup label="Legal Entity Name" fullWidth><input className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-black focus:ring-4 focus:ring-blue-500/5 outline-none transition-all" value={doc.basics.name} onChange={e => updateDocumentBasics({ name: e.target.value })} /></InputGroup>
              <InputGroup label="Market Segment Label" fullWidth><input className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none transition-all" value={doc.basics.label} onChange={e => updateDocumentBasics({ label: e.target.value })} /></InputGroup>
              <InputGroup label="Primary Comms Email"><input className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-bold focus:ring-4 focus:ring-blue-500/5 outline-none" value={doc.basics.email} onChange={e => updateDocumentBasics({ email: e.target.value })} /></InputGroup>
              <InputGroup label="Cellular Line"><input className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-bold focus:ring-4 focus:ring-blue-500/5 outline-none" value={doc.basics.phone} onChange={e => updateDocumentBasics({ phone: e.target.value })} /></InputGroup>
              <InputGroup label="Global Reach URI"><input className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-bold focus:ring-4 focus:ring-blue-500/5 outline-none" value={doc.basics.url} onChange={e => updateDocumentBasics({ url: e.target.value })} /></InputGroup>
              <InputGroup label="HQ Location"><input className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-bold focus:ring-4 focus:ring-blue-500/5 outline-none" value={doc.basics.location} onChange={e => updateDocumentBasics({ location: e.target.value })} /></InputGroup>
              <InputGroup label="Core Professional Narrative" fullWidth><textarea className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-xs font-medium min-h-[140px] focus:ring-4 focus:ring-blue-500/5 outline-none" value={doc.basics.summary} onChange={e => updateDocumentBasics({ summary: e.target.value })} /></InputGroup>
            </div>
          </SectionWrapper>

          {doc.sections.map((section, idx) => (
            <SectionWrapper 
              key={section.id} 
              id={section.id} 
              title={section.title} 
              type={section.type}
              draggable
              onDragStart={(e: any) => handleSectionDragStart(e, idx)}
              onDragOver={(e: any) => e.preventDefault()}
              onDrop={(e: any) => handleSectionDrop(e, idx)}
              isDragging={draggedSectionIndex === idx}
              icon={
                section.type === 'experience' ? Briefcase :
                section.type === 'education' ? GraduationCap :
                section.type === 'skills' ? Code :
                section.type === 'projects' ? FolderKanban :
                section.type === 'certifications' ? Star :
                section.type === 'research' ? Microscope :
                section.type === 'volunteering' ? MessageSquare :
                section.type === 'leadership' ? ShieldCheck :
                section.type === 'languages' ? Globe :
                section.type === 'links' ? LinkIcon :
                section.type === 'objective' ? Target :
                section.type === 'highlights' ? Lightbulb :
                section.type === 'awards' ? Award :
                section.type === 'publications' ? Book :
                section.type === 'patents' ? Hash :
                section.type === 'speaking' ? Users : Layers
              } 
              isVisible={section.isVisible} isOpen={openSections[section.id]}
              onToggleOpen={() => toggleOpen(section.id)} onToggleVisible={() => toggleSectionVisibility(section.id)}
              onRemove={() => removeSection(section.id)} onAddMore={() => addItem(section.id)} itemCount={section.items.length}
              onUpdateTitle={(newTitle: string) => updateSectionTitle(section.id, newTitle)}
            >
              {renderSectionItems(section)}
            </SectionWrapper>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-white via-white pointer-events-none z-[60]">
        <div className="max-w-md mx-auto pointer-events-auto">
          <button 
            onClick={() => setShowAddSection(!showAddSection)}
            className={`w-full py-5 rounded-[1.75rem] font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-3 transition-all duration-500 shadow-2xl relative overflow-hidden group ${
              showAddSection ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white hover:bg-blue-500'
            }`}
          >
            {showAddSection ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {showAddSection ? 'Cancel Selection' : 'Forge New Component'}
          </button>
          
          {showAddSection && (
            <div className="absolute bottom-full mb-6 left-4 right-4 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] shadow-2xl p-6 sm:p-8 max-h-[400px] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { type: 'objective', icon: Target, label: 'Objective' },
                  { type: 'highlights', icon: Lightbulb, label: 'Highlights' },
                  { type: 'projects', icon: FolderKanban, label: 'Projects' },
                  { type: 'research', icon: Microscope, label: 'Research' },
                  { type: 'leadership', icon: ShieldCheck, label: 'Leadership' },
                  { type: 'certifications', icon: Star, label: 'Certs' },
                  { type: 'awards', icon: Award, label: 'Awards' },
                  { type: 'volunteering', icon: MessageSquare, label: 'Volunteering' },
                  { type: 'languages', icon: Globe, label: 'Languages' },
                  { type: 'publications', icon: Book, label: 'Publications' },
                  { type: 'patents', icon: Hash, label: 'Patents' },
                  { type: 'links', icon: LinkIcon, label: 'Socials' },
                  { type: 'references', icon: Users, label: 'References' },
                  { type: 'custom', icon: Layers, label: 'Custom' }
                ].map(sec => (
                  <button 
                    key={sec.type}
                    onClick={() => { addSection(sec.type as any, sec.label); setShowAddSection(false); }}
                    className="flex flex-col items-center gap-3 p-4 hover:bg-blue-50 rounded-[1.5rem] border border-transparent hover:border-blue-100 transition-all group"
                  >
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-blue-600 transition-all shadow-sm">
                      <sec.icon className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">{sec.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Editor;
