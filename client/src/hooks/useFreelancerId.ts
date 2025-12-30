import { useGetFreelancerByUserIdQuery } from "@/features/profile/freelancerApi";
import useAuth from "./useAuth";

// Hook to fetch and return the freelancer profile ID for the logged-in user
export default function useFreelancerId() {
  const auth = useAuth();
  const userId = auth.user?.id;

  const { data: profile, isLoading, error } = useGetFreelancerByUserIdQuery(userId!, {
    skip: !userId,
  });

  return {
    freelancerId: profile?.profileId ?? undefined,
    isLoading,
    error,
  };
}
