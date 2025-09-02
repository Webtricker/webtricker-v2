import { toggleModal } from '@/redux/features/modalToggler/ModalTogglerSlice';
import MediaModal from '@/sharedComponets/ui/editor/MediaModal';
import { TMedia } from '@/types/commonTypes';
import { ISidebar } from '@/types/componentsType';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { UseFormSetValue } from 'react-hook-form';
import { useDispatch } from 'react-redux';

// variables
const ACTIVE_KEY = "OPEN_SIDEBAR_LOGO_MODAL";

type Props = {
    shortLogo: string;
    setValue: UseFormSetValue<ISidebar>;
};


export default function SidebarLogo({ shortLogo, setValue }: Props) {
    // hooks
    const dispatch = useDispatch()
    const [logo, setLogo] = useState(shortLogo || "");

    useEffect(() => {
        setValue("shortLogo", shortLogo || "");
    }, [shortLogo, setValue]);


    // handlers
    const handleSelect = (media: TMedia) => {
        setLogo(media.secure_url);

        setValue("shortLogo", media.secure_url);
        dispatch(toggleModal(null));
    };

    return (
        <>
            <button className='border border-slate-300 rounded-[5px] hover:border-slate-500 dark:border-slate-700 duration-300' onClick={() => dispatch(toggleModal(ACTIVE_KEY))} type="button">
                <Image
                    width={56}
                    height={49}
                    src={logo || ""}
                    alt="Star"
                />
            </button>

            <MediaModal
                allowedMediaTypeToShow={["img"]}
                activeKey={ACTIVE_KEY}
                key={ACTIVE_KEY}
                cb={handleSelect}
            />
        </>
    )
}
