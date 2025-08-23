import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const pageApi = createApi({
    reducerPath: "pageApi",
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
        credentials: "include"
    }),
    endpoints: (builder) => ({

        // ===== Home Page Endpoints =====
        getHomePageData: builder.query({
            query: () => ({
                url: "/home-page"
            })
        }),
        updateHomePageData: builder.mutation({
            query: (data) => ({
                url: `/home-page`,
                method: "PUT",
                body: data,
            })
        }),

        // ===== About Page Endpoints =====
        getAboutPageData: builder.query({
            query: () => ({
                url: "/about-page"
            })
        }),
        updateAboutPageData: builder.mutation({
            query: (data) => ({
                url: `/about-page`,
                method: "PUT",
                body: data,
            })
        }),

        // ===== Services Page Endpoints =====
        getServicesPageData: builder.query({
            query: () => ({
                url: "/services-page"
            })
        }),
        updateServicesPageData: builder.mutation({
            query: (data) => ({
                url: `/services-page`,
                method: "PUT",
                body: data,
            })
        }),

        // ===== Portfolio Page Endpoints =====
        getPortfoliosPageData: builder.query({
            query: () => ({
                url: "/portfolios-page"
            })
        }),
        updatePortfoliosPageData: builder.mutation({
            query: (data) => ({
                url: `/portfolios-page`,
                method: "PUT",
                body: data,
            })
        }),

        // ===== Portfolio Page Endpoints =====
        getBlogsPageData: builder.query({
            query: () => ({
                url: "/blogs-page"
            })
        }),
        updateBlogsPageData: builder.mutation({
            query: (data) => ({
                url: `/blogs-page`,
                method: "PUT",
                body: data,
            })
        }),

    })
})

export const {
    useGetHomePageDataQuery,
    useUpdateHomePageDataMutation,

    // ===== About Page Endpoints =====
    useGetAboutPageDataQuery,
    useUpdateAboutPageDataMutation,

    // ===== Services Page Endpoints =====
    useGetServicesPageDataQuery,
    useUpdateServicesPageDataMutation,

    // ===== Portfolios Page Endpoints =====
    useGetPortfoliosPageDataQuery,
    useUpdatePortfoliosPageDataMutation,

    // ===== Blog Page Endpoints =====
    useGetBlogsPageDataQuery,
    useUpdateBlogsPageDataMutation
} = pageApi;