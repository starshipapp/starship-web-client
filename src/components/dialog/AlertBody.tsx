import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HTMLProps } from "react";
import Intent from "../Intent";

interface IAlertBodyProps extends HTMLProps<HTMLDivElement> {
  icon?: IconProp;
  intent?: Intent;
}

function AlertBody(props: IAlertBodyProps): JSX.Element {
  let color = "";

  switch (props.intent) {
    case Intent.SUCCESS:
      color = "text-green-400 dark:text-green-500";
      break;
    case Intent.WARNING:
      color = "text-yellow-400 dark:text-yellow-500";
      break;
    case Intent.DANGER:
      color = "text-red-400 dark:text-red-500";
      break;
    case Intent.PRIMARY:
      color = "text-blue-400 dark:text-blue-500";
      break;
    default:
      color = "text-gray-300 dark:text-gray-600";
    }

  return (
    <div {...props} className={`w-md flex p-5 ${props.className ?? ""}`}>
      {props.icon && <div className={color + " mr-4"}>
        <FontAwesomeIcon icon={props.icon} size="3x"/>
      </div>}
      <div className="my-auto">
        {props.children}
      </div>
    </div>
  );
}

export default AlertBody;
