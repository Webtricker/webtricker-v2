import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const categoryApi = createApi({
    reducerPath: 'categoryApi',
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/categories",
        credentials: "include"
    }),
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => ({
                url: '/',
                method: "GET",
            }),
        }),
        addCategory: builder.mutation({
            query: (data) => ({
                url: '/',
                method: "POST",
                body: data
            }),
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const { useAddCategoryMutation, useDeleteCategoryMutation, useLazyGetCategoriesQuery, useGetCategoriesQuery } = categoryApi;
