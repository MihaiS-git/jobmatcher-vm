import { useGetInvoiceByIdQuery } from "@/features/invoices/invoiceApi";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import useAuth from "@/hooks/useAuth";
import PayInvoiceButton from "./PayInvoiceButton";
import { PaymentTypeLabels } from "@/types/formLabels/paymentLabels";

const InvoiceDetails = () => {
  const { invoiceId } = useParams<{ invoiceId: string }>();

  const auth = useAuth();
  const role = auth?.user?.role;

  const {
    data: invoice,
    error: invoiceError,
    isLoading: isInvoiceLoading,
  } = useGetInvoiceByIdQuery(invoiceId!);

  if (isInvoiceLoading) {
    return (
      <div className="w-full sm:max-w-xl p-4 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-md">
        <div className="flex justify-center items-center h-32">
          <LoadingSpinner size={36} />
        </div>
      </div>
    );
  }

  if (invoiceError) {
    return (
      <div className="w-full sm:max-w-xl p-4 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-md">
        <div className="p-4 w-full text-start font-light text-sm">
          <p className="text-red-600 dark:text-red-400">
            Error loading invoice details.
          </p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="w-full sm:max-w-xl p-4 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-md">
        {/* Header Section */}
        <div className="space-y-2 m-4 mb-0 w-full text-center border-b pb-2 font-bold text-lg">
          <h2 className="text-center">Invoice Not Found</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full sm:max-w-xl p-4 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-md">
        <div className="space-y-2 m-4 mb-0 w-full text-center border-b pb-2 font-bold text-lg">
          {invoice && <h3 className="text-center">Invoice #{invoice.id}</h3>}
        </div>
        <div className="p-4 pt-0 w-full text-start font-light text-sm">
          <section className="mt-4 grid grid-cols-2 gap-4 border-b pb-4">
            <div>
              <p>
                <span className="font-semibold">
                  <b>Customer:</b>
                </span>{" "}
                <Link
                  to={`/public_profile/customer/${invoice.contract?.customerId}`}
                  className="underline text-blue-500 hover:text-blue-400 italic font-light"
                >
                  {invoice.contract?.customerName}
                </Link>
              </p>
              <div className="mb-4">
                <p className="font-medium">Customer Contact:</p>
                <p className="ms-2">
                  <b>Email:</b> {invoice.contract?.customerContact.email}
                </p>
                <p className="ms-2">
                  <b>Phone:</b> {invoice.contract?.customerContact.phone}
                </p>
                <p className="ms-2">
                  <b>Address:</b>{" "}
                  {`${invoice.contract?.customerContact.address.street}, 
                ${invoice.contract?.customerContact.address.city}, 
                ${invoice.contract?.customerContact.address.state}, 
                ${invoice.contract?.customerContact.address.postalCode}, 
                ${invoice.contract?.customerContact.address.country}`}
                </p>
              </div>
            </div>
            <div>
              <span className="font-semibold">
                <b>Freelancer:</b>{" "}
                <Link
                  to={`/public_profile/freelancer/${invoice.contract?.freelancerId}`}
                  className="underline text-blue-500 hover:text-blue-400 italic font-light"
                >
                  {invoice.contract?.freelancerName}
                </Link>
              </span>
              <div className="mb-4">
                <p className="font-medium">Freelancer Contact:</p>
                <p className="ms-2">
                  <b>Email:</b> {invoice.contract?.freelancerContact.email}
                </p>
                <p className="ms-2">
                  <b>Phone:</b> {invoice.contract?.freelancerContact.phone}
                </p>
                <p className="ms-2">
                  <b>Address:</b>{" "}
                  {`${invoice.contract?.freelancerContact.address.street}, 
                            ${invoice.contract?.freelancerContact.address.city}, 
                            ${invoice.contract?.freelancerContact.address.state}, 
                            ${invoice.contract?.freelancerContact.address.postalCode}, 
                            ${invoice.contract?.freelancerContact.address.country}`}
                </p>
              </div>
            </div>
          </section>
          {/* Invoice Details */}
          <section className="mt-4 border-b pb-4">
            <h4 className="font-semibold">Invoice Details</h4>
            <div className="mb-4">
              <p>{invoice.contract.title}</p>
              <p>{invoice.contract.description}</p>
              <p className="ms-2">
                <b>Contract Value:</b> {formatCurrency(Number(invoice?.amount))}
              </p>
              <p className="ms-2">
                <b>Contract Duration:</b>{" "}
                {invoice.contract!.startDate && invoice.contract!.endDate
                  ? `${formatDate(invoice.contract!.startDate)} - ${formatDate(
                      invoice.contract!.endDate
                    )}`
                  : "N/A"}
              </p>
              <p className="ms-2">
                <b>Payment Type:</b>{" "}
                {invoice.contract?.paymentType
                  ? PaymentTypeLabels[
                      invoice.contract
                        .paymentType as keyof typeof PaymentTypeLabels
                    ]
                  : "N/A"}
              </p>
            </div>
          </section>
          <section className="mt-4 border-b pb-4">
            <h5 className="font-semibold mb-4">Payment Details</h5>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <p>Issued At: {formatDate(invoice.issuedAt)}</p>
                <p>Due Date: {formatDate(invoice.dueDate)}</p>
              </div>
              <div>
                <p>
                  Total Amount:{" "}
                  <span className="text-base font-semibold">
                    {formatCurrency(Number(invoice?.amount))}
                  </span>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
      {role === "CUSTOMER" && invoice.status === "PENDING" && (
        <div className="flex flex-col items-center gap-3 w-full max-w-2xl my-2 px-2">
          <PayInvoiceButton invoiceId={invoice.id} />
        </div>
      )}
    </>
  );
};

export default InvoiceDetails;
