import { HTMLProps } from "react";

function PageHeader(props: HTMLProps<HTMLDivElement>): JSX.Element {
  return <div className="text-5xl font-extrabold mt-12 mb-3" {...props}/>;
}

export default PageHeader;