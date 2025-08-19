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
        updateHomePageData: builder.mutation({
            query: (data) => ({
                url: `/home-page`,
                method: "PUT",
                body: data,
            })
        }),
    })
})

export const {
  useGetHomePageDataQuery,
  useUpdateHomePageDataMutation
} = pageApi;