import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const postApi = createApi({
    reducerPath: "postApi",
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
        credentials: "include"
    }),
    endpoints: (builder) => ({
        getPosts: builder.query({
            query: ({ postType, categoryId, page, limit }) => ({
                url: `/posts?postType=${postType}&categoryId=${categoryId}&page=${page}&limit=${limit}`
            })
        }),
        countPosts: builder.query({
            query: ({ postType, categoryId }) => ({
                url: `/posts/counts?postType=${postType}&categoryId=${categoryId}`
            })
        }),
        addPosts: builder.mutation({
            query: (data) => ({
                url: `/posts`,
                method: "POST",
                body: data,
            })
        }),

        deletePost: builder.mutation({
            query: (blogId: string) => ({
                url: `/blogs/${blogId}`,
                method: "DELETE",
            })
        }),

        updatePost: builder.mutation({
            query: ({ slug, data }) => ({
                url: `/blogs/${slug}`,
                method: "PUT",
                body: data,
            })
        }),

        // services endpoints
        getServices: builder.query({
            query: () => ({
                url: `/services`
            })
        }),

        addService: builder.mutation({
            query: (data) => ({
                url: `/services`,
                method: "POST",
                body: data,
            })
        }),
        deleteService: builder.mutation({
            query: (blogId: string) => ({
                url: `/services/${blogId}`,
                method: "DELETE",
            })
        }),
        updateService: builder.mutation({
            query: ({ slug, data }) => ({
                url: `/services/${slug}`,
                method: "PUT",
                body: data,
            })
        }),
    })
})

export const {
    useAddPostsMutation,
    useUpdatePostMutation,
    useLazyCountPostsQuery,
    useDeletePostMutation,
    useGetPostsQuery,
    useLazyGetPostsQuery,
    // services hooks
    useGetServicesQuery,
    useLazyGetServicesQuery,
    useAddServiceMutation,
    useDeleteServiceMutation,
    useUpdateServiceMutation
} = postApi;