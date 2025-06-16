// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface DefaultSiteLogos {
//     lightLargeLogo: string;
//     darkLargeLogo: string;
//     smallLogo: string;
// }

// export interface SiteLogoState {
//     lightLargeLogo: string;
//     darkLargeLogo: string;
//     smallLogo: string;
//     defaultLogos: DefaultSiteLogos | null;
//     isLoading: boolean;
//     isError: boolean;
// }

// // Initial state
// const initialState: SiteLogoState = {
//     lightLargeLogo: "",
//     darkLargeLogo: "",
//     smallLogo: "",
//     isLoading: true,
//     isError: false,
// };

// const siteMenu = createSlice({
//     name: "siteMenu",
//     initialState,
//     reducers: {
//         setAllLogos: (state, action: PayloadAction<Omit<SiteLogoState, "isLoading" | "isError">>) => {
//             state.lightLargeLogo = action.payload.lightLargeLogo;
//             state.darkLargeLogo = action.payload.darkLargeLogo;
//             state.smallLogo = action.payload.smallLogo;
//             state.defaultLogos = action.payload.defaultLogos;
//         },

//         updateLightLargeLogo: (state, action: PayloadAction<string>) => {
//             state.lightLargeLogo = action.payload;
//         },

//         updateDarkLargeLogo: (state, action: PayloadAction<string>) => {
//             state.darkLargeLogo = action.payload;
//         },

//         updateSmallLogo: (state, action: PayloadAction<string>) => {
//             state.smallLogo = action.payload;
//         },

//         updateIsSitelogoLoading: (state, action: PayloadAction<boolean>) => {
//             state.isLoading = action.payload;
//         },

//         setSiteLogoFetchingError: (state, action: PayloadAction<boolean>) => {
//             state.isError = action.payload;
//         },
//     },
// });

// export const {
//     setAllLogos,
//     updateLightLargeLogo,
//     updateDarkLargeLogo,
//     updateSmallLogo,
//     updateIsSitelogoLoading,
//     setSiteLogoFetchingError
// } = siteMenu.actions;

// export default siteMenu;
