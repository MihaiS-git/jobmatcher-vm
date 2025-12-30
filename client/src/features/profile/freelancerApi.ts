import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithReauth";
import type {
  FreelancerDetailDTO,
  FreelancerProfileRequestDTO,
  FreelancerSummaryDTO,
} from "@/types/FreelancerDTO";

export const freelancerApi = createApi({
  reducerPath: "freelancerApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Freelancer"],
  endpoints: (builder) => ({
    getAllFreelancers: builder.query<
       FreelancerSummaryDTO[],
      void
    >({
      query: () => ({
        url: "/profiles/freelancers",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((f) => ({
                type: "Freelancer" as const,
                id: f.profileId,
              })),
              { type: "Freelancer", id: "LIST" },
            ]
          : [{ type: "Freelancer", id: "LIST" }],
      keepUnusedDataFor: 300,
    }),
    getFreelancerById: builder.query<FreelancerDetailDTO, string>({
      query: (id) => ({
        url: `/profiles/freelancers/${id}`,
      }),
      providesTags: (_result, _error, id) => [{ type: "Freelancer", id }],
      keepUnusedDataFor: 300,
    }),
    getFreelancerByUserId: builder.query<FreelancerDetailDTO, string>({
      query: (userId) => ({
        url: `/profiles/freelancers/users/${userId}`,
      }),
      providesTags: (_result, _error, userId) => [{ type: "Freelancer", id: userId }],
      keepUnusedDataFor: 300,
    }),
    saveFreelancer: builder.mutation<
      FreelancerDetailDTO,
      FreelancerProfileRequestDTO
    >({
      query: (data: FreelancerProfileRequestDTO) => ({
        url: "/profiles/freelancers",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: "Freelancer", id: "LIST" },
        { type: "Freelancer", id: userId },
      ],
    }),
    updateFreelancer: builder.mutation<
      FreelancerDetailDTO,
      { id: string; data: FreelancerProfileRequestDTO }
    >({
      query: ({ id, data }) => ({
        url: `/profiles/freelancers/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id, data }) => [
        { type: "Freelancer", id },
        { type: "Freelancer", id: data.userId }, 
        { type: "Freelancer", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllFreelancersQuery,
  useGetFreelancerByIdQuery,
  useGetFreelancerByUserIdQuery,
  useSaveFreelancerMutation,
  useUpdateFreelancerMutation,
} = freelancerApi;
