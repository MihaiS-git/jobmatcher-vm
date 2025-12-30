import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithReauth";
import type {
  JobCompletionDTO,
  MonthlyEarningsDTO,
  SkillEarningsDTO,
  TopClientDTO,
} from "@/types/FreelancerAnalyticsTypes";

export const freelancerAnalyticsApi = createApi({
  reducerPath: "freelancerAnalyticsApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getFreelancerMonthlyEarnings: builder.query<MonthlyEarningsDTO[], string>({
      query: (freelancerId) =>
        `/freelancers/${freelancerId}/analytics/monthly-earnings`,
      keepUnusedDataFor: 300,
    }),
    getFreelancerJobCompletion: builder.query<JobCompletionDTO, string>({
      query: (freelancerId) =>
        `/freelancers/${freelancerId}/analytics/job-completion`,
        keepUnusedDataFor: 300,
    }),
    getFreelancerTopClients: builder.query<TopClientDTO[], string>({
      query: (freelancerId) =>
        `/freelancers/${freelancerId}/analytics/top-clients`,
      keepUnusedDataFor: 300,
    }),
    getFreelancerSkillEarnings: builder.query<SkillEarningsDTO[], string>({
      query: (freelancerId) =>
        `/freelancers/${freelancerId}/analytics/skill-earnings`,
      keepUnusedDataFor: 300,
    }),
  }),
});

export const {
  useGetFreelancerMonthlyEarningsQuery,
  useGetFreelancerJobCompletionQuery,
  useGetFreelancerTopClientsQuery,
  useGetFreelancerSkillEarningsQuery,
} = freelancerAnalyticsApi;
