
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Resume, ResumeDocument, ResumeVersion, TemplateSettings, 
  SectionType, ResumeSection 
} from '../types';

interface ResumeState {
  resumes: Resume[];
  currentResumeId: string | null;
  activeVersionId: string | null;
  isSaving: boolean;
  
  addResume: (title: string, templateId?: string) => string;
  selectResume: (id: string) => void;
  deleteResume: (id: string) => void;
  updateDocumentBasics: (patch: Partial<ResumeDocument['basics']>) => void;
  resetStore: () => void;
  
  addSection: (type: SectionType, title?: string) => void;
  updateSectionTitle: (sectionId: string, title: string) => void;
  removeSection: (sectionId: string) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  reorderSections: (startIndex: number, endIndex: number) => void;
  duplicateSection: (sectionId: string) => void;
  
  addItem: (sectionId: string) => void;
  removeItem: (sectionId: string, itemId: string) => void;
  duplicateItem: (sectionId: string, itemId: string) => void;
  updateItem: (sectionId: string, itemId: string, patch: any) => void;
  reorderItems: (sectionId: string, startIndex: number, endIndex: number) => void;
  
  addBullet: (sectionId: string, itemId: string, text?: string) => void;
  removeBullet: (sectionId: string, itemId: string, bulletIndex: number) => void;
  updateBullet: (sectionId: string, itemId: string, bulletIndex: number, text: string) => void;
  reorderBullets: (sectionId: string, itemId: string, start: number, end: number) => void;

  addCustomField: (sectionId: string, itemId: string) => void;
  removeCustomField: (sectionId: string, itemId: string, fieldId: string) => void;
  updateCustomField: (sectionId: string, itemId: string, fieldId: string, patch: { label?: string, value?: string }) => void;
  
  updateSettings: (settings: Partial<TemplateSettings>) => void;
}

const generateUid = () => Math.random().toString(36).substring(2, 15);

const generateDefaultDoc = (): ResumeDocument => ({
  basics: {
    name: 'Dr. Jonathan J. Sterling',
    label: 'Principal Software Architect & Engineering Leader',
    email: 'j.sterling@enterprise-elite.pro',
    phone: '+1 (555) 789-1011',
    url: 'https://sterling-architect.io',
    summary: 'Strategic technology leader with over 12 years of experience in architecting high-availability distributed systems. Proven track record of leading cross-functional engineering organizations of 50+ members. Expert in cloud-native transformations, high-frequency trading infrastructure, and scaling series B-to-D startups. Passionate about developer experience and operational excellence.',
    location: 'Austin, TX',
    profiles: [
      { network: 'LinkedIn', username: 'jonathan-sterling', url: 'https://linkedin.com/in/jonathan-sterling' },
      { network: 'GitHub', username: 'jsterl-architect', url: 'https://github.com/jsterl-architect' }
    ]
  },
  sections: [
    { 
      id: generateUid(), type: 'experience', title: 'Professional History', isVisible: true, 
      items: [
        {
          id: generateUid(),
          company: 'Quantum Systems Group',
          role: 'Principal Solutions Architect',
          location: 'San Francisco, CA',
          startDate: 'Jan 2020',
          endDate: 'Present',
          current: true,
          bullets: [
            'Architected a globally distributed data processing engine using Go and Kafka, reducing latency by 45% for 10M+ daily active users.',
            'Spearheaded the migration of legacy monolith to microservices on Kubernetes, resulting in a 30% reduction in cloud infrastructure costs.',
            'Mentored 12+ senior engineers and established the company-wide Technical Design Review (TDR) process.',
            'Orchestrated a disaster recovery protocol that ensured 99.999% uptime during the 2022 major region outage.'
          ]
        }
      ]
    },
    { 
      id: generateUid(), type: 'education', title: 'Academic Foundation', isVisible: true, 
      items: [
        {
          id: generateUid(),
          institution: 'Massachusetts Institute of Technology (MIT)',
          degree: 'Ph.D. in Computer Science',
          field: 'Distributed Systems & AI',
          location: 'Cambridge, MA',
          endDate: 'May 2016'
        }
      ]
    },
    { 
      id: generateUid(), type: 'skills', title: 'Technical Arsenal', isVisible: true, 
      items: [
        { id: generateUid(), name: 'Core Architecture', skills: ['System Design', 'Microservices', 'Distributed Systems', 'Cloud Native'] }
      ] 
    }
  ]
});

const DEFAULT_SETTINGS: TemplateSettings = {
  templateId: 'minimalist',
  fontFamily: 'sans',
  fontSize: 'medium',
  lineSpacing: 'normal',
  sectionSpacing: 'normal',
  accentColor: '#2563eb',
  margins: 'standard',
  pageSize: 'A4',
  headerLayout: 'left',
  sectionStyle: 'standard',
  atsSafeLock: true,
  variant: 'standard',
  bulletStyle: 'dot',
  borderRadius: 'small'
};

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      resumes: [],
      currentResumeId: null,
      activeVersionId: null,
      isSaving: false,

      resetStore: () => {
        set({ resumes: [], currentResumeId: null, activeVersionId: null });
        localStorage.removeItem('resume-pro-elite-v7-storage');
        window.location.reload();
      },

      addResume: (title: string, templateId?: string) => {
        const newResId = generateUid();
        const newVerId = generateUid();
        const newVersion: ResumeVersion = {
          id: newVerId,
          name: 'V1.0',
          document: generateDefaultDoc(),
          settings: { ...DEFAULT_SETTINGS, templateId: templateId || DEFAULT_SETTINGS.templateId },
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        const newResume: Resume = {
          id: newResId,
          title: title || 'New Resume',
          userId: 'user-1',
          versions: [newVersion],
          currentVersionId: newVerId,
          isArchived: false,
          createdAt: Date.now()
        };
        set(state => ({ resumes: [newResume, ...state.resumes], currentResumeId: newResId, activeVersionId: newVerId }));
        return newResId;
      },

      deleteResume: (id: string) => set(state => ({ resumes: state.resumes.filter(r => r.id !== id) })),

      selectResume: (id: string) => {
        const resume = get().resumes.find(r => r.id === id);
        if (resume) set({ currentResumeId: id, activeVersionId: resume.currentVersionId });
      },

      updateDocumentBasics: (patch) => set(state => {
        const resumes = JSON.parse(JSON.stringify(state.resumes));
        const rIdx = resumes.findIndex((r: any) => r.id === state.currentResumeId);
        const vIdx = resumes[rIdx]?.versions.findIndex((v: any) => v.id === state.activeVersionId);
        if (resumes[rIdx]?.versions[vIdx]) {
          resumes[rIdx].versions[vIdx].document.basics = { ...resumes[rIdx].versions[vIdx].document.basics, ...patch };
          resumes[rIdx].versions[vIdx].updatedAt = Date.now();
        }
        return { resumes, isSaving: true };
      }),

      addSection: (type, title) => set(state => {
        const resumes = JSON.parse(JSON.stringify(state.resumes));
        const rIdx = resumes.findIndex((r: any) => r.id === state.currentResumeId);
        const vIdx = resumes[rIdx]?.versions.findIndex((v: any) => v.id === state.activeVersionId);
        if (resumes[rIdx]?.versions[vIdx]) {
          resumes[rIdx].versions[vIdx].document.sections.push({
            id: generateUid(), type, title: title || type.charAt(0).toUpperCase() + type.slice(1), isVisible: true, items: []
          });
        }
        return { resumes };
      }),

      updateSectionTitle: (sectionId, title) => set(state => {
        const resumes = JSON.parse(JSON.stringify(state.resumes));
        const rIdx = resumes.findIndex((r: any) => r.id === state.currentResumeId);
        const vIdx = resumes[rIdx]?.versions.findIndex((v: any) => v.id === state.activeVersionId);
        const section = resumes[rIdx]?.versions[vIdx]?.document.sections.find((s: any) => s.id === sectionId);
        if (section) section.title = title;
        return { resumes };
      }),

      removeSection: (sectionId) => set(state => {
        const resumes = JSON.parse(JSON.stringify(state.resumes));
        const rIdx = resumes.findIndex((r: any) => r.id === state.currentResumeId);
        const vIdx = resumes[rIdx]?.versions.findIndex((v: any) => v.id === state.activeVersionId);
        if (resumes[rIdx]?.versions[vIdx]) {
          resumes[rIdx].versions[vIdx].document.sections = resumes[rIdx].versions[vIdx].document.sections.filter((s: any) => s.id !== sectionId);
        }
        return { resumes };
      }),

      toggleSectionVisibility: (sectionId) => set(state => {
        const resumes = JSON.parse(JSON.stringify(state.resumes));
        const rIdx = resumes.findIndex((r: any) => r.id === state.currentResumeId);
        const vIdx = resumes[rIdx]?.versions.findIndex((v: any) => v.id === state.activeVersionId);
        const section = resumes[rIdx]?.versions[vIdx]?.document.sections.find((s: any) => s.id === sectionId);
        if (section) section.isVisible = !section.isVisible;
        return { resumes };
      }),

      reorderSections: (start, end) => set(state => {
        const resumes = JSON.parse(JSON.stringify(state.resumes));
        const rIdx = resumes.findIndex((r: any) => r.id === state.currentResumeId);
        const vIdx = resumes[rIdx]?.versions.findIndex((v: any) => v.id === state.activeVersionId);
        if (resumes[rIdx]?.versions[vIdx]) {
          const sections = resumes[rIdx].versions[vIdx].document.sections;
          const [removed] = sections.splice(start, 1);
          sections.splice(end, 0, removed);
        }
        return { resumes };
      }),

      duplicateSection: (sectionId) => set(state => {
        const resumes = JSON.parse(JSON.stringify(state.resumes));
        const rIdx = resumes.findIndex((r: any) => r.id === state.currentResumeId);
        const vIdx = resumes[rIdx]?.versions.findIndex((v: any) => v.id === state.activeVersionId);
        const sections = resumes[rIdx]?.versions[vIdx]?.document.sections;
        const idx = sections?.findIndex((s: any) => s.id === sectionId);
        if (idx !== undefined && idx !== -1 && sections) {
          const copy = JSON.parse(JSON.stringify(sections[idx]));
          copy.id = generateUid();
          sections.splice(idx + 1, 0, copy);
        }
        return { resumes };
      }),

      addItem: (sectionId) => set(state => {
        const resumes = JSON.parse(JSON.stringify(state.resumes));
        const rIdx = resumes.findIndex((r: any) => r.id === state.currentResumeId);
        const vIdx = resumes[rIdx]?.versions.findIndex((v: any) => v.id === state.activeVersionId);
        const section = resumes[rIdx]?.versions[vIdx]?.document.sections.find((s: any) => s.id === sectionId);
        if (section) {
          let item: any = { id: generateUid() };
          switch (section.type) {
            case 'experience': 
            case 'volunteering':
            case 'leadership':
            case 'research':
              item = { ...item, organization: '', company: '', role: '', location: '', startDate: '', endDate: '', current: false, bullets: [''] }; break;
            case 'education': item = { ...item, institution: '', degree: '', field: '', location: '', endDate: '' }; break;
            case 'skills': item = { ...item, name: '', skills: [] }; break;
            case 'projects': item = { ...item, name: '', role: '', link: '', bullets: [''] }; break;
            case 'links': item = { ...item, label: '', url: '' }; break;
            case 'certifications': 
            case 'awards':
            case 'patents':
            case 'publications':
              item = { ...item, name: '', title: '', issuer: '', organization: '', date: '', description: '' }; break;
            case 'languages': item = { ...item, name: '', description: '' }; break;
            case 'references': item = { ...item, name: '', title: '', company: '', email: '', phone: '' }; break;
            case 'interests': item = { ...item, skills: [] }; break;
            case 'custom': item = { ...item, title: '', fields: [] }; break;
            default: item = { ...item, title: '', description: '', bullets: [] };
          }
          section.items.push(item);
        }
        return { resumes, isSaving: true };
      }),

      removeItem: (sectionId, itemId) => set(state => {
        const resumes = JSON.parse(JSON.stringify(state.resumes));
        const rIdx = resumes.findIndex((r: any) => r.id === state.currentResumeId);
        const vIdx = resumes[rIdx]?.versions.findIndex((v: any) => v.id === state.activeVersionId);
        const section = resumes[rIdx]?.versions[vIdx]?.document.sections.find((s: any) => s.id === sectionId);
        if (section) section.items = section.items.filter((i: any) => i.id !== itemId);
        return { resumes };
      }),

      duplicateItem: (sectionId, itemId) => set(state => {
        const resumes = JSON.parse(JSON.stringify(state.resumes));
        const rIdx = resumes.findIndex((r: any) => r.id === state.currentResumeId);
        const vIdx = resumes[rIdx]?.versions.findIndex((v: any) => v.id === state.activeVersionId);
        const section = resumes[rIdx]?.versions[vIdx]?.document.sections.find((s: any) => s.id === sectionId);
        const idx = section?.items.findIndex((i: any) => i.id === itemId);
        if (section && idx !== undefined && idx !== -1) {
          const copy = JSON.parse(JSON.stringify(section.items[idx]));
          copy.id = generateUid();
          section.items.splice(idx + 1, 0, copy);
        }
        return { resumes };
      }),

      updateItem: (sectionId, itemId, patch) => set(state => {
        const resumes = JSON.parse(JSON.stringify(state.resumes));
        const rIdx = resumes.findIndex((r: any) => r.id === state.currentResumeId);
        const vIdx = resumes[rIdx]?.versions.findIndex((v: any) => v.id === state.activeVersionId);
        const section = resumes[rIdx]?.versions[vIdx]?.document.sections.find((s: any) => s.id === sectionId);
        const item = section?.items.find((i: any) => i.id === itemId);
        if (item) Object.assign(item, patch);
        return { resumes, isSaving: true };
      }),

      reorderItems: (sectionId, start, end) => set(state => {
        const resumes = JSON.parse(JSON.stringify(state.resumes));
        const rIdx = resumes.findIndex((r: any) => r.id === state.currentResumeId);
        const vIdx = resumes[rIdx]?.versions.findIndex((v: any) => v.id === state.activeVersionId);
        const section = resumes[rIdx]?.versions[vIdx]?.document.sections.find((s: any) => s.id === sectionId);
        if (section) {
          const [removed] = section.items.splice(start, 1);
          section.items.splice(end, 0, removed);
        }
        return { resumes };
      }),

      addBullet: (sectionId, itemId, text = '') => set(state => {
        const resumes = JSON.parse(JSON.stringify(state.resumes));
        const rIdx = resumes.findIndex((r: any) => r.id === state.currentResumeId);
        const vIdx = resumes[rIdx]?.versions.findIndex((v: any) => v.id === state.activeVersionId);
        const section = resumes[rIdx]?.versions[vIdx]?.document.sections.find((s: any) => s.id === sectionId);
        const item = section?.items.find((i: any) => i.id === itemId);
        if (item) {
           if (!item.bullets) item.bullets = [];
           item.bullets.push(text);
        }
        return { resumes, isSaving: true };
      }),

      removeBullet: (sectionId, itemId, bIdx) => set(state => {
        const resumes = JSON.parse(JSON.stringify(state.resumes));
        const rIdx = resumes.findIndex((r: any) => r.id === state.currentResumeId);
        const vIdx = resumes[rIdx]?.versions.findIndex((v: any) => v.id === state.activeVersionId);
        const section = resumes[rIdx]?.versions[vIdx]?.document.sections.find((s: any) => s.id === sectionId);
        const item = section?.items.find((i: any) => i.id === itemId);
        if (item && item.bullets) item.bullets.splice(bIdx, 1);
        return { resumes };
      }),

      updateBullet: (sectionId, itemId, bIdx, text) => set(state => {
        const resumes = JSON.parse(JSON.stringify(state.resumes));
        const rIdx = resumes.findIndex((r: any) => r.id === state.currentResumeId);
        const vIdx = resumes[rIdx]?.versions.findIndex((v: any) => v.id === state.activeVersionId);
        const section = resumes[rIdx]?.versions[vIdx]?.document.sections.find((s: any) => s.id === sectionId);
        const item = section?.items.find((i: any) => i.id === itemId);
        if (item && item.bullets) item.bullets[bIdx] = text;
        return { resumes, isSaving: true };
      }),

      reorderBullets: (sectionId, itemId, start, end) => set(state => {
        const resumes = JSON.parse(JSON.stringify(state.resumes));
        const rIdx = resumes.findIndex((r: any) => r.id === state.currentResumeId);
        const vIdx = resumes[rIdx]?.versions.findIndex((v: any) => v.id === state.activeVersionId);
        const section = resumes[rIdx]?.versions[vIdx]?.document.sections.find((s: any) => s.id === sectionId);
        const item = section?.items.find((i: any) => i.id === itemId);
        if (item && item.bullets) {
          const [removed] = item.bullets.splice(start, 1);
          item.bullets.splice(end, 0, removed);
        }
        return { resumes };
      }),

      addCustomField: (sectionId, itemId) => set(state => {
        const resumes = JSON.parse(JSON.stringify(state.resumes));
        const rIdx = resumes.findIndex((r: any) => r.id === state.currentResumeId);
        const vIdx = resumes[rIdx]?.versions.findIndex((v: any) => v.id === state.activeVersionId);
        const section = resumes[rIdx]?.versions[vIdx]?.document.sections.find((s: any) => s.id === sectionId);
        const item = section?.items.find((i: any) => i.id === itemId);
        if (item) {
          if (!item.fields) item.fields = [];
          item.fields.push({ id: generateUid(), label: 'New Field', value: '' });
        }
        return { resumes, isSaving: true };
      }),

      removeCustomField: (sectionId, itemId, fieldId) => set(state => {
        const resumes = JSON.parse(JSON.stringify(state.resumes));
        const rIdx = resumes.findIndex((r: any) => r.id === state.currentResumeId);
        const vIdx = resumes[rIdx]?.versions.findIndex((v: any) => v.id === state.activeVersionId);
        const section = resumes[rIdx]?.versions[vIdx]?.document.sections.find((s: any) => s.id === sectionId);
        const item = section?.items.find((i: any) => i.id === itemId);
        if (item && item.fields) {
          item.fields = item.fields.filter((f: any) => f.id !== fieldId);
        }
        return { resumes, isSaving: true };
      }),

      updateCustomField: (sectionId, itemId, fieldId, patch) => set(state => {
        const resumes = JSON.parse(JSON.stringify(state.resumes));
        const rIdx = resumes.findIndex((r: any) => r.id === state.currentResumeId);
        const vIdx = resumes[rIdx]?.versions.findIndex((v: any) => v.id === state.activeVersionId);
        const section = resumes[rIdx]?.versions[vIdx]?.document.sections.find((s: any) => s.id === sectionId);
        const item = section?.items.find((i: any) => i.id === itemId);
        if (item && item.fields) {
          const field = item.fields.find((f: any) => f.id === fieldId);
          if (field) Object.assign(field, patch);
        }
        return { resumes, isSaving: true };
      }),

      updateSettings: (patch) => set(state => {
        const resumes = JSON.parse(JSON.stringify(state.resumes));
        const rIdx = resumes.findIndex((r: any) => r.id === state.currentResumeId);
        const vIdx = resumes[rIdx]?.versions.findIndex((v: any) => v.id === state.activeVersionId);
        if (resumes[rIdx]?.versions[vIdx]) {
          resumes[rIdx].versions[vIdx].settings = { ...resumes[rIdx].versions[vIdx].settings, ...patch };
          resumes[rIdx].versions[vIdx].updatedAt = Date.now();
        }
        return { resumes };
      })
    }),
    {
      name: 'resume-pro-elite-v7-storage',
    }
  )
);
