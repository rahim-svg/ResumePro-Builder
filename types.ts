
export enum ATSLevel {
  SAFE = 'SAFE',
  MEDIUM = 'MEDIUM',
  RISKY = 'RISKY'
}

export enum Severity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export type SectionType = 
  | 'basics' | 'summary' | 'objective' | 'highlights'
  | 'experience' | 'education' | 'skills' | 'projects' 
  | 'certifications' | 'awards' | 'volunteering' | 'publications' 
  | 'languages' | 'custom' | 'links' | 'training' | 'leadership' 
  | 'patents' | 'speaking' | 'references' | 'interests' | 'achievements'
  | 'research';

export interface ResumeSection {
  id: string;
  type: SectionType;
  title: string;
  isVisible: boolean;
  items: any[];
  variant?: 'compact' | 'standard' | 'detailed';
}

export interface ResumeDocument {
  basics: {
    name: string;
    label: string;
    email: string;
    phone: string;
    url: string;
    summary: string;
    location: string;
    profiles: Array<{ network: string; username: string; url: string }>;
  };
  sections: ResumeSection[];
}

export interface TemplateSettings {
  templateId: string;
  fontFamily: 'sans' | 'serif' | 'mono' | 'montserrat' | 'open-sans' | 'merriweather';
  fontSize: 'small' | 'medium' | 'large';
  lineSpacing: 'tight' | 'normal' | 'relaxed';
  sectionSpacing: 'compact' | 'normal' | 'spacious';
  accentColor: string;
  margins: 'standard' | 'compact' | 'wide';
  pageSize: 'A4' | 'Letter';
  headerLayout: 'centered' | 'left' | 'split';
  sectionStyle: 'standard' | 'underlined' | 'minimalist' | 'caps';
  atsSafeLock: boolean;
  variant: 'compact' | 'standard' | 'detailed';
  bulletStyle: 'dot' | 'dash' | 'square';
  borderRadius: 'none' | 'small' | 'full';
}

export interface ResumeVersion {
  id: string;
  name: string;
  document: ResumeDocument;
  settings: TemplateSettings;
  createdAt: number;
  updatedAt: number;
}

export interface Resume {
  id: string;
  title: string;
  userId: string;
  versions: ResumeVersion[];
  currentVersionId: string;
  isArchived: boolean;
  createdAt: number;
}

export interface ATSIssue {
  id: string;
  severity: Severity;
  category: string;
  title: string;
  explanation: string;
  impactedSection: string;
  suggestedFix: string;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  atsRiskLevel: ATSLevel;
  tags: string[];
  isActive: boolean;
}
