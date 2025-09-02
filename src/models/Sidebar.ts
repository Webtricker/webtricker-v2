import { ISidebar } from '@/types/componentsType';
import mongoose, { Schema, model, models } from 'mongoose';


// Define the Mongoose schema for the TInformation type.
const TInformationSchema = new mongoose.Schema<ISidebar['information']>({
    title: {
        type: String,
        required: true,
    },
    phones: {
        type: [String],
        required: true,
    },
    mails: {
        type: [String],
        required: true,
    },
    addresses: {
        type: [String],
        required: true,
    },
});


const ShortLinksSchema = new mongoose.Schema<ISidebar['socialLinks']>({
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
        },
    }]
});



const SidebarSchema = new Schema<ISidebar>({

    shortLogo: { type: String, required: true },
    description: { type: String, required: true },
    title: { type: String, required: true },
    information: TInformationSchema,
    socialLinks: ShortLinksSchema

});

const Sidebar = models.Sidebar || model<ISidebar>('Sidebar', SidebarSchema);

export default Sidebar;
