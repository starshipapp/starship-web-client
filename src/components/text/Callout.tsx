import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HTMLProps } from "react";
import Intent from "../Intent";

interface ICalloutProps extends HTMLProps<HTMLDivElement> {
  title?: string;
  intent?: Intent;
  icon?: IconProp;
}

function Callout(props: ICalloutProps): JSX.Element {
  let className = `px-3 py-3 rounded flex text-black bg-opacity-50 dark:bg-opacity-50 dark:text-white ${props.className ?? ""}`;

  switch (props.intent) {
    case Intent.SUCCESS:
      className += " bg-green-600";
      break;
    case Intent.WARNING:
      className += " bg-yellow-600";
      break;
    case Intent.DANGER:
      className += " bg-red-600";
      break;
    case Intent.PRIMARY:
      className += " bg-blue-600";
      break;
    default:
      className += " bg-gray-300 dark:bg-gray-600";
  }

  return (
    <div {...props} className={className}>
      {props.icon && (
        <div className="flex-shrink-0 mr-2">
          <FontAwesomeIcon className="mr-1" icon={props.icon}/>
        </div>
      )}
      <div>
        {props.title && <div className="flex-grow mb-1 -mt-1 text-lg font-extrabold">
          {props.title}
        </div>}
        <div className="">{props.children}</div>
      </div>
    </div>
  );
}

export default Callout;
