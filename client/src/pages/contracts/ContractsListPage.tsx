import ContractsList from "@/components/contract/ContractsList";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import SectionErrorFallback from "@/components/error/SectionErrorFallback";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";

const ContractsListPage = () => {
  const [retryKey, setRetryKey] = useState(0);

  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-0 pt-4 pb-16 w-full"
        aria-labelledby="contracts-list-heading"
      >
        <PageTitle title="Contracts List" id="contracts-list-page" />

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
          <ContractsList />
        </ErrorBoundary>
      </section>
    </PageContent>
  );
};

export default ContractsListPage;
