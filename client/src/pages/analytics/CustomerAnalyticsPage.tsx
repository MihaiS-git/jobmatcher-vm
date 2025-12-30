import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import SectionErrorFallback from "@/components/error/SectionErrorFallback";
import LoadingSpinner from "@/components/LoadingSpinner";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import { lazy, Suspense, useState } from "react";

const CustomerAnalytics = lazy(
  () => import("@/components/analytics/CustomerAnalytics")
);

const CustomerAnalyticsPage = () => {
  const [retryKey, setRetryKey] = useState(0);
  
  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-0 pt-4 pb-16 w-full"
        aria-labelledby="customer-analytics-heading"
      >
        <PageTitle title="Customer Analytics" id="customer-analytics-page" />

        <ErrorBoundary
          key={retryKey}
          fallback={
            <SectionErrorFallback
              title="Failed to load analytics data"
              message="An error occurred while loading the analytics data."
              onRetry={() => setRetryKey((prev) => prev + 1)}
            />
          }
        >
          <Suspense fallback={<LoadingSpinner fullScreen={true} size={36} />}>
            <CustomerAnalytics />
          </Suspense>
        </ErrorBoundary>
      </section>
    </PageContent>
  );
};

export default CustomerAnalyticsPage;
