import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const MediaApi = createApi({
  reducerPath: 'MediaApi',
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/media",
    credentials: "include"
  }),
  endpoints: (builder) => ({
    getMedia: builder.query({
      query: () => ({
        url: '/',
        method: 'GET',
      }),
    }),
  }),
});

export const {useGetMediaQuery} = MediaApi;
