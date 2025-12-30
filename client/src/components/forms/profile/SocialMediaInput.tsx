import { useEffect, useState, type RefObject } from "react";
import InputErrorMessage from "../InputErrorMessage";
import { validateSocialLinks } from "@/utils/validation";
import useDebounce from "@/hooks/useDebounce";
import { Trash2 } from "lucide-react";
import { normalizeUrl } from "@/utils/normalizeUrl";

type Props = {
  socialLinks: string[];
  setSocialLinks: (links: string[]) => void;
  errors: (string | null)[];
  setErrors: (errors: (string | null)[]) => void;
  refs?: RefObject<HTMLInputElement | null>[];
  updateSocialLink: (index: number, value: string) => void;
  setSocialLinkRef: (index: number, ref: HTMLInputElement | null) => void;
  debounceDelay?: number;
};

const SocialMediaInput = ({
  socialLinks,
  setSocialLinks,
  errors,
  setErrors,
  setSocialLinkRef,
  updateSocialLink,
  debounceDelay,
}: Props) => {
  const [touchedFields, setTouchedFields] = useState<Record<number, boolean>>(
    {}
  );

  const debouncedLinks = useDebounce(socialLinks, debounceDelay || 400);

  useEffect(() => {
    if (Object.keys(touchedFields).length === 0) return;

    const validationErrors = validateSocialLinks(debouncedLinks);

    const errorsChanged =
      validationErrors.length !== errors.length ||
      validationErrors.some((err, i) => err !== errors[i]);

    if (errorsChanged) {
      setErrors(validationErrors);
    }
  }, [debouncedLinks, setErrors, touchedFields, errors]);

  const handleRemoveLink = (index: number) => {
    const updatedLinks = socialLinks.filter((_, i) => i !== index);
    const updatedErrors = errors.filter((_, i) => i !== index);
    setSocialLinks(updatedLinks);
    setErrors(updatedErrors);
  };

  const handleAddLink = () => {
    setSocialLinks([...socialLinks, ""]);
    setErrors([...errors, null]);
  };

  return (
    <div className="flex flex-col items-left w-full my-2 px-2 xl:px-16">
      <label className="font-semibold text-sm xl:text-base mb-2">
        Social Media URLs:
      </label>
      {socialLinks.map((url, index) => (
        <div key={index} className="mt-2 w-full flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <input
              type="url"
              placeholder="https://your-social-link.com"
              className="bg-gray-200 text-gray-950 py-2 px-4 rounded-sm border border-gray-950 text-sm xl:text-base grow transition-all duration-200 min-w-0"
              value={url}
              onChange={(e) => {
                const rawValue = e.target.value;
                const normalizedValue = rawValue.trim()
                  ? normalizeUrl(rawValue)
                  : rawValue;
                const updatedLinks = [...socialLinks];
                updatedLinks[index] = normalizedValue;

                const validationErrors = validateSocialLinks(updatedLinks);

                setSocialLinks(updatedLinks);
                setErrors(validationErrors);
                updateSocialLink(index, normalizedValue);
                setTouchedFields((prev) => ({ ...prev, [index]: true }));
              }}
              aria-invalid={!!errors[index]}
              aria-describedby={
                errors[index] ? `social-url-error-${index}` : undefined
              }
              ref={(node) => setSocialLinkRef(index, node)}
            />
            <button
              type="button"
              onClick={() => handleRemoveLink(index)}
              aria-label={`Remove social link ${index + 1}`}
              className="p-0 text-xs flex items-center"
            >
              <Trash2 className="w-7 h-7 text-gray-800 dark:text-red-600 hover:text-red-700 rounded-xs border border-gray-800 dark:border-red-600 hover:border-red-700 p-1 cursor-pointer" />
            </button>
          </div>
          {errors[index] && (
            <InputErrorMessage
              message={errors[index]}
              label={`social-url-error-${index}`}
            />
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddLink}
        className="mx-auto mt-2 bg-gray-300 text-gray-950 text-sm p-0.5 rounded-sm border border-gray-950 hover:bg-gray-500 hover:text-gray-200 w-40 cursor-pointer"
      >
        + Add Link
      </button>
    </div>
  );
};

export default SocialMediaInput;
