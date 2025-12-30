import ContractDetails from "@/components/contract/ContractDetails";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import SectionErrorFallback from "@/components/error/SectionErrorFallback";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";
import { useParams } from "react-router-dom";

const ContractDetailPage = () => {
  const { contractId } = useParams<{ contractId: string }>();
  const [retryKey, setRetryKey] = useState(0);

  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-0 pt-4 pb-16 w-full"
        aria-labelledby="new-contract-heading"
      >
        <PageTitle title="Contract Details" id="contract-detail-page" />

        <ErrorBoundary
          key={retryKey}
          fallback={
            <SectionErrorFallback
              title="Failed to load contract details"
              message="An error occurred while loading the contract details."
              onRetry={() => setRetryKey((prev) => prev + 1)}
            />
          }
        >
            <ContractDetails contractId={contractId!} />
        </ErrorBoundary>
      </section>
    </PageContent>
  );
};

export default ContractDetailPage;
