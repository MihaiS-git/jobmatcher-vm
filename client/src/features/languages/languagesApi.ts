import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithReauth";
import type { LanguageDTO } from "@/types/LanguageDTO";

export const languagesApi = createApi({
  reducerPath: "languagesApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Language"],
  endpoints: (builder) => ({
    getAllLanguages: builder.query<LanguageDTO[], void>({
      query: () => ({ url: "/languages" }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((l) => ({
                type: "Language" as const,
                id: l.id,
              })),
              { type: "Language", id: "LIST" },
            ]
          : [{ type: "Language", id: "LIST" }],
      keepUnusedDataFor: 300,
    }),
  }),
});

export const { useGetAllLanguagesQuery } = languagesApi;
