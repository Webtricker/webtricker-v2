import { ISiteLogos } from "@/types/logoType";
const darkLargeLogo = "https://res.cloudinary.com/dirjayri8/raw/upload/v1748532597/r2rg0cgdr3xa8e8bctbw.svg";

const logos = {
    lightLargeLogo: "",
    darkLargeLogo: darkLargeLogo,
    smallLogo: "",
}

export const defaultData: ISiteLogos = {
    ...logos,
    defaultLogos: {...logos},
    createdAt: new Date(),
    updatedAt: new Date()
}