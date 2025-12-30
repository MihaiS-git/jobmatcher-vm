const SuccessMessage = ({message}: {message: string}) => {
  return (
    <p
      id="error-message"
      className="text-red-600 dark:text-red-400 text-center my-4"
      role="alert"
      aria-live="assertive"
    >
      {message}
    </p>
  );
};

export default SuccessMessage;
