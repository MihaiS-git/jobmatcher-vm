import { useEffect, type Dispatch, type SetStateAction } from "react";

// Auto-clear a value (string or object) after a delay (default 10s)
const useAutoClear = <T>(
  value: T | null,
  setValue: Dispatch<SetStateAction<T | string>>,
  delay = 10000
) => {
  useEffect(() => {
    if (value == null) return;
    const timer = setTimeout(() => {
      if (typeof value === "object") {
        setValue({} as T);
      } else {
        setValue("");
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [value, setValue, delay]);
};

export default useAutoClear;
