type SectionErrorFallbackProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

const SectionErrorFallback = ({
  title = "This section failed to load",
  message = "An unexpected error occurred.",
  onRetry,
}: SectionErrorFallbackProps) => {
  return (
    <div
      role="alert"
      className="border border-red-500 bg-red-50 text-red-800
                 rounded p-4 my-4
                 text-center"
    >
      <h2 className="font-semibold mb-2">
        {title}
      </h2>

      <p className="text-sm mb-4">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3 py-1 text-sm rounded
                     bg-red-600 text-white
                     hover:bg-red-700 focus:outline-none focus:ring
                     cursor-pointer"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default SectionErrorFallback;
