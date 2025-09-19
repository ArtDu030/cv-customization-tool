'use client';

import { CustomizedCV } from '@/types';
import Image from 'next/image';

interface Props {
  cv: CustomizedCV;
}

export default function CVLayout({ cv }: Props) {
  // Sort experiences chronologically (newest first)
  const sortedExperiences = [...cv.relevantExperiences].sort((a, b) => {
    // Parse periods to compare dates - expecting format like "mm.yyyy - mm.yyyy" or "May 2024 – Present"
    const parseDate = (period: string) => {
      const endDatePart = period.split('–')[1]?.trim() || period.split('-')[1]?.trim();
      if (!endDatePart || endDatePart.toLowerCase().includes('present') || endDatePart.toLowerCase().includes('heute')) {
        return new Date(); // Current date for present positions
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

  return (
    <div id="cv-content" className="w-full max-w-[210mm] mx-auto bg-white" style={{ minHeight: '297mm' }}>
      <div className="flex h-full">
        {/* Left Sidebar - 35% */}
        <div className="w-[35%] bg-gray-200 p-6 space-y-6">
          {/* Profile Picture */}
          {cv.personalInfo.profileImage && (
            <div className="flex justify-center">
              <div className="w-32 h-32 relative">
                <Image
                  src={cv.personalInfo.profileImage}
                  alt="Profile"
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
              {cv.language === 'de' ? 'KONTAKT' : 'CONTACT'}
            </h3>
            <div className="space-y-2 text-sm text-gray-800">
              <div className="flex items-start space-x-2">
                <span className="font-medium">📧</span>
                <span className="break-all">{cv.personalInfo.email}</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-medium">📱</span>
                <span>{cv.personalInfo.phone}</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-medium">📍</span>
                <span>{cv.personalInfo.address}</span>
              </div>
              {cv.personalInfo.birthdate && (
                <div className="flex items-start space-x-2">
                  <span className="font-medium">🎂</span>
                  <span>{new Date(cv.personalInfo.birthdate).toLocaleDateString(cv.language === 'de' ? 'de-DE' : 'en-US')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills / Competencies */}
          {cv.prioritizedSkills.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
                {cv.language === 'de' ? 'KOMPETENZEN' : 'SKILLS'}
              </h3>
              <ul className="space-y-2">
                {cv.prioritizedSkills.map((skill, index) => (
                  <li key={index} className="text-sm text-gray-800">
                    <div className="flex items-start space-x-2">
                      <span className="text-gray-600 mt-1">•</span>
                      <div>
                        <div className="font-medium">{skill.skill}</div>
                        {skill.context && (
                          <div className="text-xs text-gray-600 mt-1">{skill.context}</div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Additional Skills */}
          {cv.additionalSkills.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
                {cv.language === 'de' ? 'WEITERE FÄHIGKEITEN' : 'ADDITIONAL SKILLS'}
              </h3>
              <ul className="space-y-1">
                {cv.additionalSkills.map((skill, index) => (
                  <li key={index} className="text-sm text-gray-800 flex items-start space-x-2">
                    <span className="text-gray-600 mt-1">•</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Main Area - 65% */}
        <div className="w-[65%] p-6 space-y-6">
          {/* Name Header */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {cv.personalInfo.name}
            </h1>
            <div className="w-16 h-1 bg-blue-600"></div>
          </div>

          {/* Short Profile / Summary */}
          {cv.shortProfile && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                {cv.language === 'de' ? 'PROFIL' : 'PROFILE'}
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                {cv.shortProfile}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {cv.relevantExperiences.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {cv.language === 'de' ? 'BERUFSERFAHRUNG' : 'WORK EXPERIENCE'}
              </h2>
              <div className="space-y-4">
                {sortedExperiences.map((exp, index) => (
                  <div key={index} className="border-l-2 border-blue-600 pl-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">{exp.position}</h3>
                        <h4 className="text-base font-medium text-blue-600">{exp.company}</h4>
                      </div>
                      <span className="text-sm text-gray-600 font-medium">{exp.period}</span>
                    </div>
                    {exp.responsibilities.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {exp.responsibilities.map((resp, respIndex) => (
                          <li key={respIndex} className="text-sm text-gray-700 flex items-start space-x-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {cv.education.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {cv.language === 'de' ? 'BILDUNG' : 'EDUCATION'}
              </h2>
              <div className="space-y-3">
                {cv.education.map((edu, index) => (
                  <div key={index} className="border-l-2 border-blue-600 pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">{edu.degree}</h3>
                        <h4 className="text-sm font-medium text-blue-600">{edu.institution}</h4>
                      </div>
                      <span className="text-sm text-gray-600 font-medium">{edu.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}