import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import SectionErrorFallback from "@/components/error/SectionErrorFallback";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import FreelancerProposalsList from "@/components/proposal/FreelancerProposalsList";
import { useState } from "react";

const ProposalsListPage = () => {
  const [retryKey, setRetryKey] = useState(0);

  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-0 pt-4 pb-16 w-full"
        aria-labelledby="proposals-list-heading"
      >
        <PageTitle title="Proposals" id="proposals-list-heading" />

        <ErrorBoundary
          key={retryKey}
          fallback={
            <SectionErrorFallback
              title="Failed to load proposals list"
              message="An error occurred while loading the proposals list."
              onRetry={() => setRetryKey((prev) => prev + 1)}
            />
          }
        >
          <FreelancerProposalsList />
        </ErrorBoundary>
      </section>
    </PageContent>
  );
};

export default ProposalsListPage;
