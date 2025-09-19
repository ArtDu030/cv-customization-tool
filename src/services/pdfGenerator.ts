import { CustomizedCV } from '@/types';

export async function generateCVPDF(cvData: CustomizedCV, filename?: string): Promise<void> {
  try {
    // Create the full HTML document for PDF generation
    const htmlContent = createFullHTMLDocument(cvData);

    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        htmlContent,
        filename: filename || `${cvData.personalInfo.name.replace(/\s+/g, '_')}_CV`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate PDF');
    }

    // Download the PDF
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename || cvData.personalInfo.name.replace(/\s+/g, '_')}_CV.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

function createFullHTMLDocument(cv: CustomizedCV): string {
  // Sort experiences chronologically (newest first)
  const sortedExperiences = [...cv.relevantExperiences].sort((a, b) => {
    const parseDate = (period: string) => {
      const endDatePart = period.split('–')[1]?.trim() || period.split('-')[1]?.trim();
      if (!endDatePart || endDatePart.toLowerCase().includes('present') || endDatePart.toLowerCase().includes('heute')) {
        return new Date();
      }
      
      // Handle mm.yyyy format (e.g., "02.2020")
      if (endDatePart.includes('.')) {
        const [month, year] = endDatePart.split('.');
        return new Date(parseInt(year), parseInt(month) - 1); // month is 0-indexed
      }
      
      // Fallback for other formats
      return new Date(endDatePart);
    };
    return parseDate(b.period).getTime() - parseDate(a.period).getTime();
  });

  return `<!DOCTYPE html>
<html lang="${cv.language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cv.personalInfo.name} - CV</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @page {
      margin: 15mm 10mm;
      size: A4;
    }
    @page:first {
      margin-top: 10mm;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .cv-container {
      width: 100%;
      max-width: 190mm;
      min-height: 267mm;
      background: white;
      display: flex;
      margin: 0 auto;
      page-break-inside: avoid;
    }
    .page-break {
      page-break-before: always;
    }
    .sidebar {
      width: 35%;
      background-color: #e5e7eb;
      padding: 24px;
    }
    .main-content {
      width: 65%;
      padding: 24px;
    }
    .profile-image {
      width: 128px;
      height: 128px;
      border-radius: 8px;
      object-fit: cover;
      margin: 0 auto;
      display: block;
    }
    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: #111827;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .contact-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 8px;
      font-size: 14px;
      color: #374151;
    }
    .contact-icon {
      margin-right: 8px;
      font-weight: 500;
    }
    .skill-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 8px;
      font-size: 14px;
      color: #374151;
    }
    .skill-bullet {
      color: #6b7280;
      margin-top: 4px;
      margin-right: 8px;
    }
    .skill-name {
      font-weight: 500;
    }
    .skill-context {
      font-size: 12px;
      color: #6b7280;
      margin-top: 4px;
    }
    .name-header {
      font-size: 36px;
      font-weight: bold;
      color: #111827;
      margin-bottom: 8px;
    }
    .name-underline {
      width: 64px;
      height: 4px;
      background-color: #2563eb;
      margin-bottom: 24px;
    }
    .main-section-title {
      font-size: 20px;
      font-weight: bold;
      color: #111827;
      margin-bottom: 16px;
    }
    .profile-text {
      font-size: 14px;
      color: #374151;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .experience-item {
      border-left: 2px solid #2563eb;
      padding-left: 16px;
      margin-bottom: 16px;
    }
    .experience-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }
    .position-title {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
    }
    .company-name {
      font-size: 16px;
      font-weight: 500;
      color: #2563eb;
    }
    .period {
      font-size: 14px;
      color: #6b7280;
      font-weight: 500;
    }
    .responsibility-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 4px;
      font-size: 14px;
      color: #374151;
    }
    .responsibility-bullet {
      color: #2563eb;
      margin-top: 4px;
      margin-right: 8px;
    }
    .education-item {
      border-left: 2px solid #2563eb;
      padding-left: 16px;
      margin-bottom: 12px;
    }
    .education-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .degree {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
    }
    .institution {
      font-size: 14px;
      font-weight: 500;
      color: #2563eb;
    }
    .year {
      font-size: 14px;
      color: #6b7280;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="cv-container">
    <!-- Left Sidebar -->
    <div class="sidebar">
      ${cv.personalInfo.profileImage ? `
      <div style="text-align: center; margin-bottom: 24px;">
        <img src="${cv.personalInfo.profileImage}" alt="Profile" class="profile-image" />
      </div>
      ` : ''}
      
      <!-- Contact Information -->
      <div style="margin-bottom: 24px;">
        <h3 class="section-title">${cv.language === 'de' ? 'KONTAKT' : 'CONTACT'}</h3>
        <div class="contact-item">
          <span class="contact-icon">📧</span>
          <span style="word-break: break-all;">${cv.personalInfo.email}</span>
        </div>
        <div class="contact-item">
          <span class="contact-icon">📱</span>
          <span>${cv.personalInfo.phone}</span>
        </div>
        <div class="contact-item">
          <span class="contact-icon">📍</span>
          <span>${cv.personalInfo.address}</span>
        </div>
        ${cv.personalInfo.birthdate ? `
        <div class="contact-item">
          <span class="contact-icon">🎂</span>
          <span>${new Date(cv.personalInfo.birthdate).toLocaleDateString(cv.language === 'de' ? 'de-DE' : 'en-US')}</span>
        </div>
        ` : ''}
      </div>

      ${cv.prioritizedSkills.length > 0 ? `
      <!-- Skills -->
      <div style="margin-bottom: 24px;">
        <h3 class="section-title">${cv.language === 'de' ? 'KOMPETENZEN' : 'SKILLS'}</h3>
        ${cv.prioritizedSkills.map(skill => `
        <div class="skill-item">
          <span class="skill-bullet">•</span>
          <div>
            <div class="skill-name">${skill.skill}</div>
            ${skill.context ? `<div class="skill-context">${skill.context}</div>` : ''}
          </div>
        </div>
        `).join('')}
      </div>
      ` : ''}

      ${cv.additionalSkills.length > 0 ? `
      <!-- Additional Skills -->
      <div>
        <h3 class="section-title">${cv.language === 'de' ? 'WEITERE FÄHIGKEITEN' : 'ADDITIONAL SKILLS'}</h3>
        ${cv.additionalSkills.map(skill => `
        <div class="skill-item">
          <span class="skill-bullet">•</span>
          <span>${skill}</span>
        </div>
        `).join('')}
      </div>
      ` : ''}
    </div>

    <!-- Right Main Area -->
    <div class="main-content">
      <!-- Name Header -->
      <div>
        <h1 class="name-header">${cv.personalInfo.name}</h1>
        <div class="name-underline"></div>
      </div>

      ${cv.shortProfile ? `
      <!-- Short Profile -->
      <div>
        <h2 class="main-section-title">${cv.language === 'de' ? 'PROFIL' : 'PROFILE'}</h2>
        <p class="profile-text">${cv.shortProfile}</p>
      </div>
      ` : ''}

      ${cv.relevantExperiences.length > 0 ? `
      <!-- Work Experience -->
      <div style="margin-bottom: 24px;">
        <h2 class="main-section-title">${cv.language === 'de' ? 'BERUFSERFAHRUNG' : 'WORK EXPERIENCE'}</h2>
        ${sortedExperiences.map(exp => `
        <div class="experience-item">
          <div class="experience-header">
            <div>
              <h3 class="position-title">${exp.position}</h3>
              <h4 class="company-name">${exp.company}</h4>
            </div>
            <span class="period">${exp.period}</span>
          </div>
          ${exp.responsibilities.length > 0 ? `
          <div style="margin-top: 8px;">
            ${exp.responsibilities.map(resp => `
            <div class="responsibility-item">
              <span class="responsibility-bullet">•</span>
              <span>${resp}</span>
            </div>
            `).join('')}
          </div>
          ` : ''}
        </div>
        `).join('')}
      </div>
      ` : ''}

      ${cv.education.length > 0 ? `
      <!-- Education -->
      <div>
        <h2 class="main-section-title">${cv.language === 'de' ? 'BILDUNG' : 'EDUCATION'}</h2>
        ${cv.education.map(edu => `
        <div class="education-item">
          <div class="education-header">
            <div>
              <h3 class="degree">${edu.degree}</h3>
              <h4 class="institution">${edu.institution}</h4>
            </div>
            <span class="year">${edu.year}</span>
          </div>
        </div>
        `).join('')}
      </div>
      ` : ''}
    </div>
  </div>
</body>
</html>`;
}