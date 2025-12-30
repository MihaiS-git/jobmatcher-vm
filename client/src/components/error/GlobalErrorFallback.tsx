type GlobalErrorFallbackProps = {
  error?: Error;
};

const GlobalErrorFallback = ({ error }: GlobalErrorFallbackProps) => {
  return (
    <div
      role="alert"
      className="min-h-screen flex flex-col items-center justify-center
                 bg-gray-100 text-gray-900 p-6"
    >
      <h1 className="text-xl font-semibold mb-4">
        Something went wrong
      </h1>

      <p className="text-sm text-gray-700 mb-6 text-center max-w-md">
        The application encountered an unexpected error and cannot continue.
      </p>

      {import.meta.env.DEV && error && (
        <pre className="text-xs text-red-700 bg-red-100 p-4 rounded mb-6 max-w-xl overflow-auto">
          {error.message}
        </pre>
      )}

      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-600 text-white rounded
                   hover:bg-blue-700 focus:outline-none focus:ring"
      >
        Reload page
      </button>
    </div>
  );
};

export default GlobalErrorFallback;
