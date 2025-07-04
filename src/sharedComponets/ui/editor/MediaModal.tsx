import { useDispatch } from "react-redux";
import { CustomModal, CustomModalHeader } from "../modal/Modal";
import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";

type Props = {
    cb:(url:string,title:string)=>void;
}
export default function MediaModal({cb}:Props) {
  const dispatch = useDispatch()
    const handleClick = ()=>{
  cb("https://res.cloudinary.com/dirjayri8/raw/upload/v1748532597/r2rg0cgdr3xa8e8bctbw.svg","Site Logo")
  dispatch(toggleModal(null));
    }
  return (
  <CustomModal  activeKey="OPEN_MEDIA_MODAL" key='OPEN_MEDIA_MODAL'>
    <CustomModalHeader  title="Choose media and paste link" />
    <div className="w-full">
     <h4>Something in the modal</h4>
     <button onClick={handleClick}>
  select
     </button>
    </div>
  </CustomModal>  
  )
}
