
import { toggleModal } from '@/redux/features/modalToggler/ModalTogglerSlice';
import MediaModal from '@/sharedComponets/ui/editor/MediaModal';
import { TMedia } from '@/types/commonTypes';
import { ISidebar } from '@/types/componentsType';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { UseFormSetValue } from 'react-hook-form';
import { useDispatch } from 'react-redux';

// variables
const ACTIVE_KEY = "OPEN_CANCEL_LOGO_MODAL";

type Props = {
    closeIcon: string;
    setValue: UseFormSetValue<ISidebar>;
};


export default function CancelButton({ closeIcon, setValue }: Props) {
    // hooks
    const dispatch = useDispatch()
    const [logo, setLogo] = useState(closeIcon || "");

    useEffect(() => {
        setValue("closeIcon", closeIcon || "");
    }, [closeIcon, setValue]);


    // handlers
    const handleSelect = (media: TMedia) => {
        setLogo(media.secure_url);

        setValue("closeIcon", media.secure_url);
        dispatch(toggleModal(null));
    };

    return (
        <>
            <button onClick={() => dispatch(toggleModal(ACTIVE_KEY))} type="button">
                <Image
                    className="w-[32px] h-auto"
                    width={32}
                    height={32}
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
