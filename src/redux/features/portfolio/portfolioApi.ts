import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const portfolioApi = createApi({
    reducerPath: "portfolioApi",
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
        credentials: "include"
    }),
    endpoints: (builder) => ({
        getPortfolios: builder.query({
            query: ({ page, limit }) => ({
                url: `/portfolios?page=${page}&limit=${limit}`
            })
        }),

        getPortfolio: builder.query({
            query: (portfolioId) => ({
                url: `/portfolios/${portfolioId}`
            })
        }),

        addPortfolio: builder.mutation({
            query: (data) => ({
                url: `/portfolios`,
                method: "POST",
                body: data,
            })
        }),

        deletePortfolio: builder.mutation({
            query: (portfolioId: string) => ({
                url: `/portfolios/${portfolioId}`,
                method: "DELETE",
            })
        }),

        updatePortfolio: builder.mutation({
            query: ({ slug, data }) => ({
                url: `/portfolios/${slug}`,
                method: "PUT",
                body: data,
            })
        }),
    })
})

export const {
    useAddPortfolioMutation, useDeletePortfolioMutation, useGetPortfolioQuery, useGetPortfoliosQuery, useUpdatePortfolioMutation
} = portfolioApi;