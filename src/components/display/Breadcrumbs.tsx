import { HTMLProps } from "react";

function Breadcrumbs(props: HTMLProps<HTMLDivElement>): JSX.Element {
  return (
    <div {...props} className={`h-8 flex ${props.className ?? ""}`}>
    </div>
  );
}

export default Breadcrumbs;
