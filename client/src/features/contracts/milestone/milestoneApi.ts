import { baseQueryWithReauth } from "@/features/baseQueryWithReauth";
import type {
  MilestoneRequestDTO,
  MilestoneResponseDTO,
} from "@/types/MilestoneDTO";
import { createApi } from "@reduxjs/toolkit/query/react";

export const milestoneApi = createApi({
  reducerPath: "milestoneApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Milestone"],
  endpoints: (builder) => ({
    getMilestonesByContractId: builder.query<
      {
        content: MilestoneResponseDTO[];
        totalElements: number;
        totalPages: number;
      },
      {
        contractId: string;
        page?: number;
        size?: number;
        status?: string;
        sort?: string[];
      }
    >({
      query: ({ sort, ...rest}) => {
        const params = new URLSearchParams();

        Object.entries(rest).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== ""){
            params.append(key, String(value));
          }
        });

        // Handle sort as repeated params
        if(sort && sort?.length > 0){
          sort.forEach((s) => params.append("sort", s));
        } else {
          params.append("sort", "lastUpdate,desc"); // default
        }

        return {
          url: "/milestones",
          params,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.content.map((milestone) => ({
                type: "Milestone" as const,
                id: milestone.id,
              })),
              { type: "Milestone", id: "LIST" },
            ]
          : [{ type: "Milestone", id: "LIST" }],
      keepUnusedDataFor: 300,
    }),
    getMilestoneById: builder.query<MilestoneResponseDTO, string>({
      query: (id) => ({
        url: `/milestones/${id}`,
      }),
      providesTags: (_result, _error, id) => [{ type: "Milestone", id }],
      keepUnusedDataFor: 300,
    }),
    createMilestone: builder.mutation<
      MilestoneResponseDTO,
      MilestoneRequestDTO
    >({
      query: (milestone) => ({
        url: "/milestones",
        method: "POST",
        body: milestone,
      }),
      invalidatesTags: [{ type: "Milestone", id: "LIST" }],
    }),
    updateMilestoneById: builder.mutation<
      MilestoneResponseDTO,
      { id: string; updatedMilestone: Partial<MilestoneRequestDTO> }
    >({
      query: ({ id, updatedMilestone }) => ({
        url: `/milestones/${id}`,
        method: "PATCH",
        body: updatedMilestone,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Milestone", id },
        { type: "Milestone", id: "LIST" },
      ],
    }),
    deleteMilestoneById: builder.mutation<
      { success: boolean; id: string },
      string
    >({
      query: (id) => ({
        url: `/milestones/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Milestone", id },
        { type: "Milestone", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetMilestonesByContractIdQuery,
  useGetMilestoneByIdQuery,
  useCreateMilestoneMutation,
  useUpdateMilestoneByIdMutation,
  useDeleteMilestoneByIdMutation,
} = milestoneApi;
