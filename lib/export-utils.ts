
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  AlignmentType, 
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  VerticalAlign
} from 'docx';
import * as FileSaver from 'file-saver';
import { ResumeDocument } from '../types';

// Robust helper to handle different file-saver export patterns
const safeSaveAs = (blob: Blob, name: string) => {
  const saveFn = (FileSaver as any).saveAs || (FileSaver as any).default?.saveAs || (FileSaver as any).default || FileSaver;
  if (typeof saveFn === 'function') {
    saveFn(blob, name);
  } else {
    console.error('file-saver: saveAs is not a function', saveFn);
  }
};

export const exportToTxt = (doc: ResumeDocument) => {
  let content = `${doc.basics.name.toUpperCase()}\n`;
  content += `${doc.basics.label}\n`;
  content += `${doc.basics.email} | ${doc.basics.phone} | ${doc.basics.location}\n`;
  content += `${doc.basics.url}\n\n`;
  
  if (doc.basics.summary) {
    content += `SUMMARY\n-------\n${doc.basics.summary}\n\n`;
  }

  doc.sections.filter(s => s.isVisible).forEach(section => {
    content += `${section.title.toUpperCase()}\n`;
    content += `${'-'.repeat(section.title.length)}\n`;
    
    section.items.forEach(item => {
      if (section.type === 'experience' || section.type === 'projects' || section.type === 'education') {
        content += `${item.role || item.title || item.name || item.degree}\n`;
        content += `${item.company || item.organization || item.institution || ''} | ${item.startDate || ''} - ${item.endDate || ''}\n`;
        if (item.bullets) {
          item.bullets.forEach((b: string) => {
            if (b) content += `• ${b}\n`;
          });
        }
      } else if (section.type === 'skills') {
        content += `${item.name}: ${item.skills.join(', ')}\n`;
      } else {
        content += `${item.name || item.title || ''}\n`;
        if (item.description) content += `${item.description}\n`;
      }
      content += `\n`;
    });
    content += `\n`;
  });

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  safeSaveAs(blob, `${doc.basics.name.replace(/\s+/g, '_')}_Resume.txt`);
};

export const exportToDocx = async (doc: ResumeDocument) => {
  const sections = [];

  // Header
  sections.push(
    new Paragraph({
      text: doc.basics.name,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      text: doc.basics.label,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `${doc.basics.email}  |  ${doc.basics.phone}  |  ${doc.basics.location}`,
          size: 20,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  // Summary
  if (doc.basics.summary) {
    sections.push(
      new Paragraph({
        text: "PROFESSIONAL SUMMARY",
        heading: HeadingLevel.HEADING_2,
        border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
      }),
      new Paragraph({
        text: doc.basics.summary,
        spacing: { before: 200, after: 400 },
      })
    );
  }

  // Sections
  doc.sections.filter(s => s.isVisible).forEach(section => {
    sections.push(
      new Paragraph({
        text: section.title.toUpperCase(),
        heading: HeadingLevel.HEADING_2,
        border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
        spacing: { before: 200 },
      })
    );

    section.items.forEach(item => {
      if (['experience', 'projects', 'education', 'volunteering'].includes(section.type)) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: item.role || item.title || item.name || item.degree, bold: true }),
              new TextRun({ text: `\t${item.startDate || ''} - ${item.endDate || ''}`, bold: true }),
            ],
            tabStops: [{ type: AlignmentType.RIGHT, position: 9000 }],
            spacing: { before: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: item.company || item.organization || item.institution || '', italic: true }),
              new TextRun({ text: `\t${item.location || ''}`, italic: true }),
            ],
            tabStops: [{ type: AlignmentType.RIGHT, position: 9000 }],
          })
        );

        if (item.bullets) {
          item.bullets.forEach((b: string) => {
            if (b) {
              sections.push(
                new Paragraph({
                  text: b,
                  bullet: { level: 0 },
                })
              );
            }
          });
        }
      } else if (section.type === 'skills') {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${item.name}: `, bold: true }),
              new TextRun({ text: item.skills.join(', ') }),
            ],
            spacing: { before: 100 },
          })
        );
      } else {
        sections.push(
          new Paragraph({
            text: item.name || item.title || '',
            bold: true,
            spacing: { before: 200 },
          })
        );
        if (item.description) {
          sections.push(new Paragraph({ text: item.description }));
        }
      }
    });
  });

  const wordDoc = new Document({
    sections: [{
      properties: {},
      children: sections,
    }],
  });

  const blob = await Packer.toBlob(wordDoc);
  safeSaveAs(blob, `${doc.basics.name.replace(/\s+/g, '_')}_Resume.docx`);
};
