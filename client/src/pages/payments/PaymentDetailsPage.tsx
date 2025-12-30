import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import SectionErrorFallback from "@/components/error/SectionErrorFallback";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import PaymentDetails from "@/components/payments/PaymentDetails";
import { useState } from "react";

const PaymentDetailsPage = () => {
  const [retryKey, setRetryKey] = useState(0);
  
  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-0 pt-4 pb-16 w-full"
        aria-labelledby="payments-list-heading"
      >
        <PageTitle title="Payment Details" id="payments-list-page" />

        <ErrorBoundary
          key={retryKey}
          fallback={
            <SectionErrorFallback
              title="Failed to load payment details"
              message="An error occurred while loading the payment details."
              onRetry={() => setRetryKey((prev) => prev + 1)}
            />
          }
        >
            <PaymentDetails />
        </ErrorBoundary>
      </section>
    </PageContent>
  );
};

export default PaymentDetailsPage;
