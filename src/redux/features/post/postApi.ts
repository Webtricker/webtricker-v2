import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const postApi = createApi({
    reducerPath: "postApi",
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
        credentials: "include"
    }),
    endpoints: (builder) => ({
        getPosts: builder.query({
            query: (postType) => ({
                url: `/posts?postType=${postType}`
            })
        }),
        countPosts: builder.query({
            query: ({postType,categoryId}) => ({
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
        deletePosts: builder.mutation({
            query: (postId: string) => ({
                url: `/posts/${postId}`,
                method: "DELETE",
            })
        }),
    })
})

export const { useAddPostsMutation, useCountPostsQuery, useDeletePostsMutation, useGetPostsQuery } = postApi;