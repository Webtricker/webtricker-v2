"use client"
import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";
import Button from "@/sharedComponets/ui/buttons/Button";
import React from "react";
import { useDispatch } from "react-redux";

export default function AddTechnologyBtn() {
  const modalKey = "OPEN_PORTFOLIO_TECHNOLOGY_ADD_MODAL";
  const dispatch = useDispatch();
  return (
    <Button
      cb={() => dispatch(toggleModal(modalKey))}
      className="!py-2.5 whitespace-nowrap"
      label="Add Technology"
    />
  );
}
