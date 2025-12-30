type SortColumn = "title" | "status" | "budget" | "paymentType" | "deadline" | "category";

type SortButtonProps = {
  column: SortColumn;
  direction: "asc" | "desc";
  sortState: Record<SortColumn, "asc" | "desc" | null>;
  toggleSort: (column: SortColumn, direction: "asc" | "desc") => void;
  icon: React.ElementType;
};

const SortButton = ({ column, direction, sortState, toggleSort, icon: Icon }: SortButtonProps) => {
  const isActive = sortState[column] === direction;

  return (
    <Icon
      className={`border rounded-xs p-0.5 w-5 h-5 cursor-pointer
              text-gray-900 dark:text-gray-300
              hover:border-gray-600 hover:text-gray-600
              dark:hover:border-gray-400 dark:hover:text-gray-400
              ${isActive ? "border-red-500" : "border-gray-900 dark:border-gray-300"}`}
      onClick={() => toggleSort(column, direction)}
    />
  );
};

export default SortButton;