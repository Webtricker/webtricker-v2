import { IServicesPage } from "@/types/pageTypes";
import { model, models, Schema } from "mongoose";

const bannerSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    bg: {
        type: String,
        required: true,
    }
}, { _id: false });

const servicesShortcutSchema = new Schema({
    icon: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        required: true,
    }
}, { _id: false });

const bottomTextSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    }
}, { _id: false });

const servicesPageSchema = new Schema<IServicesPage>({
    banner: {
        type: bannerSchema,
        required: true,
    },
    servicesShotcut: {
        type: servicesShortcutSchema,
        required: true,
    },
    bottomText: {
        type: bottomTextSchema,
        required: true,
    }
}, {
    timestamps: true,
});

const ServicePage = models.ServicePage || model<IServicesPage>('ServicePage', servicesPageSchema);
export default ServicePage;

