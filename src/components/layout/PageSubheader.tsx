import { HTMLProps } from "react";

function PageSubheader(props: HTMLProps<HTMLDivElement>): JSX.Element {
  return <div className="text-2xl font-extrabold mt-3 mb-2" {...props}/>;
}

export default PageSubheader;