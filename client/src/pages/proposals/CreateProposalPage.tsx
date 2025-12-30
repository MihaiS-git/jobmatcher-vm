import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import SectionErrorFallback from "@/components/error/SectionErrorFallback";
import UpsertProposalForm from "@/components/forms/project/UpsertProposalForm";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";
import { useParams } from "react-router";

const CreateProposalPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [retryKey, setRetryKey] = useState(0);

  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-0 pt-4 pb-16 w-full"
        aria-labelledby="new-proposal-heading"
      >
        <PageTitle title="Create Proposal" id="new-proposal-heading" />
        <ErrorBoundary
          key={retryKey}
          fallback={
            <SectionErrorFallback
              title="Failed to load proposal form"
              message="An error occurred while loading the proposal form."
              onRetry={() => setRetryKey((prev) => prev + 1)}
            />
          }
        >
          <UpsertProposalForm projectId={projectId} />
        </ErrorBoundary>
      </section>
    </PageContent>
  );
};

export default CreateProposalPage;
