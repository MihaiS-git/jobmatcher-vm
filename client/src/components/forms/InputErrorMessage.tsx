const InputErrorMessage = ({message, label}:  {message: string | undefined, label: string}) => {
  return (
    <p
      id={`${label}-error`}
      className="w-80 break-words text-red-600 dark:text-red-400 text-xs mt-0.5"
      role="alert"
      aria-live="assertive"
    >
      {message}
    </p>
  );
};

export default InputErrorMessage;
