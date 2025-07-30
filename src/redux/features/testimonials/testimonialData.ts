import { ITestimonialsInfo } from "@/types/data";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Initial state
interface IInitialState {
    testimonials: ITestimonialsInfo[]
}

const initialState: IInitialState = {
    testimonials: []
};

const testimonialData = createSlice({
    name: "testimonialData",
    initialState,
    reducers: {
        addTestimonialInfo: (state, action: PayloadAction<ITestimonialsInfo>) => {
            state.testimonials.push(action.payload);
        },

        deleteTestimonial: (state, action: PayloadAction<string>) => {
            state.testimonials = state.testimonials.filter(
                (testimonial) => testimonial._id !== action.payload
            );
        },
        updateTestimonial: (state, action: PayloadAction<ITestimonialsInfo>) => {
            const index = state.testimonials.findIndex(
                (testimonial) => testimonial._id === action.payload._id
            );
            if (index !== -1) {
                state.testimonials[index] = action.payload;
            }
        },
        setTestimonials: (state, action: PayloadAction<ITestimonialsInfo[]>) => {
            state.testimonials = action.payload;
        },
    },
});

export const {
    addTestimonialInfo,
    deleteTestimonial,
    updateTestimonial,
    setTestimonials,
} = testimonialData.actions;

export default testimonialData;
