import PageContent from "../../components/PageContent";
import { useGetUserByIdQuery } from "../../features/user/userApi";
import useAuth from "../../hooks/useAuth";
import { lazy, Suspense, useMemo, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import PageTitle from "@/components/PageTitle";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import SectionErrorFallback from "@/components/error/SectionErrorFallback";

const UserGeneralForm = lazy(
  () => import("../../components/user/UserGeneralForm")
);
const UserAddressForm = lazy(
  () => import("../../components/user/UserAddressForm")
);
const UserImmutableData = lazy(
  () => import("../../components/user/UserImmutableData")
);
const UploadPictureForm = lazy(
  () => import("../../components/user/UploadPictureForm")
);

const ProfilePage = () => {
  const auth = useAuth();
  const authUser = auth?.user;
  const userId = authUser?.id;
  const [retryKey1, setRetryKey1] = useState(0);
  const [retryKey2, setRetryKey2] = useState(0);
  const [retryKey3, setRetryKey3] = useState(0);
  const [retryKey4, setRetryKey4] = useState(0);

  const queryArgs = useMemo(() => (userId ? userId : skipToken), [userId]);

  const { data: user, isLoading, error } = useGetUserByIdQuery(queryArgs);

  if (!authUser?.id) return <div>Loading user session...</div>;
  if (isLoading) return <LoadingSpinner fullScreen={true} size={36} />;
  if (error) return <div>Error loading profile.</div>;
  if (!user) return <div>No user data found after fetching.</div>;

  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center p-4"
        aria-labelledby="edit-profile-heading"
      >
        <PageTitle title="User Profile" id="edit-profile-heading" />
        <div className="bg-stone-200 dark:bg-gray-800 p-1 rounded-lg mb-8">
          <img
            className="text-xs font-light m-4 w-80 h-80"
            src={user.pictureUrl || "/user_icon.png"}
            alt="User profile picture"
          />
        </div>

        <ErrorBoundary
          key={retryKey1}
          fallback={
            <SectionErrorFallback
              title="Failed to load picture upload form"
              message="An error occurred while loading the picture upload form."
              onRetry={() => setRetryKey1((prev) => prev + 1)}
            />
          }
        >
          <Suspense fallback={<LoadingSpinner />}>
            <UploadPictureForm user={user} />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary
          key={retryKey2}
          fallback={
            <SectionErrorFallback
              title="Failed to load user data"
              message="An error occurred while loading the user data."
              onRetry={() => setRetryKey2((prev) => prev + 1)}
            />
          }
        >
          <Suspense fallback={<LoadingSpinner />}>
            <UserImmutableData user={user} />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary
          key={retryKey3}
          fallback={
            <SectionErrorFallback
              title="Failed to load general info form"
              message="An error occurred while loading the general info form."
              onRetry={() => setRetryKey3((prev) => prev + 1)}
            />
          }
        >
          <Suspense fallback={<LoadingSpinner />}>
            <UserGeneralForm user={user} />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary
          key={retryKey4}
          fallback={
            <SectionErrorFallback
              title="Failed to load user address form"
              message="An error occurred while loading the user address form."
              onRetry={() => setRetryKey4((prev) => prev + 1)}
            />
          }
        >
          <Suspense fallback={<LoadingSpinner />}>
            <UserAddressForm user={user} />
          </Suspense>
        </ErrorBoundary>
      </section>
    </PageContent>
  );
};

export default ProfilePage;
