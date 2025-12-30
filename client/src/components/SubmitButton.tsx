import { Button } from "./ui/button";

type Props = {
    type: "submit" | "button";
    disabled?: boolean;
    className?: string;
    label: string;
    onClick?: () => void;
};

const SubmitButton = ({type, disabled, className, label, onClick}: Props) => {
  return (
        <Button
          type={type}
          disabled={disabled}
          className={`bg-blue-500 text-gray-200 p-2 rounded-sm border border-gray-200 hover:bg-blue-400 mt-4 w-80 disabled:bg-gray-400 disabled:cursor-not-allowed ${className} cursor-pointer`}
          onClick={onClick}
        >
          {label}
        </Button>
  );
};

export default SubmitButton;
