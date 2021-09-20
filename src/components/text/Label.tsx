import { HTMLProps } from "react";
import Intent from "../Intent";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface ILabelProps extends HTMLProps<HTMLDivElement> {
  intent?: Intent;
  icon?: IconProp;
}

function Label(props: ILabelProps): JSX.Element {
  let className = `mb-1 ${props.className ?? ""} `;

  switch (props.intent) {
    case Intent.SUCCESS:
      className += `text-green-600 dark:text-green-400`;
      break;
    case Intent.WARNING:
      className += `text-yellow-600 dark:text-yellow-400`;
      break;
    case Intent.DANGER:
      className += `text-red-600 dark:text-red-400`;
      break;
    case Intent.PRIMARY:
      className += `text-blue-600 dark:text-blue-400`;
      break;
    default:
      className += `text-gray-600 dark:text-gray-400`;
  }

  return (
    <div {...props} className={className}>
      {props.icon && <FontAwesomeIcon className="mr-1" icon={props.icon}/>}{props.children}
    </div>
  );
}

export default Label;