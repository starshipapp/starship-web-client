import { HTMLProps } from "react";

function SubPage(props: HTMLProps<HTMLDivElement>): JSX.Element {
  return (
    <div {...props} className={`w-full mt-4 flex ${props.className ?? ""}`}>
      {props.children}
    </div>
  );
}

export default SubPage;
