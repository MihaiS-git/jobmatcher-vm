import type { JobCategoryDTO } from "./JobCategoryDTO";

export type PortfolioItemDetailDTO = {
  id: string;
  title: string;
  description: string;
  category: JobCategoryDTO;
  subcategories: JobCategoryDTO[];
  demoUrl?: string;
  sourceUrl?: string;
  imageUrls?: string[];
  clientName?: string;
  freelancerProfileId?: string;
}

export type PortfolioItemSummaryDTO = {
  id: string;
  title: string;
  description: string;
  category: JobCategoryDTO;
  subcategories: JobCategoryDTO[];
  imageUrls?: string[];
  freelancerProfileId?: string;
}

export type PortfolioItemRequestDTO = {
  title: string;
  description: string;
  categoryId: number;
  subcategoryIds: number[];
  demoUrl?: string;
  sourceUrl?: string;
  clientName?: string;
  freelancerProfileId?: string;
}