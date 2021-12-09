import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HTMLProps } from "react";
import Intent from "../Intent";

interface ITagProps extends HTMLProps<HTMLDivElement> {
  intent?: Intent;
  icon?: IconProp;
}

function Tag(props: ITagProps): JSX.Element {
  let className = "rounded ext-black w-max dark:text-white text-xs font-normal px-1.5 py-0.5 font-extrabold";

  switch (props.intent) {
    case Intent.DANGER:
      className += " bg-red-400 dark:bg-red-600 text-red-700 dark:text-red-100";
      break;
    case Intent.WARNING:
      className += " bg-yellow-400 dark:bg-yellow-600 text-yellow-700 dark:text-yellow-100";
      break;
    case Intent.SUCCESS:
      className += " bg-green-400 dark:bg-green-600 text-green-700 dark:text-green-100";
      break;
    case Intent.PRIMARY:
      className += " bg-blue-400 dark:bg-blue-600 text-blue-700 dark:text-blue-100";
      break;
    default:
      className += " bg-gray-200 dark:bg-gray-700";
  }

  return (
    <span className={`${className} ${props.className ?? ""}`}>
      {props.icon && <FontAwesomeIcon icon={props.icon} size="sm" className="mr-2"/>}{props.children}
    </span>
  );
}

export default Tag;
