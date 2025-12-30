import Select, { type MultiValue } from "react-select";
import classNames from "classnames";
import InputErrorMessage from "./InputErrorMessage";
import { forwardRef } from "react";

interface Option {
  value: number;
  label: string;
}

interface MultiSelectProps {
  id: string;
  name: string;
  label: string;
  options: Option[];
  selectedValues?: number[];
  onChange: (values: number[]) => void;
  isDisabled?: boolean;
  error?: string | null;
  isLoading?: boolean;
}

const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(({
  id,
  name,
  label,
  options = [],
  selectedValues = [],
  onChange,
  isDisabled = false,
  error,
  isLoading = false,
}: MultiSelectProps, ref) => {
  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.value)
  );

  const handleChange = (selected: MultiValue<Option>) => {
    const values = selected.map((opt) => opt.value);
    onChange(values);
  };

  if (options.length === 0 || isLoading) return <div>Loading options...</div>;

  return (
    <div ref={ref} className="my-2 w-full px-2 xl:px-16">
      <label htmlFor={id} className="font-semibold text-sm xl:text-base">
        {label}
      </label>
      <Select
        inputId={id}
        name={name}
        isMulti
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        isDisabled={isDisabled}
        placeholder="Select options..."
        className="react-select-container"
        classNamePrefix="react-select"
        classNames={{
          control: ({ isDisabled, isFocused }) =>
            classNames(
              "w-80 !rounded-sm !border !border-gray-950 px-2 py-0.5 !bg-bg-gray-200",
              isFocused && "!border-1 !border-gray-400 !ring-1 !ring-gray-200",
              isDisabled && "opacity-50 cursor-not-allowed"
            ),
          multiValue: () =>
            "bg-blue-100 text-blue-700 rounded px-2 py-0.5 text-sm",
          multiValueLabel: () => "text-sm",
          multiValueRemove: () =>
            "text-blue-500 hover:text-red-500 cursor-pointer",
          option: ({ isFocused, isSelected }) =>
            classNames(
              "px-3 py-2 text-sm cursor-pointer !text-gray-950",
              isSelected
                ? "bg-blue-500 text-white"
                : isFocused
                ? "bg-blue-100 dark:bg-gray-700"
                : "text-gray-900 dark:text-white"
            ),
          menu: () =>
            "bg-white border border-gray-300 rounded mt-1 dark:bg-gray-900 dark:border-gray-700",
          placeholder: () => "text-gray-400 dark:text-gray-500",
        }}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={!!error}
      />
      {error && <InputErrorMessage message={error} label={id} />}
    </div>
  );
});

export default MultiSelect;
