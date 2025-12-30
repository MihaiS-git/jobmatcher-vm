import FeedbackMessage from "@/components/FeedbackMessage";
import InputErrorMessage from "@/components/forms/InputErrorMessage";
import { Button } from "@/components/ui/button";
import { useCreateMilestoneMutation } from "@/features/contracts/milestone/milestoneApi";
import useAuth from "@/hooks/useAuth";
import {
  milestonesFormSchema,
  type MilestoneFormValues,
  type MilestoneItem,
} from "@/schemas/milestoneSchema";
import { PriorityLabels } from "@/types/formLabels/proposalLabels";
import { Priority } from "@/types/MilestoneDTO";
import type { Role } from "@/types/UserDTO";
import { parseValidationErrors } from "@/utils/parseApiError";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useFieldArray, useForm, type FieldPath } from "react-hook-form";

type MilestoneFormProps = {
  contractId: string;
};

const EditableFieldsByRole: Record<Role, (keyof MilestoneItem)[]> = {
  STAFF: [
    "title",
    "description",
    "amount",
    "estimatedDuration",
    "plannedStartDate",
    "notes",
  ],
  CUSTOMER: [
    "penaltyAmount",
    "bonusAmount",
    "notes",
    "actualStartDate",
    "priority",
  ],
  ADMIN: [],
};

const MilestonesAddForm = ({ contractId }: MilestoneFormProps) => {
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [apiError, setApiError] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string
  > | null>(null);

  const auth = useAuth();
  const role = auth.user?.role as Role;

  const editableFields = EditableFieldsByRole[role];

  const defaultValues = useMemo<MilestoneFormValues>(
    () => ({
      milestones: [],
    }),
    []
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<MilestoneFormValues>({
    defaultValues,
    resolver: zodResolver(milestonesFormSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "milestones",
  });

  const [createMilestone, { isLoading: isCreating }] =
    useCreateMilestoneMutation();

  const clearFieldError = (fieldName: FieldPath<MilestoneFormValues>) => {
    clearErrors(fieldName);
    setValidationErrors((prev) => {
      if (!prev) return null;
      const updated = { ...prev };
      delete updated[fieldName];
      return Object.keys(updated).length ? updated : null;
    });
  };

  function handleValidationApiError(
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
      setApiError(apiError || "Validation error");
    } else {
      setApiError(errorResult.message);
      setValidationErrors(null);
    }
    return;
  }

  const onSubmit = async (data: MilestoneFormValues) => {
    for (const milestone of data.milestones) {
      const payload = {
        title: milestone.title || "",
        description: milestone.description || "",
        amount: parseFloat(milestone.amount || "0"),
        estimatedDuration: milestone.estimatedDuration || 0,
        notes: milestone.notes || "",
        plannedStartDate: milestone.plannedStartDate || "",
      };

      try {
        await createMilestone({ ...payload, contractId }).unwrap();
        setSuccessMessage("Milestones added successfully.");
        setApiError("");
        setValidationErrors(null);
        reset(defaultValues);
      } catch (err: unknown) {
        handleValidationApiError(err, setValidationErrors, setApiError);
      }
    }
    reset({ milestones: [] });
  };

  return (
    <div className="w-full sm:max-w-6xl p-4 mb-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-md">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full pb-24 flex flex-col items-center"
      >
        {fields.map((field, index) => (
          <fieldset
            key={field.id}
            className="flex flex-col items-center mt-1 w-full mx-auto"
            disabled={isCreating}
          >
            {(errors?.milestones?.[index]?.title ||
              validationErrors?.[`milestones.${index}.title`]) && (
              <InputErrorMessage
                message={
                  typeof errors?.milestones?.[index]?.title?.message ===
                  "string"
                    ? errors.milestones[index]!.title!.message
                    : validationErrors?.[`milestones.${index}.title`]
                }
                label="title"
              />
            )}
            <div className="space-y-2 border-b border-gray-400 w-full flex flex-col items-center">
              {editableFields.includes("title") && (
                <div className="flex flex-col w-full max-w-2xl items-start my-1 px-2">
                  <label
                    htmlFor="title"
                    className="font-semibold text-sm xl:text-base"
                  >
                    Title
                  </label>
                  <input
                    id="title"
                    {...register(`milestones.${index}.title`, {
                      onChange: () =>
                        clearFieldError(`milestones.${index}.title`),
                      required: "Title required",
                    })}
                    className="bg-gray-200 text-gray-950 disabled:opacity-30 py-1 px-4 w-full rounded-sm border border-gray-950 text-sm xl:text-base"
                    aria-invalid={!!errors.milestones?.[index]?.title}
                    aria-describedby={
                      errors.milestones?.[index]?.title
                        ? "title-error"
                        : undefined
                    }
                  />
                </div>
              )}

              {editableFields.includes("description") && (
                <div className="flex flex-col items-start w-full max-w-2xl my-2 px-2">
                  <label
                    htmlFor="description"
                    className="font-semibold text-sm xl:text-base"
                  >
                    Description
                  </label>
                  <textarea
                    {...register(`milestones.${index}.description`, {
                      onChange: () =>
                        clearFieldError(`milestones.${index}.description`),
                      required: "Description required",
                    })}
                    className="bg-gray-200 text-gray-950 disabled:opacity-30 py-2 px-4 w-full h-40 rounded-sm border border-gray-950 text-sm xl:text-base resize-y"
                    aria-invalid={!!errors.milestones?.[index]?.description}
                    aria-describedby={
                      errors.milestones?.[index]?.description
                        ? "description-error"
                        : undefined
                    }
                  />
                  {(errors?.milestones?.[index]?.description ||
                    validationErrors?.[`milestones.${index}.description`]) && (
                    <InputErrorMessage
                      message={
                        typeof errors?.milestones?.[index]?.description
                          ?.message === "string"
                          ? errors.milestones[index]!.description!.message
                          : validationErrors?.[
                              `milestones.${index}.description`
                            ]
                      }
                      label="description"
                    />
                  )}
                </div>
              )}

              {editableFields.includes("amount") && (
                <div className="flex flex-col items-start w-full max-w-2xl my-2 px-2">
                  <label
                    htmlFor="amount"
                    className="font-semibold text-sm xl:text-base"
                  >
                    Amount
                  </label>
                  <input
                    type="text"
                    {...register(`milestones.${index}.amount`, {
                      required: "Amount required",
                      min: 0.01,
                    })}
                    className="bg-gray-200 text-gray-950 disabled:opacity-30 py-1 px-4 w-full rounded-sm border border-gray-950 text-sm xl:text-base"
                    aria-invalid={!!errors.milestones?.[index]?.amount}
                    aria-describedby={
                      errors.milestones?.[index]?.amount
                        ? "amount-error"
                        : undefined
                    }
                  />
                  {(errors?.milestones?.[index]?.amount ||
                    validationErrors?.[`milestones.${index}.amount`]) && (
                    <InputErrorMessage
                      message={
                        typeof errors?.milestones?.[index]?.amount?.message ===
                        "string"
                          ? errors.milestones[index]!.amount!.message
                          : validationErrors?.[`milestones.${index}.amount`]
                      }
                      label="amount"
                    />
                  )}
                </div>
              )}

              {editableFields.includes("penaltyAmount") && (
                <div className="flex flex-col items-start w-full max-w-2xl my-2 px-2">
                  <label
                    htmlFor="penaltyAmount"
                    className="font-semibold text-sm xl:text-base"
                  >
                    Penalty Amount
                  </label>
                  <input
                    type="text"
                    {...register(`milestones.${index}.penaltyAmount`)}
                    className="bg-gray-200 text-gray-950 disabled:opacity-30 py-1 px-4 w-full rounded-sm border border-gray-950 text-sm xl:text-base"
                    aria-invalid={!!errors.milestones?.[index]?.penaltyAmount}
                    aria-describedby={
                      errors.milestones?.[index]?.penaltyAmount
                        ? "penaltyAmount-error"
                        : undefined
                    }
                  />
                  {errors.milestones?.[index]?.penaltyAmount && (
                    <InputErrorMessage
                      message={errors.milestones[index]?.penaltyAmount?.message}
                      label="penaltyAmount"
                    />
                  )}
                </div>
              )}

              {editableFields.includes("bonusAmount") && (
                <div className="flex flex-col items-start w-full max-w-2xl my-2 px-2">
                  <label
                    htmlFor="bonusAmount"
                    className="font-semibold text-sm xl:text-base"
                  >
                    Bonus Amount
                  </label>
                  <input
                    type="text"
                    {...register(`milestones.${index}.bonusAmount`)}
                    className="bg-gray-200 text-gray-950 disabled:opacity-30 py-1 px-4 w-full rounded-sm border border-gray-950 text-sm xl:text-base"
                    aria-invalid={!!errors.milestones?.[index]?.bonusAmount}
                    aria-describedby={
                      errors.milestones?.[index]?.bonusAmount
                        ? "bonusAmount-error"
                        : undefined
                    }
                  />
                  {errors.milestones?.[index]?.bonusAmount && (
                    <InputErrorMessage
                      message={errors.milestones[index]?.bonusAmount?.message}
                      label="bonusAmount"
                    />
                  )}
                </div>
              )}

              {editableFields.includes("estimatedDuration") && (
                <div className="flex flex-col items-start w-full max-w-2xl my-2 px-2">
                  <label
                    htmlFor="estimatedDuration"
                    className="font-semibold text-sm xl:text-base"
                  >
                    Estimated Duration(in days)
                  </label>
                  <input
                    type="number"
                    {...register(`milestones.${index}.estimatedDuration`, {
                      required: "Estimated duration required",
                      min: 1,
                      valueAsNumber: true,
                    })}
                    className="bg-gray-200 text-gray-950 disabled:opacity-30 py-1 px-4 w-full rounded-sm border border-gray-950 text-sm xl:text-base"
                    aria-invalid={
                      !!errors.milestones?.[index]?.estimatedDuration
                    }
                    aria-describedby={
                      errors.milestones?.[index]?.estimatedDuration
                        ? "estimatedDuration-error"
                        : undefined
                    }
                  />
                  {errors.milestones?.[index]?.estimatedDuration && (
                    <InputErrorMessage
                      message={
                        errors.milestones[index]?.estimatedDuration?.message
                      }
                      label="estimatedDuration"
                    />
                  )}
                </div>
              )}

              {editableFields.includes("plannedStartDate") && (
                <div className="flex flex-col items-start w-full max-w-2xl my-2 px-2">
                  <label
                    htmlFor="plannedStartDate"
                    className="font-semibold text-sm xl:text-base"
                  >
                    Planned Start Date
                  </label>
                  <input
                    type="date"
                    {...register(`milestones.${index}.plannedStartDate`, {
                      required: "Planned start date required",
                    })}
                    className="bg-gray-200 text-gray-950 disabled:opacity-30 py-1 px-4 w-full rounded-sm border border-gray-950 text-sm xl:text-base"
                    aria-invalid={
                      !!errors.milestones?.[index]?.plannedStartDate
                    }
                    aria-describedby={
                      errors.milestones?.[index]?.plannedStartDate
                        ? "plannedStartDate-error"
                        : undefined
                    }
                  />
                  {errors.milestones?.[index]?.plannedStartDate && (
                    <InputErrorMessage
                      message={
                        errors.milestones[index]?.plannedStartDate?.message
                      }
                      label="plannedStartDate"
                    />
                  )}
                </div>
              )}

              {editableFields.includes("actualStartDate") && (
                <div className="flex flex-col items-start w-full max-w-2xl my-2 px-2">
                  <label
                    htmlFor="actualStartDate"
                    className="font-semibold text-sm xl:text-base"
                  >
                    Actual Start Date
                  </label>
                  <input
                    type="date"
                    {...register(`milestones.${index}.actualStartDate`, {
                      required: "Actual start date required",
                    })}
                    className="bg-gray-200 text-gray-950 disabled:opacity-30 py-1 px-4 w-full rounded-sm border border-gray-950 text-sm xl:text-base"
                    aria-invalid={!!errors.milestones?.[index]?.actualStartDate}
                    aria-describedby={
                      errors.milestones?.[index]?.actualStartDate
                        ? "actualStartDate-error"
                        : undefined
                    }
                  />
                  {errors.milestones?.[index]?.actualStartDate && (
                    <InputErrorMessage
                      message={
                        errors.milestones[index]?.actualStartDate?.message
                      }
                      label="actualStartDate"
                    />
                  )}
                </div>
              )}

              {editableFields.includes("notes") && (
                <div className="flex flex-col items-start w-full max-w-2xl my-2 px-2">
                  <label
                    htmlFor="notes"
                    className="font-semibold text-sm xl:text-base"
                  >
                    Notes
                  </label>
                  <textarea
                    {...register(`milestones.${index}.notes`)}
                    className="bg-gray-200 text-gray-950 disabled:opacity-30 py-2 px-4 w-full h-40 rounded-sm border border-gray-950 text-sm xl:text-base resize-y"
                    aria-invalid={!!errors.milestones?.[index]?.notes}
                    aria-describedby={
                      errors.milestones?.[index]?.notes
                        ? "notes-error"
                        : undefined
                    }
                  />
                  {errors.milestones?.[index]?.notes && (
                    <InputErrorMessage
                      message={errors.milestones[index]?.notes?.message}
                      label="notes"
                    />
                  )}
                </div>
              )}

              {editableFields.includes("priority") && (
                <div className="flex flex-col items-start w-full max-w-2xl my-2 px-2">
                  <label
                    htmlFor="priority"
                    className="font-semibold text-sm xl:text-base"
                  >
                    Priority
                  </label>
                  <select
                    id="priority"
                    {...register(`milestones.${index}.priority`, {
                      onChange: () =>
                        clearFieldError(`milestones.${index}.priority`),
                    })}
                    className="bg-gray-200 text-gray-950 disabled:opacity-30 py-1 px-4 w-full rounded-sm border border-gray-950 text-sm xl:text-base"
                    aria-invalid={!!errors.milestones?.[index]?.priority}
                    aria-describedby={
                      errors.milestones?.[index]?.priority
                        ? "priority-error"
                        : undefined
                    }
                  >
                    {Object.values(Priority).map((priority) => (
                      <option key={priority} value={priority}>
                        {PriorityLabels[priority]}
                      </option>
                    ))}
                  </select>
                  {errors.milestones?.[index]?.priority && (
                    <InputErrorMessage
                      message={errors.milestones[index]?.priority?.message}
                      label="priority"
                    />
                  )}
                </div>
              )}

              <div className="flex flex-col items-center gap-3 w-full max-w-2xl my-2 px-2">
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  variant="destructive"
                  className="w-40"
                >
                  Remove Milestone
                </Button>
              </div>
            </div>
          </fieldset>
        ))}

        <div className="flex flex-col items-center gap-3 w-full max-w-2xl my-2 px-2">
          <Button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white w-40"
            variant="default"
            onClick={() =>
              append({
                title: "",
                description: "",
                amount: "0",
                estimatedDuration: 1,
                plannedStartDate: new Date().toISOString().split("T")[0], // default to today
                penaltyAmount: "0",
                bonusAmount: "0",
                notes: "",
                priority: "LOW" as Priority,
              })
            }
          >
            Add Milestone
          </Button>

          {fields.length > 0 && (
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white w-40"
            >
              Save All Milestones
            </Button>
          )}
        </div>
      </form>
      <fieldset
        className="flex flex-col items-center mt-4 space-y-4 w-full mx-auto"
        disabled={isCreating}
      >
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
          <div className="text-red-600 mt-4">
            {Object.entries(validationErrors).map(([field, message]) => (
              <div key={field}>
                {field}: {message}
              </div>
            ))}
          </div>
        )}
      </fieldset>
    </div>
  );
};

export default MilestonesAddForm;
