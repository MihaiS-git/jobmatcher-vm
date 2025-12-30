import {
  useGetProjectByIdQuery,
  useUpdateProjectStatusMutation,
} from "@/features/projects/projectsApi";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { toTitleCase } from "@/utils/stringEdit";
import { Button } from "../ui/button";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import ProposalsList from "../proposal/ProposalsList";
import LoadingSpinner from "../LoadingSpinner";
import { useGetFreelancerByUserIdQuery } from "@/features/profile/freelancerApi";
import { useGetProposalByFreelancerIdAndProjectIdQuery } from "@/features/proposal/proposalApi";
import useFreelancerId from "@/hooks/useFreelancerId";
import { ProjectStatus } from "@/types/ProjectDTO";
import { useEffect } from "react";

type ProjectDetailsProps = {
  projectId: string;
};

const ProjectDetails = ({ projectId }: ProjectDetailsProps) => {
  const navigate = useNavigate();
  const { data: project, isLoading, error } = useGetProjectByIdQuery(projectId);

  const auth = useAuth();
  const userId = auth?.user?.id;
  const role = auth?.user?.role;

  const {
    freelancerId,
    isLoading: freelancerLoading,
    error: freelancerError,
  } = useFreelancerId();

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useGetFreelancerByUserIdQuery(userId);

  const {
    data: existingProposal,
    isLoading: existingProposalLoading,
    error: existingProposalError,
  } = useGetProposalByFreelancerIdAndProjectIdQuery(
    freelancerId && projectId
      ? { freelancerId, projectId }
      : { freelancerId: "", projectId: "" }, // dummy value won't be used because skip=true
    { skip: !freelancerId || !projectId }
  );

  useEffect(() => {
    if (!existingProposal) {
      return;
    }
  }, [existingProposal]);

  const [updateProjectStatus, { isLoading: isUpdating }] =
    useUpdateProjectStatusMutation();

  const handleApply = () => {
    navigate(`/projects/${projectId}/proposals/new`);
  };

  const navigateToProposal = () => {
    navigate(`/proposals/${existingProposal?.id}`);
  };

  function navigateToContract(contractId: string): void {
    navigate(`/contracts/${contractId}`);
  }

  if (existingProposalLoading) {
    return <LoadingSpinner fullScreen={false} size={36} />;
  }

  if (freelancerLoading) {
    return <LoadingSpinner fullScreen={false} size={36} />;
  }

  if (existingProposalError) {
    return <div>Error loading existing proposal</div>;
  }

  if (freelancerError) {
    return <div>Error loading freelancer data</div>;
  }

  function handlePublishProject(): void {
    if (project?.id) {
      updateProjectStatus({
        id: project.id,
        data: { status: ProjectStatus.OPEN },
      });
    } else {
      console.error("Project ID is undefined.");
    }
  }

  return (
    <>
      <div className="max-w-4xl p-4 mb-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-md">
        <div className="space-y-2 m-4 w-full text-center border-b pb-4 font-bold text-xl">
          {isLoading && <LoadingSpinner fullScreen={false} size={24} />}
          {error && (
            <div>
              Error loading project details:{" "}
              {"status" in error
                ? typeof error.data === "string"
                  ? error.data
                  : JSON.stringify(error.data)
                : error.message || "Unknown error"}
            </div>
          )}
          <h2>
            <b>{project?.title}</b>{" "}
          </h2>
        </div>
        <div className="space-y-2 m-4 w-full text-center border-b pb-4 text-lg">
          <h3 className="text-sm">
            Posted by{" "}
            <NavLink
              to={`/public_profile/customer/${project?.customer?.profileId}`}
              className="text-blue-500 hover:underline"
            >
              <b>{project?.customer?.username}</b>
            </NavLink>{" "}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
          <div className="space-y-2 my-4">
            <p>
              <b>Category:</b> {project?.category?.name}
            </p>
            <p>
              <b>Subcategories:</b>{" "}
              {project?.subcategories?.map((sub) => sub.name).join(", ")}
            </p>
            <p>
              <b>Status:</b>{" "}
              {project?.status ? toTitleCase(project?.status) : "N/A"}
            </p>
          </div>
          <div className="space-y-2 my-4">
            <p>
              <b>Payment Type:</b>{" "}
              {project?.paymentType ? toTitleCase(project?.paymentType) : "N/A"}
            </p>
            <p>
              <b>Budget:</b>{" "}
              {project?.budget ? formatCurrency(project?.budget) : "N/A"}
            </p>
            <p>
              <b>Deadline:</b>{" "}
              {project?.deadline ? formatDate(project.deadline) : "N/A"}
            </p>
          </div>
        </div>
        <div className="space-y-2 my-4 w-full border-b pb-4">
          <p>
            <b>Description:</b> {project?.description}
          </p>
        </div>

        {role === "CUSTOMER" && project?.status === ProjectStatus.DRAFT && (
          <div className="space-y-2 my-4 w-full text-center">
            <Button
              variant="default"
              size="lg"
              onClick={() => handlePublishProject()}
            >
              Publish
            </Button>
          </div>
        )}

        {role === "STAFF" && !profileLoading && !profileError && !profile && (
          <div className="col-span-2 space-y-2 my-8 text-center">
            <p className="text-red-500">
              You need to create a profile before applying to projects.{" "}
            </p>
            <p>
              <Link to="/profile" className="text-blue-500 hover:underline">
                Create User Profile
              </Link>
            </p>
            <p>
              <Link
                to="/edit_public_profile"
                className="text-blue-500 hover:underline"
              >
                Create Public Profile
              </Link>
            </p>
          </div>
        )}

        <section className="col-span-2 space-y-2 my-4 text-center gap-2 flex justify-center">
          {role === "STAFF" && profile && (
            <Button
              variant="default"
              size="sm"
              onClick={existingProposal ? navigateToProposal : handleApply}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {existingProposal ? "View Proposal" : "Create Proposal"}
            </Button>
          )}

          {project?.contractId && (
            <Button
              variant="default"
              size="sm"
              onClick={() =>
                project?.contractId && navigateToContract(project.contractId)
              }
              className="bg-blue-500 hover:bg-blue-600 text-white"
              disabled={
                !project?.contractId ||
                isUpdating ||
                project?.status === ProjectStatus.DRAFT
              }
            >
              View Contract
            </Button>
          )}
        </section>
      </div>
      {role === "CUSTOMER" && <ProposalsList projectId={projectId} />}
    </>
  );
};

export default ProjectDetails;
