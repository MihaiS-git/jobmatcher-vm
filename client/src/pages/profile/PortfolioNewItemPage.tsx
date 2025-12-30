import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import SectionErrorFallback from "@/components/error/SectionErrorFallback";
import LoadingSpinner from "@/components/LoadingSpinner";
import PageContent from "@/components/PageContent";
import { lazy, Suspense, useState } from "react";

const PortfolioItemUpsertForm = lazy(
  () => import("@/components/forms/portfolio/PortfolioItemUpsertForm")
);

const PortfolioNewItemPage = () => {
  const [retryKey, setRetryKey] = useState(0);

  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-4 w-full"
        aria-labelledby="add-portfolio-item-heading"
      >
        <hr className="my-4 border-gray-950 dark:border-gray-200 w-full" />
        <h1
          id="add-portfolio-item-heading"
          className="text-xl font-bold text-blue-600 dark:text-gray-200"
        >
          Add Portfolio Item Form
        </h1>

        <div className="mt-4 p-4">
          <ErrorBoundary
            key={retryKey}
            fallback={
              <SectionErrorFallback
                title="Failed to load portfolio item form"
                message="An error occurred while loading the portfolio item form."
                onRetry={() => setRetryKey((prev) => prev + 1)}
              />
            }
          >
            <Suspense fallback={<LoadingSpinner />}>
              <PortfolioItemUpsertForm itemId={undefined} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </section>
    </PageContent>
  );
};

export default PortfolioNewItemPage;
