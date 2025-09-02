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
        getMainHeaderData: builder.query({
            query: () => ({
                url: `/main-header`
            })
        }),
        updateMainHeaderData: builder.mutation({
            query: (data) => ({
                url: `/main-header`,
                method: "PUT",
                body: data,
            })
        }),

        // ===== public footer Endpoints =====
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

        // ===== public footer Endpoints =====
        getSidebarData: builder.query({
            query: () => ({
                url: `/sidebar`
            })
        }),
        updateSidebarData: builder.mutation({
            query: (data) => ({
                url: `/sidebar`,
                method: "PUT",
                body: data,
            })
        }),
    })
})

export const {
    // ===== Top Header Endpoints =====
    useGetTopHeaderDataQuery,
    useUpdateTopHeaderDataMutation,

    // ======= Main Header endpoints ======
    useGetMainHeaderDataQuery,
    useUpdateMainHeaderDataMutation,

    // ======= public footer data =====
    useGetFooterDataQuery,
    useUpdateFooterDataMutation,


    // ==== sidebar data =========
    useGetSidebarDataQuery,
    useUpdateSidebarDataMutation


} = customizationApi;