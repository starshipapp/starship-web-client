import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HTMLProps } from "react";
import Intent from "../Intent";
import Checkbox from "./Checkbox";

interface IOptionProps extends HTMLProps<HTMLDivElement> {
  intent?: Intent;
  checked?: boolean;
  description?: string;
  icon?: IconProp;
}

function Option(props: IOptionProps): JSX.Element {
  let className = `transition-all duration-200 w-full p-3 mb-2.5 rounded shadow-md active:shadow-sm flex text-black dark:text-white cursor-pointer ${props.className ?? ""}`;

  switch (props.intent) {
    case Intent.SUCCESS:
      className += " bg-green-300 dark:bg-green-700 hover:bg-green-500 dark:hover:bg-green-600 active:bg-green-600 dark:active:bg-green-800";
      break;
    case Intent.WARNING:
      className += " bg-yellow-300 dark:bg-yellow-700 hover:bg-yellow-500 dark:hover:bg-yellow-600 active:bg-yellow-600 dark:active:bg-yellow-800";
      break;
    case Intent.DANGER:
      className += " bg-red-300 dark:bg-red-700 hover:bg-red-500 dark:hover:bg-red-600 active:bg-red-600 dark:active:bg-red-800";
      break;
    case Intent.PRIMARY:
      className += " bg-blue-300 dark:bg-blue-700 hover:bg-blue-500 dark:hover:bg-blue-600 active:bg-blue-600 dark:active:bg-blue-800";
      break;
    default:
      className += " bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 active:bg-gray-400 dark:active:bg-gray-800";
  }

  return (
    <div {...props} className={className}>
      {props.icon && <div className={`ml-1 mr-1 my-auto flex items-center text-center content-center `}>
        <div className={`text-center content-center ${props.description ? "w-8": "w-4"}`}>
          <FontAwesomeIcon icon={props.icon} size={props.description ? "2x" : undefined}/>
        </div> 
      </div>}
      <div className="mr-auto ml-1">
        <div className="text-lg font-bold flex">
          {props.children}
        </div>
        {props.description && <div className="mb-0.5">
          {props.description} 
        </div>}
      </div>
      <div className="mt-auto mb-auto mr-1">
        <Checkbox large minimal checked={props.checked} intent={props.intent}/>
      </div>
    </div>
  );
}

export default Option;
