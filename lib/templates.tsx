
import React from 'react';
import { ResumeDocument, TemplateSettings, ATSLevel, Template } from '../types';

interface TemplateProps {
  doc: ResumeDocument;
  settings: TemplateSettings;
}

/** 
 * DESIGN ENGINE HELPERS
 */
const getFont = (f: string) => {
  const map: any = {
    'sans': "'Inter', sans-serif",
    'serif': "'Playfair Display', serif",
    'mono': "'Source Code Pro', monospace",
    'montserrat': "'Montserrat', sans-serif",
    'open-sans': "'Open Sans', sans-serif",
    'merriweather': "'Merriweather', serif"
  };
  return map[f] || map.sans;
};

const getFontSize = (s: string) => {
  if (s === 'small') return '11px';
  if (s === 'large') return '16px';
  return '13px';
};

const getBorderRadius = (r: string) => {
  if (r === 'none') return '0px';
  if (r === 'full') return '9999px';
  return '8px'; 
};

const SectionHeader = ({ title, settings, light = false }: { title: string, settings: TemplateSettings, light?: boolean }) => {
  const style = settings.sectionStyle;
  const isCentered = settings.headerLayout === 'centered';
  const accentColor = light ? '#ffffff' : settings.accentColor;

  const baseTextStyles: React.CSSProperties = {
    color: accentColor,
    fontSize: '11px',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    textAlign: isCentered ? 'center' : 'left'
  };

  if (style === 'underlined') {
    return (
      <div className={`mb-6 border-b-2 pb-1.5 ${isCentered ? 'text-center' : 'text-left'}`} style={{ borderColor: accentColor + '40' }}>
        <h2 style={baseTextStyles}>{title}</h2>
      </div>
    );
  }

  if (style === 'caps') {
    return (
      <div className={`mb-6 ${isCentered ? 'text-center' : 'text-left'}`} style={{ borderLeft: isCentered ? 'none' : `4px solid ${accentColor}`, paddingLeft: isCentered ? '0' : '14px' }}>
        <h2 style={{ ...baseTextStyles, fontStyle: 'italic' }}>{title}</h2>
      </div>
    );
  }

  if (style === 'minimalist') {
    return (
      <div className={`mb-4 ${isCentered ? 'text-center' : 'text-left'}`}>
        <h2 style={{ ...baseTextStyles, color: light ? '#cbd5e1' : '#64748b', opacity: 0.8, fontSize: '10px' }}>{title}</h2>
      </div>
    );
  }

  return (
    <div className={`mb-6 ${isCentered ? 'text-center' : 'text-left'}`}>
      <h2 style={baseTextStyles}>{title}</h2>
    </div >
  );
};

const SharedBullets = ({ bullets, settings, invert = false }: { bullets: string[], settings: TemplateSettings, invert?: boolean }) => (
  <ul className="space-y-1.5 mt-3">
    {bullets.map((b, idx) => b && b.trim() && (
      <li key={idx} className={`${invert ? 'text-slate-300' : 'text-slate-600'} leading-relaxed flex gap-3 items-start`}>
        <span 
          className="mt-1.5 w-1.5 h-1.5 shrink-0" 
          style={{ 
            backgroundColor: settings.accentColor, 
            borderRadius: getBorderRadius(settings.borderRadius) 
          }} 
        />
        <span style={{ fontSize: '1em' }}>{b}</span>
      </li>
    ))}
  </ul>
);

const SharedSkills = ({ items, settings, invert = false }: { items: any[], settings: TemplateSettings, invert?: boolean }) => (
  <div className="space-y-4">
    {items.map(item => (
      <div key={item.id}>
        {item.name && <p className={`text-[10px] font-black uppercase ${invert ? 'text-slate-500' : 'text-slate-400'} mb-2`}>{item.name}</p>}
        <div className="flex flex-wrap gap-1.5">
          {item.skills?.map((sk: string) => (
            <span 
              key={sk} 
              className={`px-3 py-1 text-[10px] font-bold border`}
              style={{ 
                borderRadius: getBorderRadius(settings.borderRadius),
                borderColor: settings.accentColor + (invert ? '60' : '25'),
                color: invert ? '#fff' : settings.accentColor,
                backgroundColor: settings.accentColor + (invert ? '30' : '08')
              }}
            >
              {sk}
            </span>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const RenderItem = ({ item, type, settings, invert = false }: { item: any, type: string, settings: TemplateSettings, invert?: boolean }) => {
  const textPrimary = invert ? 'text-white' : 'text-slate-800';
  const textSecondary = invert ? 'text-slate-400' : 'text-slate-500';
  const textMuted = invert ? 'text-slate-500' : 'text-slate-400';

  switch (type) {
    case 'skills':
      return <SharedSkills items={[item]} settings={settings} invert={invert} />;
    case 'experience':
    case 'research':
    case 'volunteering':
    case 'leadership':
    case 'projects':
      return (
        <div className="break-inside-avoid">
          <div className="flex justify-between font-bold">
            <span className={`text-lg ${textPrimary}`}>{item.role || item.title || item.name}</span>
            <span className={`text-[10px] ${textMuted} uppercase tracking-widest self-center`}>{item.startDate} {item.endDate ? `— ${item.endDate}` : ''}</span>
          </div>
          <p className={`${textSecondary} font-medium italic mb-2`}>{item.company || item.institution || item.organization || (item.link && <a href={item.link} className="underline text-blue-500">{item.link}</a>)}</p>
          {item.bullets && <SharedBullets bullets={item.bullets} settings={settings} invert={invert} />}
        </div>
      );
    case 'education':
      return (
        <div className="break-inside-avoid">
          <div className="flex justify-between font-bold">
            <span className={`text-lg ${textPrimary}`}>{item.degree} {item.field ? `in ${item.field}` : ''}</span>
            <span className={`text-[10px] ${textMuted} uppercase tracking-widest self-center`}>{item.endDate}</span>
          </div>
          <p className={`${textSecondary} font-medium`}>{item.institution} • {item.location}</p>
        </div>
      );
    case 'languages':
      return (
        <div className="flex justify-between items-center py-1 border-b border-slate-100/10">
          <span className={`font-bold ${textPrimary}`}>{item.name}</span>
          <span className={`text-[10px] font-black uppercase ${textMuted}`}>{item.description || 'Native'}</span>
        </div>
      );
    case 'certifications':
    case 'awards':
    case 'patents':
      return (
        <div className="flex justify-between items-start break-inside-avoid">
          <div className="flex-1">
            <p className={`font-bold ${textPrimary}`}>{item.name || item.title}</p>
            <p className={`text-[11px] ${textMuted} font-medium`}>{item.issuer || item.organization} • {item.description}</p>
          </div>
          <span className={`text-[10px] font-black uppercase ${textMuted} ml-4`}>{item.date || item.endDate}</span>
        </div>
      );
    case 'links':
      return (
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-black uppercase ${textMuted} w-24`}>{item.label}:</span>
          <span className="text-[11px] font-medium text-blue-500 truncate">{item.url}</span>
        </div>
      );
    case 'custom':
      return (
        <div className="break-inside-avoid">
          {item.title && <p className={`text-lg font-bold mb-3 ${textPrimary}`}>{item.title}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3">
            {item.fields?.map((f: any) => (
              <div key={f.id} className="flex justify-between items-baseline border-b border-slate-100/10 pb-1">
                <span className={`text-[10px] font-black uppercase tracking-widest ${textMuted} mr-4`}>{f.label}:</span>
                <span className={`text-[11px] font-medium text-right ${textSecondary}`}>{f.value}</span>
              </div>
            ))}
          </div>
          {item.bullets && <SharedBullets bullets={item.bullets} settings={settings} invert={invert} />}
        </div>
      );
    default:
      return (
        <div className="break-inside-avoid">
          {item.title && <p className={`font-bold ${textPrimary}`}>{item.title}</p>}
          {item.description && <p className={invert ? 'text-slate-400' : 'text-slate-600'}>{item.description}</p>}
          {item.bullets && <SharedBullets bullets={item.bullets} settings={settings} invert={invert} />}
        </div>
      );
  }
};

/** 
 * 1. ELITE MINIMALIST
 */
const Minimalist: React.FC<TemplateProps> = ({ doc, settings }) => (
  <div style={{ padding: '1.5cm', fontFamily: getFont(settings.fontFamily), fontSize: getFontSize(settings.fontSize) }}>
    <header className={`mb-12 ${settings.headerLayout === 'centered' ? 'text-center' : settings.headerLayout === 'split' ? 'flex justify-between items-end' : 'text-left'}`}>
      <div>
        <h1 className="text-4xl font-black tracking-tighter mb-1" style={{ color: settings.accentColor }}>{doc.basics.name}</h1>
        <p className="text-xl font-medium text-slate-500">{doc.basics.label}</p>
      </div>
      <div className={`mt-4 flex flex-wrap gap-4 text-xs font-bold text-slate-400 ${settings.headerLayout === 'centered' ? 'justify-center' : settings.headerLayout === 'split' ? 'justify-end' : ''}`}>
        <span>{doc.basics.email}</span><span>|</span><span>{doc.basics.phone}</span><span>|</span><span>{doc.basics.location}</span>
      </div>
    </header>
    {doc.basics.summary && (
       <section className="mb-10"><SectionHeader title="Summary" settings={settings} /><p className="text-slate-600 leading-relaxed">{doc.basics.summary}</p></section>
    )}
    {doc.sections.filter(s => s.isVisible).map(s => (
      <section key={s.id} className="mb-10 break-inside-avoid">
        <SectionHeader title={s.title} settings={settings} />
        <div className="space-y-6">{s.items.map((i: any) => <RenderItem key={i.id} item={i} type={s.type} settings={settings} />)}</div>
      </section>
    ))}
  </div>
);

/** 
 * 2. TECH PRO SIDEBAR
 */
const TechPro: React.FC<TemplateProps> = ({ doc, settings }) => (
  <div className="flex min-h-full" style={{ fontFamily: getFont(settings.fontFamily), fontSize: getFontSize(settings.fontSize) }}>
    <aside className="w-[32%] bg-slate-900 text-white p-10 flex flex-col">
      <h1 className="text-2xl font-black mb-1 leading-none" style={{ color: settings.accentColor }}>{doc.basics.name}</h1>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10">{doc.basics.label}</p>
      <div className="space-y-10">
        <section>
          <h3 className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-4">Contact</h3>
          <div className="text-[11px] space-y-2 text-slate-300">
            <p className="truncate">{doc.basics.email}</p><p>{doc.basics.phone}</p><p>{doc.basics.location}</p>
          </div>
        </section>
        {doc.sections.filter(s => (['skills', 'languages', 'links'].includes(s.type)) && s.isVisible).map(s => (
          <div key={s.id}>
            <h3 className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-4">{s.title}</h3>
            <div className="space-y-4">{s.items.map(i => <RenderItem key={i.id} item={i} type={s.type} settings={settings} invert />)}</div>
          </div>
        ))}
      </div>
    </aside>
    <main className="flex-1 p-12 bg-white">
      {doc.basics.summary && <p className="text-slate-500 text-xs italic mb-10 leading-relaxed border-l-2 pl-4 border-slate-100">{doc.basics.summary}</p>}
      {doc.sections.filter(s => s.isVisible && !['skills', 'languages', 'links'].includes(s.type)).map(s => (
        <section key={s.id} className="mb-10">
          <SectionHeader title={s.title} settings={settings} />
          <div className="space-y-8">{s.items.map((i: any) => <RenderItem key={i.id} item={i} type={s.type} settings={settings} />)}</div>
        </section>
      ))}
    </main>
  </div>
);

/** 
 * 3. CEO VISION (Serif/Classic)
 */
const Executive: React.FC<TemplateProps> = ({ doc, settings }) => (
  <div className="bg-[#fffdfa]" style={{ padding: '2cm', fontFamily: getFont(settings.fontFamily), fontSize: getFontSize(settings.fontSize) }}>
    <header className={`mb-16 border-b border-slate-200 pb-10 ${settings.headerLayout === 'centered' ? 'text-center' : settings.headerLayout === 'split' ? 'flex justify-between items-end' : 'text-left'}`}>
      <div>
        <h1 className="text-5xl font-serif font-bold text-slate-900 mb-2">{doc.basics.name}</h1>
        <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 mb-6">{doc.basics.label}</p>
      </div>
      <div className={`flex gap-6 text-[10px] font-bold text-slate-500 italic ${settings.headerLayout === 'centered' ? 'justify-center' : settings.headerLayout === 'split' ? 'justify-end' : ''}`}>
        <span>{doc.basics.email}</span><span>•</span><span>{doc.basics.phone}</span><span>•</span><span>{doc.basics.location}</span>
      </div>
    </header>
    <div className="max-w-4xl mx-auto space-y-12">
      {doc.basics.summary && (
        <section className={`italic text-slate-600 leading-loose max-w-2xl ${settings.headerLayout === 'centered' ? 'mx-auto text-center' : ''}`}>{doc.basics.summary}</section>
      )}
      {doc.sections.filter(s => s.isVisible).map(s => (
        <section key={s.id} className="break-inside-avoid">
          <SectionHeader title={s.title} settings={settings} />
          <div className="space-y-8">{s.items.map((i: any) => <RenderItem key={i.id} item={i} type={s.type} settings={settings} />)}</div>
        </section>
      ))}
    </div>
  </div>
);

/** 
 * 4. GRID MASTER
 */
const GridMaster: React.FC<TemplateProps> = ({ doc, settings }) => (
  <div style={{ padding: '1.5cm', fontFamily: getFont(settings.fontFamily), fontSize: getFontSize(settings.fontSize) }}>
    <header className={`p-10 rounded-3xl mb-10 flex justify-between items-center bg-slate-900 text-white ${settings.headerLayout === 'centered' ? 'flex-col text-center' : ''}`}>
      <div>
        <h1 className="text-3xl font-black tracking-tight" style={{ color: settings.accentColor }}>{doc.basics.name}</h1>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{doc.basics.label}</p>
      </div>
      <div className={`text-[10px] space-y-1 font-bold ${settings.headerLayout === 'centered' ? 'mt-4' : 'text-right'}`}>
        <p>{doc.basics.email}</p><p>{doc.basics.phone}</p><p>{doc.basics.location}</p>
      </div>
    </header>
    <div className="grid grid-cols-2 gap-8">
      <div className="col-span-2">{doc.basics.summary && <p className="text-slate-600 leading-relaxed border-b pb-8">{doc.basics.summary}</p>}</div>
      {doc.sections.filter(s => s.isVisible).map(s => (
        <section key={s.id} className={`${s.type === 'experience' || s.type === 'projects' ? 'col-span-2' : 'col-span-1'} break-inside-avoid bg-slate-50/50 p-6 rounded-2xl border border-slate-100`}>
          <SectionHeader title={s.title} settings={settings} />
          <div className="space-y-6">{s.items.map((i: any) => <RenderItem key={i.id} item={i} type={s.type} settings={settings} />)}</div>
        </section>
      ))}
    </div>
  </div>
);

/** 
 * 5. DARK CONSOLE
 */
const DarkConsole: React.FC<TemplateProps> = ({ doc, settings }) => (
  <div className="bg-[#0f172a] text-[#f8fafc] min-h-full" style={{ padding: '1.5cm', fontFamily: "'Source Code Pro', monospace", fontSize: '12px' }}>
    <header className="border-b border-emerald-500/30 pb-8 mb-10">
       <div className="flex items-center gap-2 mb-2 text-emerald-500 font-bold">
         <span className="opacity-50">$</span> <span>whoami</span>
       </div>
       <h1 className="text-4xl font-black text-white">{doc.basics.name.toUpperCase()}</h1>
       <p className="text-emerald-400 font-bold mt-1" style={{ color: settings.accentColor }}>&gt; {doc.basics.label}</p>
       <div className="mt-4 flex gap-6 text-[10px] opacity-60">
         <span>EMAIL: {doc.basics.email}</span><span>TEL: {doc.basics.phone}</span><span>LOC: {doc.basics.location}</span>
       </div>
    </header>
    <div className="space-y-12">
      <section>
        <div className="text-emerald-500 font-bold mb-4 flex items-center gap-2"><span className="opacity-50">$</span> <span>cat summary.txt</span></div>
        <p className="text-slate-400 leading-relaxed">{doc.basics.summary}</p>
      </section>
      {doc.sections.filter(s => s.isVisible).map(s => (
        <section key={s.id} className="break-inside-avoid">
          <div className="text-emerald-500 font-bold mb-6 flex items-center gap-2" style={{ color: settings.accentColor }}><span className="opacity-50">$</span> <span>ls {s.type}/</span></div>
          <div className="space-y-8">{s.items.map((i: any) => <RenderItem key={i.id} item={i} type={s.type} settings={settings} invert />)}</div>
        </section>
      ))}
    </div>
  </div>
);

/** 
 * 6. GRAPHIC HORIZON
 */
const GraphicHorizon: React.FC<TemplateProps> = ({ doc, settings }) => (
  <div className="bg-white min-h-full flex flex-col" style={{ fontFamily: getFont(settings.fontFamily), fontSize: getFontSize(settings.fontSize) }}>
    <div className="h-4 w-full" style={{ backgroundColor: settings.accentColor }} />
    <header className={`p-16 flex justify-between items-start ${settings.headerLayout === 'centered' ? 'flex-col items-center text-center' : ''}`}>
      <div>
        <h1 className="text-6xl font-black tracking-tighter leading-none" style={{ color: settings.accentColor }}>{doc.basics.name.split(' ')[0]}<br /><span className="text-slate-900">{doc.basics.name.split(' ').slice(1).join(' ')}</span></h1>
        <p className="text-2xl font-bold text-slate-300 mt-2">{doc.basics.label}</p>
      </div>
      <div className={`space-y-2 pr-6 ${settings.headerLayout === 'centered' ? 'mt-8 border-r-0 text-center pr-0' : 'text-right border-r-8'}`} style={{ borderColor: settings.accentColor }}>
        <p className="font-black text-xs uppercase tracking-widest">{doc.basics.location}</p>
        <p className="font-bold text-slate-400 text-xs">{doc.basics.email}</p>
        <p className="font-bold text-slate-400 text-xs">{doc.basics.phone}</p>
      </div>
    </header>
    <div className="px-16 pb-16 grid grid-cols-12 gap-12">
      <div className="col-span-4 space-y-12">
        {doc.sections.filter(s => (['skills', 'languages', 'links'].includes(s.type)) && s.isVisible).map(s => (
          <section key={s.id} className="break-inside-avoid">
            <SectionHeader title={s.title} settings={settings} />
            <div className="space-y-4">{s.items.map(i => <RenderItem key={i.id} item={i} type={s.type} settings={settings} />)}</div>
          </section>
        ))}
      </div>
      <div className="col-span-8 space-y-12">
        {doc.basics.summary && <p className="text-xl font-medium text-slate-600 leading-relaxed border-b-4 pb-10" style={{ borderColor: settings.accentColor + '20' }}>{doc.basics.summary}</p>}
        {doc.sections.filter(s => s.isVisible && !['skills', 'languages', 'links'].includes(s.type)).map(s => (
          <section key={s.id} className="break-inside-avoid">
            <SectionHeader title={s.title} settings={settings} />
            <div className="space-y-10">{s.items.map((i: any) => <RenderItem key={i.id} item={i} type={s.type} settings={settings} />)}</div>
          </section>
        ))}
      </div>
    </div>
  </div>
);

/** 
 * 7. DIRECTOR SUITE (Bold/Professional)
 */
const Director: React.FC<TemplateProps> = ({ doc, settings }) => (
  <div style={{ padding: '1.5cm', fontFamily: getFont(settings.fontFamily), fontSize: getFontSize(settings.fontSize) }}>
    <header className={`border-l-8 pl-8 mb-12 ${settings.headerLayout === 'centered' ? 'text-center border-l-0' : ''}`} style={{ borderColor: settings.accentColor }}>
      <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">{doc.basics.name}</h1>
      <p className="text-xl font-bold text-slate-500 mt-1">{doc.basics.label}</p>
      <div className={`mt-4 flex gap-4 text-[10px] font-black uppercase text-slate-400 tracking-widest ${settings.headerLayout === 'centered' ? 'justify-center' : ''}`}>
        <span>{doc.basics.email}</span><span>/</span><span>{doc.basics.phone}</span><span>/</span><span>{doc.basics.location}</span>
      </div>
    </header>
    {doc.sections.filter(s => s.isVisible).map(s => (
      <section key={s.id} className="mb-12 grid grid-cols-12 gap-8 break-inside-avoid">
        <div className={`col-span-3 ${settings.headerLayout === 'centered' ? 'col-span-12 text-center' : ''}`}>
          <h2 className="font-black text-xs uppercase tracking-[0.2em]" style={{ color: settings.accentColor }}>{s.title}</h2>
        </div>
        <div className={`${settings.headerLayout === 'centered' ? 'col-span-12' : 'col-span-9'} space-y-8`}>{s.items.map((i: any) => <RenderItem key={i.id} item={i} type={s.type} settings={settings} />)}</div>
      </section>
    ))}
  </div>
);

/** 
 * 8. SCHOLAR CV (Academic/Detailed)
 */
const Academic: React.FC<TemplateProps> = ({ doc, settings }) => (
  <div style={{ padding: '1.5cm', fontFamily: getFont(settings.fontFamily), fontSize: '11px' }}>
    <header className={`mb-10 border-b border-slate-900 pb-6 ${settings.headerLayout === 'centered' ? 'text-center' : ''}`}>
      <h1 className="text-2xl font-bold mb-1">{doc.basics.name.toUpperCase()}</h1>
      <div className={`flex gap-4 text-[10px] ${settings.headerLayout === 'centered' ? 'justify-center' : ''}`}>
        <span>{doc.basics.location}</span><span>|</span><span>{doc.basics.email}</span><span>|</span><span>{doc.basics.phone}</span>
      </div>
      {doc.basics.url && <p className="mt-1 font-mono text-[9px]">{doc.basics.url}</p>}
    </header>
    <div className="space-y-8">
      {doc.sections.filter(s => s.isVisible).map(s => (
        <section key={s.id} className="break-inside-avoid">
          <h2 className="font-bold border-b border-slate-200 mb-3 text-[12px] uppercase">{s.title}</h2>
          <div className="space-y-4">{s.items.map((i: any) => <RenderItem key={i.id} item={i} type={s.type} settings={settings} />)}</div>
        </section>
      ))}
    </div>
  </div>
);

export const TEMPLATE_REGISTRY: Template[] = [
  { id: 'minimalist', name: 'Elite Minimalist', category: 'ATS Safe', atsRiskLevel: ATSLevel.SAFE, tags: ['Clean', 'Standard'], isActive: true },
  { id: 'tech-pro', name: 'Tech Pro Sidebar', category: 'Modern', atsRiskLevel: ATSLevel.SAFE, tags: ['Developer', 'Compact'], isActive: true },
  { id: 'executive', name: 'CEO Vision', category: 'ATS Safe', atsRiskLevel: ATSLevel.SAFE, tags: ['Leadership', 'Serif'], isActive: true },
  { id: 'director', name: 'Director Suite', category: 'ATS Safe', atsRiskLevel: ATSLevel.SAFE, tags: ['Impact', 'Senior'], isActive: true },
  { id: 'grid-master', name: 'Grid Master', category: 'ATS Safe', atsRiskLevel: ATSLevel.SAFE, tags: ['Cards', 'Density'], isActive: true },
  { id: 'refined', name: 'Refined Classic', category: 'Modern', atsRiskLevel: ATSLevel.SAFE, tags: ['Elegant', 'Balanced'], isActive: true },
  { id: 'columnist', name: 'Asymmetric Columnist', category: 'Modern', atsRiskLevel: ATSLevel.MEDIUM, tags: ['Bold', 'Unique'], isActive: true },
  { id: 'dark-console', name: 'Dark Mode Console', category: 'Creative', atsRiskLevel: ATSLevel.RISKY, tags: ['Terminal', 'Tech'], isActive: true },
  { id: 'graphic', name: 'Graphic Horizon', category: 'Creative', atsRiskLevel: ATSLevel.RISKY, tags: ['Visual', 'Designer'], isActive: true },
  { id: 'academic', name: 'Scholar CV', category: 'ATS Safe', atsRiskLevel: ATSLevel.SAFE, tags: ['Research', 'Detailed'], isActive: true },
];

export const renderTemplate = (doc: ResumeDocument, settings: TemplateSettings) => {
  switch (settings.templateId) {
    case 'tech-pro': return <TechPro doc={doc} settings={settings} />;
    case 'executive': return <Executive doc={doc} settings={settings} />;
    case 'director': return <Director doc={doc} settings={settings} />;
    case 'grid-master': return <GridMaster doc={doc} settings={settings} />;
    case 'dark-console': return <DarkConsole doc={doc} settings={settings} />;
    case 'graphic': return <GraphicHorizon doc={doc} settings={settings} />;
    case 'academic': return <Academic doc={doc} settings={settings} />;
    case 'refined': return <Minimalist doc={doc} settings={settings} />;
    case 'columnist': return <TechPro doc={doc} settings={settings} />;
    default: return <Minimalist doc={doc} settings={settings} />;
  }
};
