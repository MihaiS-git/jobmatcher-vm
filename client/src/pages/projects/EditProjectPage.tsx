import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import SectionErrorFallback from "@/components/error/SectionErrorFallback";
import UpsertProjectForm from "@/components/forms/project/UpsertProjectForm";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";
import { useParams } from "react-router-dom";

const EditProjectPage = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const [retryKey, setRetryKey] = useState(0);

  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-0 pt-4 pb-16 w-full h-screen"
        aria-labelledby="edit-project-heading"
      >
        <PageTitle title="Edit Project" id="edit-project-heading" />

        <ErrorBoundary
          key={retryKey}
          fallback={
            <SectionErrorFallback
              title="Failed to load project edit form"
              message="An error occurred while loading the project edit form."
              onRetry={() => setRetryKey((prev) => prev + 1)}
            />
          }
        >
          <UpsertProjectForm projectId={projectId!} />
        </ErrorBoundary>
      </section>
    </PageContent>
  );
};

export default EditProjectPage;
