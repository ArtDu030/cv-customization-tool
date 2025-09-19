export interface PersonalInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  birthdate?: string;
  profileImage?: string;
}

export interface Skill {
  skill: string;
  context: string;
  evidence: string;
}

export interface Experience {
  position: string;
  company: string;
  period: string;
  responsibilities: string[];
  keywords: string[];
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface MasterProfile {
  personalInfo: PersonalInfo;
  shortProfile: string;
  skillsPool: Skill[];
  experiencePool: Experience[];
  education: Education[];
  additionalSkills: string[];
}

export interface CustomizedCV {
  personalInfo: PersonalInfo;
  shortProfile: string;
  prioritizedSkills: Skill[];
  relevantExperiences: Experience[];
  education: Education[];
  additionalSkills: string[];
  language: 'en' | 'de';
}

export type Language = 'en' | 'de';

export interface JobPosting {
  content: string;
  requirements: string[];
  keywords: string[];
}