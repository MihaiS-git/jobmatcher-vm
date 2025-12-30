import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithReauth";
import type {
  PaymentDetailDTO,
  PaymentSummaryDTO,
  StripeCheckoutRequestDTO,
  StripeCheckoutResponseDTO,
} from "@/types/PaymentDTO";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Payment"],
  endpoints: (builder) => ({
    getAllPayments: builder.query<
      {
        content: PaymentSummaryDTO[];
        totalElements: number;
        totalPages: number;
      },
      {
        page?: number;
        size?: number;
        status?: string;
        searchTerm?: string;
        sort?: string[];
      }
    >({
      query: ({ sort, ...rest }) => ({
        url: "/payments",
        params: {
          ...rest,
          sort: sort ?? "paidAt,desc",
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map((payment) => ({
                type: "Payment" as const,
                id: payment.id,
              })),
              { type: "Payment", id: "LIST" },
            ]
          : [{ type: "Payment", id: "LIST" }],
      keepUnusedDataFor: 300,
    }),
    getPaymentById: builder.query<PaymentDetailDTO, string>({
      query: (payment: string) => ({
        url: `/payments/${payment}`,
      }),
      providesTags: (_result, _error, id) => [
        { type: "Payment", id },
        { type: "Payment", id: "LIST" },
      ],
      keepUnusedDataFor: 300,
    }),
    getPaymentByInvoiceId: builder.query<PaymentDetailDTO, string>({
      query: (invoiceId: string) => ({
        url: `/payments/invoice/${invoiceId}`,
      }),
      providesTags: (_result, _error, id) => [
        { type: "Payment", id },
        { type: "Payment", id: "LIST" },
      ],
      keepUnusedDataFor: 300,
    }),
    createStripeCheckout: builder.mutation<
      StripeCheckoutResponseDTO,
      StripeCheckoutRequestDTO
    >({
      query: (body) => ({
        url: "/payments/stripe/checkout",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetAllPaymentsQuery,
  useGetPaymentByIdQuery,
  useGetPaymentByInvoiceIdQuery,
  useCreateStripeCheckoutMutation,
} = paymentApi;
