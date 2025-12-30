import { useGetCustomerByUserIdQuery } from "@/features/profile/customerApi";
import useAuth from "./useAuth";

// Hook to fetch and return the customer ID associated with the logged-in user
export default function useCustomerId() {
  const auth = useAuth();
  const userId = auth.user?.id;

  const { data: profile, isLoading, error } = useGetCustomerByUserIdQuery(userId!, {
    skip: !userId,
  });

  return {
    customerId: profile?.profileId ?? undefined,
    isLoading,
    error
  }
}
