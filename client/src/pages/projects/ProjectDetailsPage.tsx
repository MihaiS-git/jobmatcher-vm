import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import SectionErrorFallback from "@/components/error/SectionErrorFallback";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import ProjectDetails from "@/components/project/ProjectDetails";
import { useState } from "react";
import { useParams } from "react-router-dom";

const ProjectDetailsPage = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const [retryKey, setRetryKey] = useState(0);

  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-0 pt-4 pb-16 w-full"
        aria-labelledby="project-list-heading"
      >
        <PageTitle title="Project Details" id="project-details-heading" />

        <ErrorBoundary
          key={retryKey}
          fallback={
            <SectionErrorFallback
              title="Failed to load project details"
              message="An error occurred while loading the project details."
              onRetry={() => setRetryKey((prev) => prev + 1)}
            />
          }
        >
            <ProjectDetails projectId={projectId!} />
        </ErrorBoundary>
      </section>
    </PageContent>
  );
};

export default ProjectDetailsPage;
