import FeedbackMessage from "@/components/FeedbackMessage";
import InputErrorMessage from "@/components/forms/InputErrorMessage";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  useDeleteMilestoneByIdMutation,
  useGetMilestoneByIdQuery,
  useUpdateMilestoneByIdMutation,
} from "@/features/contracts/milestone/milestoneApi";
import { useCreateInvoiceMutation } from "@/features/invoices/invoiceApi";
import { milestoneSchema, type MilestoneItem } from "@/schemas/milestoneSchema";
import { PriorityLabels } from "@/types/formLabels/proposalLabels";
import { Priority } from "@/types/MilestoneDTO";
import type { Role } from "@/types/UserDTO";
import { formatCurrency } from "@/utils/formatCurrency";
import { parseApiError, parseValidationErrors } from "@/utils/parseApiError";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type MilestoneFormProps = {
  milestoneId: string;
  role: Role;
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

const MilestonesEditForm = ({
  milestoneId,
  role,
  contractId,
}: MilestoneFormProps) => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [apiError, setApiError] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string
  > | null>(null);

  const {
    data: milestoneData,
    isLoading: isLoadingMilestone,
    error: milestoneError,
  } = useGetMilestoneByIdQuery(milestoneId);

  const [
    deleteMilestone,
    { isLoading: isDeletingMilestone, error: deleteError },
  ] = useDeleteMilestoneByIdMutation();

  useEffect(() => {
    if (milestoneError) {
      setApiError(parseApiError(milestoneError));
    }
  }, [milestoneError]);

  const [createInvoice, { isLoading: isCreatingInvoice }] =
    useCreateInvoiceMutation();

  const editableFields = EditableFieldsByRole[role];

  const defaultValues = useMemo<MilestoneItem>(
    () => ({
      title: milestoneData?.title || "",
      description: milestoneData?.description || "",
      amount:
        milestoneData?.amount !== undefined
          ? String(milestoneData.amount)
          : "0",
      penaltyAmount:
        milestoneData?.penaltyAmount !== undefined
          ? String(milestoneData.penaltyAmount)
          : "0",
      bonusAmount:
        milestoneData?.bonusAmount !== undefined
          ? String(milestoneData.bonusAmount)
          : "0",
      estimatedDuration: milestoneData?.estimatedDuration || 0,
      notes: milestoneData?.notes || "",
      plannedStartDate: milestoneData?.plannedStartDate || "",
      actualStartDate: milestoneData?.actualStartDate || "",
      priority: milestoneData?.priority || ("LOW" as Priority),
    }),
    [milestoneData]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<MilestoneItem>({
    defaultValues,
    resolver: zodResolver(milestoneSchema),
  });

  const [updateMilestone, { isLoading: isUpdating }] =
    useUpdateMilestoneByIdMutation();

  useEffect(() => {
    if (milestoneData) {
      reset({
        title: milestoneData.title || "",
        description: milestoneData.description || "",
        amount:
          milestoneData.amount !== undefined
            ? String(milestoneData.amount)
            : "0",
        penaltyAmount:
          milestoneData.penaltyAmount !== undefined
            ? String(milestoneData.penaltyAmount)
            : "0",
        bonusAmount:
          milestoneData.bonusAmount !== undefined
            ? String(milestoneData.bonusAmount)
            : "0",
        estimatedDuration: milestoneData.estimatedDuration || 0,
        notes: milestoneData.notes || "",
        plannedStartDate: milestoneData.plannedStartDate || "",
        actualStartDate: milestoneData.actualStartDate || "",
        priority: milestoneData.priority || ("LOW" as Priority),
      });
    }
  }, [milestoneData, reset]);

  const clearFieldError = (fieldName: FieldPath<MilestoneItem>) => {
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

  const onSubmit = async (data: MilestoneItem) => {
    const payload = {
      title: data.title || "",
      description: data.description || "",
      amount: parseFloat(data.amount || "0"),
      penaltyAmount: parseFloat(data.penaltyAmount || "0"),
      bonusAmount: parseFloat(data.bonusAmount || "0"),
      estimatedDuration: data.estimatedDuration || 0,
      notes: data.notes || "",
      plannedStartDate: data.plannedStartDate || "",
      actualStartDate: data.actualStartDate || "",
      priority: data.priority || ("LOW" as Priority),
    };

    try {
      await updateMilestone({
        id: milestoneId,
        updatedMilestone: payload,
      }).unwrap();
      setSuccessMessage("Milestones updated successfully.");
      setApiError("");
      setValidationErrors(null);
      reset(defaultValues);
    } catch (err: unknown) {
      handleValidationApiError(err, setValidationErrors, setApiError);
    }

    reset(defaultValues);
  };

  const handleDeleteMilestone = async (milestoneId: string) => {
    try {
      await deleteMilestone(milestoneId).unwrap();
      setSuccessMessage("Milestone deleted successfully.");
      setApiError("");
      setValidationErrors(null);
      navigate(`/contracts/${contractId}/add-milestones`);
    } catch (err: unknown) {
      handleValidationApiError(err, setValidationErrors, setApiError);
    }
  };

  const handleCreateInvoice = async (milestoneId: string) => {
    try {
      const invoice = await createInvoice({ contractId, milestoneId }).unwrap();
      setSuccessMessage("Invoice created successfully.");
      setApiError("");
      setValidationErrors(null);
      navigate(`/invoices/${invoice.id}`);
    } catch (error: unknown) {
      setApiError(parseApiError(error));
      setSuccessMessage("");
      setValidationErrors(null);
    }
  };

  useEffect(() => {
    if (deleteError) {
      handleValidationApiError(deleteError, setValidationErrors, setApiError);
    }
  }, [deleteError]);

  if (isLoadingMilestone) {
    return <LoadingSpinner fullScreen={false} size={32} />;
  }

  return (
    <div className="w-full sm:max-w-6xl p-4 mb-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-md">
      {milestoneError ? (
        <FeedbackMessage id="milestone-error" message={apiError} type="error" />
      ) : (
        <div className="w-full text-center px-1 md:px-2 py-1">
          {milestoneData && (
            <div className="w-full text-center px-1 md:px-2 py-1">
              <h2 className="text-blue-600 mb-4 text-center">
                <b>Milestone Data</b>
              </h2>
              <section className="text-sm font-medium text-start grid grid-cols-3 lg:grid-cols-5 gap-1 md:gap-2 border-b pb-4">
                <p>Title: </p>
                <p className="font-light col-span-2 lg:col-span-4">
                  {milestoneData?.title || "N/A"}
                </p>

                <p>Description: </p>
                <p className="font-light col-span-2 lg:col-span-4">
                  {milestoneData?.description || "N/A"}
                </p>

                <p>Amount: </p>
                <p className="font-light col-span-2 lg:col-span-4">
                  {milestoneData?.amount
                    ? formatCurrency(milestoneData?.amount)
                    : "N/A"}
                </p>

                <p>Penalty Amount: </p>
                <p className="font-light col-span-2 lg:col-span-4">
                  {milestoneData?.penaltyAmount
                    ? formatCurrency(milestoneData?.penaltyAmount)
                    : "N/A"}
                </p>

                <p>Bonus Amount: </p>
                <p className="font-light col-span-2 lg:col-span-4">
                  {milestoneData?.bonusAmount
                    ? formatCurrency(milestoneData?.bonusAmount)
                    : "N/A"}
                </p>

                <p>Estimated Duration: </p>
                <p className="font-light col-span-2 lg:col-span-4">
                  {milestoneData?.estimatedDuration || "N/A"} days
                </p>

                <p>Planned Start Date: </p>
                <p className="font-light col-span-2 lg:col-span-4">
                  {milestoneData?.plannedStartDate || "N/A"}
                </p>

                <p>Actual Start Date: </p>
                <p className="font-light col-span-2 lg:col-span-4">
                  {milestoneData?.actualStartDate || "N/A"}
                </p>

                <p>Priority: </p>
                <p className="font-light col-span-2 lg:col-span-4">
                  {
                    PriorityLabels[
                      milestoneData?.priority || ("LOW" as Priority)
                    ]
                  }
                </p>

                <p>Notes: </p>
                <p className="font-light col-span-2 lg:col-span-4">
                  {milestoneData?.notes || "N/A"}
                </p>
              </section>
            </div>
          )}
        </div>
      )}

      <div className="w-full text-center px-1 md:px-2 py-1">
        <h2 className="text-blue-600 mb-2 text-center mt-8">
          <b>Milestone Update Form</b>
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full pb-24 flex flex-col items-center"
        >
          <fieldset
            className="flex flex-col items-center mt-1 w-full mx-auto"
            disabled={isUpdating || isLoadingMilestone || isDeletingMilestone}
          >
            <fieldset
              className="flex flex-col items-center mt-4 space-y-4 w-full mx-auto"
              disabled={isUpdating || isLoadingMilestone || isDeletingMilestone}
            >
              {successMessage && (
                <FeedbackMessage
                  id="success-message"
                  message={successMessage}
                  type="success"
                />
              )}
              {apiError && (
                <FeedbackMessage
                  id="api-error"
                  message={apiError}
                  type="error"
                />
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

            {editableFields.includes("title") && (
              <div className="flex flex-col w-full max-w-2xl items-start my-2 px-2">
                <label
                  htmlFor="title"
                  className="font-semibold text-sm xl:text-base"
                >
                  Title
                </label>
                <input
                  id="title"
                  {...register("title", {
                    onChange: () => clearFieldError("title"),
                    required: "Title required",
                  })}
                  className="bg-gray-200 text-gray-950 disabled:opacity-30 py-1 px-4 w-full rounded-sm border border-gray-950 text-sm xl:text-base"
                  aria-invalid={!!errors.title}
                  aria-describedby={errors.title ? "title-error" : undefined}
                />
                {(errors?.title || validationErrors?.[".title"]) && (
                  <InputErrorMessage
                    message={
                      typeof errors?.title?.message === "string"
                        ? errors.title!.message
                        : validationErrors?.["title"]
                    }
                    label="title"
                  />
                )}
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
                  {...register("description", {
                    onChange: () => clearFieldError("description"),
                    required: "Description required",
                  })}
                  className="bg-gray-200 text-gray-950 disabled:opacity-30 py-2 px-4 w-full h-40 rounded-sm border border-gray-950 text-sm xl:text-base resize-y"
                  aria-invalid={!!errors.description}
                  aria-describedby={
                    errors.description ? "description-error" : undefined
                  }
                />
                {(errors?.description || validationErrors?.["description"]) && (
                  <InputErrorMessage
                    message={
                      typeof errors?.description?.message === "string"
                        ? errors.description!.message
                        : validationErrors?.["description"]
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
                  {...register("amount", {
                    required: "Amount required",
                    min: 0.01,
                  })}
                  className="bg-gray-200 text-gray-950 disabled:opacity-30 py-1 px-4 w-full rounded-sm border border-gray-950 text-sm xl:text-base"
                  aria-invalid={!!errors.amount}
                  aria-describedby={errors.amount ? "amount-error" : undefined}
                />
                {(errors?.amount || validationErrors?.["amount"]) && (
                  <InputErrorMessage
                    message={
                      typeof errors?.amount?.message === "string"
                        ? errors.amount!.message
                        : validationErrors?.["amount"]
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
                  {...register("penaltyAmount")}
                  className="bg-gray-200 text-gray-950 disabled:opacity-30 py-1 px-4 w-full rounded-sm border border-gray-950 text-sm xl:text-base"
                  aria-invalid={!!errors.penaltyAmount}
                  aria-describedby={
                    errors.penaltyAmount ? "penaltyAmount-error" : undefined
                  }
                />
                {errors.penaltyAmount && (
                  <InputErrorMessage
                    message={errors.penaltyAmount?.message}
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
                  {...register("bonusAmount")}
                  className="bg-gray-200 text-gray-950 disabled:opacity-30 py-1 px-4 w-full rounded-sm border border-gray-950 text-sm xl:text-base"
                  aria-invalid={!!errors.bonusAmount}
                  aria-describedby={
                    errors.bonusAmount ? "bonusAmount-error" : undefined
                  }
                />
                {errors.bonusAmount && (
                  <InputErrorMessage
                    message={errors?.bonusAmount?.message}
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
                  {...register("estimatedDuration", {
                    required: "Estimated duration required",
                    min: 1,
                    valueAsNumber: true,
                  })}
                  className="bg-gray-200 text-gray-950 disabled:opacity-30 py-1 px-4 w-full rounded-sm border border-gray-950 text-sm xl:text-base"
                  aria-invalid={!!errors?.estimatedDuration}
                  aria-describedby={
                    errors?.estimatedDuration
                      ? "estimatedDuration-error"
                      : undefined
                  }
                />
                {errors?.estimatedDuration && (
                  <InputErrorMessage
                    message={errors?.estimatedDuration?.message}
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
                  {...register("plannedStartDate", {
                    required: "Planned start date required",
                  })}
                  className="bg-gray-200 text-gray-950 disabled:opacity-30 py-1 px-4 w-full rounded-sm border border-gray-950 text-sm xl:text-base"
                  aria-invalid={!!errors?.plannedStartDate}
                  aria-describedby={
                    errors?.plannedStartDate
                      ? "plannedStartDate-error"
                      : undefined
                  }
                />
                {errors?.plannedStartDate && (
                  <InputErrorMessage
                    message={errors?.plannedStartDate?.message}
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
                  {...register("actualStartDate", {
                    required: "Actual start date required",
                  })}
                  className="bg-gray-200 text-gray-950 disabled:opacity-30 py-1 px-4 w-full rounded-sm border border-gray-950 text-sm xl:text-base"
                  aria-invalid={!!errors?.actualStartDate}
                  aria-describedby={
                    errors?.actualStartDate
                      ? "actualStartDate-error"
                      : undefined
                  }
                />
                {errors?.actualStartDate && (
                  <InputErrorMessage
                    message={errors?.actualStartDate?.message}
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
                  {...register("notes")}
                  className="bg-gray-200 text-gray-950 disabled:opacity-30 py-2 px-4 w-full h-40 rounded-sm border border-gray-950 text-sm xl:text-base resize-y"
                  aria-invalid={!!errors?.notes}
                  aria-describedby={errors?.notes ? "notes-error" : undefined}
                />
                {errors?.notes && (
                  <InputErrorMessage
                    message={errors?.notes?.message}
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
                  {...register("priority", {
                    onChange: () => clearFieldError("priority"),
                  })}
                  className="bg-gray-200 text-gray-950 disabled:opacity-30 py-1 px-4 w-full rounded-sm border border-gray-950 text-sm xl:text-base"
                  aria-invalid={!!errors?.priority}
                  aria-describedby={
                    errors?.priority ? "priority-error" : undefined
                  }
                >
                  {Object.values(Priority).map((priority) => (
                    <option key={priority} value={priority}>
                      {PriorityLabels[priority]}
                    </option>
                  ))}
                </select>
                {errors?.priority && (
                  <InputErrorMessage
                    message={errors?.priority?.message}
                    label="priority"
                  />
                )}
              </div>
            )}

            <section
              className="flex flex-row justify-center gap-2"
              aria-disabled={
                isLoadingMilestone || isUpdating || isDeletingMilestone
              }
            >
              {role === "STAFF" && (
                <div className="flex flex-col items-center gap-3 w-full max-w-2xl my-2 px-2">
                  <Button
                    type="button"
                    variant="default"
                    onClick={() => {
                      handleCreateInvoice(milestoneData!.id);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white w-35"
                    disabled={
                      isUpdating ||
                      isLoadingMilestone ||
                      isDeletingMilestone ||
                      isCreatingInvoice ||
                      ["TERMINATED", "CANCELLED"].includes(
                        milestoneData!.status!
                      )
                    }
                  >
                    Create Invoice
                  </Button>
                </div>
              )}

              <div className="flex flex-col items-center gap-3 w-full max-w-2xl my-2 px-2">
                <Button
                  type="submit"
                  variant="default"
                  className="bg-blue-500 hover:bg-blue-600 text-white w-35"
                  disabled={
                    isUpdating || isLoadingMilestone || isDeletingMilestone
                  }
                >
                  Update
                </Button>
              </div>
              <div className="flex flex-col items-center gap-3 w-full max-w-2xl my-2 px-2">
                <Button
                  type="button"
                  variant="destructive"
                  className="w-35"
                  disabled={
                    isUpdating || isLoadingMilestone || isDeletingMilestone
                  }
                  onClick={() => handleDeleteMilestone(milestoneId)}
                >
                  Delete
                </Button>
              </div>
            </section>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default MilestonesEditForm;
