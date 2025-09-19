'use client';

import { useState } from 'react';
import { MasterProfile, PersonalInfo, Skill, Experience, Education } from '@/types';
import { saveMasterProfile } from '@/utils/localStorage';

interface Props {
  initialProfile?: MasterProfile;
  onSave: (profile: MasterProfile) => void;
}

export default function MasterProfileSetup({ initialProfile, onSave }: Props) {
  const [profile, setProfile] = useState<MasterProfile>(
    initialProfile || {
      personalInfo: {
        name: '',
        address: '',
        phone: '',
        email: '',
        birthdate: '',
        profileImage: ''
      },
      shortProfile: '',
      skillsPool: [],
      experiencePool: [],
      education: [],
      additionalSkills: []
    }
  );

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setProfile(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const addSkill = () => {
    setProfile(prev => ({
      ...prev,
      skillsPool: [...prev.skillsPool, { skill: '', context: '', evidence: '' }]
    }));
  };

  const updateSkill = (index: number, field: keyof Skill, value: string) => {
    setProfile(prev => ({
      ...prev,
      skillsPool: prev.skillsPool.map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const removeSkill = (index: number) => {
    setProfile(prev => ({
      ...prev,
      skillsPool: prev.skillsPool.filter((_, i) => i !== index)
    }));
  };

  const addExperience = () => {
    setProfile(prev => ({
      ...prev,
      experiencePool: [...prev.experiencePool, {
        position: '',
        company: '',
        period: '',
        responsibilities: [''],
        keywords: ['']
      }]
    }));
  };

  const updateExperience = (index: number, field: keyof Experience, value: string | string[]) => {
    setProfile(prev => ({
      ...prev,
      experiencePool: prev.experiencePool.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (index: number) => {
    setProfile(prev => ({
      ...prev,
      experiencePool: prev.experiencePool.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    setProfile(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', institution: '', year: '' }]
    }));
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (index: number) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    saveMasterProfile(profile);
    onSave(profile);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updatePersonalInfo('profileImage', result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Master Profile Setup</h1>

      {/* Personal Information */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={profile.personalInfo.name}
              onChange={(e) => updatePersonalInfo('name', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={profile.personalInfo.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="text"
              value={profile.personalInfo.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input
              type="text"
              value={profile.personalInfo.address}
              onChange={(e) => updatePersonalInfo('address', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Birthdate</label>
            <input
              type="date"
              value={profile.personalInfo.birthdate || ''}
              onChange={(e) => updatePersonalInfo('birthdate', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </section>

      {/* Short Profile */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Short Profile / Summary</h2>
        <textarea
          value={profile.shortProfile}
          onChange={(e) => setProfile(prev => ({ ...prev, shortProfile: e.target.value }))}
          rows={4}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter your professional summary..."
        />
      </section>

      {/* Skills Pool */}
      <section className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Skills Pool</h2>
          <button
            onClick={addSkill}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Skill
          </button>
        </div>
        {profile.skillsPool.map((skill, index) => (
          <div key={index} className="border border-gray-200 p-4 rounded-md mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skill</label>
                <input
                  type="text"
                  value={skill.skill}
                  onChange={(e) => updateSkill(index, 'skill', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Context</label>
                <input
                  type="text"
                  value={skill.context}
                  onChange={(e) => updateSkill(index, 'context', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Evidence</label>
                <input
                  type="text"
                  value={skill.evidence}
                  onChange={(e) => updateSkill(index, 'evidence', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <button
              onClick={() => removeSkill(index)}
              className="mt-2 text-red-600 hover:text-red-800"
            >
              Remove Skill
            </button>
          </div>
        ))}
      </section>

      {/* Experience Pool */}
      <section className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Experience Pool</h2>
          <button
            onClick={addExperience}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Experience
          </button>
        </div>
        {profile.experiencePool.map((exp, index) => (
          <div key={index} className="border border-gray-200 p-4 rounded-md mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                <input
                  type="text"
                  value={exp.position}
                  onChange={(e) => updateExperience(index, 'position', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                <input
                  type="text"
                  value={exp.period}
                  onChange={(e) => updateExperience(index, 'period', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Responsibilities</label>
              <textarea
                value={exp.responsibilities.join('\n')}
                onChange={(e) => updateExperience(index, 'responsibilities', e.target.value.split('\n'))}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="One responsibility per line"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
              <input
                type="text"
                value={exp.keywords.join(', ')}
                onChange={(e) => updateExperience(index, 'keywords', e.target.value.split(', '))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Comma-separated keywords"
              />
            </div>
            <button
              onClick={() => removeExperience(index)}
              className="text-red-600 hover:text-red-800"
            >
              Remove Experience
            </button>
          </div>
        ))}
      </section>

      {/* Education */}
      <section className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Education</h2>
          <button
            onClick={addEducation}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Education
          </button>
        </div>
        {profile.education.map((edu, index) => (
          <div key={index} className="border border-gray-200 p-4 rounded-md mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <input
                  type="text"
                  value={edu.year}
                  onChange={(e) => updateEducation(index, 'year', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <button
              onClick={() => removeEducation(index)}
              className="mt-2 text-red-600 hover:text-red-800"
            >
              Remove Education
            </button>
          </div>
        ))}
      </section>

      {/* Additional Skills */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Additional Skills</h2>
        <textarea
          value={profile.additionalSkills.join('\n')}
          onChange={(e) => setProfile(prev => ({
            ...prev,
            additionalSkills: e.target.value.split('\n').filter(skill => skill.trim())
          }))}
          rows={4}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="One skill per line"
        />
      </section>

      <div className="flex justify-center">
        <button
          onClick={handleSave}
          className="px-8 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 font-semibold"
        >
          Save Master Profile
        </button>
      </div>
    </div>
  );
}