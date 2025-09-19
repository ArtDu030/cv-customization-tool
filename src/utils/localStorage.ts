import { MasterProfile, CustomizedCV } from '@/types';

const MASTER_PROFILE_KEY = 'cv-master-profile';
const LAST_CV_KEY = 'cv-last-generated';

export const saveMasterProfile = (profile: MasterProfile): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(MASTER_PROFILE_KEY, JSON.stringify(profile));
  }
};

export const getMasterProfile = (): MasterProfile | null => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(MASTER_PROFILE_KEY);
    return stored ? JSON.parse(stored) : null;
  }
  return null;
};

export const saveLastCV = (cv: CustomizedCV): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LAST_CV_KEY, JSON.stringify(cv));
  }
};

export const getLastCV = (): CustomizedCV | null => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(LAST_CV_KEY);
    return stored ? JSON.parse(stored) : null;
  }
  return null;
};

export const clearStorage = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(MASTER_PROFILE_KEY);
    localStorage.removeItem(LAST_CV_KEY);
  }
};