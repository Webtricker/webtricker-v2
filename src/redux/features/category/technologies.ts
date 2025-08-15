import { ITechnology } from "@/types/data";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ICategories {
    technologies: ITechnology[]
}

// Initial state
export const initialState: ICategories = {
    technologies: []
};

const technologies = createSlice({
    name: "technologies",
    initialState,
    reducers: {
        addTechnologies: (state, action: PayloadAction<ITechnology[]>) => {
            state.technologies.push(...action.payload)
        },
        deleteTechnology: (state, action: PayloadAction<string>) => {
            state.technologies = state.technologies.filter(cat => cat._id !== action.payload);
        },
    },
});

export const {
    addTechnologies,
    deleteTechnology
} = technologies.actions;

export default technologies;
