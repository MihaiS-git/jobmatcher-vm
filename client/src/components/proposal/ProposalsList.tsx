import { useGetAllProposalsByProjectIdQuery } from "@/features/proposal/proposalApi";
import { ProposalStatusLabels } from "@/types/formLabels/proposalLabels";
import { ProposalStatus } from "@/types/ProposalDTO";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import SortButton from "../ProposalsSortButton";
import {
  ArrowDownAZ,
  ArrowDownNarrowWide,
  ArrowUpAZ,
  ArrowUpNarrowWide,
} from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";

const ProposalsList = ({ projectId }: { projectId: string }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? 0);
  const size = Number(searchParams.get("size") ?? 10);
  const status = searchParams.get("status") ?? "";

  const sortStateDefaultValues: Record<
    | "freelancer"
    | "amount"
    | "estimatedDuration"
    | "status"
    | "plannedStartDate"
    | "lastUpdate",
    "asc" | "desc" | null
  > = {
    freelancer: null,
    amount: null,
    estimatedDuration: null,
    status: null,
    plannedStartDate: null,
    lastUpdate: null,
  };
  const sortParam = searchParams.getAll("sort");
  const sortState: Record<
    keyof typeof sortStateDefaultValues,
    "asc" | "desc" | null
  > = {
    ...sortStateDefaultValues,
  };
  sortParam.forEach((s) => {
    const [col, dir] = s.split(",");
    if (col in sortState && (dir === "asc" || dir === "desc")) {
      sortState[col as keyof typeof sortState] = dir;
    }
  });
  const sortArray = Object.entries(sortState)
    .filter(([, dir]) => dir != null)
    .map(([col, dir]) => `${col},${dir}`);

  const {
    data: proposals,
    isLoading,
    isError,
  } = useGetAllProposalsByProjectIdQuery({
    projectId,
    page,
    size,
    status,
    sort: sortArray,
  });

  type ProposalListSearchParams = {
    page?: number;
    size?: number;
    status?: string;
    sortState?: Record<string, "asc" | "desc" | null>;
  };

  const updateSearchParams = (newParams: ProposalListSearchParams) => {
    const params: Record<string, string | string[]> = {
      page: String(newParams.page ?? page),
      size: String(newParams.size ?? size),
    };

    if (newParams.status !== undefined) {
      if (newParams.status === "") {
        delete params.status;
      } else {
        params.status = newParams.status;
      }
    } else if (status) params.status = status;

    // Sorting single column at a time
    const mergedSort = newParams.sortState ?? sortState;
    const sortParams: string[] = [];
    for (const [col, dir] of Object.entries(mergedSort)) {
      if (dir) {
        sortParams.push(`${col},${dir}`);
        break; // only one sort at a time
      }
    }
    if (sortParams.length > 0) params.sort = sortParams;

    setSearchParams(params);
  };

  const handleResetFilters = () => {
    updateSearchParams({
      page: 0,
      size: 10,
      status: "",
      sortState: { ...sortStateDefaultValues },
    });
  };

  const toggleSort = (
    column: keyof typeof sortStateDefaultValues,
    direction: "asc" | "desc"
  ) => {
    const current = sortState[column];
    const next = current === direction ? null : direction;

    const newSortState: typeof sortState = {
      freelancer: null,
      amount: null,
      estimatedDuration: null,
      status: null,
      plannedStartDate: null,
      lastUpdate: null,
      [column]: next,
    };

    updateSearchParams({ page: 0, sortState: newSortState });
  };

  useEffect(() => {
    updateSearchParams({ page, size, status, sortState });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleProposalClick(id: string) {
    navigate(`/proposals/${id}`);
  }

  return (
    <>
      <div className="flex flex-col items-center p-0 m-0 w-full gap-2">
        <section className="w-full bg-gray-200 dark:bg-gray-900 p-2">
          <div className="gap-4 p-2 w-full">
            <fieldset className="flex flex-row gap-4 border border-gray-900 dark:border-gray-700 p-2 rounded">
              <div className="flex flex-col">
                <label htmlFor="size" className="text-sm">
                  Page size:
                </label>
                <select
                  name="size"
                  id="size"
                  value={size}
                  onChange={(e) =>
                    updateSearchParams({ size: Number(e.target.value) })
                  }
                  className="bg-white border border-gray-600 text-gray-950 py-1 px-2 rounded flex-1 cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="status" className="text-sm">
                  Status:
                </label>
                <select
                  name="status"
                  id="status"
                  onChange={(e) =>
                    updateSearchParams({
                      status: e.target.value
                        ? (e.target.value as ProposalStatus)
                        : "",
                    })
                  }
                  className="bg-white border border-gray-600 text-gray-950 py-1 px-2 rounded flex-1 cursor-pointer"
                  value={status ?? ""}
                >
                  <option value={""}>All Statuses</option>

                  {Object.values(ProposalStatus).map((status) => (
                    <option key={status} value={status}>
                      {ProposalStatusLabels[status]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-end flex-1">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded py-1 px-4 cursor-pointer text-sm min-w-[200px]"
                >
                  Reset filters
                </button>
              </div>
            </fieldset>
          </div>
        </section>
      </div>

      <section className="w-full overflow-x-auto 2xl:overflow-x-visible">
        <table className="w-full p-4 bg-gray-200 dark:bg-gray-900 border-collapse border border-gray-400 table-fixed text-xs min-w-[1100px]">
          <thead>
            <tr className="bg-gray-300 dark:bg-gray-800">
              <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-center relative border border-gray-400">
                <span className="flex-1 text-center">No.crt.</span>
              </th>
              <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-left relative border border-gray-400">
                <div className="flex items-center justify-between">
                  <span className="flex-1 text-center">Freelancer</span>
                  <div className="flex gap-1">
                    <SortButton
                      column="freelancer"
                      direction="asc"
                      sortState={sortState}
                      toggleSort={toggleSort}
                      icon={ArrowDownAZ}
                    />
                    <SortButton
                      column="freelancer"
                      direction="desc"
                      sortState={sortState}
                      toggleSort={toggleSort}
                      icon={ArrowUpAZ}
                    />
                  </div>
                </div>
              </th>
              <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-left relative border border-gray-400">
                <div className="flex items-center justify-between">
                  <span className="flex-1 text-center">
                    Proposed
                    <br /> amount
                  </span>
                  <div className="flex gap-1">
                    <SortButton
                      column="amount"
                      direction="asc"
                      sortState={sortState}
                      toggleSort={toggleSort}
                      icon={ArrowDownNarrowWide}
                    />
                    <SortButton
                      column="amount"
                      direction="desc"
                      sortState={sortState}
                      toggleSort={toggleSort}
                      icon={ArrowUpNarrowWide}
                    />
                  </div>
                </div>
              </th>
              <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-left relative border border-gray-400">
                <div className="flex items-center justify-between">
                  <span className="flex-1 text-center">
                    Duration
                    <br />
                    (in days)
                  </span>
                  <div className="flex gap-1">
                    <SortButton
                      column="estimatedDuration"
                      direction="asc"
                      sortState={sortState}
                      toggleSort={toggleSort}
                      icon={ArrowDownNarrowWide}
                    />
                    <SortButton
                      column="estimatedDuration"
                      direction="desc"
                      sortState={sortState}
                      toggleSort={toggleSort}
                      icon={ArrowUpNarrowWide}
                    />
                  </div>
                </div>
              </th>
              <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-left relative border border-gray-400">
                <div className="flex items-center justify-between">
                  <span className="flex-1 text-center">Status</span>
                  <div className="flex gap-1">
                    <SortButton
                      column="status"
                      direction="asc"
                      sortState={sortState}
                      toggleSort={toggleSort}
                      icon={ArrowDownNarrowWide}
                    />
                    <SortButton
                      column="status"
                      direction="desc"
                      sortState={sortState}
                      toggleSort={toggleSort}
                      icon={ArrowUpNarrowWide}
                    />
                  </div>
                </div>
              </th>
              <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-left relative border border-gray-400">
                <div className="flex items-center justify-between">
                  <span className="flex-1 text-center">Planned Start</span>
                  <div className="flex gap-1">
                    <SortButton
                      column="plannedStartDate"
                      direction="asc"
                      sortState={sortState}
                      toggleSort={toggleSort}
                      icon={ArrowDownNarrowWide}
                    />
                    <SortButton
                      column="plannedStartDate"
                      direction="desc"
                      sortState={sortState}
                      toggleSort={toggleSort}
                      icon={ArrowUpNarrowWide}
                    />
                  </div>
                </div>
              </th>
              <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-left relative border border-gray-400">
                <div className="flex items-center justify-between">
                  <span className="flex-1 text-center">Last Update</span>
                  <div className="flex gap-1">
                    <SortButton
                      column="lastUpdate"
                      direction="asc"
                      sortState={sortState}
                      toggleSort={toggleSort}
                      icon={ArrowDownNarrowWide}
                    />
                    <SortButton
                      column="lastUpdate"
                      direction="desc"
                      sortState={sortState}
                      toggleSort={toggleSort}
                      icon={ArrowUpNarrowWide}
                    />
                  </div>
                </div>
              </th>
            </tr>
          </thead>

          {isLoading && (
            <tbody>
              <tr>
                <td colSpan={7} className="p-4 text-center">
                  <LoadingSpinner fullScreen={false} size={24} />
                </td>
              </tr>
            </tbody>
          )}

          {isError && (
            <tbody>
              <tr>
                <td colSpan={7} className="p-4 text-center">
                  Error loading proposals.
                </td>
              </tr>
            </tbody>
          )}

          {proposals?.content.length === 0 && (
            <tbody>
              <tr>
                <td colSpan={7} className="p-4 text-center">
                  No proposals found for the current filter selection.
                </td>
              </tr>
            </tbody>
          )}

          <tbody className="text-center gap-2 p-2">
            {proposals?.content.map((proposal, index) => (
              <tr
                key={proposal.id}
                className="h-[40px] bg-gray-200 dark:bg-gray-700 border-1 border-gray-300 dark:border-gray-600 items-center justify-items-center hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer"
                onClick={() => handleProposalClick(proposal.id)}
              >
                <td className="truncate max-w-[110px] overflow-hidden whitespace-nowrap mx-auto">
                  {index + 1}
                </td>
                <td className="truncate max-w-[110px] overflow-hidden whitespace-nowrap mx-auto">
                  {proposal.freelancer.username}
                </td>
                <td className="truncate max-w-[110px] overflow-hidden whitespace-nowrap mx-auto">
                  {formatCurrency(Number(proposal.amount))}
                </td>
                <td className="truncate max-w-[110px] overflow-hidden whitespace-nowrap mx-auto">
                  {proposal.estimatedDuration}
                </td>
                <td className="truncate max-w-[110px] overflow-hidden whitespace-nowrap mx-auto">
                  {proposal.status
                    ? ProposalStatusLabels[proposal.status]
                    : "N/A"}
                </td>
                <td className="truncate max-w-[110px] overflow-hidden whitespace-nowrap mx-auto">
                  {proposal.plannedStartDate
                    ? formatDate(proposal.plannedStartDate)
                    : "N/A"}
                </td>
                <td className="truncate max-w-[110px] overflow-hidden whitespace-nowrap mx-auto">
                  {proposal.lastUpdate
                    ? formatDate(proposal.lastUpdate)
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default ProposalsList;
