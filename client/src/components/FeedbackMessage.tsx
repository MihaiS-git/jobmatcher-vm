type FeedbackMessageProps = {
  id?: string;
  message: string;
  type?: "error" | "success";
  className?: string;
};

const FeedbackMessage = (
  ({ id, message, type = "error", className = "" }: FeedbackMessageProps) => {
    const baseStyles =
      "text-sm break-words whitespace-normal max-w-80 text-center my-4";
    const color =
      type === "error"
        ? "text-red-600 dark:text-red-400"
        : "text-green-400 dark:text-green-300";

    return (
      <p
        id={id}

        className={`${baseStyles} ${color} ${className}`}
        role={type === "error" ? "alert" : "status"}
        aria-live="assertive"
      >
        {message}
      </p>
    );
  }
);

export default FeedbackMessage;
