import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const testimonialApi = createApi({
    reducerPath: "testimonialApi",
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
        credentials: "include"
    }),
    tagTypes: ['TestimonialsData'],
    endpoints: (builder) => ({
        getTestimonialInfo: builder.query({
            query: () => ({
                url: '/testimonials'
            }),
            providesTags: ['TestimonialsData']
        }),
        getATestimonialInfo: builder.query({
            query: (id) => ({
                url: `/testimonials/${id}`
            })
        }),
        addTestimonial: builder.mutation({
            query: (data) => ({
                url: `/testimonials`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ['TestimonialsData']
        }),

        deleteTestimonial: builder.mutation({
            query: (id: string) => ({
                url: `/testimonials/${id}`,
                method: "DELETE",
            })
        }),

        updateTestimonialInfo: builder.mutation({
            query: ({ id, data }) => ({
                url: `/testimonials/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ['TestimonialsData']
        }),
    })
})

export const {
    useAddTestimonialMutation,
    useDeleteTestimonialMutation,
    useGetATestimonialInfoQuery,
    useGetTestimonialInfoQuery,
    useUpdateTestimonialInfoMutation,
} = testimonialApi;