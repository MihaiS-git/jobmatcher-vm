import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithReauth";
import type {
  InvoiceDetailDTO,
  InvoiceRequestDTO,
  InvoiceSummaryDTO,
} from "@/types/InvoiceDTO";

export const invoiceApi = createApi({
  reducerPath: "invoiceApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Invoice"],
  endpoints: (builder) => ({
    getAllInvoices: builder.query<
      {
        content: InvoiceSummaryDTO[];
        totalElements: number;
        totalPages: number;
      },
      {
        page?: number;
        size?: number;
        contractId?: string;
        status?: string;
        searchTerm?: string;
        sort?: string[];
      }
    >({
      query: ({ sort, ...rest }) => ({
        url: "/invoices",
        params: {
          ...rest,
          sort: sort ?? "lastUpdate,desc",
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map((invoice) => ({
                type: "Invoice" as const,
                id: invoice.id,
              })),
              { type: "Invoice", id: "LIST" },
            ]
          : [{ type: "Invoice", id: "LIST" }],
      keepUnusedDataFor: 300,
    }),
    getInvoiceById: builder.query<InvoiceDetailDTO, string>({
      query: (id: string) => ({
        url: `/invoices/${id}`,
      }),
      providesTags: (_result, _error, id) => [
        { type: "Invoice", id },
        { type: "Invoice", id: "LIST" },
      ],
      keepUnusedDataFor: 300,
    }),
    createInvoice: builder.mutation<InvoiceDetailDTO, InvoiceRequestDTO>({
      query: (invoice) => ({
        url: "/invoices",
        method: "POST",
        body: invoice,
      }),
      invalidatesTags: [{ type: "Invoice", id: "LIST" }],
    }),
    deleteInvoiceById: builder.mutation<
      { success: boolean; id: string },
      string
    >({
      query: (id) => ({
        url: `/invoices/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Invoice", id: "LIST" },
        { type: "Invoice", id },
      ],
    }),
  }),
});

export const {
  useGetAllInvoicesQuery,
  useGetInvoiceByIdQuery,
  useCreateInvoiceMutation,
  useDeleteInvoiceByIdMutation,
} = invoiceApi;
