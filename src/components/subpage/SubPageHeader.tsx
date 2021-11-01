import { HTMLProps } from "react";

function SubPageHeader(props: HTMLProps<HTMLDivElement>): JSX.Element {
  return (
    <div {...props} className={`text-3xl -mt-1 mb-2 font-extrabold ${props.className ?? ""}`}>
      {props.children}
    </div>
  );
}

export default SubPageHeader;
