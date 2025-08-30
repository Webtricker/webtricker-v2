import { IFooter } from "@/types/componentsType";
import mongoose, { models } from "mongoose";

// Define a schema for the nested ShortLinks object
const ShortLinksSchema = new mongoose.Schema<IFooter['pages']>({
    title: {
        type: String,
        required: true
    },
    links: [{
        label: {
            type: String,
            required: true
        },
        href: {
            type: String,
            required: true
        },
        isExternal: {
            type: Boolean,
            required: true
        }
    }]
});

// Define a schema for the nested logo object
const LogoSchema = new mongoose.Schema<IFooter['logo']>({
    white: {
        type: String,
        required: true
    },
    black: {
        type: String,
        required: true
    }
});

// Define a schema for the nested NewsLater object
const NewsLaterSchema = new mongoose.Schema<IFooter['newsLater']>({
    title: {
        type: String,
        required: true
    },
    placeholder: {
        type: String,
        required: true
    },
    formMail: {
        type: String,
        required: true
    }
});

// Define the main Footer schema based on the IFooter interface
const FooterSchema = new mongoose.Schema({
    logo: {
        type: LogoSchema,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    pages: {
        type: ShortLinksSchema,
        required: true
    },
    services: {
        type: ShortLinksSchema,
        required: true
    },
    socialLinks: {
        type: ShortLinksSchema,
        required: true
    },
    newsLater: {
        type: NewsLaterSchema,
        required: true
    },
    bounchingTxt: {
        type: String,
        required: true
    },
    copyrightTxt: {
        type: String,
        required: true
    }
});

// Create and export the Mongoose model
const Footer = models.Footer || mongoose.model<IFooter>('Footer', FooterSchema);
export default Footer;