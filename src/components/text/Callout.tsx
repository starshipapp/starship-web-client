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
  let className = `px-3 py-3 rounded flex text-black dark:text-white ${props.className ?? ""}`;

  if (props.intent === Intent.DANGER) {
    className += " bg-red-300 dark:bg-red-700";
  } else if (props.intent === Intent.SUCCESS) {
    className += " bg-green-300 dark:bg-green-700";
  } else if (props.intent === Intent.WARNING) {
    className += " bg-yellow-300 dark:bg-yellow-700";
  } else if (props.intent === Intent.PRIMARY) {
    className += " bg-blue-300 dark:bg-blue-700";
  } else {
    className += " bg-gray-200 dark:bg-gray-800";
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