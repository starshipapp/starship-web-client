import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DetailedHTMLProps } from "react";
import Intent from "../Intent";

interface IButtonProps extends DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  icon?: IconProp;
  rightIcon?: IconProp;
  disabled?: boolean;
  intent?: Intent; 
  large?: boolean;
  small?: boolean;
  minimal?: boolean;
  strikethrough?: boolean;
}

function Button(props: IButtonProps): JSX.Element {
  let className = `transition-all duration-200 text-black leading-tight flex-shrink-0
  outline-none focus:outline-none focus:ring-blue-300 focus:ring-1 dark:focus:ring-blue-600 
  dark:text-white ${props.className ?? ""}`;

  if(props.large) {
    className += " px-4 py-2 text-lg rounded";
  } else if(props.small) {
    className += " px-1.5 py-1 rounded-sm";
  } else {
    className += " px-3 py-1.5 rounded-sm";
  }

  if(props.disabled) {
    className += " disabled opacity-75 cursor-not-allowed";
  }

  if(!props.minimal) {
    className += " shadow-md active:shadow-sm";
  }
 
  if(props.minimal) {
    switch(props.intent) {
      case Intent.PRIMARY:
        className += " text-blue-400 dark:text-blue-600";
        break;
      case Intent.SUCCESS:
        className += " text-green-400 dark:text-green-600";
        break;
      case Intent.WARNING:
        className += " text-orange-400 dark:text-orange-600";
        break;
      case Intent.DANGER:
        className += " text-red-400 dark:text-red-600";
        break;
    }
    className += " bg-opacity-0 bg-gray-500 hover:bg-opacity-30";
  } else {
    switch(props.intent) {
      case Intent.PRIMARY:
        className += " bg-blue-400 border border-blue-500 hover:bg-blue-500 dark:bg-blue-700 dark:border-blue-600 dark:hover:bg-blue-600 active:bg-blue-600 dark:active:bg-blue-800";
        break;
      case Intent.SUCCESS:
        className += " bg-green-400 border border-green-500 hover:bg-green-500 dark:bg-green-700 dark:border-green-600 dark:hover:bg-green-600 active:bg-green-600 dark:active:bg-green-800";
        break;
      case Intent.WARNING:
        className += " bg-yellow-400 border border-yellow-500 hover:bg-yellow-500 dark:bg-yellow-700 dark:border-yellow-600 dark:hover:bg-yellow-600 active:bg-yellow-600 dark:active:bg-yellow-800";
        break;
      case Intent.DANGER:
        className += " bg-red-400 border border-red-500 hover:bg-red-500 dark:bg-red-700 dark:border-red-600 dark:hover:bg-red-600 active:bg-red-600 dark:active:bg-red-800";
        break;
      default:
        className += " bg-gray-200 border border-gray-300 hover:bg-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 active:bg-gray-400 dark:active:bg-gray-800";
    }
  }

  return (
    <button {...props} className={className}>
      {props.icon && <span className={`fa-layers fa-fw ${!props.children ? "" : "mr-2"}`}> 
        <FontAwesomeIcon icon={props.icon}/>
        {props.strikethrough && <FontAwesomeIcon icon={faSlash} inverse/>}
      </span>}
      {props.children}
      {props.rightIcon && <FontAwesomeIcon className={!props.children ? "" : "ml-2"} icon={props.rightIcon}/>}
    </button>
  );
}

export default Button;
