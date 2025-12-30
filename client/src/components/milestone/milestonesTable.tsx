import { useGetMilestonesByContractIdQuery } from "@/features/contracts/milestone/milestoneApi";
import type { MilestoneResponseDTO } from "@/types/MilestoneDTO";
import { formatDate } from "@/utils/formatDate";
import { parseApiError } from "@/utils/parseApiError";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import FeedbackMessage from "../FeedbackMessage";
import { MilestoneStatusLabels } from "@/types/formLabels/milestoneLabels";
import { PriorityLabels } from "@/types/formLabels/proposalLabels";

type MilestonesTableProps = {
  contractId: string;
};

const MilestonesTable = ({ contractId }: MilestonesTableProps) => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string>("");

  const {
    data: existentMilestones,
    isLoading: areMilestonesLoading,
    error: milestonesError,
  } = useGetMilestonesByContractIdQuery(
    { contractId: contractId as string, page: 0, size: 100 },
    { skip: !contractId }
  );

  useEffect(() => {
    if (milestonesError) {
      setApiError(parseApiError(milestonesError));
    }
  }, [milestonesError]);

  const handleMilestoneClick = (id: string): void => {
    navigate(`/contracts/${contractId}/milestones/${id}/edit`);
  };

  return (
    <section className="w-full overflow-x-auto 2xl:overflow-x-visible my-4 p-4">
      {existentMilestones && existentMilestones.totalElements > 0 && (
        <table className="w-full p-4 bg-gray-200 dark:bg-gray-900 border-collapse border border-gray-400 table-fixed text-xs min-w-[1100px] text-center [&_td]:align-middle [&_td]:text-center">
          <thead>
            <tr className="bg-gray-300 dark:bg-gray-800">
              <th className="py-2 px-2 max-w-[150px] border border-gray-400">
                Title
              </th>
              <th className="py-2 px-2 max-w-[150px] border border-gray-400">
                Description
              </th>
              <th className="py-2 px-2 max-w-[150px] border border-gray-400">
                Amount
              </th>
              <th className="py-2 px-2 max-w-[150px] border border-gray-400">
                Penalty Amount
              </th>
              <th className="py-2 px-2 max-w-[150px] border border-gray-400">
                Bonus Amount
              </th>
              <th className="py-2 px-2 max-w-[150px] border border-gray-400">
                Estimated Duration (days)
              </th>
              <th className="py-2 px-2 max-w-[150px] border border-gray-400">
                Status
              </th>
              <th className="py-2 px-2 max-w-[150px] border border-gray-400">
                Payment Status
              </th>
              <th className="py-2 px-2 max-w-[150px] border border-gray-400">
                Notes
              </th>
              <th className="py-2 px-2 max-w-[150px] border border-gray-400">
                Planned Start Date
              </th>
              <th className="py-2 px-2 max-w-[150px] border border-gray-400">
                Planned End Date
              </th>
              <th className="py-2 px-2 max-w-[150px] border border-gray-400">
                Actual Start Date
              </th>
              <th className="py-2 px-2 max-w-[150px] border border-gray-400">
                Actual End Date
              </th>
              <th className="py-2 px-2 max-w-[150px] border border-gray-400">
                Priority
              </th>
            </tr>
          </thead>
          <tbody>
            {areMilestonesLoading && (
              <LoadingSpinner fullScreen={false} size={24} />
            )}
            {milestonesError && (
              <FeedbackMessage
                id="existing-milestones-error"
                message={apiError}
                type="error"
              />
            )}
            {existentMilestones.content.length === 0 && (
              <tr>
                <td
                  colSpan={12}
                  className="border border-gray-300 p-2 text-center"
                >
                  No milestones found. Maybe add some.
                </td>
              </tr>
            )}
            {existentMilestones.content.map(
              (milestone: MilestoneResponseDTO) => (
                <tr
                  key={milestone.id}
                  className="h-[40px] bg-gray-200 dark:bg-gray-700 border-1 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer"
                  onClick={() => handleMilestoneClick(milestone.id)}
                >
                  <td className="border border-gray-300 p-2 truncate max-w-[150px]">
                    {milestone.title}
                  </td>
                  <td className="border border-gray-300 p-2 truncate max-w-[150px]">
                    {milestone.description}
                  </td>
                  <td className="border border-gray-300 p-2 truncate max-w-[150px]">
                    {milestone.amount}
                  </td>
                  <td className="border border-gray-300 p-2 truncate max-w-[150px]">
                    {milestone.penaltyAmount}
                  </td>
                  <td className="border border-gray-300 p-2 truncate max-w-[150px]">
                    {milestone.bonusAmount}
                  </td>
                  <td className="border border-gray-300 p-2 truncate max-w-[150px]">
                    {milestone.estimatedDuration}
                  </td>
                  <td className="border border-gray-300 p-2 truncate max-w-[150px]">
                    {MilestoneStatusLabels[milestone.status!]}
                  </td>
                  <td className="border border-gray-300 p-2 truncate max-w-[150px]">
                    {milestone.paymentId ? "Paid" : "Unpaid"}
                  </td>
                  <td className="border border-gray-300 p-2 truncate max-w-[150px]">
                    {milestone.notes}
                  </td>
                  <td className="border border-gray-300 p-2 truncate max-w-[150px]">
                    {milestone.plannedStartDate
                      ? formatDate(milestone.plannedStartDate)
                      : "N/A"}
                  </td>
                  <td className="border border-gray-300 p-2 truncate max-w-[150px]">
                    {milestone.plannedEndDate
                      ? formatDate(milestone.plannedEndDate)
                      : "N/A"}
                  </td>
                  <td className="border border-gray-300 p-2 truncate max-w-[150px]">
                    {milestone.actualStartDate
                      ? formatDate(milestone.actualStartDate)
                      : "N/A"}
                  </td>
                  <td className="border border-gray-300 p-2 truncate max-w-[150px]">
                    {milestone.actualEndDate
                      ? formatDate(milestone.actualEndDate)
                      : "N/A"}
                  </td>
                  <td className="border border-gray-300 p-2 truncate max-w-[150px]">
                    {PriorityLabels[milestone.priority!]}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default MilestonesTable;
