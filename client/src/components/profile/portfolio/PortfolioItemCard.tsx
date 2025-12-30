import { useDeletePortfolioItemMutation } from "@/features/profile/portfolio/portfolioApi";
import type { PortfolioItemSummaryDTO } from "@/types/PortfolioDTO";
import { Trash2 } from "lucide-react";
import fallbackImage from "@/assets/react.svg";

type Props = {
  item: PortfolioItemSummaryDTO;
  selected?: boolean;
};

const PortfolioItemCard = ({ item, selected }: Props) => {
  const [deletePortfolioItem] = useDeletePortfolioItemMutation();

  const handleDeleteItem = (e: React.MouseEvent) => {
    e.stopPropagation();
    deletePortfolioItem(item.id);
  };

  return (
    <div
      className={`p-4 flex flex-row border rounded-lg shadow-md ${
        selected ? "bg-blue-100 dark:bg-gray-600" : "bg--card dark:bg-gray-900"
      } text-gray-950 border-gray-300 dark:border-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600 active:bg-gray-300 cursor-pointer`}
    >
        <div className="me-4">
          <img src={item.imageUrls?.[0] ?? fallbackImage} alt={item.title} className="w-30 rounded-sm text-gray-500"/>
        </div>
        <div className="flex-1 flex-col text-gray-950 dark:text-gray-200">
          <h2 className="text-lg font-semibold">{item.title}</h2>
          <p className="text-sm">{item.description}</p>
          <p className="text-xs">
            Category: {item.category.name || "Not categorized"}
          </p>
          <p className="text-xs">
            Subcategory:{" "}
            {item.subcategories?.map((s) => s.name).join(", ") || "None"}
          </p>
        </div>
        <div className="flex flex-col justify-center items-end">
          <Trash2 className="text-red-500 w-5 h-5" onClick={handleDeleteItem} />
        </div>
    </div>
  );
};

export default PortfolioItemCard;
