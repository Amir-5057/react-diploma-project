import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  IGetUserResponse,
  ILoginUserPayload,
  ILoginUserResponse,
  IRegisterUserPayload,
  IRegisterUserResponse,
} from "./types";

export const baseUrl = "http://161.35.153.209:5430/api"

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    getUser: builder.query<IGetUserResponse, string>({
      query: (user_id) => `/user?user_id=${user_id}`,
    }),
    loginUser: builder.mutation<ILoginUserResponse, ILoginUserPayload>({
      query: (loginData) => ({
        url: "/login",
        method: "POST",
        body: loginData,
      }),
    }),
    registerUser: builder.mutation<IRegisterUserResponse, IRegisterUserPayload>(
      {
        query: (registerData) => ({
          url: "/registration",
          method: "POST",
          body: registerData,
        }),
      }
    ),
  }),
});

export const {
  useGetUserQuery,
  useLoginUserMutation,
  useRegisterUserMutation,
} = authApi;
