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
                method: "POST",
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

} = pageApi;