import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import type { RootState } from "../store";
import type { AuthResponse } from "../types/AuthTypes";
import { clearCredentials, setCredentials } from "./authSlice";

const BASE_URL = import.meta.env.VITE_BASE_URL!;

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  Parameters<typeof baseQuery>[0],
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshToken = (api.getState() as RootState).auth.refreshToken;

    if (!refreshToken) {
      api.dispatch(clearCredentials());
      window.location.href = "/auth";
      return { error: { status: 401, data: "No refresh token - logged out" } };
    }

    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
        body: { refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const {
        token,
        refreshToken: newRefreshToken,
        user,
      } = refreshResult.data as AuthResponse;

      const updatedAuth: AuthResponse = {
        token,
        refreshToken: newRefreshToken,
        user,
      };

      // Update Redux store
      api.dispatch(setCredentials(updatedAuth));

      // Retry the original request with new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed – force logout
      api.dispatch(clearCredentials());
      window.location.href = "/auth";
    }
  }

  return result;
};
