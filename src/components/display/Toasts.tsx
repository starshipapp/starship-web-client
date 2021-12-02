import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@tailwindui/react";
import { toast } from "react-hot-toast";

// a
function success(message: string): void {
  const toastId = toast.custom((t) => (
    <Transition
      show={t.visible}
      enter="transition ease-out duration-100"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition ease-in duration-75"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="max-w-xl pr-2.5 pl-3.5 py-1.5 bg-green-600 text-white flex shadow-lg rounded-full">
        <div>
          {message}
        </div>
        <div className="ml-2 px-1 cursor-pointer" onClick={() => toast.dismiss(toastId)}>
          <FontAwesomeIcon icon={faTimes}/>
        </div>
      </div>
    </Transition>
  ));
}

function warning(message: string): void {
  const toastId = toast.custom((t) => (
    <Transition
      show={t.visible}
      enter="transition ease-out duration-100"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition ease-in duration-75"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="max-w-xl pr-2.5 pl-3.5 py-1.5 bg-yellow-600 text-white flex shadow-lg rounded-full">
        <div>
          {message}
        </div>
        <div className="ml-2 px-1 cursor-pointer" onClick={() => toast.dismiss(toastId)}>
          <FontAwesomeIcon icon={faTimes}/>
        </div>
      </div>
    </Transition>
  ));
}

function danger(message: string): void {
  const toastId = toast.custom((t) => (
    <Transition
      show={t.visible}
      enter="transition ease-out duration-100"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition ease-in duration-75"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="max-w-xl pr-2.5 pl-3.5 py-1.5 bg-red-600 text-white flex shadow-lg rounded-full">
        <div>
          {message}
        </div>
        <div className="ml-2 px-1 cursor-pointer" onClick={() => toast.dismiss(toastId)}>
          <FontAwesomeIcon icon={faTimes}/>
        </div>
      </div>
    </Transition>
  ));
}

function primary(message: string): void {
  const toastId = toast.custom((t) => (
    <Transition
      show={t.visible}
      enter="transition ease-out duration-100"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition ease-in duration-75"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="max-w-xl pr-2.5 pl-3.5 py-1.5 bg-blue-600 text-white flex shadow-lg rounded-full">
        <div>
          {message}
        </div>
        <div className="ml-2 px-1 cursor-pointer" onClick={() => toast.dismiss(toastId)}>
          <FontAwesomeIcon icon={faTimes}/>
        </div>
      </div>
    </Transition>
  ));
}

function regular(message: string): void {
  const toastId = toast.custom((t) => (
    <Transition
      show={t.visible}
      enter="transition ease-out duration-100"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition ease-in duration-75"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="max-w-xl pr-2.5 pl-3.5 py-1.5 bg-gray-600 text-white flex shadow-lg rounded-full">
        <div>
          {message}
        </div>
        <div className="ml-2 px-1 cursor-pointer" onClick={() => toast.dismiss(toastId)}>
          <FontAwesomeIcon icon={faTimes}/>
        </div>
      </div>
    </Transition>
  ));
}

const Toasts = {
  success,
  warning,
  danger,
  primary,
  regular
};

export default Toasts;
