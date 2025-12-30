import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import SectionErrorFallback from "@/components/error/SectionErrorFallback";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import ProposalDetails from "@/components/proposal/ProposalDetails";
import { useState } from "react";
import { useParams } from "react-router-dom";

const ProposalDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [retryKey, setRetryKey] = useState(0);

  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-0 pt-4 pb-16 w-full"
        aria-labelledby="new-proposal-heading"
      >
        <PageTitle title="Proposal Details" id="proposal-detail-page" />
        <ErrorBoundary
          key={retryKey}
          fallback={
            <SectionErrorFallback
              title="Failed to load contracts list"
              message="An error occurred while loading the contracts list."
              onRetry={() => setRetryKey((prev) => prev + 1)}
            />
          }
        >
          <ProposalDetails id={id!} />
        </ErrorBoundary>
      </section>
    </PageContent>
  );
};

export default ProposalDetailsPage;
