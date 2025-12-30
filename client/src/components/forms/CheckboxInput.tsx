import InputErrorMessage from "./InputErrorMessage";
import { forwardRef, type InputHTMLAttributes } from "react";

interface CheckboxInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
  containerClassName?: string;
}

const CheckboxInput = forwardRef<HTMLInputElement, CheckboxInputProps>(
  (
    { label, error, id, containerClassName = "", className = "", ...props },
    ref
  ) => {
    return (
      <div
        className={`flex flex-col items-start w-full my-2 mt-8 px-2 xl:px-16 ${containerClassName}`}
      >
        <label
          htmlFor={id}
          className="font-semibold text-sm xl:text-base ms-2 mb-2 flex items-center"
        >
          <input
            id={id}
            ref={ref}
            type="checkbox"
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className={`me-2 ${className}`}
            {...props}
          />
          {label}
        </label>
        {error && <InputErrorMessage message={error} label={id!} />}
      </div>
    );
  }
);

CheckboxInput.displayName = "CheckboxInput";

export default CheckboxInput;