import { HTMLProps } from "react";
import Intent from "../Intent";

interface ILabelProps extends HTMLProps<HTMLDivElement> {
  intent?: Intent;
}


function Label(props: ILabelProps): JSX.Element {
  let className = `mb-1 ${props.className ?? ""} `;

  if (props.intent === Intent.PRIMARY) {
    className += `text-blue-600 dark:text-blue-300`;
  } else if (props.intent === Intent.SUCCESS) {
    className += `text-green-600 dark:text-green-300`;
  } else if (props.intent === Intent.WARNING) {
    className += `text-yellow-600 dark:text-yellow-300`;
  } else if (props.intent === Intent.DANGER) {
    className += `text-red-600 dark:text-red-300`;
  } else {
    className += `text-gray-600 dark:text-gray-300`;
  }

  return (
    <div {...props} className={className}/>
  );
}

export default Label;