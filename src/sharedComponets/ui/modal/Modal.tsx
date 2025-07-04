"use client";
import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";
import { RootState } from "@/redux/store";
import { MouseEvent, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { XMarkIcon } from "../icons/Icons";
// import XMarkBlack from "../icons/XMarkBlack";

type CustomModalProps = {
  wrapperContainerStyle?: string;
  containerStyle?: string;
  children: React.ReactNode;
  activeKey: string;
};

export const CustomModal = (props: CustomModalProps) => {
  // props value
  const { children, activeKey, containerStyle, wrapperContainerStyle } = props;

  // dispatcher and active state
  const dispatch = useDispatch();
  const active = useSelector(
    (state: RootState) => state.modalToggler.activeModalID
  );

  //   reset all state
  const hideModal = (event: React.MouseEvent<HTMLDivElement>) => {
    // event.stopPropagation();

    // return if the innter container element is clicked;
    if (event.target !== containerRef.current) return;

    dispatch(toggleModal(null));
    document.body.style.overflowY = "auto";
  };

  // inner contianer ref
  const containerRef = useRef<HTMLDivElement>(null);

  //  ========== hidden overflow of body ========
  useEffect(() => {
    if (active) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }
  }, [active]);

  if (active !== activeKey) return <></>;

  return createPortal(
    <div
    
      ref={containerRef}
      onClick={hideModal}
      className={`text-[#30353E] w-full h-full fixed top-0 px-4 left-0 flex justify-center items-center bg-[#17171791] overflow-hidden z-[99998] ${wrapperContainerStyle}`}
    >
      <div
        className={`w-full max-w-[844px] duration-300 h-auto max-h-[95vh] flex flex-col relative py-8 md:py-10 lg:py-[50px] px-4 md:px-5 lg:px-[22px] bg-white rounded-[20px] lg:rounded-[30px]  z-[99999] ${containerStyle}`}
      >
        {children}
      </div>
    </div>,
    document.getElementById("modal_portal") as Element
  );
};

// Modal Header
type HeaderProps = {
  title: string;
  containerStyle?: string;
  buttonStyle?: string;
  titleStyle?: string;
  handler?: () => void;
};
export const CustomModalHeader = (props: HeaderProps) => {
  // props value
  const {
    title,
    titleStyle = "",
    containerStyle = "",
    buttonStyle = "",
    // handler
  } = props;
  const dispatch = useDispatch();

  //   handlers
  const handleClose = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleModal(null));
    // handler && handler();
    document.body.style.overflowY = "auto";
  };
  return (
    <div
      className={`w-full flex items-center justify-between gap-5 flex-wrap bg-[#005aff08] py-2.5 px-[18px] rounded-[12px] ${containerStyle}`}
    >
      <h6 className={`fs-xl-lh-lg text-[#30353E] ${titleStyle}`}>{title}</h6>
      <button className={`${buttonStyle}`} type="button" onClick={handleClose}>
        <XMarkIcon className="w-7 h-7" />
      </button>
    </div>
  );
};
