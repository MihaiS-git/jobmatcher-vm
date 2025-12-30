import FeedbackMessage from "@/components/FeedbackMessage";
import LoadingSpinner from "@/components/LoadingSpinner";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import PortfolioItemDetailsCard from "@/components/profile/portfolio/PortfolioItemDetailsCard";
import { useGetPortfolioItemByIdQuery } from "@/features/profile/portfolio/portfolioApi";
import { parseApiError } from "@/utils/parseApiError";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PortfolioItemDetailPage = () => {
    const { itemId } = useParams<{ itemId: string }>();
    const [apiError, setApiError] = useState<string>("");

    const { data: item, isLoading: isLoadingItem, error: itemError } = useGetPortfolioItemByIdQuery(itemId!, {
        skip: !itemId,
    });

    useEffect(() => {
        if(itemError) {
            setApiError(parseApiError(itemError));
        }
    }, [itemError, setApiError]);

  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-0 pt-4 pb-16 w-full"
        aria-labelledby="portfolio-item-details-heading"
      >
        <PageTitle title="Portfolio Item Details" id="portfolio-item-details-heading" />
        {isLoadingItem && <LoadingSpinner fullScreen={true} size={36}/>}
        {apiError && <FeedbackMessage message={apiError ?? "Error loading portfolio item."} type="error" />}
        {item && <PortfolioItemDetailsCard itemId={item.id} />}
      </section>
    </PageContent>
  );
};

export default PortfolioItemDetailPage;
