import { HTMLProps } from "react";

function Divider(props: HTMLProps<HTMLDivElement>): JSX.Element {
  return <div {...props} className="border-r border-t border-gray-400 dark:border-gray-600 m-1" />;
}

export default Divider;
