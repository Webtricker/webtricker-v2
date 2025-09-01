import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const customizationApi = createApi({
    reducerPath: "customizationApi",
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
        credentials: "include"
    }),
    endpoints: (builder) => ({

        // ===== Top Header Endpoints =====
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

        // ===== Top Header Endpoints =====
        getFooterData: builder.query({
            query: () => ({
                url: `/footer`
            })
        }),
        updateFooterData: builder.mutation({
            query: (data) => ({
                url: `/footer`,
                method: "PUT",
                body: data,
            })
        }),
        postFooterData: builder.mutation({
            query: (data) => ({
                url: `/footer`,
                method: "POST",
                body: data,
            })
        }),

    })
})

export const {
    useGetTopHeaderDataQuery,
    useUpdateTopHeaderDataMutation,

    // ===== Top Header Endpoints =====
    useGetFooterDataQuery,
    useUpdateFooterDataMutation,
    usePostFooterDataMutation
} = customizationApi;