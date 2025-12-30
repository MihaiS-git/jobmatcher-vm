import { useGetAllLanguagesQuery } from "@/features/languages/languagesApi";

interface Option {
  value: number;
  label: string;
}

// Hook to fetch and return language options for dropdowns
function useLanguages() {
  const { data: languages, error, isLoading } = useGetAllLanguagesQuery();

  const languageOptions: Option[] =
    languages ? [...languages].sort((a, b) => a.name.localeCompare(b.name))
    .map((tag) => ({
      value: tag.id,
      label: tag.name,
    })) : [];

  return {languageOptions, isLoading, error};
}

export default useLanguages;
