import { useGetAllPaymentsQuery } from "@/features/payment/paymentApi";
import { PaymentStatusLabels } from "@/types/formLabels/proposalLabels";
import { PaymentStatus } from "@/types/ProposalDTO";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import SortButton from "../PaymentsSortButton";
import {
  ArrowDownAZ,
  ArrowDownNarrowWide,
  ArrowUpAZ,
  ArrowUpNarrowWide,
} from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { debounce } from "lodash";

const PaymentsList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTermInput, setSearchTermInput] = useState(
    searchParams.get("searchTerm") ?? ""
  );

  const debouncedSearch = useRef(
    debounce((term: string) => updateSearchParams({ searchTerm: term }), 500)
  ).current;

  const page = Number(searchParams.get("page") ?? 0);
  const size = Number(searchParams.get("size") ?? 10);

  const status = (searchParams.get("status") as PaymentStatus) ?? "";
  const searchTerm = searchParams.get("searchTerm") ?? "";

  const sortColumns = ["amount", "status", "paidAt"] as const;

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
    data: payments,
    isLoading: isLoadingPayments,
    error: paymentsError,
  } = useGetAllPaymentsQuery({
    page,
    size,
    status,
    searchTerm,
    sort: sortArray,
  });

  type PaymentsListSearchParams = {
    page?: number;
    size?: number;
    status?: PaymentStatus | "";
    searchTerm?: string;
    sortState?: typeof sortState;
  };

  const updateSearchParams = (newParams: PaymentsListSearchParams) => {
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
    setSearchTermInput("");
  };

  const toggleSort = (
    column: keyof typeof sortState,
    direction: "asc" | "desc"
  ) => {
    const current = sortState[column];
    const next = current === direction ? null : direction;

    // Only keep clicked column
    const newSortState: typeof sortState = {
      amount: null,
      status: null,
      paidAt: null,
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

  // Initialize search params on first render
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

  const navigateToPayment = (id: string) => {
    navigate(`/payments/${id}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTermInput(value);
    debouncedSearch(value); // automatically fires 500ms after last keystroke
  };

  return (
    <div className="flex flex-col items-center p-0 m-0 w-full gap-2">
      <section className="w-full bg-gray-200 dark:bg-gray-900 p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2 w-full">
          <fieldset className="flex flex-col gap-1 border border-gray-900 dark:border-gray-700 p-2 rounded">
            <legend className="text-xs px-1">General</legend>
            <div className="flex flex-col">
              <label htmlFor="searchTerm" className="text-sm">
                Search by Invoice ID:
              </label>
              <input
                value={searchTermInput}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    updateSearchParams({ searchTerm: searchTermInput });
                }}
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
            <legend className="text-xs px-1">Payment</legend>
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
                      ? (e.target.value as PaymentStatus)
                      : "",
                  })
                }
                className="bg-white border border-gray-600 text-gray-950 py-1 px-2 rounded flex-1 cursor-pointer"
                value={status ?? ""}
              >
                <option value={""}>All Statuses</option>
                {Object.values(PaymentStatus).map((status) => (
                  <option key={status} value={status}>
                    {PaymentStatusLabels[status]}
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
      {isLoadingPayments && <LoadingSpinner fullScreen={false} size={24} />}
      {payments && !isLoadingPayments && !paymentsError && (
        <section className="w-full overflow-x-auto 2xl:overflow-x-visible">
          <table className="w-full p-4 bg-gray-200 dark:bg-gray-900 border-collapse border border-gray-400 table-fixed text-xs min-w-[1100px]">
            <thead>
              <tr className="bg-gray-300 dark:bg-gray-800">
                <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-left relative border border-gray-400">
                  <div className="flex items-center justify-between">
                    <span className="flex-1 text-center">No.crt.</span>
                  </div>
                </th>
                <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-left relative border border-gray-400">
                  <div className="flex items-center justify-between">
                    <span className="flex-1 text-center">Payment ID</span>
                  </div>
                </th>
                <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-left relative border border-gray-400">
                  <div className="flex items-center justify-between">
                    <span className="flex-1 text-center">Contract ID</span>
                  </div>
                </th>
                <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-left relative border border-gray-400">
                  <div className="flex items-center justify-between">
                    <span className="flex-1 text-center">Milestone ID</span>
                  </div>
                </th>
                <th className="py-2 px-2 max-w-[150px] overflow-hidden whitespace-nowrap text-left relative border border-gray-400">
                  <div className="flex items-center justify-between">
                    <span className="flex-1 text-center">Invoice ID</span>
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
                    <span className="flex-1 text-center">Paid at</span>
                    <div className="flex gap-1">
                      <SortButton
                        column="paidAt"
                        direction="asc"
                        sortState={sortState}
                        toggleSort={toggleSort}
                        icon={ArrowDownNarrowWide}
                      />
                      <SortButton
                        column="paidAt"
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
            <tbody className="text-center gap-2 p-2">
              {payments.content.map((payment, index) => (
                <tr
                  key={payment.id}
                  className="h-15 bg-gray-200 dark:bg-gray-700 border-1 border-gray-300 dark:border-gray-600 items-center justify-items-center hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer"
                  onClick={() => navigateToPayment(payment.id)}
                >
                  <td className="border border-gray-400">{index + 1}</td>

                  <td className="border border-gray-400">{payment.id}</td>
                  <td className="border border-gray-400">
                    {payment.contract.id}
                  </td>
                  <td className="border border-gray-400">
                    {payment.milestone ? payment.milestone.id : "N/A"}
                  </td>
                  <td className="border border-gray-400">
                    {payment.invoice.id}
                  </td>
                  <td className="border border-gray-400">
                    {formatCurrency(Number(payment.amount))}
                  </td>
                  <td className="border border-gray-400">
                    {PaymentStatusLabels[payment.status]}
                  </td>
                  <td className="border border-gray-400">
                    {formatDate(new Date(payment.paidAt))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
};

export default PaymentsList;
