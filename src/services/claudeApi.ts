import { MasterProfile, CustomizedCV, Language } from '@/types';

const CLAUDE_SYSTEM_PROMPT_EN = `You are a professional CV customization assistant. Your task is to analyze a job posting and customize a master CV profile to match the job requirements while following these strict rules:

RULES:
1. NEVER invent skills, experiences, or qualifications not present in the master profile
2. ONLY use existing qualifications and experiences from the provided data
3. Prioritize and reorder existing skills based on relevance to the job
4. Adapt wording and emphasis without adding fictional details
5. INCLUDE ALL experiences from the experience pool (prioritize order but include all)
6. Return the customized CV in English

TASK:
- Analyze the job posting for key requirements and keywords
- Select the most relevant skills from the skills pool
- Include ALL experiences from the experience pool, but reorder them by relevance to the job
- Adapt the short profile to emphasize relevant aspects (without inventing)
- Return a JSON object with this exact structure:

{
  "personalInfo": { "name": "string", "address": "string", "phone": "string", "email": "string", "birthdate": "string" },
  "shortProfile": "string",
  "prioritizedSkills": [{ "skill": "string", "context": "string", "evidence": "string" }],
  "relevantExperiences": [{ "position": "string", "company": "string", "period": "string", "responsibilities": ["string"], "keywords": ["string"] }],
  "education": [{ "degree": "string", "institution": "string", "year": "string" }],
  "additionalSkills": ["string"]
}

The response must be valid JSON only, no additional text.`;

const CLAUDE_SYSTEM_PROMPT_DE = `Sie sind ein professioneller CV-Anpassungsassistent. Ihre Aufgabe ist es, eine Stellenausschreibung zu analysieren und ein Master-CV-Profil an die Stellenanforderungen anzupassen, während Sie diese strengen Regeln befolgen:

REGELN:
1. Erfinden Sie NIEMALS Fähigkeiten, Erfahrungen oder Qualifikationen, die nicht im Masterprofil vorhanden sind
2. Verwenden Sie NUR vorhandene Qualifikationen und Erfahrungen aus den bereitgestellten Daten
3. Priorisieren und ordnen Sie vorhandene Fähigkeiten nach Relevanz für die Stelle
4. Passen Sie Formulierungen und Schwerpunkte an, ohne fiktive Details hinzuzufügen
5. Nehmen Sie ALLE Erfahrungen aus dem Erfahrungspool auf (priorisieren Sie die Reihenfolge, aber nehmen Sie alle auf)
6. Geben Sie den angepassten CV auf Deutsch zurück

AUFGABE:
- Analysieren Sie die Stellenausschreibung nach Schlüsselanforderungen und Schlüsselwörtern
- Wählen Sie die relevantesten Fähigkeiten aus dem Fähigkeitenpool
- Nehmen Sie ALLE Erfahrungen aus dem Erfahrungspool auf, ordnen Sie sie aber nach Relevanz für die Stelle
- Passen Sie das Kurzprofil an, um relevante Aspekte zu betonen (ohne zu erfinden)
- Geben Sie ein JSON-Objekt mit dieser exakten Struktur zurück:

{
  "personalInfo": { "name": "string", "address": "string", "phone": "string", "email": "string", "birthdate": "string" },
  "shortProfile": "string",
  "prioritizedSkills": [{ "skill": "string", "context": "string", "evidence": "string" }],
  "relevantExperiences": [{ "position": "string", "company": "string", "period": "string", "responsibilities": ["string"], "keywords": ["string"] }],
  "education": [{ "degree": "string", "institution": "string", "year": "string" }],
  "additionalSkills": ["string"]
}

Die Antwort muss nur gültiges JSON sein, kein zusätzlicher Text.`;

export async function customizeCV(
  masterProfile: MasterProfile,
  jobPosting: string,
  language: Language,
  apiKey: string
): Promise<CustomizedCV> {
  if (!apiKey) {
    throw new Error('Claude API key is required');
  }

  const systemPrompt = language === 'de' ? CLAUDE_SYSTEM_PROMPT_DE : CLAUDE_SYSTEM_PROMPT_EN;

  // Create a condensed version of the profile without the large base64 image
  const condensedProfile = {
    personalInfo: {
      name: masterProfile.personalInfo.name,
      address: masterProfile.personalInfo.address,
      phone: masterProfile.personalInfo.phone,
      email: masterProfile.personalInfo.email,
      birthdate: masterProfile.personalInfo.birthdate,
    },
    shortProfile: masterProfile.shortProfile,
    skillsPool: masterProfile.skillsPool,
    experiencePool: masterProfile.experiencePool,
    education: masterProfile.education,
    additionalSkills: masterProfile.additionalSkills
  };

  // Further optimize for token usage by using compact JSON
  const userPrompt = `Master Profile:
${JSON.stringify(condensedProfile)}

Job Posting:
${jobPosting}

Please customize the CV for this job posting in ${language === 'de' ? 'German' : 'English'} and return as JSON matching the CustomizedCV interface.`;

  // Log prompt length for debugging
  console.log(`Prompt length: ${userPrompt.length} characters`);

  try {
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemPrompt,
        userPrompt,
        apiKey,
        language
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to customize CV');
    }

    const data = await response.json();
    
    // Ensure the returned CV has the correct language set and includes the profile image
    const customizedCV: CustomizedCV = {
      ...data.customizedCV,
      language,
      personalInfo: {
        ...data.customizedCV.personalInfo,
        profileImage: masterProfile.personalInfo.profileImage // Preserve the profile image
      }
    };

    return customizedCV;
  } catch (error) {
    console.error('Error customizing CV:', error);
    throw error;
  }
}

export function validateApiKey(apiKey: string): boolean {
  return apiKey.startsWith('sk-ant-') && apiKey.length > 20;
}