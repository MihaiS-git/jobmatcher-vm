import { useGetContractByIdQuery } from "@/features/contracts/contractsApi";
import LoadingSpinner from "../LoadingSpinner";
import { useEffect, useState } from "react";
import { parseApiError } from "@/utils/parseApiError";
import { Link, useNavigate } from "react-router";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { Button } from "../ui/button";
import FeedbackMessage from "../FeedbackMessage";
import { useCreateInvoiceMutation } from "@/features/invoices/invoiceApi";
import useAuth from "@/hooks/useAuth";
import { PaymentType } from "@/types/PaymentDTO";
import { PaymentTypeLabels } from "@/types/formLabels/paymentLabels";

type ContractDetailsProps = {
  contractId: string;
};

const ContractDetails = ({ contractId }: ContractDetailsProps) => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>("");
  const [apiError, setApiError] = useState<string>("");

  const auth = useAuth();
  const role = auth.user.role;

  const {
    data: contract,
    error,
    isLoading,
  } = useGetContractByIdQuery(contractId);

  const [createInvoice, { isLoading: isCreatingInvoice }] =
    useCreateInvoiceMutation();

  useEffect(() => {
    if (error) {
      setApiError(parseApiError(error));
    }
  }, [error]);

  const milestones = contract?.milestones
    ? Array.from(contract.milestones)
    : [];

  if (!contractId) {
    return <p className="text-red-500">Contract ID is required.</p>;
  }

  const handleMilestonesClick = (id: string) => {
    navigate(`/contracts/${id}/add-milestones`);
  };

  if (isLoading) {
    return (
      <div className="p-4 w-full text-start font-light text-sm">
        <LoadingSpinner fullScreen={true} size={36} />
      </div>
    );
  }
  if (apiError || !contract) {
    return (
      <div className="p-4 w-full text-start font-light text-sm">
        <FeedbackMessage
          id="contract-feedback"
          type="error"
          message={apiError ?? "Contract not found."}
        />
      </div>
    );
  }

  const handleCreateInvoice = async (contractId: string) => {
    try {
      const invoice = await createInvoice({ contractId }).unwrap();
      setSuccessMessage("Invoice created successfully.");
      setApiError("");
      navigate(`/invoices/${invoice.id}`);
    } catch (error: unknown) {
      setApiError(parseApiError(error));
      setSuccessMessage("");
    }
  };

  return (
    <div className="w-full sm:max-w-6xl p-4 mb-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-md">
      <div className="w-full text-center border-b px-1 md:px-2 py-1 md:py-4">
        <div className="space-y-2 m-4 mb-0 w-full text-center border-b pb-2 font-bold text-lg">
          {contract && <h2 className="text-center">Contract #{contractId}</h2>}
        </div>

        <div className="p-4 pt-0 w-full text-start font-light text-sm">
          <section>
            <h3 className="text-xs text-center font-light italic mb-4">
              {contract?.title}
            </h3>
            <p>{contract?.description}.</p>
            <p>
              The object of the present contract is the execution of the works /
              services, in accordance with the terms and conditions stipulated
              and accepted by the both parts in the Proposal with ID{" "}
              <Link
                to={`/proposals/${contract?.proposalId}`}
                className="underline text-blue-500 hover:text-blue-400 italic font-light"
              >
                {contract?.proposalId}
              </Link>{" "}
              having as base the Project with ID{" "}
              <Link
                to={`/projects/${contract?.projectId}`}
                className="underline text-blue-500 hover:text-blue-400 italic font-light"
              >
                {contract?.projectId}
              </Link>
              .
            </p>
          </section>

          <section className="mt-4">
            <p>
              <span className="font-semibold">
                <b>Customer:</b>
              </span>{" "}
              <Link
                to={`/public_profile/customer/${contract?.customerId}`}
                className="underline text-blue-500 hover:text-blue-400 italic font-light"
              >
                {contract?.customerName}
              </Link>
            </p>
            <div className="mb-4">
              <p className="font-medium">Customer Contact:</p>
              <p className="ms-2">
                <b>Email:</b> {contract?.customerContact.email}
              </p>
              <p className="ms-2">
                <b>Phone:</b> {contract?.customerContact.phone}
              </p>
              <p className="ms-2">
                <b>Address:</b>{" "}
                {`${contract?.customerContact.address.street}, 
                ${contract?.customerContact.address.city}, 
                ${contract?.customerContact.address.state}, 
                ${contract?.customerContact.address.postalCode}, 
                ${contract?.customerContact.address.country}`}
              </p>
            </div>
            <span className="font-semibold">
              <b>Freelancer:</b>{" "}
              <Link
                to={`/public_profile/freelancer/${contract?.freelancerId}`}
                className="underline text-blue-500 hover:text-blue-400 italic font-light"
              >
                {contract?.freelancerName}
              </Link>
            </span>
            <div className="mb-4">
              <p className="font-medium">Freelancer Contact:</p>
              <p className="ms-2">
                <b>Email:</b> {contract?.freelancerContact.email}
              </p>
              <p className="ms-2">
                <b>Phone:</b> {contract?.freelancerContact.phone}
              </p>
              <p className="ms-2">
                <b>Address:</b>{" "}
                {`${contract?.freelancerContact.address.street}, 
                ${contract?.freelancerContact.address.city}, 
                ${contract?.freelancerContact.address.state}, 
                ${contract?.freelancerContact.address.postalCode}, 
                ${contract?.freelancerContact.address.country}`}
              </p>
            </div>
          </section>

          <section className="mt-4">
            <div className="mb-4">
              <p className="font-bold">Contract Details:</p>
              <p className="ms-2">
                <b>Contract Value:</b>{" "}
                {formatCurrency(Number(contract?.amount))}
              </p>
              <p className="ms-2">
                <b>Contract Duration:</b>{" "}
                {contract!.startDate && contract!.endDate
                  ? `${formatDate(contract!.startDate)} - ${formatDate(
                      contract!.endDate
                    )}`
                  : "N/A"}
              </p>
              <p className="ms-2">
                <b>Payment Type:</b> {PaymentTypeLabels[contract?.paymentType]}
              </p>
            </div>
          </section>

          {contract.paymentType === PaymentType.MILESTONE && (
            <section className="my-4">
              <h4 className="text-start font-semibold text-sm mb-2">
                Milestones
              </h4>
              <ul className="space-y-2 ">
                {milestones.length > 0 ? (
                  milestones.map((milestone) => (
                    <li key={milestone.id} className="ms-4 mb-2 text-sm">
                      <p className="font-semibold">
                        <b>Title:</b> {milestone.title}
                      </p>
                      <p className="ms-2">
                        <b>Description:</b> {milestone.description}
                      </p>
                      <p className="ms-2">
                        <b>Amount:</b>{" "}
                        {formatCurrency(Number(milestone.amount))}
                      </p>
                      <p className="ms-2">
                        <b>Estimated Duration:</b> {milestone.estimatedDuration}{" "}
                        days
                      </p>
                      <p className="ms-2">
                        <b>Notes:</b> {milestone.notes || "N/A"}
                      </p>
                      <p className="ms-2">
                        <b>Start Date:</b>{" "}
                        {formatDate(milestone.plannedStartDate!)}
                      </p>
                      <p className="ms-2">
                        <b>Due Date:</b> {formatDate(milestone.plannedEndDate!)}
                      </p>
                    </li>
                  ))
                ) : (
                  <p className="italic font-light">No milestones defined.</p>
                )}
              </ul>
            </section>
          )}

          <section className="flex flex-row justify-between mt-4">
            <div className="mb-4">
              <p className="font-bold">Signatures:</p>
              <p className="ms-2">
                <b>Freelancer:</b> {contract?.freelancerName}
              </p>
              <p className="ms-2">
                <b>Client:</b> {contract?.customerName}
              </p>
            </div>
            <div className="mb-4">
              <p className="font-bold">Signed at:</p>
              <p>{formatDate(contract?.signedAt)}</p>
            </div>
          </section>
        </div>
      </div>
      <section>
        {successMessage && successMessage !== "" && (
          <div className="p-4 w-full text-start font-light text-sm">
            <FeedbackMessage
              id="invoice-success-feedback"
              type="success"
              message={successMessage}
            />
          </div>
        )}
        {apiError && (
          <div className="p-4 w-full text-start font-light text-sm">
            <FeedbackMessage
              id="invoice-error-feedback"
              type="error"
              message={apiError}
            />
          </div>
        )}
      </section>
      <div className="space-y-2 p-4 w-full text-start pb-4 text-lg">
        <section className="flex mt-4 justify-center gap-2">
          {contract.paymentType === PaymentType.MILESTONE && (
            <Button
              variant="default"
              size="sm"
              className="bg-blue-500 text-gray-200 rounded-sm border border-gray-200 hover:bg-blue-400 w-35"
              onClick={() => handleMilestonesClick(contract.id)}
            >
              Milestones
            </Button>
          )}

          {contract.paymentType !== PaymentType.MILESTONE &&
            role === "STAFF" &&
            contract.invoices.length === 0 && (
              <div className="flex flex-col items-center gap-3 w-full max-w-2xl my-2 px-2">
                <Button
                  type="button"
                  variant="default"
                  onClick={() => {
                    handleCreateInvoice(contract.id);
                  }}
                  className="bg-blue-500 text-gray-200 rounded-sm border border-gray-200 hover:bg-blue-400 w-35"
                  disabled={
                    isCreatingInvoice ||
                    [
                      "TERMINATED",
                      "ON_HOLD",
                      "CANCELLED",
                      "COMPLETED",
                    ].includes(contract.status!)
                  }
                >
                  Create Invoice
                </Button>
              </div>
            )}
        </section>
      </div>
    </div>
  );
};

export default ContractDetails;
