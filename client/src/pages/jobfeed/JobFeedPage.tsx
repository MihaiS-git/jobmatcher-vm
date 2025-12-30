import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import SectionErrorFallback from "@/components/error/SectionErrorFallback";
import JobFeedList from "@/components/jobfeed/JobFeedList";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";

const JobFeedPage = () => {
  const [retryKey, setRetryKey] = useState(0);

  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-0 pt-4 pb-16 w-full"
        aria-labelledby="job-feed-heading"
      >
        <PageTitle title="Job Feed" id="job-feed-heading" />

        <ErrorBoundary
          key={retryKey}
          fallback={
            <SectionErrorFallback
              title="Failed to load jobs feed"
              message="An error occurred while loading the jobs feed."
              onRetry={() => setRetryKey((prev) => prev + 1)}
            />
          }
        >
          <JobFeedList />
        </ErrorBoundary>
      </section>
    </PageContent>
  );
};

export default JobFeedPage;
