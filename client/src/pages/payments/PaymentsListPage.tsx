import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import SectionErrorFallback from "@/components/error/SectionErrorFallback";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import PaymentsList from "@/components/payments/PaymentsList";
import { useState } from "react";

const PaymentsListPage = () => {
  const [retryKey, setRetryKey] = useState(0);

  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-0 pt-4 pb-16 w-full"
        aria-labelledby="payments-list-heading"
      >
        <PageTitle title="Payments List" id="payments-list-page" />

        <ErrorBoundary
          key={retryKey}
          fallback={
            <SectionErrorFallback
              title="Failed to load payments list"
              message="An error occurred while loading the payments list."
              onRetry={() => setRetryKey((prev) => prev + 1)}
            />
          }
        >
            <PaymentsList />
        </ErrorBoundary>
      </section>
    </PageContent>
  );
};

export default PaymentsListPage;
