import { configureStore } from "@reduxjs/toolkit";
import ModalToggler from "./features/modalToggler/ModalTogglerSlice";
import Modyfier from "./features/rootModyfier/Modyfier";
import floatingText from "./features/dom/floatingDotSlice";
import { contactApi } from "./features/contact/contactApiSlice";
import { loginApi } from "./features/auth/LoginApiSlice";
import { logosApi } from "./features/logos/logosApiSlice";
import siteLogo from "./features/logos/siteLogoSlice";
import { uploadApi } from "./features/upload/uploadApiSlice";
import { menuApi } from "./features/menu/menuApiSlice";

export const store = configureStore({
  reducer: {
    /* root modyfier to open dropdown, modal, menu or to toggle  between different active states */
    modyfier: Modyfier.reducer,

    floatingText: floatingText.reducer,

    // modal show/hide slice
    modalToggler: ModalToggler,

    // site logo
    siteLogo: siteLogo.reducer,

    // api slices can be added here
    [contactApi.reducerPath]: contactApi.reducer,
    [loginApi.reducerPath]: loginApi.reducer,
    [logosApi.reducerPath]: logosApi.reducer,
    [uploadApi.reducerPath]: uploadApi.reducer,
    [menuApi.reducerPath]: menuApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().
      concat(loginApi.middleware).
      concat(logosApi.middleware).
      concat(uploadApi.middleware).
      concat(menuApi.middleware)
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
