import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const technologyApi = createApi({
    reducerPath: 'technologyApi',
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/portfolio-technologies",
        credentials: "include"
    }),
    endpoints: (builder) => ({
        getTechnologies: builder.query({
            query: () => ({
                url: '/',
                method: "GET",
            }),
        }),
        addTechnology: builder.mutation({
            query: (data) => ({
                url: '/',
                method: "POST",
                body: data
            }),
        }),
        deleteTechnology: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE", 
            }),
        }),
    }),
});

export const { useAddTechnologyMutation,useDeleteTechnologyMutation, useGetTechnologiesQuery,} = technologyApi;
