import fallbackImage from "@/assets/react.svg";
import FeedbackMessage from "@/components/FeedbackMessage";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useGetPortfolioItemByIdQuery } from "@/features/profile/portfolio/portfolioApi";
import { parseApiError } from "@/utils/parseApiError";
import { useEffect, useState } from "react";

type Props = {
  itemId: string;
};

const PortfolioItemDetailsCard = ({ itemId }: Props) => {
  const [apiError, setApiError] = useState<string>("");

  const {
    data: item,
    isLoading,
    error,
  } = useGetPortfolioItemByIdQuery(itemId, { skip: !itemId });

  useEffect(() => {
    if (!item) return;
  }, [item]);

  useEffect(() => {
    if (error) {
      setApiError(parseApiError(error));
    }
  }, [error]);

  if (isLoading) {
    return <LoadingSpinner fullScreen={false} size={24} />;
  }

  return (
    <div className="p-4 max-w-2xl w-full flex flex-row border rounded-lg shadow-md  text-gray-950 border-gray-300 dark:border-gray-700">
      {apiError && (
        <FeedbackMessage
          message={apiError ?? "Error loading portfolio item."}
          type="error"
        />
      )}
      {item && (
        <div className="w-full flex flex-col justify-center text-center text-gray-950 dark:text-gray-200 p-8">
          <img
            src={item.imageUrls?.[0] ?? fallbackImage}
            alt={item.title}
            className="w-30 rounded-sm text-gray-500 items-center mx-auto mb-4"
          />
          <h2 className="text-lg font-semibold">{item.title}</h2>
          <p>
            <span className="font-bold">Category: </span>
            {item.category.name || "Not categorized"}
          </p>
          <p>
            <span className="font-bold">Subcategory: </span>
            {item.subcategories?.map((s) => s.name).join(", ") || "None"}
          </p>
          <p>
            <span className="font-bold">Client:</span> {item.clientName}
          </p>
          {item.demoUrl && (
            <div>
              <span className="font-bold">Demo URL:</span>{" "}
              <span className="text-blue-500 hover:text-blue-400 hover:underline cursor-not-allowed">
                {item.demoUrl}
              </span>
            </div>
          )}
          {item.sourceUrl && (
            <div>
              <span className="font-bold">Source URL:</span>{" "}
              <span className="text-blue-500 hover:text-blue-400 hover:underline cursor-not-allowed">
                {item.sourceUrl}
              </span>
            </div>
          )}
          <p>
            <span className="font-bold">Description: </span>
            {item.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default PortfolioItemDetailsCard;
