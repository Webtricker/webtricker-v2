import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const menuApi = createApi({
  reducerPath: 'menuApi',
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/settings",
    credentials: "include"
  }),
  endpoints: (builder) => ({
    getMenu: builder.query({
      query: () => ({
        url: '/menu',
      }),
    }),
    updateMenu: builder.mutation({
      query: (data) => ({
        url: '/menu',
        method:"PUT",
        body:data
      }),
    }),
  }),
});

export const {useGetMenuQuery, useUpdateMenuMutation} = menuApi;
