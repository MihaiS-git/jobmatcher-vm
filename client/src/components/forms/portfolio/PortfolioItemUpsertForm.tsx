import {
  useAddPortfolioItemMutation,
  useGetPortfolioItemByIdQuery,
  useUpdatePortfolioItemMutation,
} from "@/features/profile/portfolio/portfolioApi";
import { parseApiError, parseValidationErrors } from "@/utils/parseApiError";
import { useEffect, useRef, useState, type RefObject } from "react";
import MultiSelect from "@/components/forms/MultiSelect";
import SelectField from "@/components/forms/SelectField";
import FormInput from "@/components/forms/FormInput";
import TextareaInput from "@/components/forms/TextareaInput";
import type { SelectOption } from "@/types/SelectOption";
import { useGetAllJobCategoriesQuery } from "@/features/jobs/jobCategoriesApi";
import FeedbackMessage from "@/components/FeedbackMessage";
import { validateText, validateName, validateUrl } from "@/utils/validation";
import focusFirstError from "@/utils/focusFirstError";
import type { PortfolioItemRequestDTO } from "@/types/PortfolioDTO";
import useDebounce from "@/hooks/useDebounce";
import useAuth from "@/hooks/useAuth";
import { useGetFreelancerByUserIdQuery } from "@/features/profile/freelancerApi";
import SubmitButton from "@/components/SubmitButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import { normalizeUrl } from "@/utils/normalizeUrl";

const DEBOUNCE_DELAY = 500;

type Props = {
  itemId?: string;
};

type PortfolioFormData = {
  title: string;
  description: string;
  selectedCategory: number;
  selectedSubcategories: number[];
  demoUrl: string;
  sourceUrl: string;
  clientName: string;
};

const PortfolioItemUpsertForm = ({ itemId }: Props) => {
  // get the freelancer profileId
  const auth = useAuth();
  const userId = auth?.user?.id;
  const {
    data: profile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useGetFreelancerByUserIdQuery(userId, { skip: !userId });

  const profileId = profile?.profileId;

  useEffect(() => {
    if (profileError) {
      setApiError(parseApiError(profileError));
    }
    if (isProfileLoading) return;
  }, [isProfileLoading, profileError]);

  const [apiError, setApiError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [textCounter, setTextCounter] = useState(0);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );

  const [errors, setErrors] = useState<{
    title?: string | null;
    description?: string | null;
    selectedCategory?: string | null;
    selectedSubcategories?: string | null;
    demoUrl?: string | null;
    sourceUrl?: string | null;
    clientName?: string | null;
  }>({});

  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string
  > | null>(null);

  const {
    data: portfolioItem,
    error,
    isLoading,
  } = useGetPortfolioItemByIdQuery(itemId!, {
    skip: !itemId,
  });

  useEffect(() => {
    if (error) {
      setApiError(parseApiError(error));
    }
    if (isLoading) return;
  }, [error, isLoading]);

  const [formData, setFormData] = useState<PortfolioFormData>({
    title: "",
    description: "",
    selectedCategory: 1,
    selectedSubcategories: [],
    demoUrl: "",
    sourceUrl: "",
    clientName: "",
  });

  const debouncedTitle = useDebounce(formData.title, DEBOUNCE_DELAY);
  const debouncedDescription = useDebounce(
    formData.description,
    DEBOUNCE_DELAY
  );
  const debouncedDemoUrl = useDebounce(formData.demoUrl, DEBOUNCE_DELAY);
  const debouncedSourceUrl = useDebounce(formData.sourceUrl, DEBOUNCE_DELAY);
  const debouncedClientName = useDebounce(formData.clientName, DEBOUNCE_DELAY);

  useEffect(() => {
    if (!touchedFields.title) return;
    const trimmed = debouncedTitle.trim();
    const err = validateName(trimmed);
    setErrors((prev) => ({
      ...(prev.title === err ? prev : { ...prev, title: err }),
    }));
  }, [debouncedTitle, formData.title, touchedFields.title]);

  useEffect(() => {
    if (!touchedFields.description) return;
    const trimmed = debouncedDescription.trim();
    const err = validateText(trimmed);
    setErrors((prev) => ({
      ...(prev.description === err ? prev : { ...prev, description: err }),
    }));
  }, [debouncedDescription, formData.description, touchedFields.description]);

  useEffect(() => {
    if (!touchedFields.demoUrl) return;
    const trimmed = debouncedDemoUrl.trim();
    const err = validateUrl(trimmed);
    setErrors((prev) => ({
      ...(prev.demoUrl === err ? prev : { ...prev, demoUrl: err }),
    }));
  }, [debouncedDemoUrl, formData.demoUrl, touchedFields.demoUrl]);

  useEffect(() => {
    if (!touchedFields.sourceUrl) return;
    const trimmed = debouncedSourceUrl.trim();
    const err = validateUrl(trimmed);
    setErrors((prev) => ({
      ...(prev.sourceUrl === err ? prev : { ...prev, sourceUrl: err }),
    }));
  }, [debouncedSourceUrl, formData.sourceUrl, touchedFields.sourceUrl]);

  useEffect(() => {
    if (!touchedFields.clientName) return;
    const trimmed = debouncedClientName.trim();
    const err = validateName(trimmed);
    setErrors((prev) => ({
      ...(prev.clientName === err ? prev : { ...prev, clientName: err }),
    }));
  }, [debouncedClientName, formData.clientName, touchedFields.clientName]);

  //job categories
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

  // job subcategories
  const category = categories?.[formData.selectedCategory - 1];
  const filteredSubcategories =
    category?.subcategories.map((s) => ({ id: s.id, name: s.name })) ?? [];

  const tagOptions: SelectOption[] = filteredSubcategories.map((tag) => ({
    value: tag.id,
    label: tag.name,
  }));

  const refsGeneral: {
    title: RefObject<HTMLInputElement | null>;
    description: RefObject<HTMLTextAreaElement | null>;
    selectedCategory: RefObject<HTMLSelectElement | null>;
    selectedSubcategories: RefObject<HTMLInputElement | null>;
    demoUrl: RefObject<HTMLInputElement | null>;
    sourceUrl: RefObject<HTMLInputElement | null>;
    clientName: RefObject<HTMLInputElement | null>;
  } = {
    title: useRef<HTMLInputElement>(null),
    description: useRef<HTMLTextAreaElement>(null),
    selectedCategory: useRef<HTMLSelectElement>(null),
    selectedSubcategories: useRef<HTMLInputElement>(null),
    demoUrl: useRef<HTMLInputElement>(null),
    sourceUrl: useRef<HTMLInputElement>(null),
    clientName: useRef<HTMLInputElement>(null),
  };

  const [saveItem, { isLoading: isSaving, error: saveError }] =
    useAddPortfolioItemMutation();
  const [updateItem, { isLoading: isUpdating, error: updateError }] =
    useUpdatePortfolioItemMutation();

  useEffect(() => {
    if (updateError) {
      setApiError(parseApiError(updateError));
    }
  }, [updateError]);

  useEffect(() => {
    if (saveError) {
      setApiError(parseApiError(saveError));
    }
  }, [saveError]);

  useEffect(() => {
    if (portfolioItem) {
      setFormData((prev) => ({
        ...prev,
        title: portfolioItem.title || "",
        description: portfolioItem.description || "",
        selectedCategory: portfolioItem.category?.id || 1,
        selectedSubcategories:
          portfolioItem.subcategories?.map((s) => s.id) || [],
        demoUrl: portfolioItem.demoUrl || "",
        sourceUrl: portfolioItem.sourceUrl || "",
        clientName: portfolioItem.clientName || "",
      }));
      setTextCounter((portfolioItem.description ?? "").length);
    }
  }, [portfolioItem]);

  const validateForm = () => {
    const errors = {
      title: validateName(formData.title),
      description: validateText(formData.description),
      demoUrl: validateUrl(formData.demoUrl),
      sourceUrl: validateUrl(formData.sourceUrl),
      clientName: validateName(formData.clientName),
    };
    setErrors((prev) => ({ ...prev, ...errors }));
    return errors;
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      selectedCategory: 1,
      selectedSubcategories: [],
      demoUrl: "",
      sourceUrl: "",
      clientName: "",
    });
    setTextCounter(0);
    setTouchedFields({});
    setErrors({});
    setValidationErrors(null);
    setApiError("");
    setSuccessMessage("");
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
      focusFirstError(validationErrors, refsGeneral);
      return;
    }

    const payload: PortfolioItemRequestDTO = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      categoryId: formData.selectedCategory,
      subcategoryIds: formData.selectedSubcategories,
      demoUrl: formData.demoUrl.trim(),
      sourceUrl: formData.sourceUrl.trim(),
      clientName: formData.clientName.trim(),
      freelancerProfileId: profileId,
    };

    try {
      if (!portfolioItem) {
        await saveItem(payload).unwrap();
        setSuccessMessage("Portfolio item saved successfully.");
        setApiError("");
        setValidationErrors(null);
        setTimeout(() => resetForm(), 2000);
      } else {
        await updateItem({ id: portfolioItem.id, data: payload }).unwrap();
        setSuccessMessage("Portfolio item updated successfully.");
        setApiError("");
        setValidationErrors(null);
      }
    } catch (err: unknown) {
      handleUpsertApiError(err, setValidationErrors, setApiError, apiError);
    }
  };

  const buttonText = itemId ? "Update Item" : "Save Item";

  if (isProfileLoading || isLoading || isLoadingCategories)
    return <LoadingSpinner fullScreen={true} size={36} />;

  if (!profile?.profileId) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 mt-8">
        You must create a freelancer profile before adding portfolio items.
      </div>
    );
  }

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <FormInput
        id="title"
        label="Title:"
        type="text"
        name="title"
        value={formData.title}
        onChange={(e) => {
          setFormData((prev) => ({ ...prev, title: e.target.value }));
          setTouchedFields((prev) =>
            prev.title ? prev : { ...prev, title: true }
          );
          if (apiError) setApiError("");
        }}
        error={errors.title}
        autoComplete="off"
        aria-required="true"
        ref={refsGeneral.title}
        disabled={isLoading}
      />

      <TextareaInput
        id="description"
        name="description"
        label="Description:"
        value={formData.description}
        onChange={(val) => {
          setFormData((prev) => ({
            ...prev,
            description: val,
          }));
          setTouchedFields((prev) =>
            prev.description ? prev : { ...prev, description: true }
          );
          setTextCounter(val.length);
          if (apiError) setApiError("");
        }}
        error={errors.description}
        characterCount={textCounter}
        showCharacterCount
      />

      <SelectField
        id="selectedCategory"
        name="selectedCategory"
        label="Project Category"
        value={formData.selectedCategory}
        options={
          categories
            ? categories.map((c) => ({
                value: c.id,
                label: c.name,
              }))
            : [{ value: 1, label: "Not categorized" }]
        }
        onChange={(value: number) => {
          setFormData((prev) => ({
            ...prev,
            selectedCategory: value,
          }));
          setErrors((prev) => ({ ...prev, selectedCategory: null }));
          if (apiError) setApiError("");
        }}
        selectRef={refsGeneral.selectedCategory}
        disabled={isLoading}
      />

      <MultiSelect
        id="jobSubcategories"
        name="jobSubcategories"
        label="Project subcategories"
        options={tagOptions}
        selectedValues={formData.selectedSubcategories}
        onChange={(values) => {
          if (values.length <= 5) {
            setFormData((prev) => ({
              ...prev,
              selectedSubcategories: values,
            }));
            setErrors((prev) => ({
              ...prev,
              jobSubcategories: undefined,
            }));
            if (apiError) setApiError("");
          } else {
            setErrors((prev) => ({
              ...prev,
              jobSubcategories: "You can select up to 5 categories only.",
            }));
          }
        }}
        isDisabled={isLoading}
        isLoading={isLoadingCategories}
        ref={refsGeneral.selectedSubcategories}
      />

      <FormInput
        id="demoUrl"
        label="Demo URL:"
        type="text"
        name="demoUrl"
        value={formData.demoUrl}
        onChange={(e) => {
          const rawValue = e.target.value;
          const normalizedValue = rawValue.trim() ? normalizeUrl(rawValue) : "";
          setFormData((prev) => ({
            ...prev,
            demoUrl: normalizedValue,
          }));
          setTouchedFields((prev) =>
            prev.demoUrl ? prev : { ...prev, demoUrl: true }
          );
          if (apiError) setApiError("");
        }}
        error={errors.demoUrl}
        autoComplete="off"
        aria-required="true"
        ref={refsGeneral.demoUrl}
        disabled={isLoading}
      />

      <FormInput
        id="sourceUrl"
        label="Source URL:"
        type="text"
        name="sourceUrl"
        value={formData.sourceUrl}
        onChange={(e) => {
          const rawValue = e.target.value;
          const normalizedValue = rawValue.trim() ? normalizeUrl(rawValue) : "";
          setFormData((prev) => ({
            ...prev,
            sourceUrl: normalizedValue,
          }));
          setTouchedFields((prev) =>
            prev.sourceUrl ? prev : { ...prev, sourceUrl: true }
          );
          if (apiError) setApiError("");
        }}
        error={errors.sourceUrl}
        autoComplete="off"
        aria-required="true"
        ref={refsGeneral.sourceUrl}
        disabled={isLoading}
      />

      <FormInput
        id="clientName"
        label="Client Name:"
        type="text"
        name="clientName"
        value={formData.clientName}
        onChange={(e) => {
          setFormData((prev) => ({
            ...prev,
            clientName: e.target.value,
          }));
          setTouchedFields((prev) =>
            prev.clientName ? prev : { ...prev, clientName: true }
          );
          if (apiError) setApiError("");
        }}
        error={errors.clientName}
        autoComplete="off"
        aria-required="true"
        ref={refsGeneral.clientName}
        disabled={isLoading}
      />

      <section className="flex flex-col items-center mt-4">
        {successMessage && (
          <FeedbackMessage
            id="success-message"
            message={successMessage}
            type="success"
          />
        )}

        {apiError && (
          <FeedbackMessage id="api-error" message={apiError} type="error" />
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
      </section>

      <SubmitButton
        type={"submit"}
        label={buttonText}
        disabled={isSaving || isUpdating || isLoading || isProfileLoading}
        className="mx-auto"
      />
    </form>
  );
};

export default PortfolioItemUpsertForm;

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
