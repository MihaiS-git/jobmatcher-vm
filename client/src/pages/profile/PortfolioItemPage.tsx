import PageContent from "@/components/PageContent";
import { useGetPortfolioItemByIdQuery } from "@/features/profile/portfolio/portfolioApi";
import { parseApiError } from "@/utils/parseApiError";
import { lazy, Suspense, useEffect, useState } from "react";

import FeedbackMessage from "@/components/FeedbackMessage";
import { useParams } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import SectionErrorFallback from "@/components/error/SectionErrorFallback";

const PortfolioItemUpsertForm = lazy(
  () => import("@/components/forms/portfolio/PortfolioItemUpsertForm")
);

const PortfolioItemImagesCarousel = lazy(
  () => import("@/components/forms/portfolio/PortfolioItemImagesCarousel")
);

const MultiFileUploadForm = lazy(
  () => import("@/components/forms/portfolio/MultiFileUploadForm")
);

const PortfolioItemPage = () => {
  const auth = useAuth();
  const userId = auth?.user?.id;
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!userId) {
      return;
    }
  }, [userId]);

  const { id: itemId } = useParams<{ id: string }>();
  const [apiError, setApiError] = useState<string>("");

  const {
    data: portfolioItem,
    error,
    isLoading,
  } = useGetPortfolioItemByIdQuery(itemId!);

  useEffect(() => {
    if (error) {
      setApiError(parseApiError(error));
    }
    if (isLoading) return;
  }, [error, isLoading]);

  if (isLoading) {
    return <LoadingSpinner fullScreen={false} size={36} />;
  }

  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-4 w-full"
        aria-labelledby="edit-portfolio-item-heading"
      >
        <hr className="my-4 border-gray-950 dark:border-gray-200 w-full" />
        <h1
          id="edit-portfolio-item-heading"
          className="text-xl font-bold text-blue-600 dark:text-gray-200"
        >
          Portfolio Item Edit Form
        </h1>

        <div className="flex flex-col items-center w-full mt-4 p-4">
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
            <Suspense fallback={<LoadingSpinner fullScreen={false} />}>
              <PortfolioItemUpsertForm itemId={portfolioItem?.id} />
            </Suspense>
          </ErrorBoundary>
          <hr className="my-4 border-gray-950 dark:border-gray-200 w-full" />

          {portfolioItem?.imageUrls && (
            <Suspense fallback={<LoadingSpinner fullScreen={false} />}>
              <PortfolioItemImagesCarousel
                images={portfolioItem?.imageUrls}
                portfolioItemId={portfolioItem?.id}
              />
            </Suspense>
          )}

          {portfolioItem?.id && (
            <Suspense fallback={<LoadingSpinner fullScreen={false} />}>
              <MultiFileUploadForm itemId={portfolioItem.id} userId={userId} />
            </Suspense>
          )}

          {apiError && (
            <FeedbackMessage id="api-error" message={apiError} type="error" />
          )}
        </div>
      </section>
    </PageContent>
  );
};

export default PortfolioItemPage;
