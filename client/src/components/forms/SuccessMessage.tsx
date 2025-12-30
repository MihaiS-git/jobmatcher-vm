const SuccessMessage = ({message}: {message: string}) => {
  return (
    <p
      id="success-message"
      className="text-green-400 text-center my-4"
      role="alert"
      aria-live="assertive"
    >
      {message}
    </p>
  );
};

export default SuccessMessage;
