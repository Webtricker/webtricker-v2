import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const teamApi = createApi({
    reducerPath: "teamApi",
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
        credentials: "include"
    }),
    endpoints: (builder) => ({
        getTeamInfo: builder.query({
            query: () => ({
                url: '/teams'
            })
        }),
        getATeamInfo: builder.query({
            query: (id) => ({
                url: `/teams/${id}`
            })
        }),
        addTeamMember: builder.mutation({
            query: (data) => ({
                url: `/teams`,
                method: "POST",
                body: data,
            })
        }),

        deleteTeamMember: builder.mutation({
            query: (id: string) => ({
                url: `/teams/${id}`,
                method: "DELETE",
            })
        }),

        updateTeamInfo: builder.mutation({
            query: ({ id, data }) => ({
                url: `/blogs/${id}`,
                method: "PUT",
                body: data,
            })
        }),
    })
})

export const {
    useAddTeamMemberMutation,
    useDeleteTeamMemberMutation,
    useGetATeamInfoQuery,
    useGetTeamInfoQuery,
    useUpdateTeamInfoMutation,
} = teamApi;