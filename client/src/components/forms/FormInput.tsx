import InputErrorMessage from "@/components/forms/InputErrorMessage";
import { forwardRef, type InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  className?: string;
  label: string;
  error?: string | null;
  containerClassName?: string;
  isLoading?: boolean;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    { id, label, containerClassName = "", className = "", error, isLoading, ...props },
    ref
  ) => {
    return (
      <div
        className={`flex flex-col items-start w-full my-2 px-2 xl:px-16 ${containerClassName}`}
      >
        <label htmlFor={id} className="font-semibold text-sm xl:text-base">
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`bg-gray-200 text-gray-950 py-2 px-4 w-80 rounded-sm border border-gray-950 text-sm xl:text-base ${className}`}
          disabled={isLoading}
          {...props}
        />
        {error && <InputErrorMessage message={error} label={id!} />}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
