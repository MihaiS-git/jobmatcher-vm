import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import SectionErrorFallback from "@/components/error/SectionErrorFallback";
import UpsertProjectForm from "@/components/forms/project/UpsertProjectForm";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";

const CreateProjectPage = () => {
  const [retryKey, setRetryKey] = useState(0);

  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-4 w-full"
        aria-labelledby="create-project-heading"
      >
        <PageTitle title="Create Project" id="create-project-heading" />

        <ErrorBoundary
          key={retryKey}
          fallback={
            <SectionErrorFallback
              title="Failed to load project form"
              message="An error occurred while loading the project form."
              onRetry={() => setRetryKey((prev) => prev + 1)}
            />
          }
        >
            <UpsertProjectForm />
        </ErrorBoundary>
      </section>
    </PageContent>
  );
};

export default CreateProjectPage;
