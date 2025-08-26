
export type THeaderContactLink = {
    icon: string;
    text: string;
}

export type THeaderSocialLink = {
    icon: string;
    href: string;
}


export interface ITopHeader {
    contactLinks: {
        icon: string;
        text: string;
    }[];
    socialLinks: {
        icon: string;
        href: string;
    }[]
}