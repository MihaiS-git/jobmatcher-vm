import { useMemo } from "react";
import { useCategoryOptions } from "./useCategoryOptions";
import type { JobSubcategoryDTO } from "@/types/JobCategoryDTO";

// Hook to fetch and return job subcategory options based on selected category for dropdowns
export function useSubcategoryByCategoryOptions(selectedCategoryId?: number): JobSubcategoryDTO[] {
  const categoryOptions = useCategoryOptions();

  const jobSubcategoryMap = useMemo(() => {
    const map: Record<number, JobSubcategoryDTO[]> = {};
    categoryOptions.forEach((cat) => {
      map[cat.id] = cat.subcategories ?? [];
    });
    return map;
  }, [categoryOptions]);

  return useMemo(() => {
    if (!selectedCategoryId) return [];
    return jobSubcategoryMap[selectedCategoryId] ?? [];
  }, [selectedCategoryId, jobSubcategoryMap]);
}
