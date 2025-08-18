import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const pageApi = createApi({
    reducerPath: "pageApi",
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
        credentials: "include"
    }),
    endpoints: (builder) => ({
        getHomePageData: builder.query({
            query: () => ({
                url: "/home-page"
            })
        }),
        addPosts: builder.mutation({
            query: (data) => ({
                url: `/posts`,
                method: "POST",
                body: data,
            })
        }),
    })
})

export const {
  useGetHomePageDataQuery,
} = pageApi;