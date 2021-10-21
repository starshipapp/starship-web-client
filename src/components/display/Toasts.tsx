import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-hot-toast";

// a
function success(message: string): void {
  const toastId = toast.custom(<div className="w-72 p-2 bg-green-300 dark:bg-green-600 text-black dark:text-white flex shadow-lg rounded-sm">
    <div>
      {message}
    </div>
    <div className="ml-auto px-1" onClick={() => toast.dismiss(toastId)}>
      <FontAwesomeIcon icon={faTimes}/>
    </div>
  </div>);
}

function warning(message: string): void {
  const toastId = toast.custom(<div className="w-72 p-2 bg-yellow-300 dark:bg-yellow-600 text-black dark:text-white flex shadow-lg rounded-sm">
    <div>
      {message}
    </div>
    <div className="ml-auto px-1" onClick={() => toast.dismiss(toastId)}>
      <FontAwesomeIcon icon={faTimes}/>
    </div>
  </div>);
}

function danger(message: string): void {
  const toastId = toast.custom(<div className="w-72 p-2 bg-red-300 dark:bg-red-600 text-black dark:text-white flex shadow-lg rounded-sm">
    <div>
      {message}
    </div>
    <div className="ml-auto px-1" onClick={() => toast.dismiss(toastId)}>
      <FontAwesomeIcon icon={faTimes}/>
    </div>
  </div>);
}

function primary(message: string): void {
  const toastId = toast.custom(<div className="w-72 p-2 bg-blue-300 dark:bg-blue-600 text-black dark:text-white flex shadow-lg rounded-sm">
    <div>
      {message}
    </div>
    <div className="ml-auto px-1" onClick={() => toast.dismiss(toastId)}>
      <FontAwesomeIcon icon={faTimes}/>
    </div>
  </div>);
}

function regular(message: string): void {
  const toastId = toast.custom(<div className="w-72 p-2 bg-gray-300 dark:bg-gray-600 text-black dark:text-white flex shadow-lg rounded-sm">
    <div>
      {message}
    </div>
    <div className="ml-auto px-1" onClick={() => toast.dismiss(toastId)}>
      <FontAwesomeIcon icon={faTimes}/>
    </div>
  </div>);
}

const Toasts = {
  success,
  warning,
  danger,
  primary,
  regular
};

export default Toasts;
