
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


export interface IMainHeader {
    logo: {
        white: string;
        black: string;
    };
    links: {
        label: string;
        href: string;
        isExternal: boolean;
    }[]
}



// ======= footer ==========

type ShortLinks = {
    title: string;
    links: {
        label: string;
        href: string;
        isExternal: boolean;
    }[]
}
export interface IFooter {
    logo: {
        white: string;
        black: string;
    };
    description: string;
    pages: ShortLinks;
    services: ShortLinks;
    socialLinks: ShortLinks;
    newsLater: {
        title: string;
        placeholder: string;
        formMail: string;
    };
    bounchingTxt: string;
    copyrightTxt: string;
}


// ===== side panel ========

type TInformation = {
    title: string;
    phones: string[];
    mails: string[];
    addresses: string[];
}
export interface ISidebar {
    shortLogo: string;
    closeIcon: string;
    title: string;
    description: string;
    information: TInformation;
    socialLinks: ShortLinks;
}