"use client";
import {
  SET_EXPAND,
  updatePreventScrolling,
} from "@/redux/features/rootModyfier/Modyfier";
import { RootState } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const BodyEventListeners = () => {
  const EXPAND = useSelector((state: RootState) => state.modyfier.EXPAND);
  const dispatch = useDispatch();
  useEffect(() => {
    const handleListeners = (event: MouseEvent) => {
      if (!EXPAND) return;

      const targetElement = event.target as HTMLElement;
      if (
        targetElement.closest(".prevent-body-trigger") ||
        targetElement.closest("[data-prevent-body-trigger]") !== null
      ) {
        return;
      }

      dispatch(SET_EXPAND(null));
      dispatch(updatePreventScrolling(false));
    };

    document.body.addEventListener("click", handleListeners);

    return () => {
      document.body.removeEventListener("click", handleListeners);
    };
  });
  return <></>;
};

export default BodyEventListeners;
