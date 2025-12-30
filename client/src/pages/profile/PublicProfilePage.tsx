import PageContent from "@/components/PageContent";
import { useState } from "react";
import PageTitle from "@/components/PageTitle";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useGetFreelancerByIdQuery } from "@/features/profile/freelancerApi";
import { useGetCustomerByIdQuery } from "@/features/profile/customerApi";
import { useParams } from "react-router-dom";
import ProfileData from "@/components/profile/ProfileData";
import SEO from "@/components/SEO";
import FeedbackMessage from "@/components/FeedbackMessage";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import SectionErrorFallback from "@/components/error/SectionErrorFallback";

const PublicProfilePage = () => {
  const [retryKey, setRetryKey] = useState(0);
  const { type, profileId } = useParams<{
    type: "customer" | "freelancer";
    profileId: string;
  }>();

  const customerQuery = useGetCustomerByIdQuery(profileId!, {
    skip: !profileId || type !== "customer",
  });
  const freelancerQuery = useGetFreelancerByIdQuery(profileId!, {
    skip: !profileId || type !== "freelancer",
  });

  if (!profileId || (type !== "customer" && type !== "freelancer")) {
    return <FeedbackMessage message={"Invalid profile type"} />;
  }

  const isLoading =
    type === "freelancer" ? freelancerQuery.isLoading : customerQuery.isLoading;
  const error =
    type === "freelancer" ? freelancerQuery.error : customerQuery.error;

  if (type !== "customer" && type !== "freelancer") {
    return <div>Invalid profile type</div>;
  }

  if (isLoading) return <LoadingSpinner fullScreen={false} size={36} />;
  if (error) return <div>Error loading profile</div>;

  return (
    <>
      <SEO
        title={`${
          freelancerQuery.data?.username || customerQuery.data?.username
        } | Job Matcher`}
        description={freelancerQuery.data?.about || customerQuery.data?.about}
        url={`https://jobmatcherclient.netlify.app/public_profile/${type}/${profileId}`}
        image={
          freelancerQuery.data?.pictureUrl || customerQuery.data?.pictureUrl
        }
      />
      <PageContent className="pb-16">
        <section
          className="flex flex-col items-center p-4"
          aria-labelledby="public-profile-heading"
        >
          <PageTitle title="Public Profile" id="public-profile-heading" />
          <ErrorBoundary
            key={retryKey}
            fallback={
              <SectionErrorFallback
                title="Failed to load profile data"
                message="An error occurred while loading the profile data."
                onRetry={() => setRetryKey((prev) => prev + 1)}
              />
            }
          >
            {type === "freelancer" && freelancerQuery.data && (
              <ProfileData type="freelancer" profile={freelancerQuery.data} />
            )}

            {type === "customer" && customerQuery.data && (
              <ProfileData type="customer" profile={customerQuery.data} />
            )}
          </ErrorBoundary>
        </section>
      </PageContent>
    </>
  );
};

export default PublicProfilePage;
