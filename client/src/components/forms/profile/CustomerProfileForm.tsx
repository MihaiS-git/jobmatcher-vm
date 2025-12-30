import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect, useRef, useState, type RefObject } from "react";
import {
  validateText,
  validateNotRequiredName,
  validateSocialLinks,
  validateUrl,
  validateUsername,
} from "@/utils/validation";
import MultiSelect from "@/components/forms/MultiSelect";
import { parseApiError, parseValidationErrors } from "@/utils/parseApiError";
import focusFirstError from "@/utils/focusFirstError";
import React from "react";
import FormInput from "@/components/forms/FormInput";
import TextareaInput from "../TextareaInput";
import SocialMediaInput from "./SocialMediaInput";
import useDebounce from "@/hooks/useDebounce";
import {
  useGetCustomerByUserIdQuery,
  useSaveCustomerMutation,
  useUpdateCustomerMutation,
} from "@/features/profile/customerApi";
import type { CustomerProfileRequestDTO } from "@/types/CustomerDTO";
import LoadingSpinner from "@/components/LoadingSpinner";
import { normalizeUrl } from "@/utils/normalizeUrl";
import useLanguages from "@/hooks/useLanguages";

const DEBOUNCE_DELAY = 500;

type Props = {
  userId: string;
};

const CustomerForm = ({ userId }: Props) => {
  const [formData, setFormData] = useState({
    username: "",
    company: "",
    selectedLanguages: [] as number[],
    websiteUrl: "",
    socialLinks: [] as string[],
    about: "",
  });
  const [errors, setErrors] = useState<{
    username?: string | null;
    company?: string | null;
    selectedLanguages?: string | null;
    websiteUrl?: string | null;
    socialLinks?: (string | null)[] | null;
    about?: string | null;
  }>({});
  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string
  > | null>(null);
  const [apiError, setApiError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState("");
  const [textCounter, setTextCounter] = useState(0);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );

  const debouncedUsername = useDebounce(formData.username, DEBOUNCE_DELAY);
  const debouncedCompany = useDebounce(formData.company, DEBOUNCE_DELAY);
  const debouncedWebsiteUrl = useDebounce(formData.websiteUrl, DEBOUNCE_DELAY);
  const debouncedAbout = useDebounce(formData.about, DEBOUNCE_DELAY);

  useEffect(() => {
    if (!touchedFields.username) return;
    const trimmed = debouncedUsername.trim();
    const err = validateUsername(trimmed);
    setErrors((prev) =>
      prev.username === err ? prev : { ...prev, username: err }
    );
  }, [debouncedUsername, formData.username, touchedFields.username]);

  useEffect(() => {
    if (!touchedFields.company) return;
    const err = validateNotRequiredName(debouncedCompany.trim());
    setErrors((prev) =>
      prev.company === err ? prev : { ...prev, company: err }
    );
  }, [debouncedCompany, formData.company, touchedFields.company]);

  useEffect(() => {
    if (!touchedFields.websiteUrl) return;
    const err = validateUrl(debouncedWebsiteUrl.trim());
    setErrors((prev) =>
      prev.websiteUrl === err ? prev : { ...prev, websiteUrl: err }
    );
  }, [debouncedWebsiteUrl, formData.websiteUrl, touchedFields.websiteUrl]);

  useEffect(() => {
    if (!touchedFields.about) return;
    const err = validateText(debouncedAbout);
    setErrors((prev) => (prev.about === err ? prev : { ...prev, about: err }));
  }, [debouncedAbout, formData.about, touchedFields.about]);

  const {
    languageOptions,
    isLoading: isLoadingLanguages,
    error: languagesError,
  } = useLanguages();

  useEffect(() => {
    if (languagesError) {
      setApiError(parseApiError(languagesError));
    }
  }, [languagesError]);

  const refsGeneral: {
    username: RefObject<HTMLInputElement | null>;
    company: RefObject<HTMLInputElement | null>;
    websiteUrl: RefObject<HTMLInputElement | null>;
    languages: RefObject<HTMLInputElement | null>;
    about: RefObject<HTMLTextAreaElement | null>;
  } = {
    username: useRef<HTMLInputElement>(null),
    company: useRef<HTMLInputElement>(null),
    websiteUrl: useRef<HTMLInputElement>(null),
    languages: useRef<HTMLInputElement>(null),
    about: useRef<HTMLTextAreaElement>(null),
  };

  const socialLinkRefs = useRef<(HTMLInputElement | null)[]>([]);

  const setSocialLinkRef = (index: number, node: HTMLInputElement | null) => {
    socialLinkRefs.current[index] = node;
  };

  const updateSocialLink = (index: number, value: string) => {
    setFormData((prev) => {
      const updatedLinks = [...prev.socialLinks];
      updatedLinks[index] = value;
      return { ...prev, socialLinks: updatedLinks };
    });
    setErrors((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks ? [...prev.socialLinks] : [],
    }));
    if (apiError) setApiError("");
  };

  const {
    data: profile,
    isLoading,
    error: customerApiError,
  } = useGetCustomerByUserIdQuery(userId ? userId : skipToken);

  const [saveProfile, { isLoading: saveLoading }] = useSaveCustomerMutation();
  const [updateProfile, { isLoading: updateLoading }] =
    useUpdateCustomerMutation();

  useEffect(() => {
    if (customerApiError) {
      setApiError(parseApiError(customerApiError));
    }
  }, [customerApiError]);

  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        username: profile.username || "",
        company: profile.company || "",
        websiteUrl: profile.websiteUrl || "",
        selectedLanguages: profile.languages.map((l) => l.id) || [],
        about: profile.about || "",
        socialLinks: profile.socialMedia || [],
      }));
      setTextCounter((profile.about ?? "").length);
    }
  }, [profile]);

  const validateForm = () => {
    const socialLinkErrors = validateSocialLinks(formData.socialLinks);
    const errors = {
      username: validateUsername(formData.username),
      company: validateNotRequiredName(formData.company),
      websiteUrl: validateUrl(formData.websiteUrl),
      about: validateText(formData.about),
      socialLinks: socialLinkErrors,
    };
    setErrors((prev) => ({ ...prev, ...errors }));
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (apiError) setApiError("");
    setValidationErrors(null);
    setErrors({});
    setSuccessMessage("");

    const validationErrors = validateForm();
    const hasError = Object.values(validationErrors).some((error) => {
      if (Array.isArray(error)) {
        return error.some((item) => Boolean(item));
      }
      return Boolean(error);
    });

    if (hasError) {
      if (
        validationErrors.socialLinks?.some((err) => Boolean(err)) &&
        socialLinkRefs.current.length > 0
      ) {
        const firstErrorIndex = validationErrors.socialLinks.findIndex((err) =>
          Boolean(err)
        );
        const inputToFocus = socialLinkRefs.current[firstErrorIndex];
        if (inputToFocus) {
          inputToFocus.focus();
          return;
        }
      }
      focusFirstError(validationErrors, refsGeneral, {
        socialLinks: socialLinkRefs.current,
      });
      return;
    }

    const payload: CustomerProfileRequestDTO = {
      userId,
      username: formData.username.trim(),
      company: formData.company.trim(),
      languageIds: formData.selectedLanguages,
      about: formData.about.trim(),
      websiteUrl: formData.websiteUrl.trim(),
      socialMedia: formData.socialLinks.map((s) => s.trim()),
    };

    try {
      if (!profile?.profileId) {
        await saveProfile(payload).unwrap();
        setSuccessMessage("Profile saved successfully.");
      } else {
        await updateProfile({
          id: profile.profileId,
          data: payload,
        }).unwrap();
        setSuccessMessage("Profile updated successfully.");
      }
    } catch (err: unknown) {
      handleUpsertApiError(err, setValidationErrors, setApiError, apiError);
    }
  };

  let submitButtonText: string;
  if (profile?.profileId) {
    submitButtonText = updateLoading ? "Updating..." : "Update";
  } else {
    submitButtonText = saveLoading ? "Saving..." : "Save";
  }

  const hasClientErrors = Object.values(errors).some((err) => {
    if (Array.isArray(err)) {
      return err.some((item) => Boolean(item));
    }
    return Boolean(err);
  });
  const hasServerErrors = apiError && Object.keys(apiError).length > 0;
  const hasValidationErrors = Boolean(hasClientErrors || hasServerErrors);

  if (isLoading) return <LoadingSpinner fullScreen={true} size={36} />;

  return (
    <form
      className="flex flex-col items-center w-full mb-8"
      onSubmit={handleSubmit}
      aria-describedby={apiError ? "api-error" : undefined}
      noValidate
    >
      <section className="mx-auto">
        <FormInput
          id="username"
          label="Username:"
          type="text"
          name="username"
          value={formData.username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData((prev) => ({ ...prev, username: e.target.value }));
            setTouchedFields((prev) =>
              prev.username ? prev : { ...prev, username: true }
            );
            if (apiError) setApiError("");
          }}
          error={errors.username}
          autoComplete="off"
          aria-required="true"
          ref={refsGeneral.username}
          isLoading={isLoading}
        />

        <FormInput
          id="company"
          label="Company:"
          type="text"
          name="company"
          value={formData.company}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, company: e.target.value }));
            setTouchedFields((prev) =>
              prev.company ? prev : { ...prev, company: true }
            );
            if (apiError) setApiError("");
          }}
          error={errors.company}
          autoComplete="off"
          aria-required="true"
          ref={refsGeneral.company}
          disabled={isLoading}
        />

        <MultiSelect
          id="languages"
          name="languages"
          label="Languages"
          options={languageOptions}
          selectedValues={formData.selectedLanguages}
          onChange={(values) => {
            if (values.length <= 5) {
              setFormData((prev) => ({
                ...prev,
                selectedLanguages: values,
              }));
              setErrors((prev) => ({ ...prev, languages: undefined }));
              if (apiError) setApiError("");
            } else {
              setErrors((prev) => ({
                ...prev,
                languages: "You can select up to 5 languages only.",
              }));
            }
          }}
          isDisabled={isLoading}
          isLoading={isLoadingLanguages}
          ref={refsGeneral.languages}
        />

        <TextareaInput
          id="about"
          name="about"
          label="About:"
          value={formData.about}
          onChange={(val) => {
            setFormData((prev) => ({
              ...prev,
              about: val,
            }));
            setTouchedFields((prev) =>
              prev.about ? prev : { ...prev, about: true }
            );
            setTextCounter(val.length);
            if (apiError) setApiError("");
          }}
          error={errors.about}
          characterCount={textCounter}
          showCharacterCount
        />

        <FormInput
          id="websiteUrl"
          label="Website URL:"
          type="text"
          name="websiteUrl"
          value={formData.websiteUrl}
          onChange={(e) => {
            const rawValue = e.target.value;
            const normalizedValue = rawValue.trim()
              ? normalizeUrl(rawValue)
              : rawValue;
            setFormData((prev) => ({ ...prev, websiteUrl: normalizedValue }));

            setTouchedFields((prev) =>
              prev.websiteUrl ? prev : { ...prev, websiteUrl: true }
            );

            if (apiError) setApiError("");
          }}
          error={errors.websiteUrl}
          autoComplete="off"
          aria-required="true"
          ref={refsGeneral.websiteUrl}
          disabled={isLoading}
        />

        <SocialMediaInput
          socialLinks={formData.socialLinks}
          setSocialLinks={(links) => {
            setFormData((prev) => ({
              ...prev,
              socialLinks: links,
            }));
            if (apiError) setApiError("");
          }}
          updateSocialLink={updateSocialLink}
          errors={errors.socialLinks ?? []}
          setErrors={(newErrors) =>
            setErrors((prev) => ({ ...prev, socialLinks: newErrors }))
          }
          setSocialLinkRef={setSocialLinkRef}
          debounceDelay={DEBOUNCE_DELAY}
        />
      </section>
      <button
        type="submit"
        className="bg-blue-500 text-gray-200 p-2 rounded-sm border border-gray-200 disabled:bg-red-400 disabled:cursor-default hover:bg-blue-400 mt-8 w-80 cursor-pointer"
        disabled={
          isLoading || saveLoading || updateLoading || hasValidationErrors
        }
      >
        {submitButtonText}
      </button>
      {successMessage && (
        <p
          id="api-error-address"
          className="text-green-400 text-center my-4"
          role="alert"
          aria-live="assertive"
        >
          {successMessage}
        </p>
      )}
      {apiError && (
        <p
          id="api-error-general"
          className="text-red-600 dark:text-red-400 text-center my-4"
          role="alert"
          aria-live="assertive"
        >
          {apiError}
        </p>
      )}
      {validationErrors && (
        <div
          id="api-error-validation"
          className="text-red-600 dark:text-red-400 text-center my-4"
          role="alert"
          aria-live="assertive"
        >
          {Object.values(validationErrors).map((msg, idx) => (
            <p key={idx}>{msg}</p>
          ))}
        </div>
      )}
    </form>
  );
};

export default CustomerForm;

function handleUpsertApiError(
  err: unknown,
  setValidationErrors: React.Dispatch<
    React.SetStateAction<Record<string, string> | null>
  >,
  setApiError: React.Dispatch<React.SetStateAction<string>>,
  apiError?: string
) {
  const errorResult = parseValidationErrors(err);
  if (errorResult.validationErrors) {
    setValidationErrors(errorResult.validationErrors);
    if (apiError) setApiError("");
  } else {
    setApiError(errorResult.message);
    setValidationErrors(null);
  }
  return;
}
