import { useGetAllInvoicesQuery } from "@/features/invoices/invoiceApi";
import { InvoiceStatusLabels } from "@/types/formLabels/invoiceLabels";
import { InvoiceStatus } from "@/types/InvoiceDTO";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import {
  ArrowDownAZ,
  ArrowDownNarrowWide,
  ArrowUpAZ,
  ArrowUpNarrowWide,
} from "lucide-react";
import SortButton from "../InvoicesSortButton";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import PagePagination from "../PagePagination";

const InvoicesList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? 0);
  const size = Number(searchParams.get("size") ?? 10);

  const normalizeParam = (value: string | null) =>
    value && value !== "undefined" ? value : "";

  const contractId = normalizeParam(searchParams.get("contractId"));
  const status = normalizeParam(searchParams.get("status")) as
    | InvoiceStatus
    | "";
  const searchTerm = normalizeParam(searchParams.get("searchTerm"));

  const sortStateDefaultValues: Record<
    "contractId" | "amount" | "issuedAt" | "dueDate" | "status",
    "asc" | "desc" | null
  > = {
    contractId: null,
    amount: null,
    issuedAt: null,
    dueDate: null,
    status: null,
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
    .filter(([, dir]) => dir !== null)
    .map(([col, dir]) => `${col},${dir}`);

  const {
    data: invoices,
    isLoading: isLoadingInvoices,
    error: invoicesError,
  } = useGetAllInvoicesQuery({
    page,
    size,
    contractId,
    status,
    searchTerm,
    sort: sortArray,
  });

  type InvoicesListSearchParams = {
    page?: number;
    size?: number;
    contractId?: string;
    status?: InvoiceStatus | "";
    searchTerm?: string;
    sortState?: Record<string, "asc" | "desc" | null>;
  };

  const updateSearchParams = (newParams: InvoicesListSearchParams) => {
    const params: Record<string, string | string[]> = {
      page: String(newParams.page ?? page),
      size: String(newParams.size ?? size),
      contractId: newParams.contractId ?? contractId,
      status: newParams.status ?? status,
      searchTerm: newParams.searchTerm ?? searchTerm,
    };

    if (newParams.contractId === null) {
      delete params.contractId;
    } else {
      params.contractId = String(newParams.contractId);
    }

    if (newParams.status === null) {
      delete params.status;
    } else {
      params.status = String(newParams.status);
    }

    if (newParams.searchTerm === null) {
      delete params.searchTerm;
    } else {
      params.searchTerm = String(newParams.searchTerm);
    }

    // Sorting single-column
    const mergedSort = newParams.sortState ?? sortState;
    const sortParams: string[] = [];
    for (const [col, dir] of Object.entries(mergedSort)) {
      if (dir) {
        sortParams.push(`${col},${dir}`);
        break;
      }
    }
    if (sortParams.length > 0) params.sort = sortParams;

    setSearchParams(params);
  };

  const handleResetFilters = () => {
    updateSearchParams({
      page: 0,
      size: 10,
      contractId: "",
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
      contractId: null,
      amount: null,
      issuedAt: null,
      dueDate: null,
      status: null,
      [column]: next,
    };

    updateSearchParams({ page: 0, sortState: newSortState });
  };

  // Initialize search params on first render
  useEffect(() => {
    updateSearchParams({
      page,
      size,
      contractId,
      status,
      searchTerm,
      sortState,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigateToInvoice = (id: string) => {
    navigate(`/invoices/${id}`);
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
            <legend className="text-xs px-1">Invoice</legend>
            <div className="flex flex-col">
              <label htmlFor="contractId" className="text-sm">
                Contract:
              </label>
              <select
                name="contractId"
                id="contractId"
                onChange={(e) =>
                  updateSearchParams({
                    contractId: e.target.value
                      ? (e.target.value as string)
                      : "",
                  })
                }
                className="w-full max-w-full truncate text-ellipsis bg-white border border-gray-600 text-gray-950 py-1 px-2 rounded flex-1 cursor-pointer"
                value={contractId ?? ""}
              >
                <option value={""} className="text-xs">All Contracts</option>
                {invoices?.content
                  .map((inv) => inv.contract)
                  .filter(
                    (value, index, self) =>
                      index === self.findIndex((t) => t.id === value.id) // unique
                  )
                  .map((contract) => (
                    <option key={contract.id} value={contract.id} className="text-xs">
                      {contract.title.length > 50
                        ? contract.title.slice(0, 50) + "…"
                        : contract.title}
                    </option>
                  ))}
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
                      ? (e.target.value as InvoiceStatus)
                      : "",
                  })
                }
                className="bg-white border border-gray-600 text-gray-950 py-1 px-2 rounded flex-1 cursor-pointer"
                value={status ?? ""}
              >
                <option value={""}>All Statuses</option>
                {Object.values(InvoiceStatus).map((status) => (
                  <option key={status} value={status}>
                    {InvoiceStatusLabels[status]}
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
      {isLoadingInvoices && <LoadingSpinner fullScreen={false} size={24} />}
      {invoices && !isLoadingInvoices && !invoicesError && (
        <section className="w-full overflow-x-auto 2xl:overflow-x-visible">
          <table className="w-full p-4 bg-gray-200 dark:bg-gray-900 border-collapse border border-gray-400 table-fixed text-xs min-w-[1100px]">
            <thead>
              <tr className="bg-gray-300 dark:bg-gray-800">
                <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-left relative border border-gray-400">
                  <div className="flex items-center justify-between">
                    <span className="flex-1 text-center">No.</span>
                  </div>
                </th>
                <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-left relative border border-gray-400">
                  <div className="flex items-center justify-between">
                    <span className="flex-1 text-center">Contract</span>
                    <div className="flex gap-1">
                      <SortButton
                        column="contractId"
                        direction="asc"
                        sortState={sortState}
                        toggleSort={toggleSort}
                        icon={ArrowDownAZ}
                      />
                      <SortButton
                        column="contractId"
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
                    <span className="flex-1 text-center">Milestone</span>
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
                    <span className="flex-1 text-center">Issued at</span>
                    <div className="flex gap-1">
                      <SortButton
                        column="issuedAt"
                        direction="asc"
                        sortState={sortState}
                        toggleSort={toggleSort}
                        icon={ArrowDownNarrowWide}
                      />
                      <SortButton
                        column="issuedAt"
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
                    <span className="flex-1 text-center">Due date</span>
                    <div className="flex gap-1">
                      <SortButton
                        column="dueDate"
                        direction="asc"
                        sortState={sortState}
                        toggleSort={toggleSort}
                        icon={ArrowDownNarrowWide}
                      />
                      <SortButton
                        column="dueDate"
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
              </tr>
            </thead>
            <tbody className="text-center gap-2 p-2">
              {invoices.content.map((invoice, index) => (
                <tr
                  key={invoice.id}
                  className="h-15 bg-gray-200 dark:bg-gray-700 border-1 border-gray-300 dark:border-gray-600 items-center justify-items-center hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer"
                  onClick={() => navigateToInvoice(invoice.id)}
                >
                  <td className="border border-gray-400">{index + 1}</td>
                  <td className="border border-gray-400">
                    {invoice.contract.title}
                  </td>
                  <td className="border border-gray-400">
                    {invoice.milestone ? "True" : "False"}
                  </td>
                  <td className="border border-gray-400">
                    {formatCurrency(Number(invoice.amount))}
                  </td>
                  <td className="border border-gray-400">
                    {formatDate(invoice.issuedAt)}
                  </td>
                  <td className="border border-gray-400">
                    {formatDate(invoice.dueDate)}
                  </td>
                  <td className="border border-gray-400">
                    {InvoiceStatusLabels[invoice.status]}
                  </td>
                </tr>
              ))}
              {invoices?.totalElements === 0 && !isLoadingInvoices && (
                <tr className="w-full text-center mt-24 text-sm text-gray-500">
                  <td colSpan={8} className="p-4">
                    No invoices found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div>
            <PagePagination
              currentPage={page}
              onPageChange={(newPage) => updateSearchParams({ page: newPage })}
              totalPages={invoices.totalPages}
              size={size}
              totalElements={invoices.totalElements}
            />
          </div>
        </section>
      )}
    </div>
  );
};

export default InvoicesList;
