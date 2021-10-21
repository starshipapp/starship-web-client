import { HTMLProps } from "react";
import Intent from "../Intent";
import Checkbox from "./Checkbox";

interface IOptionProps extends HTMLProps<HTMLDivElement> {
  intent?: Intent;
  checked?: boolean;
  description?: string;
}


function Option(props: IOptionProps): JSX.Element {
  let className = `w-full p-3 rounded shadow-md flex text-black dark:text-white ${props.className ?? ""}`;

  switch (props.intent) {
    case Intent.SUCCESS:
      className += " bg-green-300 dark:bg-green-700";
      break;
    case Intent.WARNING:
      className += " bg-yellow-300 dark:bg-yellow-700";
      break;
    case Intent.DANGER:
      className += " bg-red-300 dark:bg-red-700";
      break;
    case Intent.PRIMARY:
      className += " bg-blue-300 dark:bg-blue-700";
      break;
    default:
      className += " bg-gray-200 dark:bg-gray-700";
  }

  return (
    <div {...props} className={className}>
      <div className="m-auto ml-1">
        <div className="text-lg font-bold">
          {props.children}
        </div>
        {props.description && <div className="mb-0.5">
          {props.description} 
        </div>}
      </div>
      <div className="mt-auto mb-auto mr-1">
        <Checkbox large minimal intent={props.intent}/>
      </div>
    </div>
  );
}

export default Option;
