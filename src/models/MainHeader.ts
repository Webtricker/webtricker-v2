import { IMainHeader } from "@/types/componentsType";
import mongoose, { models } from "mongoose";

const LinkSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
    },
    href: {
        type: String,
        required: true,
    },
    isExternal: {
        type: Boolean
    },
}, { _id: false });


const MainHeaderSchema = new mongoose.Schema({
    logo: {
        white: {
            type: String,
            required: true,
        },
        black: {
            type: String,
            required: true,
        },
    },
    links: {
        type: [LinkSchema],
        required: true,
    },
});

const MainHeader = models.MainHeader || mongoose.model<IMainHeader>('MainHeader', MainHeaderSchema);
export default MainHeader;