import { TCategory } from "@/types/data";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ICategories {
    categories: TCategory[]
}

// Initial state
export const initialState: ICategories = {
    categories: []
};

const categories = createSlice({
    name: "categories",
    initialState,
    reducers: {
        addCategories: (state, action: PayloadAction<TCategory[]>) => {
            state.categories.push(...action.payload)
        },
        deleteCategory: (state, action: PayloadAction<string>) => {
            state.categories = state.categories.filter(cat => cat._id !== action.payload);
        },
    },
});

export const {
    addCategories,
    deleteCategory
} = categories.actions;

export default categories;
