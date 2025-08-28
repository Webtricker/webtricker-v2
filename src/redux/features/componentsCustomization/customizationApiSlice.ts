import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const customizationApi = createApi({
    reducerPath: "customizationApi",
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
        credentials: "include"
    }),
    endpoints: (builder) => ({

        // ===== Home Page Endpoints =====
       getTopHeaderData: builder.query({
            query: () => ({
                url: `/top-header`
            })
        }),
        updateTopHeaderData: builder.mutation({
            query: (data) => ({
                url: `/top-header`,
                method: "PUT",
                body: data,
            })
        }),
    })
})

export const {
  useGetTopHeaderDataQuery,
  useUpdateTopHeaderDataMutation
} = customizationApi;