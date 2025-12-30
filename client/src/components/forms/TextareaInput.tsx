import InputErrorMessage from "./InputErrorMessage";

type Props = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string | null;
  characterCount?: number;
  showCharacterCount?: boolean;
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
  disabled?: boolean;
};

const TextareaInput = ({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  characterCount,
  showCharacterCount = false,
  textareaRef,
  disabled = false,
}: Props) => {
  return (
    <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
      <label htmlFor={id} className="font-semibold text-sm xl:text-base">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        className="bg-gray-200 text-gray-950 py-2 px-4 w-80 h-40 rounded-sm border border-gray-950 text-sm xl:text-base resize-y"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {showCharacterCount && (
        <p
          id={`${id}-charactersCounter`}
          className="text-gray-500 text-xs mt-0.5"
          role="alert"
          aria-live="assertive"
        >
          Characters typed: {characterCount ?? value.length}
        </p>
      )}
      {error && <InputErrorMessage message={error} label={label} />}
    </div>
  );
};

export default TextareaInput;
