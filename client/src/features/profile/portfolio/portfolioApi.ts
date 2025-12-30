import { baseQueryWithReauth } from "@/features/baseQueryWithReauth";
import type {
  PortfolioItemDetailDTO,
  PortfolioItemRequestDTO,
  PortfolioItemSummaryDTO,
} from "@/types/PortfolioDTO";
import { createApi } from "@reduxjs/toolkit/query/react";

export const portfolioApi = createApi({
  reducerPath: "portfolioApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Portfolio"],
  endpoints: (builder) => ({
    getPortfolioItemsByProfileId: builder.query<
      PortfolioItemSummaryDTO[],
      string
    >({
      query: (profileId) => ({
        url: `/portfolio-items/freelancer/${profileId}`,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({
                type: "Portfolio" as const,
                id: item.id,
              })),
              { type: "Portfolio", id: "LIST" },
            ]
          : [{ type: "Portfolio", id: "LIST" }],
      keepUnusedDataFor: 300,
    }),
    getPortfolioItemById: builder.query<PortfolioItemDetailDTO, string>({
      query: (id) => ({
        url: `/portfolio-items/${id}`,
      }),
      providesTags: (_result, _error, id) => [{ type: "Portfolio", id }],
      keepUnusedDataFor: 300,
    }),
    addPortfolioItem: builder.mutation<
      PortfolioItemDetailDTO,
      PortfolioItemRequestDTO
    >({
      query: (newItem) => ({
        url: "/portfolio-items",
        method: "POST",
        body: newItem,
      }),
      invalidatesTags: [{ type: "Portfolio", id: "LIST" }],
    }),
    updatePortfolioItem: builder.mutation<
      PortfolioItemDetailDTO,
      { id: string; data: PortfolioItemRequestDTO }
    >({
      query: ({ id, data }) => ({
        url: `/portfolio-items/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Portfolio", id },
        { type: "Portfolio", id: "LIST" },
      ],
    }),
    deletePortfolioItem: builder.mutation<void, string>({
      query: (id) => ({
        url: `/portfolio-items/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Portfolio", id },
        { type: "Portfolio", id: "LIST" },
      ],
    }),
    uploadPortfolioItemImages: builder.mutation<
      PortfolioItemDetailDTO,
      { portfolioItemId: string; userId: string; files: File[] }
    >({
      query: ({ portfolioItemId, userId, files }) => {
        const formData = new FormData();
        formData.append("userId", userId); // Include userId
        files.forEach((file) => formData.append("files", file));
        return {
          url: `/portfolio-items/images/upload/${portfolioItemId}`,
          method: "PATCH",
          body: formData,
          headers: {
            // browser sets proper multipart boundary automatically
            "Content-Type": undefined,
          },
        };
      },
      invalidatesTags: (_result, _error, { portfolioItemId }) => [
        { type: "Portfolio", id: portfolioItemId },
        { type: "Portfolio", id: "LIST" },
      ],
    }),
    removePortfolioItemImage: builder.mutation<
      PortfolioItemDetailDTO,
      { portfolioItemId: string; imageUrl: string }
    >({
      query: ({ portfolioItemId, imageUrl }) => ({
        url: `/portfolio-items/images/remove/${portfolioItemId}`,
        method: "PATCH",
        body: imageUrl,
      }),
      invalidatesTags: (_result, _error, { portfolioItemId }) => [
        { type: "Portfolio", id: portfolioItemId },
        { type: "Portfolio", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetPortfolioItemsByProfileIdQuery,
  useGetPortfolioItemByIdQuery,
  useAddPortfolioItemMutation,
  useUpdatePortfolioItemMutation,
  useDeletePortfolioItemMutation,
  useUploadPortfolioItemImagesMutation,
  useRemovePortfolioItemImageMutation
} = portfolioApi;
