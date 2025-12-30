import { createApi } from "@reduxjs/toolkit/query/react";
import type { AddressRequestDTO, UserRequestDTO, UserResponseDTO } from "../../types/UserDTO";
import { baseQueryWithReauth } from "../baseQueryWithReauth";

const BASE_URL = import.meta.env.VITE_BASE_URL!;

if (!BASE_URL) {
  throw new Error(
    "VITE_BASE_URL is not defined! Check your .env or deployment settings."
  );
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUserById: builder.query<UserResponseDTO, string>({
      query: (id) => ({
        url: `/users/${id}`,
      }),
      providesTags: (_result, _error, id) => [{ type: "User", id }],
      keepUnusedDataFor: 300,
    }),
    updateUserById: builder.mutation<UserResponseDTO, {id: string, data: Partial<UserRequestDTO>}>({
      query: ({id, data}) => ({
        url: `/users/update/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, {id}) => [
        {type: 'User', id},
        {type: 'User', id: "LIST"},
      ],
    }),
    updateAddressByUserId: builder.mutation<UserResponseDTO, {id: string, data: Partial<AddressRequestDTO>}>({
      query: ({id, data}) => ({
        url: `users/update/${id}/address`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, {id}) => [
        {type: 'User', id},
        {type: 'User', id: "LIST"},
      ],
    }),
    uploadProfilePicture: builder.mutation<{ imageUrl: string }, { id: string; file: File }>({
      query: ({id, file}) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: `users/${id}/profile_picture`,
          method: 'PATCH',
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),
  }),
});


export const {useGetUserByIdQuery, useUpdateUserByIdMutation, useUpdateAddressByUserIdMutation, useUploadProfilePictureMutation } = userApi;