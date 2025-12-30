import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect, useRef, useState, type RefObject } from "react";
import {
  validateText,
  validateHeadline,
  validateHourlyRate,
  validateSkills,
  validateSocialLinks,
  validateUrl,
  validateUsername,
} from "@/utils/validation";
import MultiSelect from "@/components/forms/MultiSelect";
import {
  useGetFreelancerByUserIdQuery,
  useSaveFreelancerMutation,
  useUpdateFreelancerMutation,
} from "@/features/profile/freelancerApi";
import { useGetAllJobCategoriesQuery } from "@/features/jobs/jobCategoriesApi";
import { parseApiError, parseValidationErrors } from "@/utils/parseApiError";
import type {
  ExperienceLevel,
  FreelancerProfileRequestDTO,
} from "@/types/FreelancerDTO";
import focusFirstError from "@/utils/focusFirstError";
import React from "react";
import FormInput from "@/components/forms/FormInput";
import SelectField from "../SelectField";
import TextareaInput from "../TextareaInput";
import RadioSelect from "../RadioSelect";
import SocialMediaInput from "./SocialMediaInput";
import useDebounce from "@/hooks/useDebounce";
import type { SelectOption } from "@/types/SelectOption";
import LoadingSpinner from "@/components/LoadingSpinner";
import useLanguages from "@/hooks/useLanguages";
import { normalizeUrl } from "@/utils/normalizeUrl";

const DEBOUNCE_DELAY = 500;

type Props = {
  userId: string;
};

const FreelancerForm = ({ userId }: Props) => {
  const [formData, setFormData] = useState({
    username: "",
    headline: "",
    hourlyRate: 0.0,
    websiteUrl: "",
    selectedCategories: [] as number[],
    skills: "",
    experienceLevel: "JUNIOR" as ExperienceLevel,
    selectedLanguages: [] as number[],
    about: "",
    socialLinks: [] as string[],
    availableForHire: false,
  });
  const [errors, setErrors] = useState<{
    username?: string | null;
    headline?: string | null;
    hourlyRate?: string | null;
    websiteUrl?: string | null;
    skills?: string | null;
    about?: string | null;
    socialLinks?: (string | null)[] | null;
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
  const debouncedHeadline = useDebounce(formData.headline, DEBOUNCE_DELAY);
  const debouncedWebsiteUrl = useDebounce(formData.websiteUrl, DEBOUNCE_DELAY);
  const debouncedSkills = useDebounce(formData.skills, DEBOUNCE_DELAY);
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
    if (!touchedFields.headline) return;
    const err = validateHeadline(debouncedHeadline.trim());
    setErrors((prev) =>
      prev.headline === err ? prev : { ...prev, headline: err }
    );
  }, [debouncedHeadline, formData.headline, touchedFields.headline]);

  useEffect(() => {
    if (!touchedFields.websiteUrl) return;
    const err = validateUrl(debouncedWebsiteUrl.trim());
    setErrors((prev) =>
      prev.websiteUrl === err ? prev : { ...prev, websiteUrl: err }
    );
  }, [debouncedWebsiteUrl, formData.websiteUrl, touchedFields.websiteUrl]);

  useEffect(() => {
    if (!touchedFields.skills) return;
    if (!formData.skills) return;
    const err = validateSkills(debouncedSkills);
    setErrors((prev) =>
      prev.skills === err ? prev : { ...prev, skills: err }
    );
  }, [debouncedSkills, formData.skills, touchedFields.skills]);

  useEffect(() => {
    if (!touchedFields.about) return;
    const err = validateText(debouncedAbout);
    setErrors((prev) => (prev.about === err ? prev : { ...prev, about: err }));
  }, [debouncedAbout, formData.about, touchedFields.about]);

  // job categories
  const {
    data: categories,
    error: categoriesApiError,
    isLoading: isLoadingCategories,
  } = useGetAllJobCategoriesQuery();

  useEffect(() => {
    if (categoriesApiError) {
      setApiError(parseApiError(categoriesApiError));
    }
  }, [categoriesApiError]);

  const subcategories =
    categories?.flatMap((c) =>
      c.subcategories.map((s) => ({ id: s.id, name: s.name }))
    ) ?? [];
  const tagOptions: SelectOption[] = subcategories?.map((tag) => ({
    value: tag.id,
    label: tag.name,
  }));

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
    headline: RefObject<HTMLInputElement | null>;
    hourlyRate: RefObject<HTMLInputElement | null>;
    websiteUrl: RefObject<HTMLInputElement | null>;
    jobCategories: RefObject<HTMLInputElement | null>;
    skills: RefObject<HTMLInputElement | null>;
    experienceLevel: RefObject<HTMLSelectElement | null>;
    languages: RefObject<HTMLInputElement | null>;
    about: RefObject<HTMLTextAreaElement | null>;
  } = {
    username: useRef<HTMLInputElement>(null),
    headline: useRef<HTMLInputElement>(null),
    hourlyRate: useRef<HTMLInputElement>(null),
    websiteUrl: useRef<HTMLInputElement>(null),
    jobCategories: useRef<HTMLInputElement>(null),
    skills: useRef<HTMLInputElement>(null),
    experienceLevel: useRef<HTMLSelectElement>(null),
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
    error: freelancerApiError,
  } = useGetFreelancerByUserIdQuery(userId ? userId : skipToken);

  const [saveProfile, { isLoading: saveLoading }] = useSaveFreelancerMutation();
  const [updateProfile, { isLoading: updateLoading }] =
    useUpdateFreelancerMutation();

  useEffect(() => {
    if (freelancerApiError) {
      setApiError(parseApiError(freelancerApiError));
    }
  }, [freelancerApiError]);

  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        username: profile.username || "",
        headline: profile.headline || "",
        hourlyRate: profile.hourlyRate || 0,
        websiteUrl: profile.websiteUrl || "",
        selectedCategories: profile.jobSubcategories.map((js) => js.id) || [],
        skills: profile.skills
          ? profile.skills.map((s) => s.name).join(", ")
          : "",
        experienceLevel: profile.experienceLevel || "",
        selectedLanguages: profile.languages.map((l) => l.id) || [],
        about: profile.about || "",
        socialLinks: profile.socialMedia || [],
        availableForHire: Boolean(profile.availableForHire),
      }));
      setTextCounter((profile.about ?? "").length);
    }
  }, [profile]);

  const validateForm = () => {
    const socialLinkErrors = validateSocialLinks(formData.socialLinks);
    const errors = {
      username: validateUsername(formData.username),
      headline: validateHeadline(formData.headline),
      hourlyRate: validateHourlyRate(formData.hourlyRate),
      websiteUrl: validateUrl(formData.websiteUrl),
      skills: validateSkills(formData.skills),
      about: validateText(formData.about),
      socialLinks: socialLinkErrors,
    };
    setErrors((prev) => ({ ...prev, ...errors }));
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
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

    const skillsArray = formData.skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const payload: FreelancerProfileRequestDTO = {
      userId,
      username: formData.username.trim(),
      headline: formData.headline.trim(),
      jobSubcategoryIds: formData.selectedCategories,
      skills: skillsArray,
      experienceLevel: formData.experienceLevel as ExperienceLevel,
      hourlyRate: formData.hourlyRate,
      languageIds: formData.selectedLanguages,
      about: formData.about.trim(),
      websiteUrl: formData.websiteUrl.trim(),
      socialMedia: formData.socialLinks.map((s) => s.trim()),
      availableForHire: formData.availableForHire || false,
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
          id="headline"
          label="Headline:"
          type="text"
          name="headline"
          value={formData.headline}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, headline: e.target.value }));
            setTouchedFields((prev) =>
              prev.headline ? prev : { ...prev, headline: true }
            );
            if (apiError) setApiError("");
          }}
          error={errors.headline}
          autoComplete="off"
          aria-required="true"
          ref={refsGeneral.headline}
          disabled={isLoading}
        />

        <FormInput
          id="hourlyRate"
          label="Hourly Rate:"
          type="number"
          name="hourlyRate"
          step="0.01"
          value={formData.hourlyRate}
          onChange={(e) => {
            const parsedValue = parseFloat(e.target.value);
            setFormData((prev) => ({
              ...prev,
              hourlyRate: isNaN(parsedValue) ? 0.0 : parsedValue,
            }));
            if (apiError) setApiError("");
          }}
          onBlur={() => {
            const err = validateHourlyRate(formData.hourlyRate);
            setErrors((prev) =>
              prev.hourlyRate === err ? prev : { ...prev, hourlyRate: err }
            );
          }}
          error={errors.hourlyRate}
          autoComplete="off"
          aria-required="true"
          ref={refsGeneral.hourlyRate}
          disabled={isLoading}
        />

        <FormInput
          id="skills"
          label="Skills (separated by commas):"
          type="text"
          name="skills"
          value={formData.skills}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, skills: e.target.value }));
            setTouchedFields((prev) =>
              prev.skills ? prev : { ...prev, skills: true }
            );
            if (apiError) setApiError("");
          }}
          error={errors.skills}
          autoComplete="off"
          aria-required="true"
          ref={refsGeneral.skills}
          disabled={isLoading}
        />

        <MultiSelect
          id="jobCategories"
          name="jobCategories"
          label="Project categories"
          options={tagOptions}
          selectedValues={formData.selectedCategories}
          onChange={(values) => {
            if (values.length <= 5) {
              setFormData((prev) => ({
                ...prev,
                selectedCategories: values,
              }));
              setErrors((prev) => ({ ...prev, jobCategories: undefined }));
              if (apiError) setApiError("");
            } else {
              setErrors((prev) => ({
                ...prev,
                jobCategories: "You can select up to 5 categories only.",
              }));
            }
          }}
          isDisabled={isLoading}
          isLoading={isLoadingCategories}
          ref={refsGeneral.jobCategories}
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

        <SelectField
          id="experienceLevel"
          name="experienceLevel"
          label="Experience Level"
          value={formData.experienceLevel}
          options={[
            { value: "JUNIOR", label: "Junior" },
            { value: "MID", label: "Mid" },
            { value: "SENIOR", label: "Senior" },
          ]}
          onChange={(value: ExperienceLevel) => {
            setFormData((prev) => ({
              ...prev,
              experienceLevel: value,
            }));
            setErrors((prev) => ({ ...prev, experienceLevel: null }));
            if (apiError) setApiError("");
          }}
          selectRef={refsGeneral.experienceLevel}
          disabled={isLoading}
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

        <RadioSelect
          label="Available for hire"
          id1="available"
          label1="Available"
          id2="notAvailable"
          label2="Not available"
          name="availableForHire"
          value={formData.availableForHire}
          setValue={(val: boolean) =>
            setFormData((prev) => ({ ...prev, availableForHire: val }))
          }
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

export default FreelancerForm;

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
