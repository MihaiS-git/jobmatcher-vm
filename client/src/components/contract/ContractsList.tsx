import {
  useDeleteContractByIdMutation,
  useGetAllContractsQuery,
  useUpdateContractStatusByIdMutation,
} from "@/features/contracts/contractsApi";
import useAuth from "@/hooks/useAuth";
import {
  ContractStatus,
  type ContractStatusRequestDTO,
} from "@/types/ContractDTO";
import { ContractStatusLabels } from "@/types/formLabels/contractLabels";
import { parseApiError } from "@/utils/parseApiError";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import SortButton from "../ContractsSortButton";
import {
  ArrowDownAZ,
  ArrowDownNarrowWide,
  ArrowUpAZ,
  ArrowUpNarrowWide,
} from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { formatCurrency } from "@/utils/formatCurrency";
import PagePagination from "../PagePagination";

const ContractsList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const auth = useAuth();
  const role = auth?.user?.role;

  const page = Number(searchParams.get("page") ?? 0);
  const size = Number(searchParams.get("size") ?? 10);

  const status = (searchParams.get("status") as ContractStatus) ?? "";
  const searchTerm = searchParams.get("searchTerm") ?? "";

  const sortColumns = [
    "status",
    "amount",
    "startDate",
    "endDate",
  ] as const;

  const sortStateDefaultValues: Record<
    (typeof sortColumns)[number],
    "asc" | "desc" | null
  > = Object.fromEntries(sortColumns.map((col) => [col, null])) as Record<
    (typeof sortColumns)[number],
    "asc" | "desc" | null
  >;

  const sortParam = searchParams.getAll("sort");
  const sortState: Record<(typeof sortColumns)[number], "asc" | "desc" | null> =
    {
      ...sortStateDefaultValues,
    };

  sortParam.forEach((s) => {
    const [col, dir] = s.split(",");
    if (col in sortState && (dir === "asc" || dir === "desc")) {
      sortState[col as keyof typeof sortState] = dir;
    }
  });

  const sortArray = Object.entries(sortState)
    .filter(([, dir]) => dir !== null)
    .map(([col, dir]) => `${col},${dir}`);

  const {
    data: contracts,
    isLoading: isLoadingContracts,
    error: contractsError,
  } = useGetAllContractsQuery({
    page,
    size,
    status,
    searchTerm,
    sort: sortArray,
  });

  type ContractsListSearchParams = {
    page?: number;
    size?: number;
    status?: ContractStatus | "";
    searchTerm?: string;
    sortState?: typeof sortState;
  };

  const updateSearchParams = (newParams: ContractsListSearchParams) => {
    const params: Record<string, string | string[]> = {
      page: String(newParams.page ?? page),
      size: String(newParams.size ?? size),
      status: newParams.status ?? status,
      searchTerm: newParams.searchTerm ?? searchTerm,
    };

    // Single-column sort
    const mergedSort = newParams.sortState ?? sortState;
    const sortParams: string[] = [];
    for (const [col, dir] of Object.entries(mergedSort)) {
      if (dir) {
        sortParams.push(`${col},${dir}`);
        break; // only keep first sorted column
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
      searchTerm: "",
      sortState: { ...sortStateDefaultValues },
    });
  };

  const toggleSort = (
    column: keyof typeof sortState,
    direction: "asc" | "desc"
  ) => {
    const current = sortState[column];
    const next = current === direction ? null : direction;

    // Only keep clicked column
    const newSortState: typeof sortState = {
      status: null,
      amount: null,
      startDate: null,
      endDate: null,
      [column]: next,
    };

    updateSearchParams({
      page: 0,
      size,
      status,
      searchTerm,
      sortState: newSortState,
    });
  };

  useEffect(() => {
    updateSearchParams({
      page,
      size,
      status,
      searchTerm,
      sortState,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function navigateToContract(id: string) {
    navigate(`/contracts/${id}`);
  }

  const [deleteContract] = useDeleteContractByIdMutation();
  const [updateContractStatus] = useUpdateContractStatusByIdMutation();

  const handleDeleteContract = async (id: string): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this contract?"))
      return;
    if (!id) return;

    try {
      await deleteContract(id).unwrap();
    } catch (err: unknown) {
      alert("Failed to delete contract:" + parseApiError(err));
    }
  };

  const handleUpdateContractStatus = async (
    id: string,
    status: ContractStatusRequestDTO
  ): Promise<void> => {
    if (
      !window.confirm(
        "Are you sure you want to change the status of this contract?"
      )
    )
      return;
    if (!id) return;

    try {
      await updateContractStatus({ id, status }).unwrap();
    } catch (err: unknown) {
      alert("Failed to update contract status:" + parseApiError(err));
    }
  };

  return (
    <div className="flex flex-col items-center p-0 m-0 w-full gap-2">
      <section className="w-full bg-gray-200 dark:bg-gray-900 p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2 w-full">
          <fieldset className="flex flex-col gap-1 border border-gray-900 dark:border-gray-700 p-2 rounded">
            <legend className="text-xs px-1">General</legend>
            <div className="flex flex-col">
              <label htmlFor="searchTerm" className="text-sm">
                Search:
              </label>
              <input
                type="text"
                id="searchTerm"
                value={searchTerm}
                onChange={(e) =>
                  updateSearchParams({ searchTerm: e.target.value })
                }
                className="bg-white border border-gray-600 text-gray-950 py-1 px-2 rounded flex-1 cursor-auto"
              />
            </div>

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
          </fieldset>

          <fieldset className="flex flex-col gap-1 border border-gray-900 dark:border-gray-700 p-2 rounded">
            <legend className="text-xs px-1">Contract</legend>
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
                      ? (e.target.value as ContractStatus)
                      : "",
                  })
                }
                className="bg-white border border-gray-600 text-gray-950 py-1 px-2 rounded flex-1 cursor-pointer"
                value={status ?? ""}
              >
                <option value={""}>All Statuses</option>

                {Object.values(ContractStatus).map((status) => (
                  <option key={status} value={status}>
                    {ContractStatusLabels[status]}
                  </option>
                ))}
              </select>
            </div>
          </fieldset>
        </div>
        <div className="flex flex-row justify-center items-center gap-2 w-full">
          <button
            type="button"
            onClick={handleResetFilters}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded py-1 px-4 cursor-pointer text-sm min-w-[200px]"
          >
            Reset filters
          </button>
        </div>
      </section>

      {isLoadingContracts && <LoadingSpinner fullScreen={false} size={36} />}

      {contracts && contracts?.totalElements > 0 && !contractsError && (
        <section className="w-full overflow-x-auto 2xl:overflow-x-visible">
          <table className="w-full p-4 bg-gray-200 dark:bg-gray-900 border-collapse border border-gray-400 table-fixed text-xs min-w-[1100px]">
            <thead>
              <tr className="bg-gray-300 dark:bg-gray-800">
                <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-left relative border border-gray-400">
                  <div className="flex items-center justify-between">
                    <span className="flex-1 text-center">No.</span>
                  </div>
                </th>
                {role === "STAFF" && (
                  <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-left relative border border-gray-400">
                    <div className="flex items-center justify-between">
                      <span className="flex-1 text-center">Customer</span>
                    </div>
                  </th>
                )}
                {role === "CUSTOMER" && (
                  <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-left relative border border-gray-400">
                    <div className="flex items-center justify-between">
                      <span className="flex-1 text-center">Freelancer</span>
                    </div>
                  </th>
                )}
                <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-left relative border border-gray-400">
                  <div className="flex items-center justify-between">
                    <span className="flex-1 text-center">Status</span>
                    <div className="flex gap-1">
                      <SortButton
                        column="status"
                        direction="asc"
                        sortState={sortState}
                        toggleSort={toggleSort}
                        icon={ArrowDownAZ}
                      />
                      <SortButton
                        column="status"
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
                    <span className="flex-1 text-center">Title</span>
                  </div>
                </th>
                <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-left relative border border-gray-400">
                  <div className="flex items-center justify-between">
                    <span className="flex-1 text-center">Amount</span>
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
                    <span className="flex-1 text-center">Start Date</span>
                    <div className="flex gap-1">
                      <SortButton
                        column="startDate"
                        direction="asc"
                        sortState={sortState}
                        toggleSort={toggleSort}
                        icon={ArrowDownNarrowWide}
                      />
                      <SortButton
                        column="startDate"
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
                    <span className="flex-1 text-center">End Date</span>
                    <div className="flex gap-1">
                      <SortButton
                        column="endDate"
                        direction="asc"
                        sortState={sortState}
                        toggleSort={toggleSort}
                        icon={ArrowDownNarrowWide}
                      />
                      <SortButton
                        column="endDate"
                        direction="desc"
                        sortState={sortState}
                        toggleSort={toggleSort}
                        icon={ArrowUpNarrowWide}
                      />
                    </div>
                  </div>
                </th>
                <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-center relative border border-gray-400">
                  <div className="flex items-center justify-between">
                    <span className="flex-1 text-center">Actions</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="text-center gap-2 p-2">
              {contracts.content.map((contract, index) => (
                <tr
                  key={contract.id}
                  className="h-15 bg-gray-200 dark:bg-gray-700 border-1 border-gray-300 dark:border-gray-600 items-center justify-items-center hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer"
                  onClick={() => navigateToContract(contract.id)}
                >
                  <td className="border border-gray-400">{index + 1}</td>
                  {role === "STAFF" && (
                    <td className="border border-gray-400">
                      {contract.customerName}
                    </td>
                  )}
                  {role === "CUSTOMER" && (
                    <td className="border border-gray-400">
                      {contract.freelancerName}
                    </td>
                  )}
                  <td className="border border-gray-400">
                    {ContractStatusLabels[contract.status]}
                  </td>
                  <td className="border border-gray-400">{contract.title}</td>
                  <td className="border border-gray-400">
                    {formatCurrency(Number(contract.amount))}
                  </td>
                  <td className="border border-gray-400">
                    {formatDate(contract.startDate)}
                  </td>
                  <td className="border border-gray-400">
                    {formatDate(contract.endDate)}
                  </td>
                  <td className="border border-gray-400">
                    <div className="flex flex-col justify-center items-center gap-0.5 m-0.5 w-full">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteContract(contract.id);
                        }}
                        className="bg-red-500 hover:bg-red-600 disabled:bg-gray-500 disabled:text-gray-400 text-white text-xs rounded py-0.5 px-4 w-25 cursor-pointer"
                        disabled={[
                          "ACTIVE",
                          "CANCELED",
                          "COMPLETED",
                          "TERMINATED",
                        ].includes(contract.status ?? "")}
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateContractStatus(contract.id, {
                            status: ContractStatus.TERMINATED,
                          });
                        }}
                        className="bg-red-500 hover:bg-red-600 disabled:bg-gray-500 disabled:text-gray-400 text-white text-xs rounded py-0.5 px-4 w-25 cursor-pointer"
                        disabled={[
                          "CANCELED",
                          "COMPLETED",
                          "TERMINATED",
                        ].includes(contract.status ?? "")}
                      >
                        Terminate
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateContractStatus(contract.id, {
                            status: ContractStatus.CANCELLED,
                          });
                        }}
                        className="bg-red-500 hover:bg-red-600 disabled:bg-gray-500 disabled:text-gray-400 text-white text-xs rounded py-0.5 px-4 w-25 cursor-pointer"
                        disabled={[
                          "CANCELED",
                          "COMPLETED",
                          "TERMINATED",
                        ].includes(contract.status ?? "")}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateContractStatus(contract.id, {
                            status: ContractStatus.ON_HOLD,
                          });
                        }}
                        className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-500 disabled:text-gray-400 text-white text-xs rounded py-0.5 px-4 w-25 cursor-pointer"
                        disabled={[
                          "ON_HOLD",
                          "CANCELED",
                          "COMPLETED",
                          "TERMINATED",
                        ].includes(contract.status ?? "")}
                      >
                        On Hold
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateContractStatus(contract.id, {
                            status: ContractStatus.ACTIVE,
                          });
                        }}
                        className="bg-green-700 hover:bg-green-600 disabled:bg-gray-500 disabled:text-gray-400 text-white text-xs rounded py-0.5 px-4 w-25 cursor-pointer"
                        disabled={[
                          "ACTIVE",
                          "CANCELED",
                          "COMPLETED",
                          "TERMINATED",
                        ].includes(contract.status ?? "")}
                      >
                        Activate
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {contracts?.totalElements === 0 && !isLoadingContracts && (
                <tr className="w-full text-center mt-24 text-sm text-gray-500">
                  <td colSpan={8}>
                    No contracts found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div>
            <PagePagination
              currentPage={page}
              onPageChange={(newPage) => updateSearchParams({ page: newPage })}
              totalPages={contracts.totalPages}
              size={size}
              totalElements={contracts.totalElements}
            />
          </div>
        </section>
      )}
    </div>
  );
};

export default ContractsList;
