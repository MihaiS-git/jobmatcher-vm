import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithReauth";
import type {
  ProposalDetailDTO,
  ProposalRequestDTO,
  ProposalStatusRequestDTO,
  ProposalSummaryDTO,
} from "@/types/ProposalDTO";

export const proposalApi = createApi({
  reducerPath: "proposalApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Proposal"],
  endpoints: (builder) => ({
    getAllProposalsByProjectId: builder.query<
      {
        content: ProposalSummaryDTO[];
        totalElements: number;
        totalPages: number;
      },
      {
        projectId: string;
        page?: number;
        size?: number;
        status?: string;
        sort?: string[]; // <- single sort string like "title,asc"
      }
    >({
      query: ({ sort, ...rest }) => ({
        url: "/proposals",
        params: {
          ...rest,
          sort: sort ?? "lastUpdate,desc", // default if nothing selected
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map((proposal) => ({
                type: "Proposal" as const,
                id: proposal.id,
              })),
              { type: "Proposal", id: "LIST" },
            ]
          : [{ type: "Proposal", id: "LIST" }],
      keepUnusedDataFor: 300,
    }),
    getAllProposalsByFreelancerId: builder.query<
      {
        content: ProposalSummaryDTO[];
        totalElements: number;
        totalPages: number;
      },
      {
        freelancerId: string;
        page?: number;
        size?: number;
        status?: string;
        sort?: string[]; // <- single sort string like "title,asc"
      }
    >({
      query: ({ freelancerId, sort, ...rest }) => ({
        url: `/proposals/freelancer/${freelancerId}`,
        params: {
          ...rest,
          sort: sort ?? "lastUpdate,desc", // default if nothing selected
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map((proposal) => ({
                type: "Proposal" as const,
                id: proposal.id,
              })),
              { type: "Proposal", id: "LIST" },
            ]
          : [{ type: "Proposal", id: "LIST" }],
      keepUnusedDataFor: 300,
    }),
    getProposalById: builder.query<ProposalDetailDTO, string>({
      query: (id) => ({
        url: `/proposals/${id}`,
      }),
      providesTags: (_result, _error, id) => [{ type: "Proposal", id }],
      keepUnusedDataFor: 300,
    }),
    getProposalByFreelancerIdAndProjectId: builder.query<
      ProposalDetailDTO,
      { freelancerId: string; projectId: string }
    >({
      query: ({ freelancerId, projectId }) => ({
        url: `/proposals/by-freelancer-and-project?freelancerId=${freelancerId}&projectId=${projectId}`,
      }),
      providesTags: (_result, _error, { freelancerId, projectId }) => [
        { type: "Proposal", id: `${freelancerId}-${projectId}` },
      ],
      keepUnusedDataFor: 300,
    }),
    createProposal: builder.mutation<ProposalSummaryDTO, ProposalRequestDTO>({
      query: (newProposal) => ({
        url: "/proposals",
        method: "POST",
        body: newProposal,
      }),
      invalidatesTags: [{ type: "Proposal", id: "LIST" }],
    }),
    updateProposalById: builder.mutation<
      ProposalSummaryDTO,
      { id: string; updatedProposal: Partial<ProposalRequestDTO> }
    >({
      query: ({ id, updatedProposal }) => ({
        url: `/proposals/${id}`,
        method: "PATCH",
        body: updatedProposal,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Proposal", id },
        { type: "Proposal", id: "LIST" },
      ],
    }),
    updateProposalStatusById: builder.mutation<
      ProposalSummaryDTO,
      { id: string; updatedProposalStatus: ProposalStatusRequestDTO }
    >({
      query: ({ id, updatedProposalStatus }) => ({
        url: `/proposals/status/${id}`,
        method: "PATCH",
        body: updatedProposalStatus,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Proposal", id },
        { type: "Proposal", id: "LIST" },
      ],
    }),
    deleteProposalById: builder.mutation<
      { success: boolean; id: string },
      string
    >({
      query: (id) => ({
        url: `/proposals/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Proposal", id },
        { type: "Proposal", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllProposalsByProjectIdQuery,
  useGetProposalByIdQuery,
  useGetAllProposalsByFreelancerIdQuery,
  useGetProposalByFreelancerIdAndProjectIdQuery,
  useCreateProposalMutation,
  useUpdateProposalByIdMutation,
  useUpdateProposalStatusByIdMutation,
  useDeleteProposalByIdMutation,
} = proposalApi;
