import { HTMLProps } from "react";

function SubPageSidebar(props: HTMLProps<HTMLDivElement>): JSX.Element {
  return (
    <div {...props} className={`mr-4 -ml-3 border-r border-gray-200 dark:border-gray-700 flex flex-col w-52 ${props.className ?? ""}`}>
      {props.children}
    </div>
  );
}

export default SubPageSidebar;
