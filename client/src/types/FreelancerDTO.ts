import type { LanguageDTO } from "./LanguageDTO";

export type ExperienceLevel = "JUNIOR" | "MID" | "SENIOR";

export type JobSubcategoryDTO = {
  id: number;
  name: string;
  description: string;
};

export type SkillDTO = {
  name: string;
};

export type FreelancerSummaryDTO = {
  userId: string;
  profileId: string;
  username: string;
  experienceLevel: ExperienceLevel;
  headline: string;
  jobSubcategories: JobSubcategoryDTO[];
  hourlyRate: number;
  availableForHire: boolean;
  pictureUrl: string;
  skills: SkillDTO[];
  languages: LanguageDTO[];
  rating: number;
};

export type FreelancerDetailDTO = {
  userId: string;
  profileId: string;
  username: string;
  experienceLevel: ExperienceLevel;
  headline: string;
  jobSubcategories: JobSubcategoryDTO[];
  hourlyRate: number;
  availableForHire: boolean;
  pictureUrl: string;
  skills: SkillDTO[];
  languages: LanguageDTO[];
  rating: number;
  about: string;
  socialMedia: string[];
  websiteUrl: string;
};

export type FreelancerProfileRequestDTO = {
  userId: string;
  username: string;
  experienceLevel?: ExperienceLevel;
  headline?: string;
  jobSubcategoryIds?: number[];
  hourlyRate?: number;
  availableForHire?: boolean;
  skills?: string[];
  languageIds?: number[];
  about?: string;
  socialMedia?: string[];
  websiteUrl?: string;
};
