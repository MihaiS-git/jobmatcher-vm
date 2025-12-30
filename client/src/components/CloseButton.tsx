import { SquareX } from "lucide-react";

const CloseButton = ({handleClose}: {handleClose: () => void}) => {

  return (
    <button
      onClick={handleClose}
    >
      <SquareX className="w-6 h-6 text-blue-200 dark:text-gray-200 hover:text-blue-300 dark:hover:text-gray-400 cursor-pointer"/>
    </button>
  );
};

export default CloseButton;
