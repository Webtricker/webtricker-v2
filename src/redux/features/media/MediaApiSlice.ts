import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const MediaApi = createApi({
  reducerPath: 'MediaApi',
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/media",
    credentials: "include"
  }),
  endpoints: (builder) => ({
    getMedia: builder.query({
      query: ({type}) => ({
        url: `?type=${type}`,
        method: 'GET',
      }),
    }),

    deleteMedia: builder.mutation({
      query: (data) => ({
          url: ``,
          method: 'DELETE',
          body: data,
        })
    }),
    postMedia: builder.mutation({
      query: (data) => ({
      url: ``,
      method: 'POST',
      body: data,
      }),
    }),
  }),
});

export const {useLazyGetMediaQuery, useDeleteMediaMutation, usePostMediaMutation} = MediaApi;
