import { HTMLProps } from "react";
import Intent from "../Intent";

interface ITagProps extends HTMLProps<HTMLDivElement> {
  intent?: Intent;
}

function Tag(props: ITagProps): JSX.Element {
  let className = "rounded-full ext-black w-max dark:text-white text-sm font-normal px-2 py-0.5";

  switch (props.intent) {
    case Intent.DANGER:
      className += " bg-red-400 dark:bg-red-600";
      break;
    case Intent.WARNING:
      className += " bg-yellow-400 dark:bg-yellow-600";
      break;
    case Intent.SUCCESS:
      className += " bg-green-400 dark:bg-green-600";
      break;
    case Intent.PRIMARY:
      className += " bg-blue-400 dark:bg-blue-600";
      break;
    default:
      className += " bg-gray-300 dark:bg-gray-600";
  }

  return (
    <span className={`${className} ${props.className ?? ""}`}>
      {props.children}
    </span>
  );
}

export default Tag;
