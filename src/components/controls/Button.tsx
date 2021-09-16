import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DetailedHTMLProps, HTMLProps } from "react";
import Intent from "../Intent";

interface IButtonProps extends DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  icon?: IconProp;
  rightIcon?: IconProp;
  disabled?: boolean;
  intent?: Intent; 
  large?: boolean;
  small?: boolean;
  minimal?: boolean;
}

function Button(props: IButtonProps): JSX.Element {
  let className = `transition-all duration-200 rounded text-black leading-tight
  outline-none focus:outline-none focus:ring-blue-300 focus:ring-1 dark:focus:ring-blue-600 
  dark:text-white ${props.className ?? ""}`;

  if(props.large) {
    className += " px-4 py-2 text-lg";
  } else if(props.small) {
    className += " px-2 py-1.5";
  } else {
    className += " px-4 py-2";
  }

  if(props.disabled) {
    className += " disabled opacity-75 cursor-not-allowed";
  }

  if(!props.minimal) {
    className += " shadow-md active:shadow-sm";
  }
 
  if(props.minimal) {
    className += " bg-opacity-0 bg-gray-500 hover:bg-opacity-30";
  } else if(!props.intent) {
    className += " bg-gray-200 ring-1 ring-gray-300 hover:bg-gray-300 dark:bg-gray-700 dark:ring-gray-600 dark:hover:bg-gray-600 active:bg-gray-400 dark:active:bg-gray-800";
  } else if(props.intent === Intent.SUCCESS) {
    className += " bg-green-400 ring-1 ring-green-500 hover:bg-green-500 dark:bg-green-700 dark:ring-green-600 dark:hover:bg-green-600 active:bg-green-600 dark:active:bg-green-800";
  } else if(props.intent === Intent.DANGER) {
    className += " bg-red-400 ring-1 ring-red-500 hover:bg-red-500 dark:bg-red-700 dark:ring-red-600 dark:hover:bg-red-600 active:bg-red-600 dark:active:bg-red-800";
  } else if(props.intent === Intent.WARNING) {
    className += " bg-yellow-400 ring-1 ring-yellow-500 hover:bg-yellow-500 dark:bg-yellow-700 dark:ring-yellow-600 dark:hover:bg-yellow-600 active:bg-yellow-600 dark:active:bg-yellow-800";
  } else if(props.intent === Intent.PRIMARY) {
    className += " bg-blue-400 ring-1 ring-blue-500 hover:bg-blue-500 dark:bg-blue-700 dark:ring-blue-600 dark:hover:bg-blue-600 active:bg-blue-600 dark:active:bg-blue-800";
  }

  return (
    <button {...props} className={className}>
      {props.icon && <FontAwesomeIcon className={!props.children ? "" : "mr-2"} icon={props.icon}/>}{props.children}{props.rightIcon && <FontAwesomeIcon className={!props.children ? "" : "ml-2"} icon={props.rightIcon}/>}
    </button>
  );
}

export default Button;