import { HTMLProps } from "react";
import Intent from "../Intent";

interface IProgressBarProps extends HTMLProps<HTMLDivElement> {
  progress: number;
  intent?: Intent;
}

function ProgressBar(props: IProgressBarProps): JSX.Element {
  let barStyle = "";

  switch (props.intent) {
    case Intent.PRIMARY:
      barStyle = "bg-blue-500";
      break;
    case Intent.SUCCESS:
      barStyle = "bg-green-500";
      break;
    case Intent.WARNING:
      barStyle = "bg-yellow-500";
      break;
    case Intent.DANGER:
      barStyle = "bg-red-500";
      break;
    default:
      barStyle = "bg-gray-500";
  }

  return (
    <div {...props} className={`bg-gray-300 rounded-lg dark:bg-gray-700 shadow ${props.className ?? ""}`}>
      <div className={`${barStyle} rounded-lg h-2 w-full`} style={{ width: `${Math.ceil(props.progress * 100)}%` }} />
    </div>
  );
}

export default ProgressBar;
