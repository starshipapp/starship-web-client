import { HTMLProps } from "react";

function AlertControls(props: HTMLProps<HTMLDivElement>): JSX.Element {
  return (
    <div{...props} className={`flex bg-gray-200 dark:bg-gray-800 p-2 border-t rounded-b-md border-gray-300 dark:border-gray-700`}>
      <div className="mr-auto"/>
      {props.children}
    </div>
  );
}

export default AlertControls;
