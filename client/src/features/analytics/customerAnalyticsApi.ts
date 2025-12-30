import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithReauth";
import type { MonthlySpendingDTO, ProjectStatsDTO, TopFreelancerDTO } from "@/types/CustomerAnalyticsTypes";

export const customerAnalyticsApi = createApi({
  reducerPath: "customerAnalyticsApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getMonthlySpending: builder.query<MonthlySpendingDTO[], string>({
      query: (customerId) =>
        `/customers/${customerId}/analytics/monthly-spending`,
      keepUnusedDataFor: 300,
    }),
    getProjectStats: builder.query<ProjectStatsDTO, string>({
      query: (customerId) => `/customers/${customerId}/analytics/project-stats`,
      keepUnusedDataFor: 300,
    }),
    getTopFreelancers: builder.query<TopFreelancerDTO[], string>({
      query: (customerId) =>
        `/customers/${customerId}/analytics/top-freelancers`,
      keepUnusedDataFor: 300,
    }),
  }),
});

export const {
    useGetMonthlySpendingQuery,
    useLazyGetMonthlySpendingQuery,
    useGetProjectStatsQuery,
    useLazyGetProjectStatsQuery,
    useGetTopFreelancersQuery,
    useLazyGetTopFreelancersQuery,
} = customerAnalyticsApi;
