import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithReauth";
import type {
  ContractDetailDTO,
  ContractStatusRequestDTO,
  ContractSummaryDTO,
} from "@/types/ContractDTO";

export const contractsApi = createApi({
  reducerPath: "contractsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Contract"],
  endpoints: (builder) => ({
    getAllContracts: builder.query<
      {
        content: ContractSummaryDTO[];
        totalElements: number;
        totalPages: number;
      },
      {
        page?: number;
        size?: number;
        customerName?: string;
        freelancerName?: string;
        status?: string;
        startDate?: string;
        endDate?: string;
        paymentType?: string;
        searchTerm?: string;
        sort?: string[];
      }
    >({
      query: ({ sort, ...rest }) => {
        const params = new URLSearchParams();

        Object.entries(rest).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, String(value));
          }
        });

        // Handle sort as repeated params
        if (sort && sort.length > 0) {
          sort.forEach((s) => params.append("sort", s));
        } else {
          params.append("sort", "lastUpdate,desc"); // default
        }

        return {
          url: "/contracts",
          params,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.content.map((contract) => ({
                type: "Contract" as const,
                id: contract.id,
              })),
              { type: "Contract", id: "LIST" },
            ]
          : [{ type: "Contract", id: "LIST" }],
      keepUnusedDataFor: 300,
    }),
    getContractById: builder.query<ContractDetailDTO, string>({
      query: (id: string) => ({
        url: `/contracts/${id}`,
      }),
      providesTags: (_result, _error, id) => [
        { type: "Contract", id },
        { type: "Contract", id: "LIST" },
      ],
      keepUnusedDataFor: 300,
    }),
    getContractByProjectId: builder.query<ContractDetailDTO, string>({
      query: (id: string) => ({
        url: `/contracts/project/${id}`,
      }),
      providesTags: (_result, _error, id) => [
        { type: "Contract", id },
        { type: "Contract", id: "LIST" },
      ],
      keepUnusedDataFor: 300,
    }),
    updateContractStatusById: builder.mutation<
      ContractDetailDTO,
      { id: string; status: ContractStatusRequestDTO }
    >({
      query: ({ id, status }) => ({
        url: `/contracts/status/${id}`,
        method: "PATCH",
        body: status,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Contract", id },
        { type: "Contract", id: "LIST" },
      ],
    }),
    deleteContractById: builder.mutation<void, string>({
      query: (id: string) => ({
        url: `/contracts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Contract", id },
        { type: "Contract", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllContractsQuery,
  useGetContractByIdQuery,
  useGetContractByProjectIdQuery,
  useUpdateContractStatusByIdMutation,
  useDeleteContractByIdMutation,
} = contractsApi;
