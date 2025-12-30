import { useState } from "react";
import { useCreateStripeCheckoutMutation } from "@/features/payment/paymentApi";
import LoadingSpinner from "../LoadingSpinner";
import { Button } from "../ui/button";

const PayInvoiceButton = ({ invoiceId }: { invoiceId: string }) => {
  const [createCheckout] = useCreateStripeCheckoutMutation();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayInvoice = async () => {
    setIsLoading(true);
    try {
      const { url } = await createCheckout({ invoiceId }).unwrap();
      window.location.href = url; // redirect to Stripe Checkout
    } catch (error) {
      console.error("Failed to start payment:", error);
      alert("There was a problem starting the payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="default"
      onClick={handlePayInvoice}
      className="cursor-pointer"
      disabled={isLoading}
    >
      {isLoading ? (
        <LoadingSpinner fullScreen={false} size={24} />
      ) : (
        "Pay Invoice"
      )}
    </Button>
  );
};

export default PayInvoiceButton;
