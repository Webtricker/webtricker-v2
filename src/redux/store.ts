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
import { MediaApi } from "./features/media/MediaApiSlice";
import { categoryApi } from "./features/category/categoryApiSlice";
import categories from "./features/category/categories";
import { postApi } from "./features/post/postApi";
import { subscribeApi } from "./features/subscriber/subscribeApiSlice";
import { teamApi } from "./features/team/teamApiSlice";
import teamData from "./features/team/teamData";

export const store = configureStore({
  reducer: {
    modyfier: Modyfier.reducer,
    floatingText: floatingText.reducer,
    modalToggler: ModalToggler,
    siteLogo: siteLogo.reducer,
    categories: categories.reducer,
    teamData:teamData.reducer,


    // api slices can be added here
    [contactApi.reducerPath]: contactApi.reducer,
    [postApi.reducerPath]: postApi.reducer,
    [loginApi.reducerPath]: loginApi.reducer,
    [logosApi.reducerPath]: logosApi.reducer,
    [menuApi.reducerPath]: menuApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [uploadApi.reducerPath]: uploadApi.reducer,
    [MediaApi.reducerPath]: MediaApi.reducer,
    [subscribeApi.reducerPath]: subscribeApi.reducer,
    [teamApi.reducerPath]: teamApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().
      concat(loginApi.middleware).
      concat(postApi.middleware).
      concat(logosApi.middleware).
      concat(uploadApi.middleware).
      concat(menuApi.middleware).
      concat(MediaApi.middleware).
      concat(categoryApi.middleware).
      concat(subscribeApi.middleware).
      concat(teamApi.middleware)
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
