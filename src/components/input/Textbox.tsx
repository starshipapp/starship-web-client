import { HTMLProps } from "react";
import Intent from "../Intent";

interface ITextboxProps extends HTMLProps<HTMLInputElement> {
  large?: boolean;
  small?: boolean;
  disabled?: boolean;
  intent?: Intent;
}

function Textbox(props: ITextboxProps): JSX.Element {
  let className = `bg-gray-200 transition-all duration-300 rounded text-black leading-tight shadow-inner
  outline-none focus:outline-none focus:ring-blue-300 focus:ring-1 focus:shadow-md dark:focus:ring-blue-600 
  dark:bg-gray-700 dark:text-white ${props.className ?? ""}`;

  switch (props.intent) {
    case Intent.SUCCESS:
      className += " border-2 border-green-500";
      break;
    case Intent.WARNING:
      className += " border-2 border-yellow-500";
      break;
    case Intent.DANGER:
      className += " border-2 border-red-500";
      break;
    case Intent.PRIMARY:
      className += " border-2 border-blue-500";
      break;
    default:
      className += " border-2 border-gray-300 dark:border-gray-600";
  }

  if(props.large) {
    className += " text-xl py-2 px-3";
  } else if(props.small) {
    className += " py-1.5 px-2";
  } else {
    className += " py-2 px-3";
  }

  if(props.disabled) {
    className += " disabled opacity-75 cursor-not-allowed";
  }

  return <input {...props} type="input" className={className} />;
}

export default Textbox;