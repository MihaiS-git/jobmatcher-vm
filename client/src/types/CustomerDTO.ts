import type { LanguageDTO } from "./LanguageDTO";

export type CustomerSummaryDTO = {
  userId: string;
  profileId: string;
  username: string;
  company: string;
  languages: LanguageDTO[];
  rating: number;
  pictureUrl: string;
};

export type CustomerDetailDTO = {
  userId: string;
  profileId: string;
  username: string;
  company: string;
  languages: LanguageDTO[];
  rating: number;
  pictureUrl: string;
  websiteUrl: string;
  socialMedia: string[];
  about: string;
};

export type CustomerProfileRequestDTO = {
  userId: string;
  username: string;
  company?: string;
  about?: string;
  languageIds?: number[];
  websiteUrl?: string;
  socialMedia?: string[];
};