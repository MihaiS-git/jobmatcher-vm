const focusFirstError = (
  errors: Record<string, string | null | undefined | (string | null)[]>,
  refs: Record<
    string,
    React.RefObject<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null
    >
  >,
  arrayNodes?: Record<string, (HTMLInputElement | null)[]>
) => {
  for (const key of Object.keys(errors)) {
    const error = errors[key];
    if (!error) continue;

    if (Array.isArray(error)) {
      const firstErrorIndex = error.findIndex((e) => e);
      if (firstErrorIndex !== -1 && arrayNodes?.[key]) {
        arrayNodes[key][firstErrorIndex]?.focus();
        break;
      }
    } else {
      refs[key]?.current?.focus();
      break;
    }
  }
};

export default focusFirstError;
