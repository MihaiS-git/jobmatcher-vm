import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithReauth";
import type { JobCategoryDTO } from "@/types/JobCategoryDTO";

export const jobCategoriesApi = createApi({
  reducerPath: "jobCategoriesApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["JobCategory"],
  endpoints: (builder) => ({
    getAllJobCategories: builder.query<JobCategoryDTO[], void>({
      query: () => ({ url: "/job_categories" }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((jc) => ({
                type: "JobCategory" as const,
                id: jc.id,
              })),
              { type: "JobCategory", id: "LIST" },
            ]
          : [{ type: "JobCategory", id: "LIST" }],
      keepUnusedDataFor: 300,
    }),
  }),
});

export const { useGetAllJobCategoriesQuery } = jobCategoriesApi;

