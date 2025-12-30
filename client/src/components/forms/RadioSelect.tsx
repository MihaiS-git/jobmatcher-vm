type Props = {
  label: string;
  id1: string;
  label1: string;
  id2: string;
  label2: string;
  name: string;
  value: boolean;
  setValue: (value: boolean) => void;
};

const RadioSelect = ({
  label,
  id1,
  label1,
  id2,
  label2,
  name,
  value,
  setValue,
}: Props) => {
  return (
    <div className="flex flex-col items-left w-full my-2 px-2 xl:px-16">
      <fieldset>
        <legend className="font-semibold text-sm xl:text-base mb-2">
          {label}
        </legend>
      </fieldset>
      <div>
        <input
          type="radio"
          id={id1}
          name={name}
          checked={value === true}
          onChange={() => setValue(true)}
        />
        <label
          htmlFor={id1}
          className="p-2 font-light text-sm xl:text-base mb-2"
        >
          {label1}
        </label>
      </div>
      <div>
        <input
          type="radio"
          id={id2}
          name={name}
          checked={value === false}
          onChange={() => setValue(false)}
        />
        <label
          htmlFor={id2}
          className="p-2 font-light text-sm xl:text-base mb-2"
        >
          {label2}
        </label>
      </div>
    </div>
  );
};

export default RadioSelect;
