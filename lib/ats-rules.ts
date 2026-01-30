
import { ResumeDocument, ATSIssue, Severity, TemplateSettings } from '../types';

export const evaluateATS = (doc: ResumeDocument, settings: TemplateSettings, jd?: string): { score: number, issues: ATSIssue[], breakdown: any } => {
  const issues: ATSIssue[] = [];
  let score = 100;

  const addIssue = (issue: ATSIssue) => {
    issues.push(issue);
    const penalties = { 
      [Severity.LOW]: 1.5, 
      [Severity.MEDIUM]: 3, 
      [Severity.HIGH]: 7, 
      [Severity.CRITICAL]: 15 
    };
    score -= penalties[issue.severity];
  };

  const getSection = (type: string) => doc.sections.find(s => s.type === type && s.isVisible);
  const docString = JSON.stringify(doc).toLowerCase();

  // --- 1. Parse-ability (The Technical Core) ---
  if (!doc.basics.email) addIssue({ id: 'P01', severity: Severity.CRITICAL, category: 'Parse-ability', title: 'Missing Contact: Email', explanation: 'Recruiters and automated systems cannot reach you.', impactedSection: 'Header', suggestedFix: 'Add a professional email address.' });
  if (!doc.basics.phone) addIssue({ id: 'P02', severity: Severity.HIGH, category: 'Parse-ability', title: 'Missing Contact: Phone', explanation: 'Phone number is a vital identifier for HR systems.', impactedSection: 'Header', suggestedFix: 'Include your primary phone number.' });
  if (!doc.basics.name) addIssue({ id: 'P03', severity: Severity.CRITICAL, category: 'Parse-ability', title: 'Missing Identity: Full Name', explanation: 'The document lacks a primary identifier.', impactedSection: 'Header', suggestedFix: 'Enter your full legal name.' });
  
  const linkedin = doc.basics.profiles.find(p => p.network.toLowerCase().includes('linkedin')) || docString.includes('linkedin.com');
  if (!linkedin) addIssue({ id: 'P04', severity: Severity.MEDIUM, category: 'Parse-ability', title: 'No LinkedIn Found', explanation: 'Modern ATS use LinkedIn for identity verification and profile enrichment.', impactedSection: 'Header', suggestedFix: 'Include your LinkedIn profile link.' });

  if (settings.templateId === 'dark-console' || settings.templateId === 'graphic') {
    addIssue({ id: 'P05', severity: Severity.HIGH, category: 'Parse-ability', title: 'High-Risk Template Detected', explanation: 'Graphic-heavy or non-standard layouts often break older legacy parsers.', impactedSection: 'Design', suggestedFix: 'Switch to a "Safe" category template for portal submissions.' });
  }

  if (docString.includes('http://') && !docString.includes('https://')) {
    addIssue({ id: 'P06', severity: Severity.LOW, category: 'Parse-ability', title: 'Unsecured Links', explanation: 'Use of non-HTTPS links can be flagged as a security risk by some firewalls.', impactedSection: 'Links', suggestedFix: 'Update all links to use HTTPS.' });
  }

  // --- 2. Content Quality & Metrics (The Impact) ---
  const experience = getSection('experience');
  if (experience) {
    if (experience.items.length < 2) addIssue({ id: 'C01', severity: Severity.HIGH, category: 'Content Quality', title: 'Insufficient Experience Entries', explanation: 'Listing fewer than two roles suggests a thin professional history.', impactedSection: 'Experience', suggestedFix: 'Add more professional roles or project work.' });
    
    experience.items.forEach((item: any, idx: number) => {
      const bulletCount = item.bullets?.length || 0;
      if (bulletCount < 3 && idx === 0) addIssue({ id: 'C02', severity: Severity.MEDIUM, category: 'Content Quality', title: `Thin Bullet Count: ${item.company}`, explanation: 'Your most recent role should have at least 3-5 high-impact bullets.', impactedSection: 'Experience', suggestedFix: 'Expand on your achievements in this role.' });
      
      item.bullets?.forEach((b: string) => {
        if (b.length > 250) addIssue({ id: 'C03', severity: Severity.LOW, category: 'Content Quality', title: 'Excessive Bullet Length', explanation: 'Paragraph-style bullets are harder for parsers to extract key skills from.', impactedSection: 'Experience', suggestedFix: 'Break this bullet into two separate achievements.' });
        if (b.length < 30) addIssue({ id: 'C04', severity: Severity.LOW, category: 'Content Quality', title: 'Bullet Too Brief', explanation: 'Very short bullets lack the context needed to prove impact.', impactedSection: 'Experience', suggestedFix: 'Use the XYZ formula: Accomplished [X] as measured by [Y], by doing [Z].' });
        
        const hasMetric = /\d+|%|\$|k|m|b|improved|reduced|increased|growth|scale/.test(b.toLowerCase());
        if (!hasMetric) addIssue({ id: 'C05', severity: Severity.MEDIUM, category: 'Content Quality', title: 'Non-Quantified Achievement', explanation: 'ATS and recruiters prioritize data-driven results over task descriptions.', impactedSection: 'Experience', suggestedFix: 'Add numbers, percentages, or currency values to this bullet.' });
        
        const weakVerbs = ['helped', 'assisted', 'handled', 'worked on', 'responsible for', 'tried to'];
        if (weakVerbs.some(v => b.toLowerCase().includes(v))) {
          addIssue({ id: 'C06', severity: Severity.LOW, category: 'Content Quality', title: 'Passive Language Detected', explanation: 'Passive verbs diminish the perceived ownership of your work.', impactedSection: 'Experience', suggestedFix: 'Replace with "Spearheaded", "Orchestrated", or "Executed".' });
        }
      });
    });
  }

  // --- 3. Completeness & Structural Integrity ---
  if (!doc.basics.summary || doc.basics.summary.length < 80) addIssue({ id: 'CO01', severity: Severity.MEDIUM, category: 'Completeness', title: 'Summary Lacks Depth', explanation: 'A weak summary misses the first opportunity for keyword matching.', impactedSection: 'Summary', suggestedFix: 'Write 3-4 impactful sentences highlighting your specific "Unique Selling Point".' });
  
  const skills = getSection('skills');
  const totalSkills = skills?.items.reduce((acc, cat) => acc + (cat.skills?.length || 0), 0) || 0;
  if (totalSkills < 8) addIssue({ id: 'CO02', severity: Severity.HIGH, category: 'Completeness', title: 'Low Keyword Density', explanation: 'Skills are the primary filter for ATS algorithms. You need more topical keywords.', impactedSection: 'Skills', suggestedFix: 'List at least 10-15 relevant technical and industry skills.' });

  const education = getSection('education');
  if (!education || education.items.length === 0) addIssue({ id: 'CO03', severity: Severity.HIGH, category: 'Completeness', title: 'Missing Academic History', explanation: 'Most enterprise roles require verification of education levels.', impactedSection: 'Education', suggestedFix: 'Add your degree or most recent certification.' });

  const projects = getSection('projects');
  if (!projects && totalSkills > 15) addIssue({ id: 'CO04', severity: Severity.LOW, category: 'Completeness', title: 'No Applied Evidence (Projects)', explanation: 'You list many skills but no project work to prove application.', impactedSection: 'Projects', suggestedFix: 'Add a Projects section to showcase hands-on work.' });

  // --- 4. Style & Language Precision ---
  const firstPerson = /\b(i|me|my|we|us|our)\b/i;
  if (firstPerson.test(docString)) addIssue({ id: 'S01', severity: Severity.MEDIUM, category: 'Style', title: 'First-Person Pronouns Found', explanation: 'Standard professional resumes should use third-person implied (omitted) pronouns.', impactedSection: 'Global', suggestedFix: 'Remove "I", "me", and "my" from your descriptions.' });

  const buzzwords = ['synergy', 'disruptor', 'world-class', 'ninja', 'rockstar', 'guru', 'passionate', 'hard worker'];
  const foundBuzz = buzzwords.filter(w => docString.includes(w));
  if (foundBuzz.length > 2) addIssue({ id: 'S02', severity: Severity.LOW, category: 'Style', title: 'Buzzword Overload', explanation: 'Vague buzzwords occupy valuable space and offer zero proof of competency.', impactedSection: 'Global', suggestedFix: `Replace "${foundBuzz[0]}" with a concrete skill or achievement.` });

  // Job Match Heuristic
  let matchScore = 0;
  if (jd) {
    const jdWords = jd.toLowerCase().split(/\W+/);
    const keywords = Array.from(new Set(jdWords)).filter(w => w.length > 4);
    const docLower = docString.toLowerCase();
    const matched = keywords.filter(w => docLower.includes(w)).length;
    matchScore = Math.min(15, Math.round((matched / (keywords.length * 0.3)) * 15));
  } else {
    // If no JD, redistribute the 15 points to other areas (simulated here)
    matchScore = 12; 
  }

  score = Math.max(0, Math.min(100, score));

  return {
    score: Math.floor(score),
    issues,
    breakdown: {
      parseability: Math.floor(40 - (issues.filter(i => i.category === 'Parse-ability').length * 4)),
      content: Math.floor(30 - (issues.filter(i => i.category === 'Content Quality').length * 3.5)),
      completeness: Math.floor(15 - (issues.filter(i => i.category === 'Completeness').length * 2.5)),
      jobMatch: matchScore
    }
  };
};
