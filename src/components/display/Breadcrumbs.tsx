import { HTMLProps } from "react";

function Breadcrumbs(props: HTMLProps<HTMLDivElement>): JSX.Element {
  return (
    <div {...props} className={`h-6 flex flex-row-reverse overflow-x-auto scrollbar-none ${props.className ?? ""}`}>
      <div className="flex scrollbar-none">
        {props.children}
      </div>
    </div>
  );
}

export default Breadcrumbs;
