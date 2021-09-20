import { HTMLProps } from "react";
import Intent from "../Intent";

interface ICheckboxProps extends HTMLProps<HTMLInputElement> {
  intent?: Intent;
  large?: boolean;
  disabled?: boolean;
}

function Checkbox(props: ICheckboxProps): JSX.Element {
  let className = `appearance-none form-tick bg-gray-200 dark:bg-gray-700 rounded ${props.className ?? ""}`;

  switch (props.intent) {
    case Intent.SUCCESS:
      className += " text-green-500 dark:text-green-700 checked:bg-green-500 dark:checked:bg-green-700";
      break;
    case Intent.WARNING:
      className += " text-yellow-500 dark:text-yellow-700 checked:bg-yellow-500 dark:checked:bg-yellow-700";
      break;
    case Intent.DANGER:
      className += " text-red-500 dark:text-red-700 checked:bg-red-500 dark:checked:bg-red-700";
      break;
    case Intent.PRIMARY:
      className += " text-blue-500 dark:text-blue-700 checked:bg-blue-500 dark:checked:bg-blue-700";
      break;
  }

  if (props.large) {
    className += " w6 h-6";
  } else {
    className += " w-4 h-4";
  }
  
  if (props.disabled) {
    className += " disabled opacity-75 cursor-not-allowed";
  }

  return ( 
    <input
      type="checkbox"
      className={className}
      {...props}
    />
  );
}

export default Checkbox;