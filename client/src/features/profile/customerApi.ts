import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithReauth";
import type {
  CustomerDetailDTO,
  CustomerProfileRequestDTO,
  CustomerSummaryDTO,
} from "../../types/CustomerDTO";


export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Customer"],
  endpoints: (builder) => ({
    getAllCustomers: builder.query<
       CustomerSummaryDTO[],
      void
    >({
      query: () => ({
        url: "/profiles/customers",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((f) => ({
                type: "Customer" as const,
                id: f.profileId,
              })),
              { type: "Customer", id: "LIST" },
            ]
          : [{ type: "Customer", id: "LIST" }],
      keepUnusedDataFor: 300,
    }),
    getCustomerById: builder.query<CustomerDetailDTO, string>({
      query: (id) => ({
        url: `/profiles/customers/${id}`,
      }),
      providesTags: (_result, _error, id) => [{ type: "Customer", id }],
      keepUnusedDataFor: 300,
    }),
    getCustomerByUserId: builder.query<CustomerDetailDTO, string>({
      query: (userId) => ({
        url: `/profiles/customers/users/${userId}`,
      }),
      providesTags: (_result, _error, userId) => [{ type: "Customer", id: userId }],
      keepUnusedDataFor: 300,
    }),
    saveCustomer: builder.mutation<
      CustomerDetailDTO,
      CustomerProfileRequestDTO
    >({
      query: (data: CustomerProfileRequestDTO) => ({
        url: "/profiles/customers",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: "Customer", id: userId },
        { type: "Customer", id: "LIST" },
        ],
    }),
    updateCustomer: builder.mutation<
      CustomerDetailDTO,
      { id: string; data: CustomerProfileRequestDTO }
    >({
      query: ({ id, data }) => ({
        url: `/profiles/customers/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id, data }) => [
        { type: "Customer", id },
        { type: "Customer", id: data.userId }, 
        { type: "Customer", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllCustomersQuery,
  useGetCustomerByIdQuery,
  useGetCustomerByUserIdQuery,
  useSaveCustomerMutation,
  useUpdateCustomerMutation,
} = customerApi;
