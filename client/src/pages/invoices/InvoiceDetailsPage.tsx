import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import SectionErrorFallback from "@/components/error/SectionErrorFallback";
import InvoiceDetails from "@/components/invoice/InvoiceDetails";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";

const InvoiceDetailsPage = () => {
  const [retryKey, setRetryKey] = useState(0);

  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-0 pt-4 pb-16 w-full"
        aria-labelledby="invoice-details-heading"
      >
        <PageTitle title="Invoice Details" id="invoice-details-page" />

        <ErrorBoundary
          key={retryKey}
          fallback={
            <SectionErrorFallback
              title="Failed to load invoice details"
              message="An error occurred while loading the invoice details."
              onRetry={() => setRetryKey((prev) => prev + 1)}
            />
          }
        >
          <InvoiceDetails />
        </ErrorBoundary>
      </section>
    </PageContent>
  );
};

export default InvoiceDetailsPage;
