import FeedbackMessage from "@/components/FeedbackMessage";
import LoadingSpinner from "@/components/LoadingSpinner";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import PortfolioItemCardPublic from "@/components/profile/portfolio/PortfolioItemCardPublic";
import { useGetPortfolioItemsByProfileIdQuery } from "@/features/profile/portfolio/portfolioApi";
import { parseApiError } from "@/utils/parseApiError";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const FreelancerPortfolioPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: profileId } = useParams<{ id: string }>();
  const [apiError, setApiError] = useState<string>("");

  const {
    data: portfolioItems,
    isLoading,
    error: portfolioError,
  } = useGetPortfolioItemsByProfileIdQuery(profileId!, {
    skip: !profileId,
  });

  useEffect(() => {
    if (portfolioError) {
      setApiError(parseApiError(portfolioError));
    }
  }, [portfolioError]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner fullScreen={true} size={48} />
      </div>
    );
  }
  if (portfolioError) {
    return (
      <FeedbackMessage
        message={apiError ?? "Error loading portfolio items."}
        type="error"
      />
    );
  }

  const handleClickOnItem = (itemId: string) => {
    const from = location.pathname;
    sessionStorage.setItem("fromFreelancerPortfolio", from);
    navigate(`/portfolio/item/${itemId}`);
  };

  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-4 w-full"
        aria-labelledby="portfolio-list-heading"
      >
        <PageTitle title="Freelancer Portfolio" id="portfolio-list-heading" />
        {portfolioItems?.length === 0 && (
          <div className="text-center mt-4 py-40">
            <p className="text-blue-600 mt-2">No portfolio items found.</p>
          </div>
        )}
        <ul className="w-full max-w-4xl mt-4">
          {portfolioItems?.map((item, index) => (
            <li
              key={index}
              className="mb-4 "
              onClick={() => {
                handleClickOnItem(item.id);
              }}
            >
              <PortfolioItemCardPublic item={item} />
            </li>
          ))}
        </ul>

        {apiError && (
          <FeedbackMessage id="api-error" message={apiError} type="error" />
        )}
      </section>
    </PageContent>
  );
};

export default FreelancerPortfolioPage;
