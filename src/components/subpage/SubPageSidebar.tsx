import { HTMLProps } from "react";

function SubPageSidebar(props: HTMLProps<HTMLDivElement>): JSX.Element {
  return (
    <div {...props} className={`-ml-3 border-r border-gray-300 dark:border-gray-600 flex flex-col w-64 ${props.className ?? ""}`}>
      {props.children}
    </div>
  );
}

export default SubPageSidebar;
