import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const subscribeApi = createApi({
  reducerPath: 'subscribeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/subscribe",
    credentials: "include"
  }),
  endpoints: (builder) => ({
    addSubscriber: builder.mutation({
      query: (data) => ({
        url: '/',
        method:"POST",
        body:data
      }),
    }),
    
    verfifySubscriber: builder.mutation({
      query: (data) => ({
        url: '/',
        method:"PUT",
        body:data
      }),
    }),
  }),
});

export const {useAddSubscriberMutation,useVerfifySubscriberMutation} = subscribeApi;
