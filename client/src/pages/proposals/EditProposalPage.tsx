import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import SectionErrorFallback from "@/components/error/SectionErrorFallback";
import UpsertProposalForm from "@/components/forms/project/UpsertProposalForm";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";
import { useParams } from "react-router-dom";

const EditProposalPage = () => {
  const { id } = useParams<{ id: string }>();
  const [retryKey, setRetryKey] = useState(0);

  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-0 pt-4 pb-16 w-full"
        aria-labelledby="edit-proposal-heading"
      >
        <PageTitle title="Edit Proposal" id="edit-proposal-heading" />
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
          <UpsertProposalForm proposalId={id} />
        </ErrorBoundary>
      </section>
    </PageContent>
  );
};

export default EditProposalPage;
