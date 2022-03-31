import { HTMLProps } from "react";

function PageHeader(props: HTMLProps<HTMLDivElement>): JSX.Element {
  return <div {...props} className={`text-5xl font-extrabold mt-12 mb-3 flex ${props.className ?? ""}`}/>;
}

export default PageHeader;
