import type { CustomerSummaryDTO } from "./CustomerDTO";
import type { FreelancerSummaryDTO, JobSubcategoryDTO } from "./FreelancerDTO";
import type { JobCategoryDTO } from "./JobCategoryDTO";
import type { PaymentType } from "./PaymentDTO";
import type { ProposalSummaryDTO } from "./ProposalDTO";

export const ProjectStatus = {
  DRAFT: "DRAFT",
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  STOPPED: "STOPPED",
} as const;

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];

export type ProjectRequestDTO = {
  customerId: string;
  freelancerId?: string;
  title?: string;
  description?: string;
  budget?: string;
  paymentType?: PaymentType;
  deadline?: string; // ISO date string
  categoryId?: number | null;
  subcategoryIds?: number[];
};


export type ProjectStatusRequestDTO = {
  status: ProjectStatus;
};

export type ProjectSummaryDTO = {
  id: string;
  customerId: string;
  freelancerId?: string;
  title: string;
  description: string;
  status?: ProjectStatus;
  budget?: number;
  paymentType?: PaymentType;
  deadline?: Date;
  category?: JobCategoryDTO;
  subcategories?: JobSubcategoryDTO[];
  createdAt: Date;
  lastUpdate: Date;
};

export type ProjectDetailDTO = {
  id: string;
  customer: CustomerSummaryDTO;
  freelancer?: FreelancerSummaryDTO;
  title: string;
  description: string;
  status?: ProjectStatus;
  budget?: number;
  paymentType?: PaymentType;
  deadline?: Date;
  category?: JobCategoryDTO;
  subcategories?: JobSubcategoryDTO[];
  proposals?: ProposalSummaryDTO[];
  acceptedProposalId?: string;
  contractId?: string ;
  createdAt: Date;
  lastUpdate: Date;
};
