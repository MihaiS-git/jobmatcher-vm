import type { RefObject } from "react";

type Option<T extends string | number> = {
  value: T;
  label: string;
};

type Props<T extends string | number> = {
  id: string;
  label: string;
  name: string;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  selectRef: RefObject<HTMLSelectElement | null>;
  disabled: boolean;
};
const SelectField = <T extends string | number>({
  id,
  label,
  name,
  value,
  options,
  onChange,
  selectRef,
  disabled = false,
}: Props<T>) => {
  return (
    <div className="flex flex-col items-start w-full my-2 px-2 xl:px-16">
      <label htmlFor={id} className="font-semibold text-sm xl:text-base">
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        ref={selectRef}
        disabled={disabled}
        className="bg-gray-200 text-gray-950 py-2 px-4 w-80 rounded-sm border border-gray-950 text-sm xl:text-base"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;