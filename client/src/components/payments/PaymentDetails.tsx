import { useGetPaymentByIdQuery } from "@/features/payment/paymentApi";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { useEffect } from "react";

const PaymentDetails = () => {
  const { paymentId } = useParams<{ paymentId: string }>();

  useEffect(() => {
    if (!paymentId) {
      return;
    }
  }, [paymentId]);

  const {
    data: payment,
    error: paymentError,
    isLoading: isPaymentLoading,
  } = useGetPaymentByIdQuery(paymentId!);

  if (isPaymentLoading) {
    return (
      <div className="w-full sm:max-w-xl p-4 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-md">
        <div className="flex justify-center items-center h-32">
          <LoadingSpinner size={36} />
        </div>
      </div>
    );
  }

  if (paymentError) {
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

  if (!payment) {
    return (
      <div className="w-full sm:max-w-xl p-4 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-md">
        {/* Header Section */}
        <div className="space-y-2 m-4 mb-0 w-full text-center border-b pb-2 font-bold text-lg">
          <h2 className="text-center">Payment Not Found</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className=" sm:max-w-xl lg:max-w-full p-4 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-md">
        <div className="space-y-2 m-4 mb-0 w-full text-center border-b pb-2 font-bold text-lg">
          {payment && <h3 className="text-center">Payment #{payment.id}</h3>}
        </div>
        <div className="p-4 pt-0 w-full text-start font-light text-sm">
          <section className="mt-4 grid grid-cols-2 gap-4 border-b pb-4 w-full">
            <div className=" w-full">
              <div className="w-full">
                <span className="font-semibold">
                  <b>Customer:</b>
                </span>
                <p className="">{payment.contract?.customerName ?? "N/A"}</p>
              </div>
              <div>
                <span className="font-semibold">
                  <b>Freelancer:</b>
                </span>{" "}
                <p className="">{payment.contract?.freelancerName ?? "N/A"}</p>
              </div>
            </div>
            <div>
              <p>
                <span className="font-semibold">
                  <b>Contract ID:</b>
                </span>{" "}
                {payment.contract?.id ? (
                  <Link
                    to={`/contracts/${payment.contract?.id}`}
                    className="underline text-blue-500 hover:text-blue-400 italic font-light"
                  >
                    {payment.contract?.id ?? "N/A"}
                  </Link>
                ) : (
                  <span className="italic text-gray-500">N/A</span>
                )}
              </p>
              <div>
                <span className="font-semibold">
                  <b>Milestone ID:</b>
                </span>{" "}
                {payment.milestone?.id ? (
                  <Link
                    to={`/milestones/${payment.milestone.id}`}
                    className="underline text-blue-500 hover:text-blue-400 italic font-light"
                  >
                    {payment.milestone.id}
                  </Link>
                ) : (
                  <span className="italic text-gray-500">N/A</span>
                )}
              </div>
              <p>
                <span className="font-semibold">
                  <b>Invoice ID:</b>
                </span>{" "}
                {payment.invoice?.id ? (
                  <Link
                    to={`/invoices/${payment.invoice?.id}`}
                    className="underline text-blue-500 hover:text-blue-400 italic font-light"
                  >
                    {payment.invoice?.id ?? "N/A"}
                  </Link>
                ) : (
                  <span className="italic text-gray-500">N/A</span>
                )}
              </p>
            </div>
            <div>
              <p>
                <span className="font-semibold">
                  <b>Amount:</b>
                </span>{" "}
                <span className="italic font-light">
                  {formatCurrency(Number(payment.amount))}
                </span>
              </p>
              <p>
                <span className="font-semibold">
                  <b>Paid at:</b>
                </span>{" "}
                <span className="italic font-light">
                  {formatDate(payment.paidAt) ?? "N/A"}
                </span>
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default PaymentDetails;
