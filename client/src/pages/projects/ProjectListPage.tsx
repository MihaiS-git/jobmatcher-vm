import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import SectionErrorFallback from "@/components/error/SectionErrorFallback";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import ProjectList from "@/components/project/ProjectList";
import { useState } from "react";

const ProjectListPage = () => {
  const [retryKey, setRetryKey] = useState(0);

  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-0 pt-4 pb-16 w-full"
        aria-labelledby="project-list-heading"
      >
        <PageTitle title="Project List" id="project-list-heading" />

        <ErrorBoundary
          key={retryKey}
          fallback={
            <SectionErrorFallback
              title="Failed to load project list"
              message="An error occurred while loading the project list."
              onRetry={() => setRetryKey((prev) => prev + 1)}
            />
          }
        >
          <ProjectList />
        </ErrorBoundary>
      </section>
    </PageContent>
  );
};

export default ProjectListPage;
