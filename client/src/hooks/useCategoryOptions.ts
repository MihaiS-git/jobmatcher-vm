import { useGetAllJobCategoriesQuery } from "@/features/jobs/jobCategoriesApi";
import type { JobCategoryDTO } from "@/types/JobCategoryDTO";
import { useMemo } from "react";

// Hook to fetch and return job category options for dropdowns
export function useCategoryOptions(): JobCategoryDTO[] {
  const { data: jobCategories } = useGetAllJobCategoriesQuery();

  return useMemo(() => jobCategories ?? [], [jobCategories]);
}
