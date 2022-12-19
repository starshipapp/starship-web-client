import { HTMLProps } from "react";
import Modal from "react-modal";

interface IDialogProps extends HTMLProps<HTMLDivElement> {
  open: boolean
  onClose: () => void
}

function Dialog(props: IDialogProps): JSX.Element {
  return (
    <Modal
      isOpen={props.open}
      onRequestClose={props.onClose}
      overlayClassName={"bg-opacity-30 bg-gray-900 absolute top-0 left-0 w-full h-full"}
      className={`bg-gray-10 bottom-11 max-w-screen max-h-3xl overflow-x-hidden overflow-y-scroll dark:bg-gray-800 outline-actual-none text-black dark:text-white transform absolute flex shadow-lg md:rounded-lg md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 ${props.className ?? ""}`}
      closeTimeoutMS={150} 
    >
      <div className="overflow-y-scroll md:max-w-2xl">
        {props.children}
      </div>
    </Modal>
  );
}

export default Dialog;
