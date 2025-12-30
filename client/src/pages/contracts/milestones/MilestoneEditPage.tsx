import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import SectionErrorFallback from "@/components/error/SectionErrorFallback";
import MilestonesEditForm from "@/components/forms/milestone/MilestonesEditForm";
import PageContent from "@/components/PageContent";
import PageTitle from "@/components/PageTitle";
import useAuth from "@/hooks/useAuth";
import type { Role } from "@/types/UserDTO";
import { useState } from "react";
import { useParams } from "react-router-dom";

const MilestoneEditPage = () => {
  const { contractId, milestoneId } = useParams();
  const [retryKey, setRetryKey] = useState(0);

  const auth = useAuth();
  const role = auth?.user?.role as Role;

  if (!contractId || !milestoneId) {
    return (
      <div className="text-red-500">Invalid contract ID or milestone ID.</div>
    );
  }

  return (
    <PageContent className="pb-16 px-4">
      <section
        className="flex flex-col items-center p-0 pt-4 pb-16 w-full"
        aria-labelledby="add-milestones-heading"
      >
        <PageTitle title="Edit Milestone" id="edit-milestone-heading" />

        <ErrorBoundary
          key={retryKey}
          fallback={
            <SectionErrorFallback
              title="Failed to load contracts list"
              message="An error occurred while loading the contracts list."
              onRetry={() => setRetryKey((prev) => prev + 1)}
            />
          }
        >
          <MilestonesEditForm
            milestoneId={milestoneId}
            role={role}
            contractId={contractId}
          />
        </ErrorBoundary>
      </section>
    </PageContent>
  );
};

export default MilestoneEditPage;
