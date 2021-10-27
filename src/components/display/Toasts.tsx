import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-hot-toast";

// a
function success(message: string): void {
  const toastId = toast.custom(<div className="max-w-xl px-2.5 py-1.5 bg-green-600 text-white flex shadow-lg rounded-full">
    <div>
      {message}
    </div>
    <div className="ml-2 px-1" onClick={() => toast.dismiss(toastId)}>
      <FontAwesomeIcon icon={faTimes}/>
    </div>
  </div>);
}

function warning(message: string): void {
  const toastId = toast.custom(<div className="max-w-xl px-2.5 py-1.5 bg-yellow-600 text-white flex shadow-lg rounded-full">
    <div>
      {message}
    </div>
    <div className="ml-2 px-1" onClick={() => toast.dismiss(toastId)}>
      <FontAwesomeIcon icon={faTimes}/>
    </div>
  </div>);
}

function danger(message: string): void {
  const toastId = toast.custom(<div className="max-w-xl px-2.5 py-1.5 bg-red-600 text-white flex shadow-lg rounded-full">
    <div>
      {message}
    </div>
    <div className="ml-2 px-1" onClick={() => toast.dismiss(toastId)}>
      <FontAwesomeIcon icon={faTimes}/>
    </div>
  </div>);
}

function primary(message: string): void {
  const toastId = toast.custom(<div className="max-w-xl px-2.5 py-1.5 bg-blue-600 text-white flex shadow-lg rounded-full">
    <div>
      {message}
    </div>
    <div className="ml-2 px-1" onClick={() => toast.dismiss(toastId)}>
      <FontAwesomeIcon icon={faTimes}/>
    </div>
  </div>);
}

function regular(message: string): void {
  const toastId = toast.custom(<div className="max-w-xl px-2.5 py-1.5 bg-gray-600 text-white flex shadow-lg rounded-full">
    <div>
      {message}
    </div>
    <div className="ml-2 px-1" onClick={() => toast.dismiss(toastId)}>
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
