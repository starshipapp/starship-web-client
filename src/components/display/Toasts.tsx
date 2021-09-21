import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-hot-toast";
import Button from "../controls/Button";

function success(message: string): void {
  let closeFunction: () => void = () => null;
  const toastId = toast.custom(<div className="w-72 p-2 bg-green-300 dark:bg-green-600 text-black dark:text-white flex">
    <div>
      {message}
    </div>
    <div className="ml-auto px-1" onClick={() => toast.dismiss(toastId)}>
      <FontAwesomeIcon icon={faTimes}/>
    </div>
  </div>);
  closeFunction = () => toast.dismiss(toastId);
}

const Toasts = {
  success
};

export default Toasts;