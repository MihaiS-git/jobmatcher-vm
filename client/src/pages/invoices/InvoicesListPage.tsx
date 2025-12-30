import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import SectionErrorFallback from "@/components/error/SectionErrorFallback";
import InvoicesList from "@/components/invoice/InvoicesList";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";

const InvoicesListPage = () => {
  const [retryKey, setRetryKey] = useState(0);

  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-0 pt-4 pb-16 w-full"
        aria-labelledby="invoices-list-heading"
      >
        <PageTitle title="Invoices List" id="invoices-list-page" />

        <ErrorBoundary
          key={retryKey}
          fallback={
            <SectionErrorFallback
              title="Failed to load invoices list"
              message="An error occurred while loading the invoices list."
              onRetry={() => setRetryKey((prev) => prev + 1)}
            />
          }
        >
          <InvoicesList />
        </ErrorBoundary>
      </section>
    </PageContent>
  );
};

export default InvoicesListPage;
