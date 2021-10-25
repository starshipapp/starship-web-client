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
      className={`bg-gray-100 dark:bg-gray-800 outline-actual-none text-black dark:text-white rounded-lg transform absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex shadow-lg ${props.className ?? ""}`}
      closeTimeoutMS={150} 
    >
      <div className="max-w-2xl">
        {props.children}
      </div>
    </Modal>
  );
}

export default Dialog;
