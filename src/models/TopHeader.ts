import { Schema, model, models, Document } from 'mongoose';

interface IContactLink {
    icon: string;
    text: string;
}

interface ISocialLink {
    icon: string;
    href: string;
}

export interface ITopHeader extends Document {
    contactLinks: IContactLink[];
    socialLinks: ISocialLink[];
}

const ContactLinkSchema = new Schema<IContactLink>({
    icon: { type: String, required: true },
    text: { type: String, required: true },
});

const SocialLinkSchema = new Schema<ISocialLink>({
    icon: { type: String, required: true },
    href: { type: String, required: true },
});

const TopHeaderSchema = new Schema<ITopHeader>({
    contactLinks: {
        type: [ContactLinkSchema],
        default: []
    },
    socialLinks: {
        type: [SocialLinkSchema],
        default: []
    }
});

const TopHeader = models.TopHeader || model<ITopHeader>('TopHeader', TopHeaderSchema);

export default TopHeader;
