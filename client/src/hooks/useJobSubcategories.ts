import { useGetAllJobCategoriesQuery } from "@/features/jobs/jobCategoriesApi";

interface Option {
  value: number;
  label: string;
}

// Hook to fetch and return job subcategory options for dropdowns
function useJobSubcategories(){
const {
    data: categories,
    error,
    isLoading,
  } = useGetAllJobCategoriesQuery();

  const subcategories =
    categories?.flatMap((c) =>
      c.subcategories.map((s) => ({ id: s.id, name: s.name }))
    ) ?? [];
    
  const tagOptions: Option[] = subcategories?.map((tag) => ({
    value: tag.id,
    label: tag.name,
  }));

  return {tagOptions, error, isLoading};

};

export default useJobSubcategories;